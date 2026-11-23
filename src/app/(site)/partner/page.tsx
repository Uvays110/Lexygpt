import { BadgePercent, Infinity as InfinityIcon, Link2, Share2, Timer, Wallet } from 'lucide-react';
import type { Metadata } from 'next';
import { CopyLinkButton, IncomeCalculator } from '@/components/partner/PartnerTools';
import { Accordion } from '@/components/ui/Accordion';
import { site } from '@/config/site';
import { PARTNER_FAQ } from '@/data/faq';
import s from './partner.module.css';

export const metadata: Metadata = {
  title: 'Партнёрская программа',
  description: `Рекомендуйте ${site.name} и получайте ${site.referral.commissionPercent}% с каждой оплаты приглашённых пользователей.`,
  alternates: { canonical: '/partner' },
};

const STATS = [
  { icon: BadgePercent, value: `${site.referral.commissionPercent}%`, label: 'с каждой оплаты клиента' },
  { icon: InfinityIcon, value: 'Навсегда', label: 'клиент закрепляется за вами' },
  { icon: Timer, value: `${site.referral.cookieDays} дней`, label: 'хранится метка перехода' },
];

const STEPS = [
  { icon: Link2, title: 'Получите ссылку', text: 'Скопируйте персональную реферальную ссылку — она уже готова.' },
  { icon: Share2, title: 'Поделитесь', text: 'Расскажите о сервисе в блоге, канале, чате или лично друзьям.' },
  { icon: Wallet, title: 'Получайте доход', text: 'Начисляем процент с каждой оплаты приглашённых — и с продлений тоже.' },
];

export default function PartnerPage() {
  return (
    <>
      <section className="container section">
        <div className={s.hero}>
          <p className={s.eyebrow}>Партнёрская программа</p>
          <h1 className={s.title}>
            Зарабатывайте {site.referral.commissionPercent}% с каждой оплаты
          </h1>
          <p className={s.lead}>
            Рекомендуйте {site.name} друзьям и подписчикам. Вы получаете процент со всех их платежей — не только с первого.
          </p>
          <CopyLinkButton />
          <div className={s.stats}>
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className={s.stat}>
                <Icon aria-hidden />
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 className={s.centerTitle}>Как это работает</h2>
        <ol className={s.steps}>
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className={s.step}>
              <span className={s.stepNum}>{i + 1}</span>
              <Icon aria-hidden />
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container section">
        <h2 className={s.centerTitle}>Посчитайте свой доход</h2>
        <IncomeCalculator />
      </section>

      <section className="container section">
        <h2 className={s.centerTitle}>Вопросы партнёров</h2>
        <div className={s.faq}>
          <Accordion items={PARTNER_FAQ} />
        </div>
      </section>
    </>
  );
}
