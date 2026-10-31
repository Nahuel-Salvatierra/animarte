import { beforeEach, describe, expect, it, vi } from 'vitest';

const memory = new Map<string, string>();

vi.stubGlobal('localStorage', {
  getItem: (key: string) => memory.get(key) ?? null,
  setItem: (key: string, value: string) => {
    memory.set(key, value);
  },
  removeItem: (key: string) => {
    memory.delete(key);
  },
  clear: () => memory.clear(),
});

import type { CatalogItemView } from '@/catalog/types';

import { useCartStore } from './useCartStore';

const sample: CatalogItemView = {
  id: 'product-1',
  title: 'Producto 1',
  category: 'anime',
  kind: 'notebook',
  images: ['/cover.webp'],
  coverPath: 'products/anime/product-1/cover.webp',
};

describe('useCartStore', () => {
  beforeEach(() => {
    memory.clear();
    useCartStore.getState().clearCart();
  });

  it('adds, updates amount and removes items', () => {
    useCartStore.getState().addCartItem(sample);
    expect(useCartStore.getState().quantity('product-1')).toBe(1);

    useCartStore.getState().handleAmount(sample, 3);
    expect(useCartStore.getState().cartItems['product-1'].amount).toBe(3);

    useCartStore.getState().handleAmount(sample, 0);
    expect(useCartStore.getState().cartItems['product-1']).toBeUndefined();
  });

  it('toggles selection', () => {
    useCartStore.getState().toggleSelect(sample);
    expect(useCartStore.getState().cartItems['product-1']).toBeDefined();
    useCartStore.getState().toggleSelect(sample);
    expect(useCartStore.getState().cartItems['product-1']).toBeUndefined();
  });
});
