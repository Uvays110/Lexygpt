import { Play } from 'lucide-react';
import Link from 'next/link';
import { Media } from '@/components/ui/Art';
import { Badge, type BadgeKind } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import s from './CatalogCard.module.css';

type Props = {
  seed: string;
  title: string;
  description?: string;
  href: string;
  image?: string;
  video?: string;
  /** Белый стикер на обложке («НОВИНКА», «РЕКОМЕНДУЕМ»). */
  tag?: string;
  /** Бейдж рядом с заголовком (ТОП, Новое…). */
  badge?: BadgeKind;
  /** Подпись под описанием, например стоимость. */
  meta?: string;
  motion?: boolean;
  cta?: string;
};

/** Карточка модели или эффекта: обложка, заголовок, описание и кнопка «Попробовать». */
export function CatalogCard({ seed, title, description, href, image, video, tag, badge, meta, motion, cta = 'Попробовать' }: Props) {
  return (
    <article className={s.card}>
      <Link href={href} prefetch={false} className={s.mediaLink} tabIndex={-1} aria-hidden>
        <span className={s.media}>
          <Media seed={seed} image={image} video={video} motion={motion} />
        </span>
        {tag && (
          <span className={s.tag}>
            <Badge kind="tag" label={tag} />
          </span>
        )}
      </Link>
      <div className={s.body}>
        <h3 className={s.title}>
          {title}
          {badge && <Badge kind={badge} />}
        </h3>
        {description && <p className={s.desc}>{description}</p>}
        {meta && <p className={s.meta}>{meta}</p>}
      </div>
      <Button href={href} prefetch={false} variant="white" fullWidth iconRight={<Play aria-hidden />} className={s.button}>
        {cta}
      </Button>
    </article>
  );
}
