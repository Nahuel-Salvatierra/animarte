import { create } from 'zustand';

type NameState = {
  name: string;
  setName: (name: string) => void;
  clearName: () => void;
  getName: () => string;
};

export const useName = create<NameState>()((set, get) => ({
  name: '',
  setName: (name: string) => set({ name }),
  clearName: () => set({ name: '' }),
  getName: () => get().name,
}));
