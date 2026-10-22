import { create } from "zustand";
import {
  type CartItemType,
  type CartSyncStatus,
  type DexieCartItem,
  getCartItemsFromDB,
  getCartMetaFromDB,
  putCartItemToDB,
  updateCartItemQuantityInDB,
  removeCartItemFromDB,
  clearCartInDB,
  saveCartMetaToDB,
  markItemsPaidInDB,
  getUnsyncedCartItemsFromDB,
  updateCartItemSyncStatusInDB,
  db,
} from "@/lib/db";
import { cartApi } from "@/lib/api/cart";

export type { CartItemType, CartSyncStatus };

export interface CartItem {
  id?: string;
  type: CartItemType;
  title: string;
  price: number;
  quantity?: number;
  productId?: string;
  schoolId?: string;
  syncStatus?: CartSyncStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  description: string;
}

export const VALID_COUPONS: Record<
  string,
  { discountPercentage: number; description: string }
> = {
  HAMMET20: { discountPercentage: 20, description: "20% Team Lead Special" },
  HAMMETAI: { discountPercentage: 20, description: "20% AI Scholar Promo" },
  HAMMET50: { discountPercentage: 50, description: "50% Community Special" },
  EARLYBIRD: { discountPercentage: 15, description: "15% Early Bird Discount" },
  LEARN20: { discountPercentage: 20, description: "20% Learner Pass" },
  FREE100: { discountPercentage: 100, description: "100% Full Scholarship" },
};

interface CartStore {
  items: CartItem[];
  paidItems: string[];
  couponCode: string | null;
  discountPercentage: number;
  isHydrated: boolean;
  isSyncing: boolean;

  // Cart operations (all routed through Dexie)
  addItem: (item: Omit<CartItem, "syncStatus">) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  hydrateFromDB: (
    token?: string,
    onRefresh?: () => Promise<string | null>,
  ) => Promise<void>;
  retryFailedSync: () => Promise<void>;

  // Queries & calculations
  getTotal: () => number;
  hasItem: (id: string) => boolean;
  hasPaidItem: (id: string) => boolean;
  getItemQuantity: (id: string) => number;

  // Payment simulation & coupon management
  markAsPaid: (specificIds?: string[]) => Promise<void>;
  applyCoupon: (code: string) => {
    success: boolean;
    message: string;
    discountPercentage: number;
    savePromise?: Promise<unknown>;
  };
  removeCoupon: () => Promise<void>;
  getDiscountAmount: () => number;
  getFinalTotal: () => number;
}

// ── Background Sync Helpers ──────────────────────────────────────────────────

async function backgroundSyncAddItem(item: DexieCartItem) {
  if (!item.id) return;
  try {
    const res = await cartApi.addItem(item);
    const newStatus: CartSyncStatus = res.success ? "synced" : "failed";
    await updateCartItemSyncStatusInDB(item.id, newStatus);
    useCart.setState((state) => ({
      items: state.items.map((i) =>
        i.id === item.id ? { ...i, syncStatus: newStatus } : i,
      ),
    }));
  } catch {
    await updateCartItemSyncStatusInDB(item.id, "failed");
    useCart.setState((state) => ({
      items: state.items.map((i) =>
        i.id === item.id ? { ...i, syncStatus: "failed" } : i,
      ),
    }));
  }
}

async function backgroundSyncUpdateQuantity(id: string, quantity: number) {
  try {
    const res = await cartApi.updateQuantity(id, quantity);
    const newStatus: CartSyncStatus = res.success ? "synced" : "failed";
    await updateCartItemSyncStatusInDB(id, newStatus);
    useCart.setState((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, syncStatus: newStatus } : i,
      ),
    }));
  } catch {
    await updateCartItemSyncStatusInDB(id, "failed");
  }
}

async function backgroundSyncRemoveItem(id: string) {
  try {
    // Non-blocking best effort for delete
  } catch {
    // Non-blocking best effort for delete
  }
}

async function backgroundSyncClearCart() {
  try {
    await cartApi.clearCart();
  } catch {
    // Non-blocking best effort for clear
  }
}

