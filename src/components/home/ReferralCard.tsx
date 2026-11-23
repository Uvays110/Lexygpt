'use client';

import { Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUI } from '@/components/providers/UIProvider';
import { Button } from '@/components/ui/Button';
import { site } from '@/config/site';
import { copyText } from '@/lib/clipboard';
import { getMyReferralLink } from '@/lib/referral';
import s from './ReferralCard.module.css';

export function ReferralCard() {
  const { toast } = useUI();
  const [link, setLink] = useState('');

  useEffect(() => setLink(getMyReferralLink()), []);

  const copy = async () => {
    const value = link || getMyReferralLink();
    const ok = await copyText(value);
    toast(ok ? 'Ссылка скопирована — отправьте её другу' : 'Не удалось скопировать ссылку', ok ? 'success' : 'error');
  };

  return (
    <section className="container section">
      <div className={s.card}>
        <div className={s.text}>
          <p className={s.eyebrow}>Реферальная программа</p>
          <h2 className={s.title}>+{site.referral.bonusTokens} токенов за друга!</h2>
          <p className={s.desc}>Хотите больше генераций бесплатно? Пригласите друзей — бонус придёт, как только они зарегистрируются.</p>
        </div>
        <div className={s.action}>
          <Button variant="white" fullWidth onClick={copy} iconLeft={<Copy aria-hidden />}>
            Скопировать ссылку
          </Button>
          <p className={s.link} title={link}>
            {link || ' '}
          </p>
        </div>
      </div>
    </section>
  );
}
