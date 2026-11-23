import { CatalogCard } from '@/components/catalog/CatalogCard';
import { itemHref, type CatalogItem } from '@/data/catalog';
import s from './ModelsCatalog.module.css';

export function EffectsGrid({ items }: { items: CatalogItem[] }) {
  return (
    <div className={s.grid}>
      {items.map((e) => (
        <CatalogCard
          key={e.id}
          seed={`effect-${e.id}`}
          title={e.title}
          description={e.description}
          tag={e.tag}
          href={itemHref(e)}
          image={e.image}
          video={e.video}
          motion={e.categories.includes('video')}
        />
      ))}
    </div>
  );
}
