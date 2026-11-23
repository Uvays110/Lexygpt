/**
 * Каталог ИИ-моделей. Здесь задаются названия, описания, цена в токенах
 * и подключение к провайдеру генерации.
 *
 * Поле `fal.endpoint` — ID модели на fal.ai (https://fal.ai/models).
 * Если оно не указано или на сервере нет ключа FAL_KEY, модель работает в демо-режиме.
 * Перед запуском сверьте ID и параметры каждой модели с её страницей на fal.ai.
 */

export type MediaType = 'image' | 'video' | 'audio';

export type AIModel = {
  slug: string;
  type: MediaType;
  name: string;
  /** Короткая подпись для карточек. */
  tagline: string;
  /** Подробное описание для страницы модели и студии. */
  description: string;
  /** Стоимость одной генерации в токенах. */
  cost: number;
  badge?: 'new' | 'top';
  /** Можно ли прикреплять фото-референсы. */
  references?: boolean;
  /** Настоящие превью (если пусто — рисуется генеративная обложка). */
  image?: string;
  video?: string;
  fal?: {
    /** Эндпоинт для генерации по тексту. */
    endpoint: string;
    /** Эндпоинт для генерации с фото-референсами (если у модели он отдельный). */
    editEndpoint?: string;
    /** Дополнительные параметры, которые нужно отправлять этой модели. */
    input?: Record<string, unknown>;
  };
};

export const MEDIA_TYPES: ReadonlyArray<{ id: MediaType; label: string; plural: string }> = [
  { id: 'image', label: 'Фото', plural: 'фото' },
  { id: 'video', label: 'Видео', plural: 'видео' },
  { id: 'audio', label: 'Аудио', plural: 'аудио' },
];

export const IMAGE_RATIOS = ['1:1', '3:4', '4:3', '9:16', '16:9'] as const;
export const VIDEO_RATIOS = ['9:16', '16:9', '1:1'] as const;
export const VIDEO_DURATIONS = [5, 10] as const;
export const VOICES = ['Алиса', 'Максим', 'Вера', 'Тимур'] as const;

export const MODELS: AIModel[] = [
  {
    slug: 'nano-banana-pro',
    type: 'image',
    name: 'Nano Banana Pro',
    tagline: 'Максимум деталей',
    description:
      'Флагманская модель для фото: сложные сцены, читаемый текст на изображении и аккуратная работа с вашими референсами.',
    cost: 4,
    badge: 'top',
    references: true,
    fal: { endpoint: 'fal-ai/nano-banana-pro', editEndpoint: 'fal-ai/nano-banana-pro/edit' },
  },
  {
    slug: 'nano-banana-2',
    type: 'image',
    name: 'Nano Banana 2',
    tagline: 'Быстро и точно по описанию',
    description: 'Шустрая модель для повседневных задач: портреты, предметка и правки по фото за пару секунд.',
    cost: 2,
    references: true,
  },
  {
    slug: 'gpt-image-2-6',
    type: 'image',
    name: 'GPT Image 2.6',
    tagline: 'Точные цвета и сложные промпты',
    description: 'Хорошо понимает длинные описания, бережно передаёт цвета и подходит для инфографики и обложек.',
    cost: 4,
    references: true,
  },
  {
    slug: 'seedream-5-pro',
    type: 'image',
    name: 'Seedream 5 Pro',
    tagline: 'Киношный свет и атмосфера',
    description: 'Стильные кадры с выразительным светом — для фэшн-съёмок, обложек и атмосферных портретов.',
    cost: 3,
    references: true,
  },
  {
    slug: 'midjourney',
    type: 'image',
    name: 'Midjourney',
    tagline: 'Художественная эстетика',
    description: 'Узнаваемый художественный стиль: концепт-арт, иллюстрации и необычные визуальные идеи.',
    cost: 5,
  },
  {
    slug: 'seedance-2-5',
    type: 'video',
    name: 'Seedance 2.5',
    tagline: 'Реализм живой съёмки',
    description: 'Плавное движение камеры и естественная мимика — ролики выглядят как настоящая съёмка.',
    cost: 30,
    badge: 'new',
    references: true,
  },
  {
    slug: 'kling-3-0',
    type: 'video',
    name: 'Kling 3.0',
    tagline: 'Динамика и точная физика',
    description: 'Сильна в динамичных сценах: спорт, погони, танцы и сложные движения без артефактов.',
    cost: 35,
    references: true,
  },
  {
    slug: 'veo-3-1',
    type: 'video',
    name: 'Veo 3.1',
    tagline: 'Видео со звуком и речью',
    description: 'Генерирует ролик сразу со звуком: шум окружения, музыка и реплики героев.',
    cost: 60,
    references: true,
  },
  {
    slug: 'grok-video-1-5',
    type: 'video',
    name: 'Grok Video 1.5',
    tagline: 'Смелые идеи за секунды',
    description: 'Быстрая модель для экспериментов: мемы, клипы и креативные короткие ролики.',
    cost: 25,
  },
  {
    slug: 'elevenlabs',
    type: 'audio',
    name: 'ElevenLabs',
    tagline: 'Живая озвучка на 70+ языках',
    description: 'Естественные голоса для роликов, рекламы и подкастов — с интонациями и паузами.',
    cost: 2,
    badge: 'new',
  },
];

export const DEFAULT_MODEL: Record<MediaType, string> = {
  image: 'nano-banana-pro',
  video: 'seedance-2-5',
  audio: 'elevenlabs',
};

export function getModel(slug: string): AIModel | undefined {
  return MODELS.find((m) => m.slug === slug);
}

export function modelsByType(type: MediaType): AIModel[] {
  return MODELS.filter((m) => m.type === type);
}

export function playgroundHref(model: Pick<AIModel, 'type' | 'slug'>, prompt?: string): string {
  const base = `/playground/${model.type}/${model.slug}`;
  return prompt ? `${base}?prompt=${encodeURIComponent(prompt)}` : base;
}
