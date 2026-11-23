import { CircleAlert, CircleCheck, Info } from 'lucide-react';
import { cx } from '@/lib/cx';
import s from './Toaster.module.css';

export type ToastTone = 'default' | 'success' | 'error';
export type ToastItem = { id: number; text: string; tone: ToastTone };

export function Toaster({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className={s.region} role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={cx(s.toast, s[t.tone])}>
          {t.tone === 'success' ? <CircleCheck aria-hidden /> : t.tone === 'error' ? <CircleAlert aria-hidden /> : <Info aria-hidden />}
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}
