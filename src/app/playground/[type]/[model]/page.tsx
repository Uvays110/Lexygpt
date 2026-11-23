import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Studio } from '@/components/studio/Studio';
import { getModel, MODELS } from '@/data/models';

type Params = { type: string; model: string };
type Search = { prompt?: string | string[] };

export function generateStaticParams(): Params[] {
  return MODELS.map((m) => ({ type: m.type, model: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { model } = await params;
  const m = getModel(model);
  if (!m) return {};
  return {
    title: `${m.name} — генерация онлайн`,
    description: m.description,
    alternates: { canonical: `/playground/${m.type}/${m.slug}` },
  };
}

export default async function PlaygroundPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<Search> }) {
  const { type, model } = await params;
  const m = getModel(model);
  if (!m || m.type !== type) notFound();

  const sp = await searchParams;
  const prompt = typeof sp.prompt === 'string' ? sp.prompt.slice(0, 2000) : '';

  return <Studio key={m.slug} initialModel={m.slug} initialPrompt={prompt} />;
}
