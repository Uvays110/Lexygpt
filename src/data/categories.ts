import type { Category } from './catalog';

/** Возвращает категорию из адреса страницы, если такая существует, иначе «Все». */
export function pickCategory(categories: Category[], value: string | string[] | undefined): string {
  const v = Array.isArray(value) ? value[0] : value;
  return v && categories.some((c) => c.id === v) ? v : 'all';
}
