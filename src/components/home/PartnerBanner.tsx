import { ArrowRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Button } from '@/components/ui/Button';
import { site } from '@/config/site';
import s from './PartnerBanner.module.css';

const FLOATERS = [
  { text: '+300 ₽', x: '5%', y: '46%', r: '-9deg', z: 1, blur: 0 },
  { text: '+150 ₽', x: '17%', y: '12%', r: '7deg', z: 0.8, blur: 2 },
  { text: '+500 ₽', x: '15%', y: '70%', r: '5deg', z: 0.9, blur: 0 },
  { text: '+250 ₽', x: '82%', y: '20%', r: '10deg', z: 1, blur: 0 },
  { text: '+700 ₽', x: '74%', y: '62%', r: '-6deg', z: 0.85, blur: 1 },
  { text: `${site.referral.commissionPercent}%`, x: '62%', y: '8%', r: '-4deg', z: 0.7, blur: 3 },
];

export function PartnerBanner() {
  return (
    <section className="container section">
      <div className={s.banner}>
        <div className={s.floaters} aria-hidden>
          {FLOATERS.map((f) => (
            <span
              key={f.text + f.x}
              className={s.floater}
              style={{ left: f.x, top: f.y, '--r': f.r, '--z': f.z, filter: f.blur ? `blur(${f.blur}px)` : undefined } as CSSProperties}
            >
              {f.text}
            </span>
          ))}
        </div>
        <div className={s.center}>
          <h2 className={s.title}>Зарабатывайте с {site.name}</h2>
          <p className={s.text}>
            Рекомендуйте сервис друзьям и подписчикам — и получайте доход по одной из самых щедрых партнёрских программ.
          </p>
          <div className={s.stats}>
            <div className={s.stat}>
              <strong>{site.referral.commissionPercent}%</strong>
              <span>с каждой оплаты клиента</span>
            </div>
            <span className={s.sep} />
            <div className={s.stat}>
              <strong>Навсегда</strong>
              <span>со всех продлений подписки</span>
            </div>
          </div>
          <Button href="/partner" variant="premium" iconRight={<ArrowRight aria-hidden />}>
            Подробнее
          </Button>
        </div>
      </div>
    </section>
  );
}
