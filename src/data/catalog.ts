/**
 * Контент витрины: тренды, видео-пресеты, идеи для кадров, фотосеты, эффекты и сторис.
 * У каждой карточки можно указать `image` или `video` с адресом настоящего превью —
 * тогда вместо генеративной обложки покажется ваш файл (положите его в /public).
 */
import { DEFAULT_MODEL, getModel } from './models';

export type Category = { id: string; label: string };

export type CatalogItem = {
  id: string;
  title: string;
  description?: string;
  categories: string[];
  /** Пометка «ХИТ». */
  hit?: boolean;
  /** Белый стикер в углу, например «НОВИНКА». */
  tag?: string;
  /** Соотношение сторон превью в формате CSS: '3/4', '9/16'… */
  ratio?: string;
  /** Промпт, который подставится в студию по кнопке. */
  prompt: string;
  /** Модель, в которой откроется промпт. */
  model?: string;
  /** Подпись внизу карточки (количество кадров и т. п.). */
  meta?: string;
  image?: string;
  video?: string;
};

export const ALL: Category = { id: 'all', label: 'Все' };
export const HITS: Category = { id: 'hits', label: 'Хиты' };

/** Фильтрует карточки по категории: «Все», «Хиты» или конкретная категория. */
export function filterItems(items: CatalogItem[], category: string): CatalogItem[] {
  if (category === ALL.id) return items;
  if (category === HITS.id) return items.filter((i) => i.hit);
  return items.filter((i) => i.categories.includes(category));
}

/** Ссылка «Повторить»: открывает студию с нужной моделью и подставленным промптом. */
export function itemHref(item: CatalogItem): string {
  const model = (item.model && getModel(item.model)) || getModel(DEFAULT_MODEL.image);
  const type = model?.type ?? 'image';
  const slug = model?.slug ?? DEFAULT_MODEL.image;
  return `/playground/${type}/${slug}?prompt=${encodeURIComponent(item.prompt)}`;
}

/* ───────────────────────── Тренды (видео) ───────────────────────── */

export const TREND_CATEGORIES: Category[] = [
  ALL,
  HITS,
  { id: 'new-year', label: 'Новый год' },
  { id: 'women', label: 'Женские' },
  { id: 'men', label: 'Мужские' },
  { id: 'couples', label: 'Парные' },
  { id: 'kids', label: 'Детские' },
  { id: 'dance', label: 'Танцы' },
  { id: 'movies', label: 'Кино' },
  { id: 'memes', label: 'Мемы' },
  { id: 'pets', label: 'Животные' },
];

