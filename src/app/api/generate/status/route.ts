import { NextResponse } from 'next/server';
import { checkFal, falKey } from '@/lib/generation/fal';
import type { GenerationResponse } from '@/lib/generation/types';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token');
  if (!token || !falKey()) {
    return NextResponse.json<GenerationResponse>({ status: 'failed', mode: 'live', error: 'Задача не найдена' }, { status: 404 });
  }
  try {
    return NextResponse.json<GenerationResponse>(await checkFal(token));
  } catch (e) {
    console.error('[generate] status failed', e);
    // Временная ошибка сети — клиент просто спросит ещё раз.
    return NextResponse.json<GenerationResponse>({ status: 'pending', mode: 'live', token });
  }
}
