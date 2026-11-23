import Link from 'next/link';
import { LogoMark } from '@/components/ui/Logo';
import { site } from '@/config/site';
import { MODELS, playgroundHref } from '@/data/models';
import s from './Footer.module.css';

type FooterLink = { label: string; href: string };

const COLUMNS: Array<{ title: string; links: FooterLink[] }> = [
  {
    title: 'Продукт',
    links: [
      { label: 'Студия', href: '/playground/image/nano-banana-pro' },
      { label: 'Тренды', href: '/trends' },
      { label: 'Фотосеты', href: '/sets' },
      { label: 'Идеи для фото', href: '/prompts' },
      { label: 'Эффекты', href: '/effects' },
      { label: 'Тарифы', href: '/pricing' },
    ],
  },
  {
    title: 'Модели',
    links: [
      ...MODELS.slice(0, 7).map((m) => ({ label: m.name, href: playgroundHref(m) })),
      { label: 'Все модели', href: '/models' },
    ],
  },
  {
    title: 'Информация',
    links: [
      { label: 'Вопросы и ответы', href: '/faq' },
      { label: 'Партнёрская программа', href: '/partner' },
      { label: 'История генераций', href: '/history' },
      { label: 'Поддержка', href: site.links.support },
    ],
  },
  {
    title: 'Документы',
    links: [
      { label: 'Публичная оферта', href: '/terms' },
      { label: 'Политика конфиденциальности', href: '/privacy' },
    ],
  },
];

function FooterAnchor({ link }: { link: FooterLink }) {
  if (/^https?:\/\//.test(link.href)) {
    return (
      <a href={link.href} className={s.link} target="_blank" rel="noopener noreferrer">
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={s.link}>
      {link.label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className="container">
        <div className={s.columns}>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className={s.colTitle}>{col.title}</h2>
              <ul className={s.list}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterAnchor link={link} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={s.bottom}>
          <Link href="/" className={s.brand}>
            <LogoMark size={20} />
            {site.name}
          </Link>
          <p className={s.copy}>
            © {new Date().getFullYear()} {site.name}. Все права защищены.
          </p>
          <p className={s.legal}>
            {site.legal.owner} · ИНН {site.legal.taxId} ·{' '}
            <a href={`mailto:${site.links.email}`}>{site.links.email}</a>
          </p>
          <div className={s.bottomLinks}>
            <Link href="/terms">Оферта</Link>
            <Link href="/privacy">Конфиденциальность</Link>
            <Link href="/faq">Поддержка</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