export const TRENDS: CatalogItem[] = [
  {
    id: 'snow-waltz',
    title: 'Снежный вальс на ночной площади',
    categories: ['new-year', 'couples'],
    hit: true,
    ratio: '9/16',
    prompt: 'Пара кружится в вальсе на заснеженной площади, гирлянды и огни, медленная съёмка, кинематографичный свет',
  },
  {
    id: 'cloud-flight',
    title: 'Полёт над облаками в стиле аниме',
    categories: ['women', 'men'],
    hit: true,
    ratio: '3/4',
    prompt: 'Герой летит над облаками на закате, стиль аниме, ветер в волосах, камера следует сзади',
  },
  {
    id: 'noir',
    title: 'Кадр из нуарного детектива',
    categories: ['movies', 'men'],
    ratio: '4/5',
    prompt: 'Чёрно-белая сцена в стиле нуар: дождь, неоновая вывеска, герой в шляпе под фонарём',
  },
  {
    id: 'neon-dance',
    title: 'Танец в неоновых огнях',
    categories: ['dance', 'women'],
    hit: true,
    ratio: '9/16',
    prompt: 'Человек танцует в комнате с неоновыми лентами света, ритмичные движения, отражения на полу',
  },
  {
    id: 'mountain-morning',
    title: 'Утро в горах с чашкой какао',
    categories: ['women'],
    ratio: '1/1',
    prompt: 'Девушка в уютном свитере пьёт какао на террасе шале, утренний туман над горами, пар от чашки',
  },
  {
    id: 'sunset-ride',
    title: 'Мотоцикл на закатной трассе',
    categories: ['men'],
    ratio: '3/4',
    prompt: 'Мотоциклист едет по пустынной трассе на закате, камера сбоку, блики солнца, пыль из-под колёс',
  },
  {
    id: 'first-dance',
    title: 'Первый танец под звёздами',
    categories: ['couples', 'dance'],
    ratio: '4/5',
    prompt: 'Свадебная пара танцует под звёздным небом, гирлянды над головой, мягкий тёплый свет',
  },
  {
    id: 'super-pet',
    title: 'Мой питомец — супергерой',
    categories: ['pets', 'memes'],
    hit: true,
    ratio: '9/16',
    prompt: 'Кот в плаще супергероя летит над ночным городом, эпичный ракурс снизу, развевающийся плащ',
  },
  {
    id: 'dino-walk',
    title: 'Прогулка с динозавром',
    categories: ['kids'],
    ratio: '1/1',
    prompt: 'Ребёнок гуляет по джунглям рядом с дружелюбным динозавром, солнечные лучи, сказочная атмосфера',
  },
  {
    id: 'monday',
    title: 'Когда понедельник наступил опять',
    categories: ['memes'],
    ratio: '3/4',
    prompt: 'Офисный работник медленно поворачивается к камере с драматичным лицом, резкий зум, комедийный эффект',
  },
  {
    id: 'tokyo-rain',
    title: 'Вечерний Токио под дождём',
    categories: ['women', 'men', 'movies'],
    ratio: '9/16',
    prompt: 'Человек с прозрачным зонтом идёт по улице Токио, неоновые отражения в лужах, замедленная съёмка',
  },
  {
    id: 'fireplace',
    title: 'Новогоднее чудо у камина',
    categories: ['new-year', 'kids'],
    ratio: '4/5',
    prompt: 'Семья у камина распаковывает подарки, тёплый свет гирлянд, за окном падает снег',
  },
].map((t) => ({ ...t, model: 'seedance-2-5' }));

/* ───────────────────────── Видео-пресеты ───────────────────────── */

export const PRESETS: CatalogItem[] = [
  {
    id: 'orbit',
    title: 'Облёт камеры 360°',
    description: 'Камера плавно облетает героя по кругу',
    categories: [],
    prompt: 'Камера плавно облетает героя по кругу на 360 градусов, кинематографичный свет, стабильный кадр',
  },
  {
    id: 'push-in',
    title: 'Медленный наезд',
    description: 'Драматичное приближение к лицу',
    categories: [],
    prompt: 'Медленный кинематографичный наезд камеры на лицо героя, малая глубина резкости',
  },
  {
    id: 'drone',
    title: 'Пролёт дрона',
    description: 'Эффектный вид сверху с подъёмом камеры',
    categories: [],
    prompt: 'Дрон пролетает над героем и плавно поднимается, открывая пейзаж вокруг',
  },
  {
    id: 'confetti',
    title: 'Взрыв конфетти',
    description: 'Праздничный момент в замедлении',
    categories: [],
    prompt: 'Взрыв разноцветного конфетти вокруг героя, замедленная съёмка, праздничное настроение',
  },
  {
    id: 'clouds',
    title: 'Сквозь облака',
    description: 'Пролёт сквозь облака к главной сцене',
    categories: [],
    prompt: 'Камера пролетает сквозь облака и открывает сцену с героем, мягкий солнечный свет',
  },
  {
    id: 'bring-to-life',
    title: 'Оживить фото',
    description: 'Лёгкое естественное движение снимка',
    categories: [],
    prompt: 'Оживи фото: лёгкое движение волос и одежды, моргание, естественная мимика, статичная камера',
  },
].map((p) => ({ ...p, ratio: '16/9', model: 'seedance-2-5' }));

/* ───────────────────────── Идеи для кадров (фото) ───────────────────────── */

