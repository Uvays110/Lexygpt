import { NextResponse } from 'next/server';
import { MODELS } from '@/data/models';
import { runDemo } from '@/lib/generation/demo';
import { isLive, submitToFal } from '@/lib/generation/fal';
import { clientIp, rateLimit } from '@/lib/generation/rate-limit';
import type { GenerationResponse } from '@/lib/generation/types';
import { validateRequest } from '@/lib/generation/validate';

export const dynamic = 'force-dynamic';

/** Какие модели работают по-настоящему, а какие — в демо-режиме. */
export function GET() {
  return NextResponse.json({ liveModels: MODELS.filter(isLive).map((m) => m.slug) });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<GenerationResponse>({ status: 'failed', mode: 'demo', error: 'Некорректный запрос' }, { status: 400 });
  }

  const v = validateRequest(body);
  if ('error' in v) {
    return NextResponse.json<GenerationResponse>({ status: 'failed', mode: 'demo', error: v.error }, { status: 400 });
  }

  if (!isLive(v.model)) {
    const outputs = await runDemo(v.model, v.request);
    return NextResponse.json<GenerationResponse>({ status: 'completed', mode: 'demo', outputs });
  }

  const limit = rateLimit(clientIp(req.headers));
  if (!limit.ok) {
    return NextResponse.json<GenerationResponse>(
      { status: 'failed', mode: 'live', error: 'Слишком много генераций подряд. Попробуйте чуть позже.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  try {
    const result = await submitToFal(v);
    return NextResponse.json<GenerationResponse>(result, { status: result.status === 'failed' ? 502 : 200 });
  } catch (e) {
    console.error('[generate] submit failed', e);
    return NextResponse.json<GenerationResponse>({ status: 'failed', mode: 'live', error: 'Провайдер генерации недоступен' }, { status: 502 });
  }
}
