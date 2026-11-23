import type { CSSProperties } from 'react';
import { artBackground, artParams } from '@/lib/art';
import { cx } from '@/lib/cx';
import s from './Art.module.css';

type ArtProps = {
  /** Любая строка: одинаковый seed всегда даёт одинаковую картинку. */
  seed: string;
  /** Для видео-карточек фон медленно «дышит», имитируя движение. */
  motion?: boolean;
  className?: string;
};

/** Генеративная обложка-заглушка, пока у карточки нет настоящего фото или видео. */
export function Art({ seed, motion, className }: ArtProps) {
  const p = artParams(seed);
  const vars = {
    '--art-bg': artBackground(p),
    '--art-a': p.palette.a,
    '--art-b': p.palette.b,
    '--art-c': p.palette.c,
  } as CSSProperties;

  return (
    <div className={cx(s.art, motion && s.motion, className)} style={vars} aria-hidden>
      <div className={s.layer} />
      {p.shape !== 'none' && <div className={cx(s.shape, s[p.shape])} />}
      <div className={s.grain} />
      <div className={s.vignette} />
    </div>
  );
}

type MediaProps = {
  seed: string;
  image?: string;
  video?: string;
  alt?: string;
  motion?: boolean;
  className?: string;
};

/** Показывает настоящее фото/видео, если оно указано в данных, иначе — генеративную обложку. */
export function Media({ seed, image, video, alt = '', motion, className }: MediaProps) {
  if (video) {
    return (
      <video
        className={cx(s.media, className)}
        src={video}
        poster={image}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
      />
    );
  }
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className={cx(s.media, className)} src={image} alt={alt} loading="lazy" decoding="async" />;
  }
  return <Art seed={seed} motion={motion} className={className} />;
}
