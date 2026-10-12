import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItemType = 'school' | 'course';

export interface CartItem {
  id: string; // schoolId or courseId
  type: CartItemType;
  title: string;
  price: number;
  schoolId?: string; 
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  hasItem: (id: string) => boolean;
  hasPaidItem: (id: string) => boolean;
  markAsPaid: () => void; // for mocking payment
  paidItems: string[]; // Store paid item IDs to mock purchased state
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      paidItems: [],
      addItem: (item) =>
        set((state) => {
          if (state.items.find((i) => i.id === item.id)) return state;
          if (state.paidItems.includes(item.id)) return state; // Already paid
          return { items: [...state.items, item] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((total, item) => total + item.price, 0),
      hasItem: (id) => get().items.some(i => i.id === id),
      hasPaidItem: (id) => get().paidItems.includes(id),
      markAsPaid: () => set((state) => {
        // Move all items to paidItems
        const itemIds = state.items.map(i => i.id);
        return {
          items: [],
          paidItems: [...state.paidItems, ...itemIds]
        };
      }),
    }),
    {
      name: 'hammet-cart',
    }
  )
);

