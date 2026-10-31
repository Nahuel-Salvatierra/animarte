import {
  CatalogFileSchema,
  type CatalogFile,
  type CatalogProduct,
} from './schema';
import { getCatalogJsonUrl, resolveCatalogAssetUrl } from './cdn';
import {
  filterCatalogItems,
  paginateItems,
  sortCatalogItems,
} from './catalogUtils';
import { toCatalogItemView, type CatalogItemView } from './types';

export { filterCatalogItems, paginateItems, sortCatalogItems };

let memoryCache: { at: number; catalog: CatalogFile } | null = null;
const MEMORY_TTL_MS = 60_000;

export async function fetchCatalog(force = false): Promise<CatalogFile> {
  const now = Date.now();
  if (!force && memoryCache && now - memoryCache.at < MEMORY_TTL_MS) {
    return memoryCache.catalog;
  }

  const response = await fetch(getCatalogJsonUrl(), {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`No se pudo cargar el catálogo (${response.status})`);
  }

  const json: unknown = await response.json();
  const catalog = CatalogFileSchema.parse(json);
  memoryCache = { at: now, catalog };
  return catalog;
}

export async function fetchCatalogItems(options?: {
  category?: string;
  query?: string;
  force?: boolean;
}): Promise<CatalogItemView[]> {
  const catalog = await fetchCatalog(options?.force);
  const query = options?.query?.trim().toLowerCase() ?? '';

  const views = catalog.products
    .filter((product) => product.active)
    .map((product) => toCatalogItemView(product, resolveCatalogAssetUrl));

  return filterCatalogItems(views, {
    category: options?.category,
    query,
  });
}

export function findProductById(
  products: CatalogProduct[],
  id: string,
): CatalogProduct | undefined {
  return products.find((product) => product.id === id);
}
