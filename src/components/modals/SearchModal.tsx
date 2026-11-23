'use client';

import { ArrowUpRight, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { searchEntries } from '@/data/search';
import s from './SearchModal.module.css';

const QUICK = [
  { label: 'Nano Banana Pro', href: '/playground/image/nano-banana-pro' },
  { label: 'Seedance 2.5', href: '/playground/video/seedance-2-5' },
  { label: 'Тренды', href: '/trends' },
  { label: 'Фотосеты', href: '/sets' },
  { label: 'Идеи для фото', href: '/prompts' },
  { label: 'Эффекты', href: '/effects' },
  { label: 'Тарифы', href: '/pricing' },
];

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchEntries(query), [query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(id);
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} label="Поиск по сайту" size="lg" top>
      <div className={s.box}>
        <Search aria-hidden />
        <input
          ref={inputRef}
          className={s.input}
          type="search"
          placeholder="Модель, тренд, фотосет или эффект"
          aria-label="Поиск"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {query.trim() ? (
        results.length ? (
          <div className={s.results}>
            {results.map((group) => (
              <section key={group.group} className={s.group}>
                <h3 className={s.groupTitle}>{group.group}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={`${group.group}-${item.title}`}>
                      <Link href={item.href} className={s.result} onClick={onClose}>
                        <span className={s.resultText}>
                          <span className={s.resultTitle}>{item.title}</span>
                          {item.subtitle && <span className={s.resultSub}>{item.subtitle}</span>}
                        </span>
                        <ArrowUpRight aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <p className={s.empty}>Ничего не нашлось. Попробуйте другое слово.</p>
        )
      ) : (
        <div className={s.quick}>
          <p className={s.groupTitle}>Популярное</p>
          <div className={s.quickList}>
            {QUICK.map((q) => (
              <Link key={q.href} href={q.href} className={s.quickItem} onClick={onClose}>
                {q.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
