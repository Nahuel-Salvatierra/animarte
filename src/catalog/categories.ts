import type { CatalogCategory } from './schema';

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  { id: 'anime', label: 'Anime', kind: 'notebook' },
  { id: 'cartoon', label: 'Cartoon y Kawaii', kind: 'notebook' },
  { id: 'superheroes', label: 'Superheroes', kind: 'notebook' },
  { id: 'disney', label: 'Disney', kind: 'notebook' },
  { id: 'football', label: 'Futbol', kind: 'notebook' },
  { id: 'music', label: 'Musica y Youtube', kind: 'notebook' },
  { id: 'series', label: 'Series y Peliculas', kind: 'notebook' },
  { id: 'games', label: 'Juegos', kind: 'notebook' },
  { id: 'cover', label: 'Caratulas', kind: 'cover' },
];

export const NOTEBOOK_CATEGORIES = CATALOG_CATEGORIES.filter(
  (category) => category.kind === 'notebook',
);
