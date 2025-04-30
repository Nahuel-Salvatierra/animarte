'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { FileDrive } from '@/components/DriveBookStore';

export type CartItem = {
  amount: number;
  isSelected: boolean;
  imageBlob?: string;
  reference: Reference;
};

type Reference = FileDrive;

type CartState = {
  cartItems: Record<string, CartItem>;
  addCartItem: (id: string, reference: Reference) => void;
  updateCartItem: (id: string, updater: Partial<CartItem>) => void;
  removeCartItem: (id: string) => void;
  toggleSelect: (id: string, reference: Reference) => void;
  handleAmount: (id: string, change: number, reference: Reference) => void;
  quantity: (id: string) => number;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: {},

      quantity: (id) => {
        return get().cartItems[id]?.amount || 0;
      },

      addCartItem: async (id, file) => {
        set((state) => ({
          cartItems: {
            ...state.cartItems,
            [id]: { isSelected: true, amount: 1, reference: file },
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
        const updatedCard = { ...get().cartItems };
        delete updatedCard[id];
        set({ cartItems: updatedCard });
      },

      toggleSelect: (id, file) => {
        const exists = !!get().cartItems[id];
        if (exists) {
          get().removeCartItem(id);
        } else {
          get().addCartItem(id, file);
        }
      },

      handleAmount: (id, change, file) => {
        const item = get().cartItems[id];

        if (!item) {
          get().addCartItem(id, file);
          return;
        }

        const newAmount = Math.max(change, 0);
        if (newAmount === 0) {
          get().removeCartItem(id);
          return;
        }
        get().updateCartItem(id, { amount: newAmount });
      },

      clearCart: () => {
        set({ cartItems: {} });
      },
    }),
    {
      name: 'cart-storage',
    },
  ),
);
