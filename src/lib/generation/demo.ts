import { artParams } from '@/lib/art';
import type { AIModel } from '@/data/models';
import type { GenerationOutput, GenerationRequest } from './types';

/**
 * Демо-режим: без ключа провайдера сайт всё равно показывает полный цикл генерации,
 * но вместо настоящего результата отдаёт генеративную заглушку с пометкой «Демо».
 */

const DEMO_DELAY: Record<AIModel['type'], number> = { image: 1400, video: 2600, audio: 1100 };

const SIZES: Record<string, [number, number]> = {
  '1:1': [1024, 1024],
  '3:4': [960, 1280],
  '4:3': [1280, 960],
  '9:16': [900, 1600],
  '16:9': [1600, 900],
};

export function sizeFor(aspectRatio: string): [number, number] {
  return SIZES[aspectRatio] ?? SIZES['1:1'];
}

export async function runDemo(model: AIModel, req: Required<Pick<GenerationRequest, 'prompt' | 'aspectRatio' | 'count'>>): Promise<GenerationOutput[]> {
  await new Promise((r) => setTimeout(r, DEMO_DELAY[model.type]));
  const base = `${model.slug}:${req.prompt}:${Date.now()}`;
  const [w, h] = sizeFor(req.aspectRatio);
  const label = encodeURIComponent(model.name);

  if (model.type === 'audio') {
    return [{ type: 'audio', url: `/api/demo/audio?seed=${encodeURIComponent(base)}` }];
  }
  if (model.type === 'video') {
    return [{ type: 'video', url: `/api/demo/video?seed=${encodeURIComponent(base)}&w=${w}&h=${h}&label=${label}`, width: w, height: h }];
  }
  return Array.from({ length: req.count }, (_, i) => ({
    type: 'image' as const,
    url: `/api/demo/image?seed=${encodeURIComponent(`${base}:${i}`)}&w=${w}&h=${h}&label=${label}`,
    width: w,
    height: h,
  }));
}

