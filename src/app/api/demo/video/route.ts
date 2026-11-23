import { demoSvg } from '@/lib/generation/demo';

const clamp = (v: string | null, def: number) => Math.min(2048, Math.max(64, Number(v) || def));

export function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const svg = demoSvg(q.get('seed') || 'demo', clamp(q.get('w'), 900), clamp(q.get('h'), 1600), (q.get('label') || '').slice(0, 40), true);
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
