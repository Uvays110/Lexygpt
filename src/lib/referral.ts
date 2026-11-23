import { site } from '@/config/site';
import { readStorage, writeStorage } from './storage';

const INVITER_KEY = 'ref:inviter';
const MY_CODE_KEY = 'ref:my-code';
const CODE_RE = /^[A-Za-z0-9_-]{3,32}$/;

/**
 * Запоминает код пригласившего из ссылки вида /?ref=CODE.
 * Код хранится в cookie `ref` (её увидит сервер при регистрации/оплате) и в localStorage.
 */
export function captureReferral(): void {
  try {
    const code = new URLSearchParams(window.location.search).get('ref');
    if (!code || !CODE_RE.test(code)) return;
    const maxAge = site.referral.cookieDays * 24 * 60 * 60;
    document.cookie = `ref=${encodeURIComponent(code)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
    writeStorage(INVITER_KEY, { code, at: Date.now() });
  } catch {
    // без cookie и хранилища просто не запоминаем
  }
}

export function getInviterCode(): string | null {
  const v = readStorage<{ code: string } | null>(INVITER_KEY, null);
  return v?.code ?? null;
}

/**
 * Код текущего посетителя для его собственной реферальной ссылки.
 * После подключения авторизации заменить на код из аккаунта пользователя.
 */
export function getMyReferralCode(): string {
  const existing = readStorage<string | null>(MY_CODE_KEY, null);
  if (existing && CODE_RE.test(existing)) return existing;
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const b of bytes) code += alphabet[b % alphabet.length];
  writeStorage(MY_CODE_KEY, code);
  return code;
}

export function getMyReferralLink(): string {
  return `${window.location.origin}/?ref=${getMyReferralCode()}`;
}
