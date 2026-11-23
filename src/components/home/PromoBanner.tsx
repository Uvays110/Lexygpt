import { ArrowRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Art } from '@/components/ui/Art';
import { Button } from '@/components/ui/Button';
import { cx } from '@/lib/cx';
import s from './PromoBanner.module.css';

type Props = {
  variant: 'winter' | 'accent';
  title: string;
  text: string;
  cta: string;
  href: string;
  seed: string;
};

/** Широкий промо-баннер с веером карточек по краям. */
export function PromoBanner({ variant, title, text, cta, href, seed }: Props) {
  const fan = (side: 'l' | 'r') =>
    [0, 1].map((i) => (
      <span key={i} className={s.card}>
        <Art seed={`${seed}-${side}${i}`} />
      </span>
    ));

  return (
    <section className="container section">
      <div className={cx(s.banner, s[variant])}>
        <div className={cx(s.side, s.left)} aria-hidden>
          {fan('l')}
        </div>
        <div className={s.center}>
          <div className={s.miniFan} aria-hidden>
            {[0, 1, 2].map((i) => (
              <span key={i} className={s.miniCard} style={{ '--i': i } as CSSProperties}>
                <Art seed={`${seed}-m${i}`} />
              </span>
            ))}
          </div>
          <h2 className={s.title}>{title}</h2>
          <p className={s.text}>{text}</p>
          <Button href={href} variant={variant === 'winter' ? 'white' : 'accent'} iconRight={<ArrowRight aria-hidden />}>
            {cta}
          </Button>
        </div>
        <div className={cx(s.side, s.right)} aria-hidden>
          {fan('r')}
        </div>
      </div>
    </section>
  );
}
