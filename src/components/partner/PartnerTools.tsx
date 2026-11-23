'use client';

import { Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUI } from '@/components/providers/UIProvider';
import { Button } from '@/components/ui/Button';
import { site } from '@/config/site';
import { formatMoney, PLANS } from '@/data/pricing';
import { copyText } from '@/lib/clipboard';
import { plural } from '@/lib/plural';
import { getMyReferralLink } from '@/lib/referral';
import s from './PartnerTools.module.css';

export function CopyLinkButton({ variant = 'premium' }: { variant?: 'premium' | 'white' }) {
  const { toast } = useUI();
  const copy = async () => {
    const ok = await copyText(getMyReferralLink());
    toast(ok ? 'Ссылка скопирована' : 'Не удалось скопировать ссылку', ok ? 'success' : 'error');
  };
  return (
    <Button variant={variant} onClick={copy} iconLeft={<Copy aria-hidden />} size="lg">
      Скопировать мою ссылку
    </Button>
  );
}

/** Калькулятор дохода партнёра: число клиентов × средний чек × процент. */
export function IncomeCalculator() {
  const [clients, setClients] = useState(40);
  const [planId, setPlanId] = useState('pro');
  const [link, setLink] = useState('');
  useEffect(() => setLink(getMyReferralLink()), []);

  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[0];
  const price = plan.tiers[0].price.rub;
  const monthly = Math.round((clients * price * site.referral.commissionPercent) / 100);

  return (
    <div className={s.calc}>
      <div className={s.inputs}>
        <label className={s.field}>
          <span className={s.label}>
            Сколько клиентов оплачивают подписку
            <strong>
              {clients} {plural(clients, ['человек', 'человека', 'человек'])}
            </strong>
          </span>
          <input type="range" min={1} max={500} value={clients} onChange={(e) => setClients(Number(e.target.value))} />
        </label>
        <div className={s.field}>
          <span className={s.label}>Какой тариф выбирают чаще</span>
          <div className={s.plans} role="radiogroup" aria-label="Тариф">
            {PLANS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={p.id === planId}
                className={p.id === planId ? s.planActive : s.plan}
                onClick={() => setPlanId(p.id)}
              >
                {p.name}
                <small>{formatMoney(p.tiers[0].price.rub, 'rub')}</small>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={s.result}>
        <span className={s.resultLabel}>Ваш доход в месяц</span>
        <strong className={s.resultValue}>≈ {formatMoney(monthly, 'rub')}</strong>
        <span className={s.resultHint}>
          {site.referral.commissionPercent}% от {formatMoney(price, 'rub')} × {clients} — и так каждый месяц, пока клиенты продлевают подписку
        </span>
        {link && <span className={s.link}>{link}</span>}
      </div>
    </div>
  );
}
