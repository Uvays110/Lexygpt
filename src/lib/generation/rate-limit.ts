/**
 * Простейший лимит запросов по IP в памяти процесса.
 * Это страховка, а не защита: на нескольких серверах и после перезапуска счётчики не общие.
 * Для продакшена нужны авторизация, баланс токенов и лимиты в базе данных или Redis.
 */
const WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, number[]>();

export function rateLimit(ip: string): { ok: boolean; retryAfterSec: number } {
  const limit = Number(process.env.GENERATION_RATE_LIMIT_PER_HOUR) || 20;
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= limit) {
    hits.set(ip, recent);
    return { ok: false, retryAfterSec: Math.ceil((WINDOW_MS - (now - recent[0])) / 1000) };
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) {
    for (const [key, list] of hits) if (!list.some((t) => now - t < WINDOW_MS)) hits.delete(key);
  }
  return { ok: true, retryAfterSec: 0 };
}

export function clientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown';
}
