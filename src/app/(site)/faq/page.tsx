import { Mail } from 'lucide-react';
import type { Metadata } from 'next';
import { SectionHeader } from '@/components/catalog/SectionHeader';
import { Accordion } from '@/components/ui/Accordion';
import { TelegramIcon } from '@/components/ui/BrandIcons';
import { site } from '@/config/site';
import { FAQ } from '@/data/faq';
import s from './faq.module.css';

export const metadata: Metadata = {
  title: 'Вопросы и ответы',
  description: `Ответы на частые вопросы о ${site.name}: оплата, токены, промпты, безопасность фото и партнёрская программа.`,
  alternates: { canonical: '/faq' },
};

export default function FaqPage() {
  return (
    <div className="container section">
      <div className={s.wrap}>
        <SectionHeader as="h1" title="Вопросы и ответы" subtitle={`Всё, что нужно знать о работе с ${site.name}.`} />
        <Accordion items={FAQ} />
        <div className={s.support}>
          <div>
            <h2 className={s.supportTitle}>Не нашли ответ?</h2>
            <p className={s.supportText}>Напишите нам — поддержка отвечает каждый день.</p>
          </div>
          <div className={s.contacts}>
            <a href={site.links.support} target="_blank" rel="noopener noreferrer" className={s.contact}>
              <TelegramIcon size={22} />
              Написать в Telegram
            </a>
            <a href={`mailto:${site.links.email}`} className={s.contact}>
              <Mail aria-hidden />
              {site.links.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
