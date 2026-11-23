'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { LoginModal } from '@/components/modals/LoginModal';
import { SearchModal } from '@/components/modals/SearchModal';
import { captureReferral } from '@/lib/referral';
import { Toaster, type ToastItem, type ToastTone } from './Toaster';

type UIContextValue = {
  toast: (text: string, tone?: ToastTone) => void;
  openLogin: () => void;
  openSearch: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI должен вызываться внутри <UIProvider>');
  return ctx;
}

/** Общие элементы интерфейса: уведомления, окно входа и поиск (Ctrl/⌘ + K). */
export function UIProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const counter = useRef(0);

  const toast = useCallback((text: string, tone: ToastTone = 'default') => {
    const id = ++counter.current;
    setToasts((list) => [...list.slice(-2), { id, text, tone }]);
    window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), 3400);
  }, []);

  useEffect(() => {
    captureReferral();
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo<UIContextValue>(
    () => ({
      toast,
      openLogin: () => setLoginOpen(true),
      openSearch: () => setSearchOpen(true),
    }),
    [toast],
  );

  return (
    <UIContext.Provider value={value}>
      {children}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Toaster toasts={toasts} />
    </UIContext.Provider>
  );
}
