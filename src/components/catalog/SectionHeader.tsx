import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import s from './SectionHeader.module.css';

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  link?: { href: string; label?: string };
  /** Заголовок страницы (h1) вместо заголовка секции (h2). */
  as?: 'h1' | 'h2';
};

export function SectionHeader({ title, subtitle, link, as: Tag = 'h2' }: Props) {
  return (
    <div className={s.head}>
      <div className={s.text}>
        <Tag className="sectionTitle">{title}</Tag>
        {subtitle && <p className="sectionSubtitle">{subtitle}</p>}
      </div>
      {link && (
        <Link href={link.href} className={s.all}>
          {link.label ?? 'Все'}
          <ChevronRight aria-hidden />
        </Link>
      )}
    </div>
  );
}