export const IDEA_CATEGORIES: Category[] = [
  ALL,
  { id: 'women', label: 'Женские' },
  { id: 'men', label: 'Мужские' },
  { id: 'kids', label: 'Детские' },
  { id: 'family', label: 'Семейные' },
  { id: 'couples', label: 'Парные' },
  { id: 'pets', label: 'Животные' },
  { id: 'winter', label: 'Зима' },
  { id: 'business', label: 'Бизнес' },
];

export const IDEAS: CatalogItem[] = [
  {
    id: 'golden-portrait',
    title: 'Портрет в золотом свете',
    categories: ['women'],
    prompt: 'Портрет девушки в лучах закатного солнца, тёплые золотые блики, мягкий фон, плёночное зерно',
  },
  {
    id: 'spruce-tale',
    title: 'Зимняя сказка в еловом лесу',
    categories: ['winter', 'women'],
    prompt: 'Девушка в белой шубке среди заснеженных елей, падающий снег, сказочная атмосфера, мягкий свет',
  },
  {
    id: 'cv-portrait',
    title: 'Деловой портрет для резюме',
    categories: ['business', 'men'],
    prompt: 'Деловой портрет мужчины в тёмном костюме, нейтральный серый фон, студийный свет, уверенный взгляд',
  },
  {
    id: 'mom-daughter',
    title: 'Мама и дочь в одинаковых свитерах',
    categories: ['family'],
    prompt: 'Мама и дочь в одинаковых вязаных свитерах обнимаются у ёлки, тёплый уютный свет, искренние улыбки',
  },
  {
    id: 'paris-walk',
    title: 'Прогулка влюблённых по Парижу',
    categories: ['couples'],
    prompt: 'Влюблённая пара гуляет по парижской улице на рассвете, Эйфелева башня вдалеке, романтичное настроение',
  },
  {
    id: 'puppy-hat',
    title: 'Щенок в новогодней шапке',
    categories: ['pets', 'winter'],
    prompt: 'Щенок корги в красной новогодней шапке сидит среди подарков, боке гирлянд, праздничное настроение',
  },
  {
    id: 'little-astronaut',
    title: 'Маленький космонавт',
    categories: ['kids'],
    prompt: 'Ребёнок в костюме космонавта сидит на Луне, Земля на горизонте, мягкий сказочный свет',
  },
  {
    id: 'old-money',
    title: 'Мужской образ в стиле old money',
    categories: ['men'],
    prompt: 'Мужчина в бежевом кашемировом свитере на террасе загородного клуба, сдержанная роскошь, мягкий дневной свет',
  },
  {
    id: 'garden-tea',
    title: 'Чаепитие в цветущем саду',
    categories: ['women'],
    prompt: 'Девушка в лёгком платье пьёт чай в цветущем саду, фарфоровый сервиз, нежные пастельные тона',
  },
  {
    id: 'candle-dinner',
    title: 'Семейный ужин при свечах',
    categories: ['family', 'winter'],
    prompt: 'Семья за праздничным столом при свечах, тёплые оттенки, смех и уют, фото в стиле кино',
  },
  {
    id: 'cat-aristocrat',
    title: 'Кот-аристократ на портрете маслом',
    categories: ['pets'],
    prompt: 'Парадный портрет кота в мундире XVIII века, классическая живопись маслом, богатая золотая рама',
  },
  {
    id: 'ice-skating',
    title: 'Каток под снегопадом',
    categories: ['winter', 'couples'],
    prompt: 'Пара катается на коньках на городском катке под снегопадом, огни гирлянд, лёгкое движение в кадре',
  },
].map((i) => ({ ...i, ratio: '3/4', model: 'nano-banana-pro' }));

/* ───────────────────────── Премиум-фотосеты ───────────────────────── */

export const SET_CATEGORIES: Category[] = [
  ALL,
  HITS,
  { id: 'women', label: 'Женские' },
  { id: 'men', label: 'Мужские' },
  { id: 'couples', label: 'Парные' },
  { id: 'family', label: 'Семейные' },
  { id: 'new-year', label: 'Новый год' },
  { id: 'studio', label: 'Студия' },
];

