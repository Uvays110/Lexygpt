import Link from 'next/link';
import { Media } from '@/components/ui/Art';
import { STORIES } from '@/data/catalog';
import { cx } from '@/lib/cx';
import s from './Stories.module.css';

export function Stories() {
  return (
    <section className={s.section} aria-label="Подборки">
      <div className="container">
        <div className={cx(s.row, 'noScrollbar')}>
          {STORIES.map((story) => (
            <Link key={story.id} href={story.href} className={s.story}>
              <span className={s.frame}>
                <Media seed={`story-${story.id}`} image={story.image} video={story.video} motion={story.motion} />
              </span>
              <span className={s.title}>{story.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
