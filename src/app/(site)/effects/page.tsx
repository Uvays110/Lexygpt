import type { Metadata } from 'next';
import { EffectsGrid } from '@/components/catalog/EffectsGrid';
import { SectionHeader } from '@/components/catalog/SectionHeader';
import { EFFECTS } from '@/data/catalog';

export const metadata: Metadata = {
  title: 'ИИ-эффекты для фото и видео',
  description: 'Аватар по фото, новые ракурсы, фото на документы, улучшение качества и карточки товаров — в один клик.',
  alternates: { canonical: '/effects' },
};

export default function EffectsPage() {
  return (
    <div className="container section">
      <SectionHeader
        as="h1"
        title="Эффекты"
        subtitle="Быстрые ИИ-действия для фото и видео — когда нужен результат без сложных промптов и ручной обработки."
      />
      <EffectsGrid items={EFFECTS} />
    </div>
  );
}
