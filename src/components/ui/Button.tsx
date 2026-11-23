import Link from 'next/link';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import s from './Button.module.css';

export type ButtonVariant = 'accent' | 'white' | 'gray' | 'premium' | 'pink' | 'outline' | 'soft';
export type ButtonSize = 'sm' | 'md' | 'lg';

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

type AsLink = BaseProps & {
  href: string;
  /** Отключить предзагрузку страницы (для ссылок с уникальными параметрами). */
  prefetch?: boolean;
  onClick?: never;
  type?: never;
  disabled?: never;
  ariaLabel?: string;
};

type AsButton = BaseProps & {
  href?: undefined;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  ariaLabel?: string;
};

export function Button(props: AsLink | AsButton) {
  const { variant = 'accent', size = 'md', fullWidth, className, children, iconLeft, iconRight, ariaLabel } = props;
  const cls = cx(s.button, s[variant], s[size], fullWidth && s.full, className);
  const content = (
    <>
      {iconLeft}
      <span className={s.label}>{children}</span>
      {iconRight}
    </>
  );

  if (props.href !== undefined) {
    if (/^https?:\/\//.test(props.href)) {
      return (
        <a href={props.href} className={cls} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel}>
          {content}
        </a>
      );
    }
    return (
      <Link href={props.href} className={cls} aria-label={ariaLabel} prefetch={props.prefetch}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      className={cls}
      onClick={props.onClick}
      disabled={props.disabled}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
