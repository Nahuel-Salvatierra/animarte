const FALLBACK_CDN = '';

export function getCatalogCdnUrl(): string {
  const raw = process.env.NEXT_PUBLIC_CATALOG_CDN_URL ?? FALLBACK_CDN;
  return raw.replace(/\/$/, '');
}

export function resolveCatalogAssetUrl(relativePath: string): string {
  const cleanPath = relativePath.replace(/^\//, '');
  const cdn = getCatalogCdnUrl();
  if (!cdn) {
    return `/${cleanPath}`;
  }
  return `${cdn}/${cleanPath}`;
}

export function getCatalogJsonUrl(): string {
  return resolveCatalogAssetUrl('catalog.json');
}

export function getCategoriesJsonUrl(): string {
  return resolveCatalogAssetUrl('categories.json');
}
