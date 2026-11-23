import Link from 'next/link';
import { site } from '@/config/site';
import { cx } from '@/lib/cx';
import s from './Logo.module.css';

/** Знак бренда: рамка видоискателя с акцентной точкой в центре. */
export function LogoMark({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M4 11.5V8a4 4 0 0 1 4-4h3.5M20.5 4H24a4 4 0 0 1 4 4v3.5M28 20.5V24a4 4 0 0 1-4 4h-3.5M11.5 28H8a4 4 0 0 1-4-4v-3.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="4.6" fill="var(--accent)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cx(s.logo, className)} aria-label={`${site.name} — на главную`}>
      <LogoMark />
      <span className={s.word}>{site.name}</span>
    </Link>
  );
}
