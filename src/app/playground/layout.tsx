import type { ReactNode } from 'react';

/** Студия генерации — полноэкранная, без подвала. */
export default function PlaygroundLayout({ children }: { children: ReactNode }) {
  return <main id="main">{children}</main>;
}
