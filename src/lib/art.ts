import { hashString, mulberry32 } from './hash';

/**
 * Генеративные обложки. Пока у карточек нет настоящих фото и видео,
 * сайт рисует для них абстрактные градиентные «арты» — у каждой карточки свой,
 * но всегда одинаковый для одного и того же seed.
 */

export type Palette = { a: string; b: string; c: string; base: string };

export const PALETTES: Palette[] = [
  { a: '#ff7eb3', b: '#a259ff', c: '#ffb86b', base: '#1a0f2e' },
  { a: '#ffd166', b: '#ff6b6b', c: '#6a4cff', base: '#1c0f24' },
  { a: '#7cf3ff', b: '#3d7bff', c: '#b6ff6b', base: '#08142b' },
  { a: '#c6ff3a', b: '#24d6a5', c: '#2a6cff', base: '#071a18' },
  { a: '#ffb38a', b: '#ff4f7b', c: '#7a2cff', base: '#200a1d' },
  { a: '#e3c8ff', b: '#8ec5fc', c: '#ff9ad5', base: '#121433' },
  { a: '#ffe8a3', b: '#ff9f43', c: '#e8467c', base: '#24100c' },
  { a: '#a8fff0', b: '#5be3a0', c: '#f4ff7a', base: '#0b1f1a' },
  { a: '#f5efe6', b: '#c9b39b', c: '#8a6f55', base: '#17130f' },
  { a: '#ff5f6d', b: '#ffc371', c: '#3b1f6e', base: '#1d0b16' },
  { a: '#9be15d', b: '#00e3ae', c: '#0e4d92', base: '#071612' },
  { a: '#d4e4ff', b: '#6f86d6', c: '#48c6ef', base: '#0b1022' },
];

export const ART_SHAPES = ['orb', 'arch', 'horizon', 'ribbon', 'orb', 'none'] as const;
export type ArtShape = (typeof ART_SHAPES)[number];

export type ArtParams = {
  palette: Palette;
  shape: ArtShape;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  angle: number;
};

export function artParams(seed: string): ArtParams {
  const h = hashString(seed);
  const rnd = mulberry32(h);
  const palette = PALETTES[h % PALETTES.length];
  const shape = ART_SHAPES[Math.floor(rnd() * ART_SHAPES.length)];
  return {
    palette,
    shape,
    x1: Math.round(15 + rnd() * 70),
    y1: Math.round(8 + rnd() * 40),
    x2: Math.round(10 + rnd() * 80),
    y2: Math.round(50 + rnd() * 40),
    angle: Math.round(rnd() * 360),
  };
}

/** CSS-фон для обложки: несколько мягких радиальных градиентов поверх тёмной базы. */
export function artBackground(p: ArtParams): string {
  const { palette: c, x1, y1, x2, y2, angle } = p;
  return [
    `radial-gradient(62% 48% at ${x1}% ${y1}%, ${c.a} 0%, transparent 72%)`,
    `radial-gradient(72% 58% at ${x2}% ${y2}%, ${c.b} 0%, transparent 72%)`,
    `radial-gradient(90% 70% at ${100 - x1}% ${100 - Math.round(y1 / 2)}%, ${c.c}aa 0%, transparent 70%)`,
    `linear-gradient(${angle}deg, ${c.base} 0%, #0a0a0d 100%)`,
  ].join(', ');
}
