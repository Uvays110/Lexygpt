'use client';

import { CircleAlert, Download, Loader2, RotateCcw, Trash2 } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { GenerationOutput } from '@/lib/generation/types';
import type { Job } from '@/lib/history';
import { cx } from '@/lib/cx';
import s from './JobCard.module.css';

const shapeOf = (ratio: string): 'portrait' | 'square' | 'landscape' => {
  const [w, h] = ratio.split(':').map(Number);
  if (!w || !h || w === h) return 'square';
  return w > h ? 'landscape' : 'portrait';
};

const timeFmt = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const WAVE = Array.from({ length: 36 }, (_, i) => 0.25 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.45)) * 0.75);

function Output({ output, ratio }: { output: GenerationOutput; ratio: string }) {
  if (output.type === 'audio') {
    return (
      <div className={s.audio}>
        <div className={s.wave} aria-hidden>
          {WAVE.map((v, i) => (
            <span key={i} style={{ '--v': v } as CSSProperties} />
          ))}
        </div>
        <audio controls src={output.url} preload="none" className={s.player} />
      </div>
    );
  }

  const exactRatio = output.width && output.height ? `${output.width}/${output.height}` : ratio.replace(':', '/');
  // В демо-режиме «видео» — это анимированная SVG-картинка.
  const isRealVideo = output.type === 'video' && !output.url.startsWith('/api/demo/');

  return (
    <figure className={s.output} data-shape={shapeOf(ratio)} style={{ aspectRatio: exactRatio }}>
      {isRealVideo ? (
        <video src={output.url} controls loop muted playsInline autoPlay className={s.media} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={output.url} alt="Результат генерации" loading="lazy" className={s.media} />
      )}
      <a className={s.download} href={output.url} download target="_blank" rel="noopener noreferrer" aria-label="Скачать">
        <Download aria-hidden />
      </a>
    </figure>
  );
}

type Props = {
  job: Job;
  onReuse: (job: Job) => void;
  onDelete: (id: string) => void;
};

export function JobCard({ job, onReuse, onDelete }: Props) {
  const pendingLabel = job.type === 'video' ? 'Создаём видео…' : job.type === 'audio' ? 'Озвучиваем текст…' : 'Генерируем…';

  return (
    <article className={s.job}>
      <div className={s.head}>
        <p className={s.prompt}>{job.prompt}</p>
        <div className={s.actions}>
          <button type="button" onClick={() => onReuse(job)} aria-label="Повторить с этим промптом" title="Повторить">
            <RotateCcw aria-hidden />
          </button>
          {job.status !== 'pending' && (
            <button type="button" onClick={() => onDelete(job.id)} aria-label="Удалить из истории" title="Удалить">
              <Trash2 aria-hidden />
            </button>
          )}
        </div>
      </div>

      <div className={s.meta}>
        <span className={s.chip}>{job.modelName}</span>
        {job.type !== 'audio' && <span className={s.chip}>{job.aspectRatio}</span>}
        {job.mode === 'demo' && <span className={cx(s.chip, s.demo)}>Демо</span>}
        <time dateTime={new Date(job.createdAt).toISOString()}>{timeFmt.format(job.createdAt)}</time>
      </div>

      <div className={s.outputs}>
        {job.status === 'pending' &&
          Array.from({ length: job.count }, (_, i) =>
            job.type === 'audio' ? (
              <div key={i} className={cx(s.audio, s.skeletonAudio)}>
                <Loader2 className={s.spin} aria-hidden />
                {pendingLabel}
              </div>
            ) : (
              <div key={i} className={s.skeleton} data-shape={shapeOf(job.aspectRatio)} style={{ aspectRatio: job.aspectRatio.replace(':', '/') }}>
                <Loader2 className={s.spin} aria-hidden />
                <span>{pendingLabel}</span>
              </div>
            ),
          )}

        {job.status === 'failed' && (
          <div className={s.failed} role="alert">
            <CircleAlert aria-hidden />
            {job.error ?? 'Не удалось сгенерировать. Попробуйте ещё раз.'}
          </div>
        )}

        {job.status === 'completed' && job.outputs.map((o, i) => <Output key={`${o.url}-${i}`} output={o} ratio={job.aspectRatio} />)}
      </div>
    </article>
  );
}