export const SETS: CatalogItem[] = [
  {
    id: 'aurora',
    title: 'Северное сияние на краю земли',
    description: 'Зимний фотосет среди снегов и полярных огней',
    categories: ['women', 'new-year'],
    hit: true,
    meta: '12 кадров',
    prompt: 'Фотосессия: девушка в меховой накидке на фоне северного сияния, снежная тундра, магический свет',
  },
  {
    id: 'cover-story',
    title: 'Портрет для обложки журнала',
    description: 'Глянцевый свет, как на настоящей съёмке',
    categories: ['women', 'studio'],
    hit: true,
    meta: '10 кадров',
    prompt: 'Студийный портрет для обложки глянцевого журнала, профессиональный свет, чистый фон, выразительный взгляд',
  },
  {
    id: 'chalet',
    title: 'Рождественский вечер в шале',
    description: 'Свечи, плед и тёплый свет камина',
    categories: ['new-year', 'couples'],
    meta: '12 кадров',
    prompt: 'Пара у камина в деревянном шале, свечи, плед, рождественские украшения, тёплый кинематографичный свет',
  },
  {
    id: 'monochrome',
    title: 'Чёрно-белая классика',
    description: 'Строгий монохромный портрет с характером',
    categories: ['men', 'studio'],
    meta: '8 кадров',
    prompt: 'Чёрно-белый студийный портрет мужчины, контрастный свет, глубокие тени, классическая эстетика',
  },
  {
    id: 'winter-city',
    title: 'Снегопад в старом городе',
    description: 'Прогулка по набережным в метель',
    categories: ['women'],
    hit: true,
    meta: '12 кадров',
    prompt: 'Девушка в пальто идёт по старинной набережной в снегопад, фонари, исторические фасады, мягкий свет',
  },
  {
    id: 'pajama-party',
    title: 'Пижамная вечеринка всей семьёй',
    description: 'Одинаковые пижамы, ёлка и смех',
    categories: ['family', 'new-year'],
    meta: '10 кадров',
    prompt: 'Семья в одинаковых новогодних пижамах дурачится у ёлки, гирлянды, подарки, искренние эмоции',
  },
  {
    id: 'mountain-love',
    title: 'Love story в горах',
    description: 'Двое на фоне снежных вершин',
    categories: ['couples'],
    meta: '12 кадров',
    prompt: 'Влюблённая пара обнимается на фоне снежных горных вершин, закатный свет, развевающийся шарф',
  },
  {
    id: 'country-club',
    title: 'Тихая роскошь',
    description: 'Твид, кашемир и загородный клуб',
    categories: ['men'],
    meta: '10 кадров',
    prompt: 'Мужчина в твидовом пиджаке в загородном клубе, конюшня и поля на фоне, сдержанная роскошь, плёночный тон',
  },
  {
    id: 'seventies',
    title: 'Ретро 70-х',
    description: 'Плёночное зерно, винил и тёплые оттенки',
    categories: ['women', 'studio'],
    meta: '10 кадров',
    prompt: 'Фотосессия в стиле 70-х: клёш, проигрыватель винила, тёплые оранжевые тона, плёночное зерно',
  },
  {
    id: 'peonies',
    title: 'Портрет в пионах',
    description: 'Нежный образ среди цветов и шёлка',
    categories: ['women'],
    meta: '8 кадров',
    prompt: 'Нежный портрет девушки среди пионов и струящегося шёлка, пастельные тона, мягкий рассеянный свет',
  },
  {
    id: 'sled-forest',
    title: 'Дети в зимнем лесу',
    description: 'Санки, огоньки и сказочная прогулка',
    categories: ['family', 'new-year'],
    meta: '12 кадров',
    prompt: 'Дети катаются на санках в зимнем лесу, огоньки на ветках, снежинки, сказочная атмосфера',
  },
  {
    id: 'business',
    title: 'Деловой стиль',
    description: 'Уверенные кадры для сайта и соцсетей',
    categories: ['men', 'studio'],
    meta: '10 кадров',
    prompt: 'Деловая фотосессия в современном офисе, панорамные окна, костюм, уверенная поза, естественный свет',
  },
].map((s) => ({ ...s, ratio: '3/4', model: 'nano-banana-pro' }));

