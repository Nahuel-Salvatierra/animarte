'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CatalogItemView } from '@/catalog/types';

export type CartReference = {
  id: string;
  title: string;
  coverPath: string;
};

export type CartItem = {
  amount: number;
  isSelected: boolean;
  reference: CartReference;
};

type CartState = {
  cartItems: Record<string, CartItem>;
  addCartItem: (item: CatalogItemView) => void;
  updateCartItem: (id: string, updater: Partial<CartItem>) => void;
  removeCartItem: (id: string) => void;
  toggleSelect: (item: CatalogItemView) => void;
  handleAmount: (item: CatalogItemView, amount: number) => void;
  quantity: (id: string) => number;
  clearCart: () => void;
};

function toReference(item: CatalogItemView): CartReference {
  return {
    id: item.id,
    title: item.title,
    coverPath: item.coverPath,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: {},

      quantity: (id) => get().cartItems[id]?.amount || 0,

      addCartItem: (item) => {
        set((state) => ({
          cartItems: {
            ...state.cartItems,
            [item.id]: {
              isSelected: true,
              amount: 1,
              reference: toReference(item),
            },
          },
        }));
      },

      updateCartItem: (id, updater) => {
        const current = get().cartItems[id];
        if (!current) return;
        set((state) => ({
          cartItems: {
            ...state.cartItems,
            [id]: { ...current, ...updater },
          },
        }));
      },

      removeCartItem: (id) => {
        const updated = { ...get().cartItems };
        delete updated[id];
        set({ cartItems: updated });
      },

      toggleSelect: (item) => {
        const exists = !!get().cartItems[item.id];
        if (exists) {
          get().removeCartItem(item.id);
        } else {
          get().addCartItem(item);
        }
      },

      handleAmount: (item, amount) => {
        const current = get().cartItems[item.id];
        if (!current) {
          if (amount > 0) get().addCartItem(item);
          return;
        }

        const newAmount = Math.max(amount, 0);
        if (newAmount === 0) {
          get().removeCartItem(item.id);
          return;
        }
        get().updateCartItem(item.id, { amount: newAmount });
      },

      clearCart: () => {
        set({ cartItems: {} });
      },
    }),
    {
      name: 'cart-storage',
      version: 2,
      migrate: () => ({ cartItems: {} }),
    },
  ),
);
