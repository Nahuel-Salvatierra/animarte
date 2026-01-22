import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NameState = {
  name: string;
  setName: (name: string) => void;
  clearName: () => void;
  getName: () => string;
};

export const useName = create<NameState>()(
  persist(
    (set, get) => ({
      name: '',
      setName: (name: string) => set({ name }),
      clearName: () => set({ name: '' }),
      getName: () => get().name,
    }),
    {
      name: 'client-name-storage',
    },
  ),
);
