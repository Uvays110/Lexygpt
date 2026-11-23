'use client';

import { Clock3, ImagePlus, Loader2, Mic, RectangleVertical, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties, type DragEvent } from 'react';
import { useUI } from '@/components/providers/UIProvider';
import { Art } from '@/components/ui/Art';
import {
  getModel,
  IMAGE_RATIOS,
  VIDEO_DURATIONS,
  VIDEO_RATIOS,
  VOICES,
  type AIModel,
  type MediaType,
} from '@/data/models';
import { cx } from '@/lib/cx';
import type { GenerationResponse } from '@/lib/generation/types';
import { loadHistory, newId, removeJob, saveJob, type Job } from '@/lib/history';
import { ModelPicker, SelectPill, Stepper } from './Controls';
import { JobCard } from './JobCard';
import s from './Studio.module.css';

const MAX_REFS = 4;
const MAX_PARALLEL = 2;
const POLL_MS = 2500;
const DEFAULT_RATIO: Record<MediaType, string> = { image: '3:4', video: '9:16', audio: '1:1' };

const EXAMPLES: Record<MediaType, string[]> = {
  image: [
    'Портрет девушки в лучах закатного солнца, плёночное зерно, мягкий фон',
    'Уютная кофейня в дождливый вечер, тёплый свет, вид через окно',
    'Кот-астронавт на Луне, Земля на горизонте, кинематографичный свет',
  ],
  video: [
    'Камера медленно облетает героя на заснеженной улице, падает снег',
    'Волны разбиваются о скалы на закате, замедленная съёмка',
    'Неоновый ночной город, машины проносятся мимо, вид с дрона',
  ],
  audio: [
    'Привет! Это демо-озвучка: тёплый, дружелюбный голос для вашего ролика.',
    'Новая коллекция уже в продаже. Успейте заказать со скидкой до конца недели!',
    'Добро пожаловать на наш канал. Сегодня расскажем, как создать вау-контент за минуту.',
  ],
};

type Ref = { id: string; name: string; dataUrl: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Уменьшает фото до 1280 px по большей стороне и сжимает в JPEG — чтобы запрос был лёгким. */
async function toDataUrl(file: File, max = 1280): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.86);
}

async function requestJson(url: string, init?: RequestInit): Promise<GenerationResponse> {
  const res = await fetch(url, init);
  try {
    return (await res.json()) as GenerationResponse;
  } catch {
    return { status: 'failed', mode: 'demo', error: `Сервер ответил ошибкой ${res.status}` };
  }
}

type Props = { initialModel: string; initialPrompt?: string };

