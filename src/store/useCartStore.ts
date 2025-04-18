"use client";

import { Book } from "@/components/DriveBookStore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  amount: number;
  isSelected: boolean;
  imageBlob?: string;
  reference: Reference;
};

type Reference = Book;

type CartState = {
  cartItems: Record<string, CartItem>;
  addCartItem: (id: string, book: Reference) => void;
  updateCartItem: (id: string, updater: Partial<CartItem>) => void;
  removeCartItem: (id: string) => void;
  toggleSelect: (id: string, book: Reference) => void;
  amountChange: (id: string, change: number, reference: Reference) => void;
  isInCart: (id: string) => number;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: {},
      isInCart: (id) => {
        return get().cartItems[id]?.amount || 0;
      },

      addCartItem: async (id, book) => {
        set((state) => ({
          cartItems: {
            ...state.cartItems,
            [id]: { isSelected: true, amount: 1, reference: book },
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

      toggleSelect: (id, book) => {
        const exists = !!get().cartItems[id];
        if (exists) {
          get().removeCartItem(id);
        } else {
          get().addCartItem(id, book);
        }
      },

      amountChange: (id, change, book) => {
        const item = get().cartItems[id];

        if (!item) {
          get().addCartItem(id, book);
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
      name: "cart-storage", // clave en localStorage
    }
  )
);