/* ───────────────────────── ИИ-эффекты ───────────────────────── */

export const EFFECTS: CatalogItem[] = [
  {
    id: 'avatar',
    title: 'Аватар по трём фото',
    description: 'Запомнит вашу внешность и сохранит сходство в любых генерациях',
    categories: ['photo'],
    tag: 'РЕКОМЕНДУЕМ',
    prompt: 'Создай мой аватар по прикреплённым фото: сохрани черты лица, нейтральный фон, студийный свет',
  },
  {
    id: 'angles',
    title: 'Другие ракурсы',
    description: 'Девять кадров одной сцены с разных сторон',
    categories: ['photo'],
    prompt: 'Покажи эту сцену с девяти разных ракурсов, сохрани героя, одежду и освещение, сетка 3×3',
  },
  {
    id: 'story-9',
    title: 'История из 9 кадров',
    description: 'Превратит одно фото в мини-сюжет',
    categories: ['photo'],
    tag: 'НОВИНКА',
    prompt: 'Преврати фото в историю из девяти последовательных кадров с единым сюжетом, сетка 3×3',
  },
  {
    id: 'passport',
    title: 'Фото на документы',
    description: 'Строгий кадр по требованиям, внешность сохраняется',
    categories: ['photo'],
    prompt: 'Сделай фото на документы: анфас, светлый однотонный фон, ровный свет, деловая одежда, сохрани внешность',
  },
  {
    id: 'upscale',
    title: 'Улучшить качество',
    description: 'Сделает снимок чётче и детальнее',
    categories: ['photo'],
    prompt: 'Улучши качество фото: повысь чёткость и детализацию, убери шум, сохрани естественные цвета',
  },
  {
    id: 'product-card',
    title: 'Карточка товара',
    description: 'Продающая карточка для маркетплейса из фото товара',
    categories: ['marketing'],
    tag: 'НОВИНКА',
    prompt: 'Сделай продающую карточку товара для маркетплейса по фото: чистый фон, акцент на продукте, место под текст',
  },
  {
    id: 'restyle',
    title: 'Смена стиля',
    description: 'Аниме, комикс, акварель или 3D — в один клик',
    categories: ['photo'],
    prompt: 'Перерисуй фото в стиле аниме, сохрани композицию и узнаваемость героя',
  },
  {
    id: 'animate',
    title: 'Оживить фото',
    description: 'Плавная естественная анимация снимка',
    categories: ['video'],
    model: 'seedance-2-5',
    prompt: 'Оживи фото: лёгкое движение волос и одежды, моргание, естественная мимика, статичная камера',
  },
].map((e) => ({ ...e, ratio: '1/1', model: e.model ?? 'nano-banana-pro' }));

/* ───────────────────────── Сторис на главной ───────────────────────── */

export type Story = { id: string; title: string; href: string; motion?: boolean; image?: string; video?: string };

export const STORIES: Story[] = [
  { id: 'ideas', title: 'Идеи', href: '/prompts' },
  { id: 'sets', title: 'Фотосеты', href: '/sets', motion: true },
  { id: 'trends', title: 'Тренды', href: '/trends', motion: true },
  { id: 'new-year', title: 'Новый год', href: '/sets?category=new-year' },
  { id: 'seedance', title: 'Seedance 2.5', href: '/playground/video/seedance-2-5', motion: true },
  { id: 'partner', title: 'Партнёрам', href: '/partner', motion: true },
  { id: 'effects', title: 'Эффекты', href: '/effects', motion: true },
  { id: 'love', title: 'Love story', href: '/sets?category=couples' },
  { id: 'pets', title: 'Питомцы', href: '/prompts?category=pets' },
  { id: 'business', title: 'Бизнес', href: '/prompts?category=business' },
  { id: 'winter', title: 'Зима', href: '/prompts?category=winter' },
  { id: 'voice', title: 'Озвучка', href: '/playground/audio/elevenlabs', motion: true },
];
