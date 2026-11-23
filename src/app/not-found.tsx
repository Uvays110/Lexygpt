import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import s from './not-found.module.css';

export default function NotFound() {
  return (
    <>
      <main id="main" className={`container ${s.wrap}`}>
        <p className={s.code}>404</p>
        <h1 className={s.title}>Такой страницы нет</h1>
        <p className={s.text}>Возможно, ссылка устарела. Зато можно создать что-нибудь новое.</p>
        <div className={s.actions}>
          <Button href="/" variant="white">
            На главную
          </Button>
          <Button href="/playground/image/nano-banana-pro">Открыть студию</Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
