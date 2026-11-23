import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AIModel } from '@/data/models';
import type { GenerationOutput, GenerationResponse } from './types';
import type { Validated } from './validate';

/**
 * Подключение к fal.ai через очередь (queue API):
 *   1) POST {QUEUE}/{endpoint} — ставим задачу, получаем status_url и response_url;
 *   2) клиент опрашивает /api/generate/status, а сервер проверяет статус в fal;
 *   3) когда статус COMPLETED, забираем результат по response_url.
 * Ключ FAL_KEY никогда не уходит в браузер: клиент получает только подписанный токен задачи.
 */

const QUEUE_BASE = (process.env.FAL_QUEUE_URL || 'https://queue.fal.run').replace(/\/+$/, '');
const TOKEN_TTL_MS = 2 * 60 * 60 * 1000;

export function falKey(): string | undefined {
  return process.env.FAL_KEY?.trim() || undefined;
}

export function isLive(model: AIModel): boolean {
  return Boolean(falKey() && model.fal?.endpoint);
}

function buildInput({ model, request }: Validated): { endpoint: string; input: Record<string, unknown> } {
  const fal = model.fal!;
  const hasRefs = request.references.length > 0;
  const endpoint = hasRefs && fal.editEndpoint ? fal.editEndpoint : fal.endpoint;
  const input: Record<string, unknown> = {};

  if (model.type === 'audio') {
    input.text = request.prompt;
  } else {
    input.prompt = request.prompt;
    input.aspect_ratio = request.aspectRatio;
  }
  if (model.type === 'image') input.num_images = request.count;
  if (model.type === 'video') input.duration = String(request.duration);
  if (hasRefs) {
    if (model.type === 'video') input.image_url = request.references[0];
    else input.image_urls = request.references;
  }

  return { endpoint, input: { ...input, ...fal.input } };
}

async function falFetch(url: string, init?: RequestInit): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Key ${falKey()}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...init?.headers,
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(30_000),
  });
}

async function errorText(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { detail?: unknown; error?: unknown; message?: unknown };
    const detail = data.detail ?? data.error ?? data.message;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail[0] && typeof detail[0] === 'object' && 'msg' in detail[0]) {
      return String((detail[0] as { msg: unknown }).msg);
    }
  } catch {
    // тело не JSON
  }
  return `HTTP ${res.status}`;
}

/* ───── Подписанный токен задачи ───── */

type TokenPayload = { s: string; r: string; t: string; at: number };

function sign(payload: string): string {
  return createHmac('sha256', `queue:${falKey()}`).update(payload).digest('base64url');
}

function makeToken(p: TokenPayload): string {
  const body = Buffer.from(JSON.stringify(p)).toString('base64url');
  return `${body}.${sign(body)}`;
}

function readToken(token: string): TokenPayload | null {
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = Buffer.from(sign(body));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString()) as TokenPayload;
    const sameOrigin = (u: string) => new URL(u).origin === new URL(QUEUE_BASE).origin;
    if (!sameOrigin(p.s) || !sameOrigin(p.r)) return null;
    if (Date.now() - p.at > TOKEN_TTL_MS) return null;
    return p;
  } catch {
    return null;
  }
}

/* ───── Публичные функции ───── */

export async function submitToFal(v: Validated): Promise<GenerationResponse> {
  const { endpoint, input } = buildInput(v);
  const res = await falFetch(`${QUEUE_BASE}/${endpoint}`, { method: 'POST', body: JSON.stringify(input) });
  if (!res.ok) return { status: 'failed', mode: 'live', error: `Провайдер отклонил запрос: ${await errorText(res)}` };
  const data = (await res.json()) as { status_url?: string; response_url?: string };
  if (!data.status_url || !data.response_url) return { status: 'failed', mode: 'live', error: 'Провайдер вернул неожиданный ответ' };
  return {
    status: 'pending',
    mode: 'live',
    token: makeToken({ s: data.status_url, r: data.response_url, t: v.model.type, at: Date.now() }),
  };
}

export async function checkFal(token: string): Promise<GenerationResponse> {
  const p = readToken(token);
  if (!p) return { status: 'failed', mode: 'live', error: 'Задача не найдена или устарела' };

  const statusRes = await falFetch(p.s);
  if (!statusRes.ok) return { status: 'failed', mode: 'live', error: await errorText(statusRes) };
  const status = (await statusRes.json()) as { status?: string };
  if (status.status !== 'COMPLETED') return { status: 'pending', mode: 'live', token };

  const resultRes = await falFetch(p.r);
  if (!resultRes.ok) return { status: 'failed', mode: 'live', error: `Генерация не удалась: ${await errorText(resultRes)}` };
  const outputs = collectOutputs(await resultRes.json());
  if (!outputs.length) return { status: 'failed', mode: 'live', error: 'Провайдер не вернул файлов' };
  return { status: 'completed', mode: 'live', outputs };
}

type FileLike = { url?: unknown; width?: unknown; height?: unknown };

/** Достаёт ссылки на файлы из ответа модели (у разных моделей разные поля). */
export function collectOutputs(data: unknown): GenerationOutput[] {
  const out: GenerationOutput[] = [];
  if (!data || typeof data !== 'object') return out;
  const d = data as Record<string, unknown>;
  const push = (f: unknown, type: GenerationOutput['type']) => {
    const file = f as FileLike | undefined;
    if (file && typeof file.url === 'string' && /^https?:\/\//.test(file.url)) {
      out.push({
        type,
        url: file.url,
        width: typeof file.width === 'number' ? file.width : undefined,
        height: typeof file.height === 'number' ? file.height : undefined,
      });
    }
  };
  if (Array.isArray(d.images)) d.images.forEach((i) => push(i, 'image'));
  push(d.image, 'image');
  if (Array.isArray(d.videos)) d.videos.forEach((v) => push(v, 'video'));
  push(d.video, 'video');
  push(d.audio, 'audio');
  push(d.audio_file, 'audio');
  push(d.audio_url, 'audio');
  return out;
}
