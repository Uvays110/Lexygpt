'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useUI } from '@/components/providers/UIProvider';
import { TelegramIcon, VkIcon } from '@/components/ui/BrandIcons';
import { Button } from '@/components/ui/Button';
import { LogoMark } from '@/components/ui/Logo';
import { Modal } from '@/components/ui/Modal';
import { site } from '@/config/site';
import s from './LoginModal.module.css';

function GoogleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { toast } = useUI();
  const [email, setEmail] = useState('');

  // Авторизация подключается отдельно (см. README). Пока честно сообщаем, что это демо.
  const notConnected = () => toast('Демо-режим: вход заработает после подключения авторизации');

  return (
    <Modal open={open} onClose={onClose} label="Вход" size="sm">
      <div className={s.head}>
        <LogoMark size={44} />
        <h2 className={s.title}>Вход в {site.name}</h2>
        <p className={s.text}>Сохраняйте генерации, получайте бонусные токены и доступ к тарифам</p>
      </div>

      <div className={s.providers}>
        <button type="button" className={s.provider} onClick={notConnected}>
          <TelegramIcon size={22} />
          Продолжить с Telegram
        </button>
        <button type="button" className={s.provider} onClick={notConnected}>
          <GoogleIcon />
          Продолжить с Google
        </button>
        <button type="button" className={s.provider} onClick={notConnected}>
          <VkIcon size={22} />
          Продолжить с VK ID
        </button>
      </div>

      <div className={s.divider}>
        <span>или по почте</span>
      </div>

      <form
        className={s.form}
        onSubmit={(e) => {
          e.preventDefault();
          notConnected();
        }}
      >
        <label className="srOnly" htmlFor="login-email">
          Электронная почта
        </label>
        <input
          id="login-email"
          className={s.input}
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" fullWidth>
          Получить код
        </Button>
      </form>

      <p className={s.legal}>
        Продолжая, вы принимаете{' '}
        <Link href="/terms" onClick={onClose}>
          оферту
        </Link>{' '}
        и{' '}
        <Link href="/privacy" onClick={onClose}>
          политику конфиденциальности
        </Link>
        .
      </p>
    </Modal>
  );
}
