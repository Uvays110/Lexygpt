import { TriangleAlert } from 'lucide-react';
import { site } from '@/config/site';
import s from './LegalPage.module.css';

export type LegalSection = { title: string; paragraphs: string[] };

/** Каркас юридической страницы. Текст — шаблон: замените его документом, проверенным юристом. */
export function LegalPage({ title, sections }: { title: string; sections: LegalSection[] }) {
  return (
    <article className={`container section ${s.page}`}>
      <h1 className={s.title}>{title}</h1>
      <p className={s.meta}>
        {site.name} · {site.legal.owner} · ИНН {site.legal.taxId}
      </p>
      <div className={s.notice} role="note">
        <TriangleAlert aria-hidden />
        <p>
          Это шаблон-заготовка, а не готовый юридический документ. Перед запуском замените текст документом, составленным
          или проверенным юристом, и укажите реквизиты.
        </p>
      </div>
      {sections.map((sec, i) => (
        <section key={sec.title} className={s.section}>
          <h2>
            {i + 1}. {sec.title}
          </h2>
          {sec.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}
    </article>
  );
}
