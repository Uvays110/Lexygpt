import type { Metadata } from 'next';
import { FilterableGrid } from '@/components/catalog/FilterableGrid';
import { SectionHeader } from '@/components/catalog/SectionHeader';
import { IDEA_CATEGORIES, IDEAS } from '@/data/catalog';
import { pickCategory } from '@/data/categories';

export const metadata: Metadata = {
  title: 'Идеи и промпты для фото',
  description: 'Коллекция готовых идей для ИИ-фото: портреты, зима, семья, питомцы и бизнес. Повторите любой кадр в один клик.',
  alternates: { canonical: '/prompts' },
};

export default async function PromptsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  return (
    <div className="container section">
      <SectionHeader
        as="h1"
        title="От идеи до вау-кадра"
        subtitle="Готовые идеи, которые превращают обычное фото в контент уровня профессиональной съёмки."
      />
      <FilterableGrid
        items={IDEAS}
        categories={IDEA_CATEGORIES}
        initialCategory={pickCategory(IDEA_CATEGORIES, category)}
        layout="grid4"
        cta="Повторить"
        ratio="3/4"
        search={{ placeholder: 'Найдите идею: зима, портрет, питомцы…' }}
        syncUrl
      />
    </div>
  );
}
