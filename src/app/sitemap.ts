import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { MODELS } from '@/data/models';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/+$/, '');
  const pages = ['', '/trends', '/sets', '/prompts', '/effects', '/models', '/pricing', '/partner', '/faq', '/terms', '/privacy'];
  return [
    ...pages.map((p) => ({ url: `${base}${p || '/'}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7 })),
    ...MODELS.map((m) => ({ url: `${base}/playground/${m.type}/${m.slug}`, changeFrequency: 'monthly' as const, priority: 0.6 })),
  ];
}
