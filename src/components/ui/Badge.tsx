import { Flame, Sparkles, Star } from 'lucide-react';
import { cx } from '@/lib/cx';
import s from './Badge.module.css';

export type BadgeKind = 'top' | 'premium' | 'new' | 'hit' | 'tag';

const DEFAULT_LABEL: Record<BadgeKind, string> = {
  top: 'ТОП',
  premium: 'Премиум',
  new: 'Новое',
  hit: 'ХИТ',
  tag: 'НОВИНКА',
};

export function Badge({ kind, label, className }: { kind: BadgeKind; label?: string; className?: string }) {
  const text = label ?? DEFAULT_LABEL[kind];
  return (
    <span className={cx(s.badge, s[kind], className)}>
      {kind === 'top' && <Flame aria-hidden />}
      {kind === 'premium' && <Star aria-hidden />}
      {kind === 'new' && <Sparkles aria-hidden />}
      {text}
    </span>
  );
}
