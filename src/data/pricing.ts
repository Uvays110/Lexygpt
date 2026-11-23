/**
 * Тарифы. Цены и количество токенов — примерные, поставьте свои.
 * Токены списываются за генерации: стоимость каждой модели задана в data/models.ts.
 */

export type Currency = 'rub' | 'usd';
export type Money = Record<Currency, number>;

export type PlanTier = { tokens: number; price: Money; oldPrice?: Money };

export type Plan = {
  id: string;
  name: string;
  subtitle: string;
  /** Варианты пакета. Если больше одного — на карточке появится ползунок. */
  tiers: PlanTier[];
  /** Сколько первых пунктов из PLAN_FEATURES входит в тариф. */
  featureCount: number;
  /** Какие видеомодели доступны (по slug из models.ts). */
  videoModels: string[];
  highlight?: 'popular' | 'best';
};

export const PLAN_FEATURES = [
  'Генерация фото',
  'Генерация видео',
  'Тренды и фотосеты',
  'ИИ-эффекты',
  'Приоритетная очередь',
  'Несколько генераций сразу',
] as const;

export const PLAN_VIDEO_MODELS = ['seedance-2-5', 'kling-3-0', 'veo-3-1'] as const;

export const PLANS: Plan[] = [
  {
    id: 'start',
    name: 'Старт',
    subtitle: 'Для первых шагов',
    tiers: [{ tokens: 80, price: { rub: 249, usd: 3 } }],
    featureCount: 3,
    videoModels: [],
  },
  {
    id: 'standard',
    name: 'Стандарт',
    subtitle: 'Для регулярного контента',
    tiers: [{ tokens: 200, price: { rub: 490, usd: 6 }, oldPrice: { rub: 590, usd: 7 } }],
    featureCount: 3,
    videoModels: ['seedance-2-5'],
  },
  {
    id: 'pro',
    name: 'Про',
    subtitle: 'Для активной работы',
    tiers: [{ tokens: 500, price: { rub: 990, usd: 12 }, oldPrice: { rub: 1490, usd: 18 } }],
    featureCount: 4,
    videoModels: ['seedance-2-5', 'kling-3-0'],
  },
  {
    id: 'ultra',
    name: 'Ультра',
    subtitle: 'Для продвинутых проектов',
    tiers: [{ tokens: 1100, price: { rub: 1690, usd: 20 }, oldPrice: { rub: 2990, usd: 36 } }],
    featureCount: 6,
    videoModels: ['seedance-2-5', 'kling-3-0', 'veo-3-1'],
    highlight: 'popular',
  },
  {
    id: 'creator',
    name: 'Креатор',
    subtitle: 'Для студий и авторов',
    tiers: [
      { tokens: 2200, price: { rub: 2790, usd: 33 }, oldPrice: { rub: 5490, usd: 66 } },
      { tokens: 3200, price: { rub: 3790, usd: 45 }, oldPrice: { rub: 7990, usd: 96 } },
      { tokens: 4500, price: { rub: 4990, usd: 59 }, oldPrice: { rub: 11190, usd: 134 } },
    ],
    featureCount: 6,
    videoModels: ['seedance-2-5', 'kling-3-0', 'veo-3-1'],
    highlight: 'best',
  },
];

export function formatMoney(value: number, currency: Currency): string {
  const n = new Intl.NumberFormat('ru-RU').format(value);
  return currency === 'rub' ? `${n} ₽` : `$${n}`;
}

export function discountPercent(tier: PlanTier, currency: Currency): number | null {
  if (!tier.oldPrice) return null;
  return Math.round((1 - tier.price[currency] / tier.oldPrice[currency]) * 100);
}

/** Что входит в любой тариф — блок под таблицей цен. */
export const INCLUDED = [
  { icon: 'sparkles', title: 'Студийный визуал', text: 'Кадры уровня профессиональной съёмки без фотографа и аренды студии' },
  { icon: 'wallet', title: 'Честная оплата', text: 'Токены списываются только за готовый результат' },
  { icon: 'layers', title: 'Готовые сценарии', text: 'Тренды, фотосеты и эффекты — без сложных промптов' },
  { icon: 'crown', title: 'Лучшие модели', text: 'Фото, видео и озвучка от ведущих ИИ-моделей в одном окне' },
  { icon: 'map', title: 'Любые локации', text: 'Горы, океан или Париж — меняйте место съёмки за секунды' },
  { icon: 'shield', title: 'Гибкая подписка', text: 'Меняйте тариф или отключайте продление в пару кликов' },
] as const;
