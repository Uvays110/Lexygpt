import { demoSvg } from '@/lib/generation/demo';

const clamp = (v: string | null, def: number) => Math.min(2048, Math.max(64, Number(v) || def));

export function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const svg = demoSvg(q.get('seed') || 'demo', clamp(q.get('w'), 1024), clamp(q.get('h'), 1024), (q.get('label') || '').slice(0, 40), false);
  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
