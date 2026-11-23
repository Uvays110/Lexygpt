import { getModel, IMAGE_RATIOS, VIDEO_DURATIONS, VIDEO_RATIOS, VOICES, type AIModel } from '@/data/models';
import type { GenerationRequest } from './types';

export const MAX_PROMPT = 2000;
export const MAX_REFERENCES = 4;
const MAX_REFERENCE_CHARS = 3_000_000;
const DATA_URL_RE = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;

export type Validated = { model: AIModel; request: Required<Omit<GenerationRequest, 'voice'>> & { voice?: string } };

/** Проверяет запрос на генерацию. Возвращает понятную пользователю ошибку на русском. */
export function validateRequest(body: unknown): Validated | { error: string } {
  if (!body || typeof body !== 'object') return { error: 'Пустой запрос' };
  const b = body as Record<string, unknown>;

  const model = typeof b.model === 'string' ? getModel(b.model) : undefined;
  if (!model) return { error: 'Неизвестная модель' };

  const prompt = typeof b.prompt === 'string' ? b.prompt.trim() : '';
  if (!prompt) return { error: 'Опишите, что нужно создать' };
  if (prompt.length > MAX_PROMPT) return { error: `Промпт длиннее ${MAX_PROMPT} символов` };

  const ratios: readonly string[] = model.type === 'video' ? VIDEO_RATIOS : IMAGE_RATIOS;
  const aspectRatio = typeof b.aspectRatio === 'string' && ratios.includes(b.aspectRatio) ? b.aspectRatio : ratios[0];

  const rawCount = typeof b.count === 'number' ? Math.floor(b.count) : 1;
  const count = model.type === 'image' ? Math.min(4, Math.max(1, rawCount)) : 1;

  const durations: readonly number[] = VIDEO_DURATIONS;
  const duration = typeof b.duration === 'number' && durations.includes(b.duration) ? b.duration : durations[0];

  const voices: readonly string[] = VOICES;
  const voice = typeof b.voice === 'string' && voices.includes(b.voice) ? b.voice : undefined;

  const refsRaw = Array.isArray(b.references) ? b.references : [];
  if (refsRaw.length > MAX_REFERENCES) return { error: `Можно прикрепить не больше ${MAX_REFERENCES} фото` };
  const references: string[] = [];
  for (const r of refsRaw) {
    if (typeof r !== 'string' || r.length > MAX_REFERENCE_CHARS || !DATA_URL_RE.test(r)) {
      return { error: 'Референсы должны быть изображениями PNG, JPEG или WebP до 2 МБ' };
    }
    references.push(r);
  }
  if (references.length && !model.references) return { error: 'Эта модель не принимает фото-референсы' };

  return { model, request: { model: model.slug, prompt, aspectRatio, count, duration, voice, references } };
}
