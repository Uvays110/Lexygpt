import { ChevronDown } from 'lucide-react';
import type { FaqItem } from '@/data/faq';
import s from './Accordion.module.css';

/** Список вопросов на нативных <details>: работает без JavaScript и с клавиатуры. */
export function Accordion({ items }: { items: FaqItem[] }) {
  return (
    <div className={s.list}>
      {items.map((item) => (
        <details key={item.q} className={s.item}>
          <summary className={s.summary}>
            <span>{item.q}</span>
            <ChevronDown aria-hidden />
          </summary>
          <p className={s.answer}>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
