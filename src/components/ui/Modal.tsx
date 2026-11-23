'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { cx } from '@/lib/cx';
import s from './Modal.module.css';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /** Название окна для скринридеров. */
  label: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Прижать окно к верху экрана (для поиска). */
  top?: boolean;
};

/** Модальное окно на нативном <dialog>: фокус, Esc и фон работают из коробки. */
export function Modal({ open, onClose, label, children, size = 'md', top }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onCloseRef.current();
    };
    const handleClose = () => onCloseRef.current();
    d.addEventListener('cancel', handleCancel);
    d.addEventListener('close', handleClose);
    return () => {
      d.removeEventListener('cancel', handleCancel);
      d.removeEventListener('close', handleClose);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cx(s.dialog, s[size], top && s.top)}
      aria-label={label}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {open && (
        <div className={s.panel}>
          <button type="button" className={s.close} onClick={onClose} aria-label="Закрыть">
            <X />
          </button>
          {children}
        </div>
      )}
    </dialog>
  );
}
