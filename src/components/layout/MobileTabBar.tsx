'use client';

import { CircleUserRound, History, House, LayoutGrid, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUI } from '@/components/providers/UIProvider';
import { cx } from '@/lib/cx';
import s from './MobileTabBar.module.css';

/** Нижняя панель навигации на телефонах. */
export function MobileTabBar() {
  const pathname = usePathname();
  const { openLogin } = useUI();
  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <nav className={s.bar} aria-label="Быстрая навигация">
      <Link href="/" className={cx(s.item, active('/') && s.active)}>
        <House aria-hidden />
        Главная
      </Link>
      <Link href="/prompts" className={cx(s.item, active('/prompts') && s.active)}>
        <LayoutGrid aria-hidden />
        Идеи
      </Link>
      <Link href="/playground/image/nano-banana-pro" className={s.create} aria-label="Создать">
        <Sparkles aria-hidden />
      </Link>
      <Link href="/history" className={cx(s.item, active('/history') && s.active)}>
        <History aria-hidden />
        История
      </Link>
      <button type="button" className={s.item} onClick={openLogin}>
        <CircleUserRound aria-hidden />
        Войти
      </button>
    </nav>
  );
}
