import { EffectsGrid } from '@/components/catalog/EffectsGrid';
import { FilterableGrid } from '@/components/catalog/FilterableGrid';
import { ModelsCatalog } from '@/components/catalog/ModelsCatalog';
import { SectionHeader } from '@/components/catalog/SectionHeader';
import { BotsBlock } from '@/components/home/BotsBlock';
import { CreateGrid } from '@/components/home/CreateGrid';
import { CreateToday } from '@/components/home/CreateToday';
import { PartnerBanner } from '@/components/home/PartnerBanner';
import { PromoBanner } from '@/components/home/PromoBanner';
import { ReferralCard } from '@/components/home/ReferralCard';
import { Stories } from '@/components/home/Stories';
import { site } from '@/config/site';
import {
  EFFECTS,
  IDEA_CATEGORIES,
  IDEAS,
  PRESETS,
  SET_CATEGORIES,
  SETS,
  TREND_CATEGORIES,
  TRENDS,
} from '@/data/catalog';

export default function HomePage() {
  return (
    <>
      <h1 className="srOnly">{site.title}</h1>

      <Stories />
      <CreateGrid />

      <section className="container section">
        <SectionHeader
          title="Тренды"
          subtitle="Повторяйте вирусные ролики в один клик: выберите сценарий, загрузите фото и получите готовое видео."
        />
        <FilterableGrid
          items={TRENDS}
          categories={TREND_CATEGORIES}
          layout="masonry"
          cta="Повторить"
          motion
          fade={{ href: '/trends', label: 'Все тренды', maxHeight: 880 }}
        />
      </section>

      <PromoBanner
        variant="winter"
        seed="promo-winter"
        title="Новогодняя фотосессия"
        text="Снег, огни и уютные образы — праздничные кадры для вас и всей семьи без студии и фотографа."
        cta="Смотреть фотосеты"
        href="/sets?category=new-year"
      />

      <section className="container section">
        <SectionHeader
          title="Видео-пресеты"
          subtitle="Готовые движения камеры для кинематографичных роликов — без долгой настройки."
          link={{ href: '/trends', label: 'Все' }}
        />
        <FilterableGrid items={PRESETS} layout="grid3" cta="Использовать" motion ratio="16/9" />
      </section>

      <PromoBanner
        variant="accent"
        seed="promo-brand"
        title="Контент для бренда за минуты"
        text="Реклама, карточки товаров и UGC-ролики в едином визуальном стиле — по одному описанию."
        cta="Открыть эффекты"
        href="/effects"
      />

      <section className="container section">
        <SectionHeader
          title="От идеи до вау-кадра"
          subtitle="Готовые идеи, которые превращают обычное фото в контент уровня профессиональной съёмки."
        />
        <FilterableGrid
          items={IDEAS}
          categories={IDEA_CATEGORIES}
          layout="grid4"
          cta="Повторить"
          ratio="3/4"
          search={{ placeholder: 'Найдите идею: зима, портрет, питомцы…' }}
          fade={{ href: '/prompts', label: 'Вся коллекция идей', maxHeight: 1060 }}
        />
      </section>

      <PartnerBanner />

      <section className="container section">
        <SectionHeader
          title="Премиум-фотосеты"
          subtitle="Выберите готовый сценарий, загрузите своё фото и получите серию кадров без ручной настройки промпта."
        />
        <FilterableGrid
          items={SETS}
          categories={SET_CATEGORIES}
          layout="grid4"
          cta="Выбрать"
          ratio="3/4"
          fade={{ href: '/sets', label: 'Все фотосеты', maxHeight: 1060 }}
        />
      </section>

      <ReferralCard />

      <section className="container section">
        <SectionHeader
          title="ИИ-модели"
          subtitle="Выбирайте модель под задачу — для фото и видео, озвучки текста, стилизации и креативных идей."
          link={{ href: '/models' }}
        />
        <ModelsCatalog limit={5} />
      </section>

      <CreateToday />

      <section className="container section">
        <SectionHeader
          title="Эффекты"
          subtitle="Быстрые ИИ-действия для фото и видео — когда нужен результат без сложных промптов и ручной обработки."
          link={{ href: '/effects' }}
        />
        <EffectsGrid items={EFFECTS.slice(0, 5)} />
      </section>

      <BotsBlock />
    </>
  );
}
