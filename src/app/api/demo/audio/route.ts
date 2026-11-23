import { demoWav } from '@/lib/generation/demo';

export function GET(req: Request) {
  const seed = new URL(req.url).searchParams.get('seed') || 'demo';
  const wav = demoWav(seed);
  return new Response(new Uint8Array(wav), {
    headers: {
      'Content-Type': 'audio/wav',
      'Content-Length': String(wav.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
