import { AudioLines, Clapperboard, Film, Flame, ImagePlus, LayoutGrid, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Art } from '@/components/ui/Art';
import { Badge, type BadgeKind } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import s from './CreateGrid.module.css';

type SmallCard = { title: string; text: string; href: string; icon: LucideIcon; badge?: BadgeKind };

const CARDS: SmallCard[] = [
  { title: 'Создать видео', text: 'Кинематографичные ролики из текста или фото', href: '/playground/video/kling-3-0', icon: Clapperboard },
  { title: 'Seedance 2.5', text: 'Видео с реализмом живой съёмки', href: '/playground/video/seedance-2-5', icon: Film },
  { title: 'Nano Banana Pro', text: 'Фото с высокой детализацией и точным текстом', href: '/playground/image/nano-banana-pro', icon: ImagePlus },
  { title: 'Тренды', text: 'Повторяйте вирусные ролики одним кликом', href: '/trends', icon: Flame, badge: 'top' },
  { title: 'Фотосеты', text: 'Готовые студийные образы без промптов', href: '/sets', icon: LayoutGrid, badge: 'premium' },
  { title: 'Озвучка', text: 'Живые голоса для роликов и рекламы', href: '/playground/audio/elevenlabs', icon: AudioLines, badge: 'new' },
];

export function CreateGrid() {
  return (
    <section className="container" style={{ paddingTop: 24 }}>
      <div className={s.grid}>
        <div className={s.large}>
          <div className={s.largeText}>
            <h2 className={s.largeTitle}>Создать фото</h2>
            <p className={s.largeDesc}>Опишите идею — и получите эффектный кадр за несколько секунд</p>
            <Button href="/playground/image/nano-banana-pro" variant="white">
              Начать создавать
            </Button>
          </div>
          <div className={s.stack} aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={s.stackItem} style={{ '--i': i } as CSSProperties}>
                <Art seed={`create-stack-${i}`} />
              </span>
            ))}
          </div>
        </div>

        {CARDS.map(({ title, text, href, icon: Icon, badge }) => (
          <Link key={title} href={href} className={s.small}>
            <span className={s.smallHead}>
              <Icon aria-hidden />
              {badge && <Badge kind={badge} />}
            </span>
            <h3 className={s.smallTitle}>{title}</h3>
            <p className={s.smallText}>{text}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