// ── Migration from Legacy localStorage ───────────────────────────────────────

let migrationRan = false;

async function migrateLegacyLocalStorage() {
  if (typeof window === "undefined" || migrationRan) return;
  migrationRan = true;

  try {
    const raw = localStorage.getItem("hammet-cart");
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const legacyState = parsed?.state;

    if (legacyState) {
      if (Array.isArray(legacyState.items) && legacyState.items.length > 0) {
        for (const item of legacyState.items) {
          await putCartItemToDB({
            id: item.id || item.productId,
            type: item.type,
            title: item.title,
            price: item.price,
            quantity: item.quantity ?? 1,
            productId: item.productId || item.id,
            schoolId: item.schoolId,
            syncStatus: "pending",
          });
        }
      }

      if (
        Array.isArray(legacyState.paidItems) &&
        legacyState.paidItems.length > 0
      ) {
        const meta = await getCartMetaFromDB();
        const merged = Array.from(
          new Set([...meta.paidItems, ...legacyState.paidItems]),
        );
        await saveCartMetaToDB({
          paidItems: merged,
          couponCode: legacyState.couponCode ?? meta.couponCode,
          discountPercentage:
            legacyState.discountPercentage ?? meta.discountPercentage,
        });
      }
    }

    // Clean up old localStorage entry once migrated to Dexie
    localStorage.removeItem("hammet-cart");
  } catch (err) {
    console.warn(
      "[Cart Migration] Warning migrating legacy localStorage cart:",
      err,
    );
  }
}

