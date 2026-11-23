'use client';

import { ChevronDown, Minus, Plus, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Art } from '@/components/ui/Art';
import { Badge } from '@/components/ui/Badge';
import { MEDIA_TYPES, modelsByType, type AIModel, type MediaType } from '@/data/models';
import { cx } from '@/lib/cx';
import s from './Controls.module.css';

/** Кнопка выбора модели с выпадающим списком (открывается вверх над полем ввода). */
export function ModelPicker({ model, onSelect }: { model: AIModel; onSelect: (m: AIModel) => void }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<MediaType>(model.type);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setTab(model.type);
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, model.type]);

  return (
    <div className={s.picker} ref={ref}>
      <button
        type="button"
        className={cx(s.pill, s.modelPill)}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className={s.thumb}>
          <Art seed={`model-${model.slug}`} />
        </span>
        <span className={s.pillLabel}>{model.name}</span>
        <ChevronDown className={cx(s.chevron, open && s.chevronOpen)} aria-hidden />
      </button>

      {open && (
        <div className={s.popover} role="dialog" aria-label="Выбор модели">
          <div className={s.tabs} role="tablist">
            {MEDIA_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                className={cx(s.tab, tab === t.id && s.tabActive)}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <ul className={s.list}>
            {modelsByType(tab).map((m) => (
              <li key={m.slug}>
                <button
                  type="button"
                  className={cx(s.item, m.slug === model.slug && s.itemActive)}
                  aria-current={m.slug === model.slug}
                  onClick={() => {
                    onSelect(m);
                    setOpen(false);
                  }}
                >
                  <span className={s.itemThumb}>
                    <Art seed={`model-${m.slug}`} />
                  </span>
                  <span className={s.itemText}>
                    <span className={s.itemName}>
                      {m.name}
                      {m.badge && <Badge kind={m.badge} />}
                    </span>
                    <span className={s.itemDesc}>{m.tagline}</span>
                  </span>
                  <span className={s.itemCost} title="Стоимость в токенах">
                    <Sparkles aria-hidden />
                    {m.cost}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

type SelectPillProps<T extends string | number> = {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  label: string;
  icon?: ReactNode;
  format?: (value: T) => string;
};

/** Компактный выпадающий список: выглядит как «таблетка», работает как нативный select. */
export function SelectPill<T extends string | number>({ value, options, onChange, label, icon, format }: SelectPillProps<T>) {
  const show = (v: T) => (format ? format(v) : String(v));
  return (
    <label className={s.pill}>
      {icon}
      <span className={s.pillLabel}>{show(value)}</span>
      <ChevronDown className={s.chevron} aria-hidden />
      <select
        className={s.native}
        aria-label={label}
        value={String(value)}
        onChange={(e) => {
          const next = options.find((o) => String(o) === e.target.value);
          if (next !== undefined) onChange(next);
        }}
      >
        {options.map((o) => (
          <option key={String(o)} value={String(o)}>
            {show(o)}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Stepper({ value, min, max, onChange, label }: { value: number; min: number; max: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className={s.stepper} role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Меньше">
        <Minus aria-hidden />
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Больше">
        <Plus aria-hidden />
      </button>
    </div>
  );
}
