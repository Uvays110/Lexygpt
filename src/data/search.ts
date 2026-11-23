import { EFFECTS, IDEAS, SETS, TRENDS, itemHref } from './catalog';
import { MEDIA_TYPES, MODELS, playgroundHref } from './models';

export type SearchEntry = { group: string; title: string; subtitle?: string; href: string; keywords: string };

const typeLabel = (t: string) => MEDIA_TYPES.find((m) => m.id === t)?.label ?? '';

export const SEARCH_INDEX: SearchEntry[] = [
  ...MODELS.map((m) => ({
    group: 'Модели',
    title: m.name,
    subtitle: `${typeLabel(m.type)} · ${m.tagline}`,
    href: playgroundHref(m),
    keywords: `${m.name} ${m.tagline} ${m.description} ${typeLabel(m.type)}`,
  })),
  ...EFFECTS.map((e) => ({
    group: 'Эффекты',
    title: e.title,
    subtitle: e.description,
    href: itemHref(e),
    keywords: `${e.title} ${e.description ?? ''}`,
  })),
  ...TRENDS.map((t) => ({
    group: 'Тренды',
    title: t.title,
    href: itemHref(t),
    keywords: `${t.title} ${t.prompt}`,
  })),
  ...SETS.map((s) => ({
    group: 'Фотосеты',
    title: s.title,
    subtitle: s.description,
    href: itemHref(s),
    keywords: `${s.title} ${s.description ?? ''} ${s.prompt}`,
  })),
  ...IDEAS.map((i) => ({
    group: 'Идеи',
    title: i.title,
    href: itemHref(i),
    keywords: `${i.title} ${i.prompt}`,
  })),
  { group: 'Разделы', title: 'Тарифы', subtitle: 'Пакеты токенов и подписка', href: '/pricing', keywords: 'тарифы цены оплата подписка токены' },
  { group: 'Разделы', title: 'Партнёрская программа', subtitle: 'Зарабатывайте на рекомендациях', href: '/partner', keywords: 'партнёр реферал заработок' },
  { group: 'Разделы', title: 'Вопросы и ответы', subtitle: 'Помощь и поддержка', href: '/faq', keywords: 'faq помощь поддержка вопросы' },
  { group: 'Разделы', title: 'История генераций', subtitle: 'Ваши результаты', href: '/history', keywords: 'история генерации мои результаты' },
];

/** Поиск без учёта регистра и буквы «ё»; все слова запроса должны встретиться. */
export function searchEntries(query: string, limitPerGroup = 6): Array<{ group: string; items: SearchEntry[] }> {
  const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е');
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const groups = new Map<string, SearchEntry[]>();
  for (const e of SEARCH_INDEX) {
    const hay = norm(`${e.title} ${e.keywords}`);
    if (!words.every((w) => hay.includes(w))) continue;
    const list = groups.get(e.group) ?? [];
    if (list.length < limitPerGroup) list.push(e);
    groups.set(e.group, list);
  }
  return [...groups.entries()].map(([group, items]) => ({ group, items }));
}
