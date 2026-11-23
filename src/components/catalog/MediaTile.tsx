import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Media } from '@/components/ui/Art';
import { Badge } from '@/components/ui/Badge';
import type { CatalogItem } from '@/data/catalog';
import { cx } from '@/lib/cx';
import s from './MediaTile.module.css';

type Props = {
  item: CatalogItem;
  href: string;
  /** Подпись кнопки, появляющейся при наведении. */
  cta: string;
  motion?: boolean;
  ratio?: string;
  className?: string;
};

/** Карточка с обложкой во всю площадь и подписью поверх — для трендов, идей и фотосетов. */
export function MediaTile({ item, href, cta, motion, ratio, className }: Props) {
  return (
    <Link href={href} prefetch={false} className={cx(s.tile, className)} style={{ aspectRatio: ratio ?? item.ratio ?? '3/4' }}>
      <span className={s.media}>
        <Media seed={item.id} image={item.image} video={item.video} motion={motion} alt={item.title} />
      </span>
      {(item.hit || item.tag) && (
        <span className={s.badges}>
          {item.hit && <Badge kind="hit" />}
          {item.tag && <Badge kind="tag" label={item.tag} />}
        </span>
      )}
      <span className={s.overlay}>
        <span className={s.title}>{item.title}</span>
        {item.description && <span className={s.desc}>{item.description}</span>}
        {item.meta && <span className={s.meta}>{item.meta}</span>}
      </span>
      <span className={s.cta}>
        {cta}
        <ArrowUpRight aria-hidden />
      </span>
    </Link>
  );
}