// ── Store Definition ─────────────────────────────────────────────────────────

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  paidItems: [],
  couponCode: null,
  discountPercentage: 0,
  isHydrated: false,
  isSyncing: false,

  hydrateFromDB: async (
    token?: string,
    onRefresh?: () => Promise<string | null>,
  ) => {
    if (typeof window === "undefined") return;

    try {
      // 1. Migrate legacy localStorage if present
      await migrateLegacyLocalStorage();

      // 2. Load primary state directly from Dexie
      const [dbItems, dbMeta] = await Promise.all([
        getCartItemsFromDB(),
        getCartMetaFromDB(),
      ]);

      set({
        items: dbItems.map((item) => ({
          id: item.id ?? item.productId,
          type: item.type,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          productId: item.productId || item.id || "",
          schoolId: item.schoolId,
          syncStatus: item.syncStatus,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        paidItems: dbMeta?.paidItems ?? [],
        couponCode: dbMeta?.couponCode ?? null,
        discountPercentage: dbMeta?.discountPercentage ?? 0,
        isHydrated: true,
      });

      // 3. Attempt background sync if there are pending items
      get().retryFailedSync();
    } catch (err) {
      console.warn("[useCart] Failed to hydrate cart from Dexie:", err);
      set({ isHydrated: true });
    }
  },

  addItem: async (item) => {
    const state = get();
    const itemId = item.id || item.productId;
    if (!itemId) return;
    if (state.items.some((i) => i.id === itemId || i.productId === item.productId)) return;
    if (state.paidItems.includes(itemId)) return;

    const quantity = Math.max(1, item.quantity ?? 1);
    const optimisticItem: CartItem = {
      ...item,
      id: itemId,
      quantity,
      syncStatus: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Reactive UI update
    set({ items: [...state.items, optimisticItem] });

    // 2. Primary local persistence: Write to Dexie
    const persisted = await putCartItemToDB({
      id: itemId,
      type: item.type,
      title: item.title,
      price: item.price,
      quantity,
      productId: item.productId || itemId,
      schoolId: item.schoolId,
      syncStatus: "pending",
    });

    // 3. Background sync with backend
    backgroundSyncAddItem(persisted);
  },

  removeItem: async (id: string) => {
    // 1. Reactive UI update
    set((state) => ({ items: state.items.filter((i) => i.id !== id && i.productId !== id) }));

    // 2. Primary local persistence: Remove from Dexie
    await removeCartItemFromDB(id);

    // 3. Background sync with backend
    backgroundSyncRemoveItem(id);
  },

  updateQuantity: async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await get().removeItem(id);
      return;
    }

    // 1. Reactive UI update
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, quantity, syncStatus: "pending" } : i,
      ),
    }));

    // 2. Primary local persistence: Update in Dexie
    await updateCartItemQuantityInDB(id, quantity);

    // 3. Background sync with backend
    backgroundSyncUpdateQuantity(id, quantity);
  },

  clearCart: async () => {
    // 1. Reactive UI update
    set({ items: [] });

    // 2. Primary local persistence: Clear Dexie
    await clearCartInDB();

    // 3. Background sync with backend
    backgroundSyncClearCart();
  },

  retryFailedSync: async () => {
    if (typeof window === "undefined") return;

    try {
      const unsynced = await getUnsyncedCartItemsFromDB();
      if (unsynced.length === 0) return;

      set({ isSyncing: true });
      for (const item of unsynced) {
        if (!item.id) continue;
        const res = await cartApi.addItem(item);
        if (res.success) {
          await updateCartItemSyncStatusInDB(item.id, "synced");
        }
      }
      const updated = await getCartItemsFromDB();
      set({
        isSyncing: false,
        items: updated.map((item) => ({
          id: item.id ?? item.productId,
          type: item.type,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          productId: item.productId || item.id || "",
          schoolId: item.schoolId,
          syncStatus: item.syncStatus,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
      });
    } catch {
      set({ isSyncing: false });
    }
  },

  getTotal: () =>
    get().items.reduce(
      (total, item) => total + item.price * (item.quantity ?? 1),
      0,
    ),

  hasItem: (id: string) => get().items.some((i) => i.id === id || i.productId === id),

  hasPaidItem: (id: string) => get().paidItems.includes(id),

  getItemQuantity: (id: string) => {
    const item = get().items.find((i) => i.id === id || i.productId === id);
    return item?.quantity ?? 0;
  },

  markAsPaid: async (specificIds?: string[]) => {
    const state = get();
    const itemIds: string[] = specificIds ?? state.items.map((i) => i.id || i.productId).filter((id): id is string => Boolean(id));
    const updatedPaid: string[] = Array.from(new Set([...state.paidItems, ...itemIds]));

    // 1. Reactive UI update
    set({
      items: state.items.filter((i) => !itemIds.includes((i.id || i.productId) as string)),
      paidItems: updatedPaid,
    });

    // 2. Primary local persistence in Dexie
    await markItemsPaidInDB(itemIds);
  },

  applyCoupon: (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = VALID_COUPONS[clean];
    if (!found) {
      return {
        success: false,
        message: "Invalid coupon code. Try 'HAMMET20' or 'HAMMETAI'",
        discountPercentage: 0,
        savePromise: Promise.resolve(null),
      };
    }

    set({ couponCode: clean, discountPercentage: found.discountPercentage });
    const savePromise = saveCartMetaToDB({
      couponCode: clean,
      discountPercentage: found.discountPercentage,
    });

    return {
      success: true,
      message: `Coupon applied: ${found.description} (${found.discountPercentage}% off)`,
      discountPercentage: found.discountPercentage,
      savePromise,
    };
  },

  removeCoupon: async () => {
    set({ couponCode: null, discountPercentage: 0 });
    await saveCartMetaToDB({ couponCode: null, discountPercentage: 0 });
  },

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
}));

// ── Auto-Hydration & Browser Event Listeners ─────────────────────────────────

if (typeof window !== "undefined") {
  // Attach for test automation and client debugging
  (
    window as unknown as {
      __HAMMET_DB__: typeof db;
      __USE_CART__: typeof useCart;
    }
  ).__HAMMET_DB__ = db;
  (window as unknown as { __USE_CART__: typeof useCart }).__USE_CART__ =
    useCart;

  // Hydrate immediately on module load in browser
  useCart.getState().hydrateFromDB();

  // Re-sync on network reconnect
  window.addEventListener("online", () => {
    useCart.getState().retryFailedSync();
  });
}
