import type { Metadata } from 'next';
import { ModelsCatalog } from '@/components/catalog/ModelsCatalog';
import { SectionHeader } from '@/components/catalog/SectionHeader';
import { MEDIA_TYPES, type MediaType } from '@/data/models';

export const metadata: Metadata = {
  title: 'ИИ-модели для фото, видео и аудио',
  description: 'Все нейросети в одном окне: Nano Banana Pro, Seedance, Kling, Veo, Midjourney и другие. Выберите модель под задачу.',
  alternates: { canonical: '/models' },
};

export default async function ModelsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;
  const initial = MEDIA_TYPES.some((m) => m.id === type) ? (type as MediaType) : 'all';
  return (
    <div className="container section">
      <SectionHeader
        as="h1"
        title="ИИ-модели"
        subtitle="Ведущие нейросети для фото, видео и озвучки. Цена указана в токенах за одну генерацию."
      />
      <ModelsCatalog initialType={initial} syncUrl />
    </div>
  );
}
