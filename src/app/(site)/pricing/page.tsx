import { ArrowUpRight, Crown, Layers, MapPin, ShieldCheck, Sparkles, Wallet, type LucideIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PricingTable } from '@/components/pricing/PricingTable';
import { Accordion } from '@/components/ui/Accordion';
import { Button } from '@/components/ui/Button';
import { site } from '@/config/site';
import { FAQ } from '@/data/faq';
import { INCLUDED } from '@/data/pricing';
import s from './pricing.module.css';

export const metadata: Metadata = {
  title: 'Тарифы',
  description: `Тарифы ${site.name}: пакеты токенов для генерации фото, видео и озвучки. Оплата только за готовый результат.`,
  alternates: { canonical: '/pricing' },
};

const ICONS: Record<(typeof INCLUDED)[number]['icon'], LucideIcon> = {
  sparkles: Sparkles,
  wallet: Wallet,
  layers: Layers,
  crown: Crown,
  map: MapPin,
  shield: ShieldCheck,
};

export default function PricingPage() {
  return (
    <>
      <section className="container section">
        <div className={s.hero}>
          <h1 className={s.title}>Создавайте визуал нового уровня вместе с {site.name}</h1>
          <p className={s.lead}>Выберите пакет токенов — их хватит на фото, видео и озвучку в любых моделях.</p>
        </div>
        <PricingTable />
        <div className={s.notes}>
          <p>
            Оплачивая подписку, вы принимаете <Link href="/terms">оферту</Link> и{' '}
            <Link href="/privacy">политику обработки персональных данных</Link>, включая условия регулярных платежей.
            Отключить продление можно в любой момент.
          </p>
          <p>
            {site.legal.owner}, ИНН {site.legal.taxId}
          </p>
        </div>
      </section>

      <section className="container section">
        <div className={s.business}>
          <div>
            <h2 className={s.businessTitle}>Для команд и бизнеса</h2>
            <p className={s.businessText}>Подберём объём токенов под задачи команды, оплату по счёту и закрывающие документы.</p>
          </div>
          <Button href={site.links.support} iconRight={<ArrowUpRight aria-hidden />}>
            Связаться
          </Button>
        </div>
      </section>

      <section className="container section">
        <h2 className={s.centerTitle}>Что входит в любой тариф</h2>
        <div className={s.included}>
          {INCLUDED.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <div key={item.title} className={s.feature}>
                <Icon aria-hidden />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container section">
        <h2 className={s.centerTitle}>Частые вопросы</h2>
        <div className={s.faq}>
          <Accordion items={FAQ} />
        </div>
      </section>
    </>
  );
}
