import type { Metadata } from 'next';
import { FilterableGrid } from '@/components/catalog/FilterableGrid';
import { SectionHeader } from '@/components/catalog/SectionHeader';
import { PRESETS, TREND_CATEGORIES, TRENDS } from '@/data/catalog';
import { pickCategory } from '@/data/categories';

export const metadata: Metadata = {
  title: 'Тренды — вирусные видео в один клик',
  description: 'Повторяйте популярные видео-тренды: выберите сценарий, загрузите фото и получите готовый ролик.',
  alternates: { canonical: '/trends' },
};

export default async function TrendsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  return (
    <>
      <div className="container section">
        <SectionHeader
          as="h1"
          title="Тренды"
          subtitle="Повторяйте вирусные ролики в один клик: выберите сценарий, загрузите фото и получите готовое видео."
        />
        <FilterableGrid
          items={TRENDS}
          categories={TREND_CATEGORIES}
          initialCategory={pickCategory(TREND_CATEGORIES, category)}
          layout="masonry"
          cta="Повторить"
          motion
          syncUrl
        />
      </div>
      <section className="container section">
        <SectionHeader title="Видео-пресеты" subtitle="Готовые движения камеры для кинематографичных роликов." />
        <FilterableGrid items={PRESETS} layout="grid3" cta="Использовать" motion ratio="16/9" />
      </section>
    </>
  );
}
