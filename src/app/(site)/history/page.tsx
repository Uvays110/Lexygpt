import type { Metadata } from 'next';
import { SectionHeader } from '@/components/catalog/SectionHeader';
import { HistoryList } from '@/components/history/HistoryList';

export const metadata: Metadata = {
  title: 'История генераций',
  robots: { index: false },
};

export default function HistoryPage() {
  return (
    <div className="container section" style={{ maxWidth: 1000 }}>
      <SectionHeader as="h1" title="История" subtitle="Ваши последние генерации. Повторите любую в один клик." />
      <HistoryList />
    </div>
  );
}