const esc = (v: string) => v.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** SVG-картинка в той же стилистике, что и обложки на сайте. Для видео — с анимацией. */
export function demoSvg(seed: string, w: number, h: number, label: string, animated: boolean): string {
  const p = artParams(seed);
  const c = p.palette;
  const m = Math.min(w, h);
  const dur = (s: number) => `${s}s`;

  const drift = animated
    ? `<animateTransform attributeName="transform" type="translate" values="0 0; ${w * 0.05} ${-h * 0.04}; ${-w * 0.04} ${h * 0.03}; 0 0" dur="${dur(9)}" repeatCount="indefinite"/>`
    : '';

  let shape = '';
  switch (p.shape) {
    case 'orb': {
      const cy = h * 0.44;
      const float = animated ? `<animate attributeName="cy" values="${cy - h * 0.03};${cy + h * 0.03};${cy - h * 0.03}" dur="${dur(6)}" repeatCount="indefinite"/>` : '';
      shape = `<circle cx="${w / 2}" cy="${cy}" r="${m * 0.3}" fill="${c.a}" opacity=".45" filter="url(#soft)">${float}</circle>
<circle cx="${w / 2}" cy="${cy}" r="${m * 0.23}" fill="url(#orb)">${float}</circle>`;
      break;
    }
    case 'arch': {
      const x1 = w * 0.24;
      const x2 = w * 0.76;
      const r = (x2 - x1) / 2;
      const top = h * 0.36 + r;
      shape = `<path d="M${x1} ${h} V${top} A${r} ${r} 0 0 1 ${x2} ${top} V${h} Z" fill="url(#archFill)" opacity=".92"/>`;
      break;
    }
    case 'horizon': {
      const y = h * 0.58;
      const r = w * 0.19;
      shape = `<path d="M${w / 2 - r} ${y} A${r} ${r} 0 0 1 ${w / 2 + r} ${y} Z" fill="url(#sun)"/>
<rect x="0" y="${y}" width="${w}" height="${h - y}" fill="url(#ground)"/>
<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="#fff" stroke-opacity=".25"/>`;
      break;
    }
    case 'ribbon': {
      const sway = animated
        ? `<animateTransform attributeName="transform" type="rotate" values="-22 ${w / 2} ${h / 2}; -12 ${w / 2} ${h / 2}; -22 ${w / 2} ${h / 2}" dur="${dur(10)}" repeatCount="indefinite"/>`
        : '';
      shape = `<rect x="${-w * 0.25}" y="${h * 0.46}" width="${w * 1.5}" height="${h * 0.2}" rx="${h * 0.1}" fill="url(#ribbonFill)" opacity=".85" filter="url(#soft2)" transform="rotate(-18 ${w / 2} ${h / 2})">${sway}</rect>`;
      break;
    }
    default:
      shape = '';
  }

  const fontSize = Math.max(18, Math.round(m / 24));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
<linearGradient id="base" gradientTransform="rotate(${p.angle} .5 .5)"><stop offset="0" stop-color="${c.base}"/><stop offset="1" stop-color="#0a0a0d"/></linearGradient>
<radialGradient id="g1" cx="${p.x1}%" cy="${p.y1}%" r="62%"><stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.a}" stop-opacity="0"/></radialGradient>
<radialGradient id="g2" cx="${p.x2}%" cy="${p.y2}%" r="72%"><stop offset="0" stop-color="${c.b}"/><stop offset="1" stop-color="${c.b}" stop-opacity="0"/></radialGradient>
<radialGradient id="g3" cx="${100 - p.x1}%" cy="${100 - Math.round(p.y1 / 2)}%" r="85%"><stop offset="0" stop-color="${c.c}" stop-opacity=".67"/><stop offset="1" stop-color="${c.c}" stop-opacity="0"/></radialGradient>
<radialGradient id="orb" cx="34%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".25" stop-color="${c.a}"/><stop offset=".8" stop-color="${c.b}"/><stop offset="1" stop-color="${c.b}" stop-opacity="0"/></radialGradient>
<linearGradient id="archFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.a}"/><stop offset=".7" stop-color="${c.b}"/><stop offset="1" stop-color="${c.c}"/></linearGradient>
<linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".3" stop-color="${c.a}"/><stop offset="1" stop-color="${c.c}"/></linearGradient>
<linearGradient id="ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.b}" stop-opacity=".55"/><stop offset="1" stop-color="#08080c" stop-opacity=".92"/></linearGradient>
<linearGradient id="ribbonFill" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${c.a}" stop-opacity="0"/><stop offset=".25" stop-color="${c.a}"/><stop offset=".6" stop-color="${c.b}"/><stop offset="1" stop-color="${c.b}" stop-opacity="0"/></linearGradient>
<radialGradient id="vignette" cx="50%" cy="40%" r="75%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient>
<filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${m / 14}"/></filter>
<filter id="soft2"><feGaussianBlur stdDeviation="${m / 300}"/></filter>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0"/></filter>
</defs>
<rect width="${w}" height="${h}" fill="url(#base)"/>
<g>${drift}
<rect x="${-w * 0.1}" y="${-h * 0.1}" width="${w * 1.2}" height="${h * 1.2}" fill="url(#g3)"/>
<rect x="${-w * 0.1}" y="${-h * 0.1}" width="${w * 1.2}" height="${h * 1.2}" fill="url(#g2)"/>
<rect x="${-w * 0.1}" y="${-h * 0.1}" width="${w * 1.2}" height="${h * 1.2}" fill="url(#g1)"/>
</g>
${shape}
<rect width="${w}" height="${h}" filter="url(#grain)" opacity=".28" style="mix-blend-mode:overlay"/>
<rect width="${w}" height="${h}" fill="url(#vignette)"/>
<text x="${fontSize * 1.5}" y="${h - fontSize * 1.5}" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="${fontSize}" font-weight="600" fill="#fff" fill-opacity=".6">${animated ? 'Демо-видео' : 'Демо'} · ${esc(label)}</text>
</svg>`;
}

/** Короткий WAV-перезвон (≈3 с) — заглушка для озвучки в демо-режиме. */
export function demoWav(seed: string): Buffer {
  const rate = 22050;
  const seconds = 3;
  const n = rate * seconds;
  const data = Buffer.alloc(n * 2);
  const p = artParams(seed);
  const scale = [0, 2, 4, 7, 9, 12, 14, 16];
  const root = 220 * Math.pow(2, (p.x1 % 7) / 12);
  const notes = [0, 1, 2, 3].map((i) => root * Math.pow(2, scale[(p.x1 + p.y2 * (i + 1)) % scale.length] / 12));
  const step = n / notes.length;

  for (let i = 0; i < n; i++) {
    const t = i / rate;
    let v = 0;
    notes.forEach((f, k) => {
      const start = k * step;
      if (i < start) return;
      const local = (i - start) / rate;
      const env = Math.exp(-local * 2.4) * Math.min(1, local * 60);
      v += env * (Math.sin(2 * Math.PI * f * t) * 0.6 + Math.sin(4 * Math.PI * f * t) * 0.18);
    });
    const fadeOut = Math.min(1, (n - i) / (rate * 0.2));
    const sample = Math.max(-1, Math.min(1, v * 0.32 * fadeOut));
    data.writeInt16LE(Math.round(sample * 32767), i * 2);
  }

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}
