'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import s from './Chip.module.css';

type ChipProps = {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  small?: boolean;
};

export function Chip({ active, children, onClick, href, small }: ChipProps) {
  const cls = cx(s.chip, active && s.active, small && s.small);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick} aria-pressed={active}>
      {children}
    </button>
  );
}

type ChipGroupProps<T extends string> = {
  options: ReadonlyArray<{ id: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
};

/** Ряд фильтров: на десктопе переносится, на телефоне листается свайпом. */
export function ChipGroup<T extends string>({ options, value, onChange, label, className }: ChipGroupProps<T>) {
  return (
    <div className={cx(s.group, 'noScrollbar', className)} role="group" aria-label={label}>
      {options.map((o) => (
        <Chip key={o.id} active={o.id === value} onClick={() => onChange(o.id)}>
          {o.label}
        </Chip>
      ))}
    </div>
  );
}
