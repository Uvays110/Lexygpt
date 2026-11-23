'use client';

import { ArrowRight, ChevronDown, Headset, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useUI } from '@/components/providers/UIProvider';
import { Art } from '@/components/ui/Art';
import { Badge, type BadgeKind } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { MEDIA_TYPES, modelsByType, playgroundHref, type MediaType } from '@/data/models';
import { cx } from '@/lib/cx';
import s from './Header.module.css';

type NavItem =
  | { kind: 'menu'; type: MediaType; label: string }
  | { kind: 'link'; href: string; label: string; badge?: BadgeKind };

const NAV: NavItem[] = [
  { kind: 'menu', type: 'image', label: 'Фото' },
  { kind: 'menu', type: 'video', label: 'Видео' },
  { kind: 'menu', type: 'audio', label: 'Аудио' },
  { kind: 'link', href: '/trends', label: 'Тренды', badge: 'top' },
  { kind: 'link', href: '/sets', label: 'Фотосеты', badge: 'premium' },
  { kind: 'link', href: '/prompts', label: 'Идеи' },
  { kind: 'link', href: '/effects', label: 'Эффекты' },
  { kind: 'link', href: '/models', label: 'Модели' },
  { kind: 'link', href: '/partner', label: 'Партнёрам' },
];

const MENU_WIDTH = 340;

type OpenMenu = { type: MediaType; left: number; top: number };

export function Header() {
  const pathname = usePathname();
  const { openSearch, openLogin } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<OpenMenu | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Закрываем меню при переходе на другую страницу.
  useEffect(() => setMenu(null), [pathname]);

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const onPointer = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (menuRef.current?.contains(target) || target.closest('[data-menu-trigger]')) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', close);
    };
  }, [menu]);

  const toggleMenu = (type: MediaType, el: HTMLElement) => {
    if (menu?.type === type) return setMenu(null);
    const r = el.getBoundingClientRect();
    const left = Math.max(12, Math.min(r.left - 8, window.innerWidth - MENU_WIDTH - 12));
    setMenu({ type, left, top: r.bottom + 12 });
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={cx(s.header, scrolled && s.scrolled)}>
      <div className={cx('container', s.inner)}>
        <div className={s.left}>
          <Logo />
          <nav className={cx(s.nav, 'noScrollbar')} aria-label="Основное меню">
            {NAV.map((item) =>
              item.kind === 'menu' ? (
                <button
                  key={item.type}
                  type="button"
                  data-menu-trigger
                  className={cx(
                    s.navLink,
                    (menu?.type === item.type || pathname.startsWith(`/playground/${item.type}`)) && s.active,
                  )}
                  aria-expanded={menu?.type === item.type}
                  aria-haspopup="menu"
                  onClick={(e) => toggleMenu(item.type, e.currentTarget)}
                >
                  {item.label}
                  <ChevronDown className={cx(s.chevron, menu?.type === item.type && s.chevronOpen)} aria-hidden />
                </button>
              ) : (
                <Link key={item.href} href={item.href} className={cx(s.navLink, isActive(item.href) && s.active)}>
                  {item.label}
                  {item.badge && <Badge kind={item.badge} />}
                </Link>
              ),
            )}
          </nav>
        </div>

        <div className={s.actions}>
          <button type="button" className={s.iconBtn} onClick={openSearch} aria-label="Поиск (Ctrl + K)">
            <Search aria-hidden />
          </button>
          <Link href="/faq" className={cx(s.iconBtn, s.desktopOnly)} aria-label="Поддержка">
            <Headset aria-hidden />
          </Link>
          <Button href="/pricing" variant="outline" size="sm">
            Тарифы
          </Button>
          <Button onClick={openLogin} variant="white" size="sm">
            Войти
          </Button>
        </div>
      </div>

      {menu && (
        <div
          ref={menuRef}
          className={s.menu}
          style={{ left: menu.left, top: menu.top, width: MENU_WIDTH }}
          role="menu"
          aria-label={`Модели: ${MEDIA_TYPES.find((m) => m.id === menu.type)?.label}`}
        >
          <p className={s.menuTitle}>Модели для {MEDIA_TYPES.find((m) => m.id === menu.type)?.plural}</p>
          {modelsByType(menu.type).map((m) => (
            <Link key={m.slug} href={playgroundHref(m)} className={s.menuItem} role="menuitem">
              <span className={s.menuThumb}>
                <Art seed={`model-${m.slug}`} />
              </span>
              <span className={s.menuText}>
                <span className={s.menuName}>
                  {m.name}
                  {m.badge && <Badge kind={m.badge} />}
                </span>
                <span className={s.menuTagline}>{m.tagline}</span>
              </span>
            </Link>
          ))}
          <Link href={`/models?type=${menu.type}`} className={s.menuFooter} role="menuitem">
            Все модели
            <ArrowRight aria-hidden />
          </Link>
        </div>
      )}
    </header>
  );
}
