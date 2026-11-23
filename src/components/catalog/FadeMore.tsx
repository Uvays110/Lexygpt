'use client';

import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { cx } from '@/lib/cx';
import s from './FadeMore.module.css';

type Props = {
  children: ReactNode;
  href: string;
  label: string;
  /** Высота, после которой контент обрезается плавным затуханием. */
  maxHeight: number;
};

/** Обрезает длинную сетку с затуханием и кнопкой «Смотреть все». */
export function FadeMore({ children, href, label, maxHeight }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOverflowing(el.scrollHeight > maxHeight + 4);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [maxHeight]);

  return (
    <div className={cx(s.wrap, overflowing && s.overflowing)} style={{ '--fade-max': `${maxHeight}px` } as CSSProperties}>
      <div ref={ref} className={s.content}>
        {children}
      </div>
      <div className={s.footer}>
        <Button href={href} variant="soft" iconRight={<ArrowUpRight aria-hidden />}>
          {label}
        </Button>
      </div>
    </div>
  );
}
