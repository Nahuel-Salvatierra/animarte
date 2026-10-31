import type { CatalogProduct } from './schema';

export type CatalogItemView = {
  id: string;
  title: string;
  category: string;
  kind: CatalogProduct['kind'];
  images: string[];
  coverPath: string;
  backPath?: string;
};

export function toCatalogItemView(
  product: CatalogProduct,
  resolveUrl: (path: string) => string,
): CatalogItemView {
  const images = [resolveUrl(product.images.cover)];
  if (product.images.back) {
    images.push(resolveUrl(product.images.back));
  }

  return {
    id: product.id,
    title: product.title,
    category: product.category,
    kind: product.kind,
    images,
    coverPath: product.images.cover,
    backPath: product.images.back,
  };
}
