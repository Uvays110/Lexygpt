import { ArrowUpRight } from 'lucide-react';
import { TelegramIcon, VkIcon } from '@/components/ui/BrandIcons';
import { site } from '@/config/site';
import s from './BotsBlock.module.css';

const BOTS = [
  { title: 'Бот в Telegram', text: 'Генерации прямо в мессенджере', href: site.links.telegramBot, icon: <TelegramIcon size={40} /> },
  { title: 'Сообщество VK', text: 'Новости, идеи и розыгрыши токенов', href: site.links.vk, icon: <VkIcon size={40} /> },
];

export function BotsBlock() {
  return (
    <section className="container section">
      <div className={s.wrap}>
        {BOTS.map((b) => (
          <a key={b.title} href={b.href} className={s.bot} target="_blank" rel="noopener noreferrer">
            {b.icon}
            <span className={s.text}>
              <span className={s.title}>{b.title}</span>
              <span className={s.sub}>{b.text}</span>
            </span>
            <ArrowUpRight aria-hidden className={s.arrow} />
          </a>
        ))}
      </div>
    </section>
  );
}
