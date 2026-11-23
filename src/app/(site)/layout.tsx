import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';

/** Обычные страницы сайта — с подвалом. Студия генерации живёт вне этой группы и подвала не имеет. */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
