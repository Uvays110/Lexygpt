import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Art } from '@/components/ui/Art';
import { Button } from '@/components/ui/Button';
import s from './CreateToday.module.css';

const TOOLS = [
  { title: 'Фото', text: 'Генерируйте изображения по описанию', href: '/playground/image/nano-banana-pro', motion: false },
  { title: 'Видео', text: 'Оживляйте идеи в коротких роликах', href: '/playground/video/seedance-2-5', motion: true },
  { title: 'Все модели', text: 'Выберите модель под свою задачу', href: '/models', motion: true },
];

export function CreateToday() {
  return (
    <section className="container section">
      <div className={s.block}>
        <div className={s.text}>
          <h2 className={s.title}>
            Что вы <span className="accentText">создадите</span> сегодня?
          </h2>
          <p className={s.desc}>Фото, видео и озвучка под любую задачу — быстро, просто и красиво.</p>
          <Button href="/playground/image/nano-banana-pro" iconRight={<Sparkles aria-hidden />} size="lg">
            Сгенерировать
          </Button>
        </div>
        <div className={s.tools}>
          {TOOLS.map((t) => (
            <Link key={t.title} href={t.href} className={s.tool}>
              <span className={s.media}>
                <Art seed={`tool-${t.title}`} motion={t.motion} />
              </span>
              <span className={s.foot}>
                <span>
                  <span className={s.toolTitle}>{t.title}</span>
                  <span className={s.toolText}>{t.text}</span>
                </span>
                <ArrowRight aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
