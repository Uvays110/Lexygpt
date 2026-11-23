import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/manrope';
import '@fontsource-variable/unbounded';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { UIProvider } from '@/components/providers/UIProvider';
import { site } from '@/config/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: [...site.keywords],
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: site.locale,
    title: site.title,
    description: site.description,
    url: '/',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: site.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
    images: ['/og.png'],
  },
  appleWebApp: { capable: true, title: site.name, statusBarStyle: 'black' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0d',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <UIProvider>
          <Header />
          {children}
          <MobileTabBar />
        </UIProvider>
      </body>
    </html>
  );
}