export function Studio({ initialModel, initialPrompt = '' }: Props) {
  const { toast } = useUI();
  const [slug, setSlug] = useState(initialModel);
  const model = (getModel(slug) ?? getModel(initialModel))!;

  const [prompt, setPrompt] = useState(initialPrompt);
  const [aspect, setAspect] = useState(DEFAULT_RATIO[model.type]);
  const [count, setCount] = useState(1);
  const [duration, setDuration] = useState<number>(VIDEO_DURATIONS[0]);
  const [voice, setVoice] = useState<string>(VOICES[0]);
  const [refs, setRefs] = useState<Ref[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [liveModels, setLiveModels] = useState<string[] | null>(null);
  const [dragging, setDragging] = useState(false);

  const alive = useRef(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    alive.current = true;
    setJobs(loadHistory().slice(0, 30));
    fetch('/api/generate')
      .then((r) => r.json())
      .then((d: { liveModels?: string[] }) => setLiveModels(d.liveModels ?? []))
      .catch(() => setLiveModels([]));
    return () => {
      alive.current = false;
    };
  }, []);

  // Поле ввода растёт вместе с текстом.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [prompt]);

  const selectModel = (m: AIModel) => {
    if (m.type !== model.type) setAspect(DEFAULT_RATIO[m.type]);
    if (!m.references) setRefs([]);
    setSlug(m.slug);
    window.history.replaceState(null, '', `/playground/${m.type}/${m.slug}`);
  };

  const addFiles = async (files: FileList | File[] | null) => {
    if (!files || !model.references) return;
    const images = [...files].filter((f) => f.type.startsWith('image/'));
    const room = MAX_REFS - refs.length;
    if (images.length > room) toast(`Можно прикрепить не больше ${MAX_REFS} фото`);
    for (const file of images.slice(0, Math.max(0, room))) {
      try {
        const dataUrl = await toDataUrl(file);
        setRefs((list) => (list.length >= MAX_REFS ? list : [...list, { id: newId(), name: file.name, dataUrl }]));
      } catch {
        toast(`Не удалось открыть «${file.name}»`, 'error');
      }
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void addFiles(e.dataTransfer.files);
  };

  const updateJob = (id: string, patch: Partial<Job>) =>
    setJobs((list) => list.map((j) => (j.id === id ? { ...j, ...patch } : j)));

  const pending = jobs.filter((j) => j.status === 'pending').length;
  const cost = model.cost * (model.type === 'image' ? count : 1);
  const isDemo = liveModels !== null && !liveModels.includes(model.slug);

  const generate = async () => {
    const text = prompt.trim();
    if (!text) {
      textareaRef.current?.focus();
      toast('Опишите, что нужно создать');
      return;
    }
    if (pending >= MAX_PARALLEL) {
      toast('Дождитесь окончания текущих генераций');
      return;
    }

    const job: Job = {
      id: newId(),
      model: model.slug,
      modelName: model.name,
      type: model.type,
      prompt: text,
      aspectRatio: model.type === 'audio' ? '1:1' : aspect,
      count: model.type === 'image' ? count : 1,
      status: 'pending',
      outputs: [],
      createdAt: Date.now(),
    };
    setJobs((list) => [job, ...list]);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      let data = await requestJson('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model.slug,
          prompt: text,
          aspectRatio: job.aspectRatio,
          count: job.count,
          duration,
          voice,
          references: refs.map((r) => r.dataUrl),
        }),
      });

      const deadline = Date.now() + 15 * 60 * 1000;
      while (data.status === 'pending') {
        if (!alive.current) return;
        if (Date.now() > deadline) throw new Error('Генерация заняла слишком много времени');
        await sleep(POLL_MS);
        data = await requestJson(`/api/generate/status?token=${encodeURIComponent(data.token)}`);
      }
      if (!alive.current) return;

      if (data.status === 'completed') {
        const done: Job = { ...job, status: 'completed', mode: data.mode, outputs: data.outputs };
        updateJob(job.id, done);
        saveJob(done);
      } else {
        updateJob(job.id, { status: 'failed', mode: data.mode, error: data.error });
      }
    } catch (e) {
      if (alive.current) {
        updateJob(job.id, { status: 'failed', error: e instanceof Error ? e.message : 'Не удалось связаться с сервером' });
      }
    }
  };

  const reuse = (job: Job) => {
    const m = getModel(job.model);
    if (m && m.slug !== model.slug) selectModel(m);
    setPrompt(job.prompt);
    textareaRef.current?.focus();
  };

  const remove = (id: string) => {
    setJobs((list) => list.filter((j) => j.id !== id));
    removeJob(id);
  };

  const placeholder =
    model.type === 'audio'
      ? 'Введите текст, который нужно озвучить…'
      : model.type === 'video'
        ? 'Опишите сцену и движение камеры…'
        : 'Опишите изображение или прикрепите референс…';

  return (
    <div className={s.studio}>
      <div className={s.feed}>
        <div className={s.topbar}>
          <div>
            <h1 className={s.title}>{model.name}</h1>
            <p className={s.subtitle}>{model.description}</p>
          </div>
          <Link href="/history" className={s.historyLink}>
            <Clock3 aria-hidden />
            Вся история
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className={s.empty}>
            <div className={s.fan} aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <span key={i} style={{ '--i': i } as CSSProperties}>
                  <Art seed={`empty-${model.type}-${i}`} motion={model.type === 'video'} />
                </span>
              ))}
            </div>
            <h2 className={s.emptyTitle}>Здесь появятся ваши генерации</h2>
            <p className={s.emptyText}>Опишите идею своими словами или начните с примера:</p>
            <div className={s.examples}>
              {EXAMPLES[model.type].map((ex) => (
                <button key={ex} type="button" className={s.example} onClick={() => setPrompt(ex)}>
                  {ex}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={s.jobs}>
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onReuse={reuse} onDelete={remove} />
            ))}
          </div>
        )}
      </div>

      <div className={s.composerWrap}>
        <form
          className={cx(s.composer, dragging && s.dragging)}
          onSubmit={(e) => {
            e.preventDefault();
            void generate();
          }}
          onDragOver={(e) => {
            if (!model.references) return;
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          {refs.length > 0 && (
            <div className={s.refs}>
              {refs.map((r) => (
                <div key={r.id} className={s.ref}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.dataUrl} alt={r.name} />
                  <button type="button" onClick={() => setRefs((l) => l.filter((x) => x.id !== r.id))} aria-label={`Убрать ${r.name}`}>
                    <X aria-hidden />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className={s.inputRow}>
            {model.references && (
              <>
                <button
                  type="button"
                  className={s.attach}
                  onClick={() => fileRef.current?.click()}
                  aria-label="Прикрепить фото-референс"
                  title="Прикрепить фото"
                  disabled={refs.length >= MAX_REFS}
                >
                  <ImagePlus aria-hidden />
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  hidden
                  onChange={(e) => {
                    void addFiles(e.target.files);
                    e.target.value = '';
                  }}
                />
              </>
            )}
            <textarea
              ref={textareaRef}
              className={s.textarea}
              rows={1}
              value={prompt}
              maxLength={2000}
              placeholder={placeholder}
              aria-label="Промпт"
              onChange={(e) => setPrompt(e.target.value)}
              onPaste={(e) => {
                const files = [...e.clipboardData.files].filter((f) => f.type.startsWith('image/'));
                if (files.length && model.references) {
                  e.preventDefault();
                  void addFiles(files);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  void generate();
                }
              }}
            />
            {prompt && (
              <button type="button" className={s.clear} onClick={() => setPrompt('')} aria-label="Очистить промпт">
                <X aria-hidden />
              </button>
            )}
          </div>

          <div className={s.controls}>
            <ModelPicker model={model} onSelect={selectModel} />
            {model.type === 'image' && (
              <SelectPill
                value={aspect}
                options={IMAGE_RATIOS}
                onChange={setAspect}
                label="Соотношение сторон"
                icon={<RectangleVertical aria-hidden />}
              />
            )}
            {model.type === 'video' && (
              <>
                <SelectPill
                  value={aspect}
                  options={VIDEO_RATIOS}
                  onChange={setAspect}
                  label="Соотношение сторон"
                  icon={<RectangleVertical aria-hidden />}
                />
                <SelectPill
                  value={duration}
                  options={VIDEO_DURATIONS}
                  onChange={setDuration}
                  label="Длительность"
                  icon={<Clock3 aria-hidden />}
                  format={(d) => `${d} с`}
                />
              </>
            )}
            {model.type === 'audio' && (
              <SelectPill value={voice} options={VOICES} onChange={setVoice} label="Голос" icon={<Mic aria-hidden />} />
            )}

            <div className={s.spacer} />

            {model.type === 'image' && <Stepper value={count} min={1} max={4} onChange={setCount} label="Количество изображений" />}

            <button type="submit" className={s.generate} disabled={!prompt.trim()}>
              {pending > 0 && <Loader2 className={s.spin} aria-hidden />}
              Сгенерировать
              <span className={s.cost} title="Стоимость в токенах">
                <Sparkles aria-hidden />
                {cost}
              </span>
            </button>
          </div>

          {isDemo && (
            <p className={s.demoNote}>
              Демо-режим: вместо настоящих результатов показываются заглушки. Подключите провайдера генерации — см. README.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
