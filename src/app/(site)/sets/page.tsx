import type { Metadata } from 'next';
import { FilterableGrid } from '@/components/catalog/FilterableGrid';
import { SectionHeader } from '@/components/catalog/SectionHeader';
import { SET_CATEGORIES, SETS } from '@/data/catalog';
import { pickCategory } from '@/data/categories';

export const metadata: Metadata = {
  title: 'Премиум-фотосеты',
  description: 'Готовые сценарии фотосессий: загрузите фото и получите серию студийных кадров без промптов.',
  alternates: { canonical: '/sets' },
};

export default async function SetsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  return (
    <div className="container section">
      <SectionHeader
        as="h1"
        title="Премиум-фотосеты"
        subtitle="Выберите готовый сценарий, загрузите своё фото и получите серию кадров без ручной настройки промпта."
      />
      <FilterableGrid
        items={SETS}
        categories={SET_CATEGORIES}
        initialCategory={pickCategory(SET_CATEGORIES, category)}
        layout="grid4"
        cta="Выбрать"
        ratio="3/4"
        syncUrl
      />
    </div>
  );
}
