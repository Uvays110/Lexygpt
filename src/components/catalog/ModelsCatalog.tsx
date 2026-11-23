'use client';

import { useState } from 'react';
import { ChipGroup } from '@/components/ui/Chip';
import { MEDIA_TYPES, MODELS, playgroundHref, type MediaType } from '@/data/models';
import { tokens } from '@/lib/plural';
import { CatalogCard } from './CatalogCard';
import s from './ModelsCatalog.module.css';

type Filter = 'all' | MediaType;

const OPTIONS: ReadonlyArray<{ id: Filter; label: string }> = [{ id: 'all', label: 'Все' }, ...MEDIA_TYPES];

type Props = {
  initialType?: Filter;
  /** Сколько карточек показать (на главной — одну строку). */
  limit?: number;
  syncUrl?: boolean;
};

export function ModelsCatalog({ initialType = 'all', limit, syncUrl }: Props) {
  const [filter, setFilter] = useState<Filter>(initialType);
  const list = MODELS.filter((m) => filter === 'all' || m.type === filter).slice(0, limit);

  const change = (value: Filter) => {
    setFilter(value);
    if (!syncUrl) return;
    const url = new URL(window.location.href);
    if (value === 'all') url.searchParams.delete('type');
    else url.searchParams.set('type', value);
    window.history.replaceState(null, '', url);
  };

  return (
    <div>
      <ChipGroup options={OPTIONS} value={filter} onChange={change} label="Тип модели" className={s.chips} />
      <div className={s.grid}>
        {list.map((m) => (
          <CatalogCard
            key={m.slug}
            seed={`model-${m.slug}`}
            title={m.name}
            description={limit ? m.tagline : m.description}
            badge={m.badge}
            meta={`${tokens(m.cost)} за генерацию`}
            href={playgroundHref(m)}
            image={m.image}
            video={m.video}
            motion={m.type === 'video'}
          />
        ))}
      </div>
    </div>
  );
}
