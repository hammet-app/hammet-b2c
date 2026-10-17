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

export interface Coupon {
  code: string;
  discountPercentage: number;
  description: string;
}

export const VALID_COUPONS: Record<string, { discountPercentage: number; description: string }> = {
  HAMMET20: { discountPercentage: 20, description: "20% Team Lead Special" },
  HAMMETAI: { discountPercentage: 20, description: "20% AI Scholar Promo" },
  HAMMET50: { discountPercentage: 50, description: "50% Community Special" },
  EARLYBIRD: { discountPercentage: 15, description: "15% Early Bird Discount" },
  LEARN20: { discountPercentage: 20, description: "20% Learner Pass" },
  FREE100: { discountPercentage: 100, description: "100% Full Scholarship" },
};

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
  
  // Coupon support
  couponCode: string | null;
  discountPercentage: number;
  applyCoupon: (code: string) => { success: boolean; message: string; discountPercentage: number };
  removeCoupon: () => void;
  getDiscountAmount: () => number;
  getFinalTotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      paidItems: [],
      couponCode: null,
      discountPercentage: 0,
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
          paidItems: [...state.paidItems, ...itemIds],
        };
      }),
      applyCoupon: (code: string) => {
        const clean = code.trim().toUpperCase();
        const found = VALID_COUPONS[clean];
        if (!found) {
          return {
            success: false,
            message: "Invalid coupon code. Try 'HAMMET20' or 'HAMMETAI'",
            discountPercentage: 0,
          };
        }
        set({ couponCode: clean, discountPercentage: found.discountPercentage });
        return {
          success: true,
          message: `Coupon applied: ${found.description} (${found.discountPercentage}% off)`,
          discountPercentage: found.discountPercentage,
        };
      },
      removeCoupon: () => set({ couponCode: null, discountPercentage: 0 }),
      getDiscountAmount: () => {
        const total = get().getTotal();
        const pct = get().discountPercentage;
        return Math.round((total * pct) / 100);
      },
      getFinalTotal: () => {
        const total = get().getTotal();
        const discount = get().getDiscountAmount();
        return Math.max(0, total - discount);
      },
    }),
    {
      name: 'hammet-cart',
    }
  )
);
