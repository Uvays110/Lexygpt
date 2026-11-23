'use client';

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ChipGroup } from '@/components/ui/Chip';
import { ALL, filterItems, itemHref, type CatalogItem, type Category } from '@/data/catalog';
import { cx } from '@/lib/cx';
import { FadeMore } from './FadeMore';
import { MediaTile } from './MediaTile';
import s from './FilterableGrid.module.css';

type Layout = 'masonry' | 'grid4' | 'grid3';

type Props = {
  items: CatalogItem[];
  categories?: Category[];
  initialCategory?: string;
  layout: Layout;
  cta: string;
  motion?: boolean;
  /** Обрезать сетку с кнопкой «Смотреть все» (для главной). */
  fade?: { href: string; label: string; maxHeight: number };
  search?: { placeholder: string };
  /** Запоминать выбранную категорию в адресе страницы (?category=…). */
  syncUrl?: boolean;
  ratio?: string;
};

const normalize = (v: string) => v.toLowerCase().replace(/ё/g, 'е');

/** Сетка карточек с фильтрами по категориям и (опционально) поиском. */
export function FilterableGrid({ items, categories, initialCategory, layout, cta, motion, fade, search, syncUrl, ratio }: Props) {
  const [category, setCategory] = useState(initialCategory ?? ALL.id);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let list = categories ? filterItems(items, category) : items;
    const q = normalize(query.trim());
    if (q) list = list.filter((i) => normalize(`${i.title} ${i.description ?? ''} ${i.prompt}`).includes(q));
    return list;
  }, [items, categories, category, query]);

  const changeCategory = (id: string) => {
    setCategory(id);
    if (!syncUrl) return;
    const url = new URL(window.location.href);
    if (id === ALL.id) url.searchParams.delete('category');
    else url.searchParams.set('category', id);
    window.history.replaceState(null, '', url);
  };

  const grid = (
    <div className={s[layout]}>
      {filtered.map((item) => (
        <MediaTile
          key={item.id}
          item={item}
          href={itemHref(item)}
          cta={cta}
          motion={motion}
          ratio={layout === 'masonry' ? undefined : ratio}
          className={cx(layout === 'masonry' && s.masonryItem)}
        />
      ))}
    </div>
  );

  return (
    <div>
      {(search || categories) && (
        <div className={s.controls}>
          {search && (
            <label className={s.search}>
              <Search aria-hidden />
              <input
                type="search"
                placeholder={search.placeholder}
                aria-label={search.placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          )}
          {categories && <ChipGroup options={categories} value={category} onChange={changeCategory} label="Категории" />}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className={s.empty}>Ничего не нашлось — попробуйте другую категорию или запрос.</p>
      ) : fade ? (
        <FadeMore href={fade.href} label={fade.label} maxHeight={fade.maxHeight}>
          {grid}
        </FadeMore>
      ) : (
        grid
      )}
    </div>
  );
}
