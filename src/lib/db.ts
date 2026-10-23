// lib/db.ts
// Local-first database using Dexie (IndexedDB wrapper).
// This is where all student work lives on the device.
// Everything here is available offline, 100% of the time.

import Dexie, { type Table } from "dexie";
import { AuthUser } from "@/lib/utils/roles";
import { apiClient } from "./api/api-client";

// ── Types ────────────────────────────────────────────────────────────────────

export interface CachedSession {
  id: "current"; // singleton row
  user: AuthUser;
  accessToken: string;
  cachedAt: string;
}

export type CartItemType = "ai_school" | "course" | "profile";
export type CartSyncStatus = "synced" | "pending" | "failed";

export interface DexieCartItem {
  type: CartItemType;
  title: string;
  price: number;
  productId: string;
}

export interface DexieCartMeta {
  id: "cart-meta";
  paidItems: string[];
  couponCode: string | null;
  discountPercentage: number;
  updatedAt: string;
}

// ── Database ─────────────────────────────────────────────────────────────────

class HammetDB extends Dexie {
  session!: Table<CachedSession>;
  cart!: Table<DexieCartItem>;
  cartMeta!: Table<DexieCartMeta>;

  constructor() {
    super("hammet-db");

    // Version 1: Original session cache
    this.version(1).stores({
      session: "id",
    });

    // Version 2: Local-first Cart with indexed properties and cart metadata
    this.version(2).stores({
      session: "id",
      cart: "id, type, schoolId, syncStatus, createdAt, updatedAt",
      cartMeta: "id",
    });
  }
}

export const db = new HammetDB();

// ── Session cache helpers ─────────────────────────────────────────────────────

/**
 * Persist the authenticated session to IndexedDB.
 * Call this after every successful refresh or login so the student
 * can be recognised offline without a network round-trip.
 */
export async function persistSession(
  user: AuthUser,
  accessToken: string,
): Promise<void> {
  try {
    await db.session.put({
      id: "current",
      user,
      accessToken,
      cachedAt: new Date().toISOString(),
    });
  } catch {
    // best-effort — never throw
  }
}

/**
 * Read the most recently persisted session.
 * Returns null if nothing is cached or the DB read fails.
 */
export async function getPersistedSession(): Promise<CachedSession | null> {
  try {
    return (await db.session.get("current")) ?? null;
  } catch {
    return null;
  }
}

/**
 * Wipe the session cache on explicit logout.
 */
export async function clearPersistedSession(): Promise<void> {
  try {
    await db.session.delete("current");
  } catch {
    // best-effort
  }
}

// ── Cart Dexie helpers ────────────────────────────────────────────────────────

const DEFAULT_CART_META: DexieCartMeta = {
  id: "cart-meta",
  paidItems: [],
  couponCode: null,
  discountPercentage: 0,
  updatedAt: new Date().toISOString(),
};

/**
 * Fetch all cart items from Dexie, ordered chronologically.
 */
export async function getCartItemsFromDB(): Promise<DexieCartItem[]> {
  try {
    return await db.cart.orderBy("createdAt").toArray();
  } catch (err) {
    console.warn("[Dexie] Failed to fetch cart items from IndexedDB:", err);
    return [];
  }
}

/**
 * Fetch a single cart item by ID.
 */
export async function getCartItemFromDB(
  id: string,
): Promise<DexieCartItem | undefined> {
  try {
    return await db.cart.get(id);
  } catch (err) {
    console.warn(`[Dexie] Failed to get cart item ${id}:`, err);
    return undefined;
  }
}

export interface PutCartItemInput {
  id: string;
  type: CartItemType;
  title: string;
  price: number;
  quantity?: number;
  productId: string;
  syncStatus?: CartSyncStatus;
}

/**
 * Insert or update a cart item in Dexie.
 * If the item already exists, updates its quantity and timestamp.
 *
export async function putCartItemToDB(
  input: PutCartItemInput,
): Promise<DexieCartItem> {
  const now = new Date().toISOString();
  try {
    const existing = await db.cart.get(input.id);
    const item: DexieCartItem = {
      id: input.id,
      type: input.type,
      title: input.title,
      price: input.price,
      quantity: Math.max(1, input.quantity ?? existing?.quantity ?? 1),
      productId: input.productId ?? existing?.productId,
      syncStatus: input.syncStatus ?? "pending",
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    await db.cart.put(item);
    return item;
  } catch (err) {
    console.warn(`[Dexie] Failed to put cart item ${input.id}:`, err);
    return {
      id: input.id,
      type: input.type,
      title: input.title,
      price: input.price,
      quantity: Math.max(1, input.quantity ?? 1),
      productId: input.productId,
      syncStatus: "failed",
      createdAt: now,
      updatedAt: now,
    };
  }
}/

/**
 * Update quantity of a cart item in Dexie.
 * If quantity <= 0, the item is removed.
 *
export async function updateCartItemQuantityInDB(
  id: string,
  quantity: number,
): Promise<void> {
  try {
    if (quantity <= 0) {
      await removeCartItemFromDB(id);
      return;
    }
    const existing = await db.cart.get(id);
    if (!existing) return;

    await db.cart.update(id, {
      quantity,
      syncStatus: "pending",
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn(`[Dexie] Failed to update quantity for ${id}:`, err);
  }
}

/**
 * Remove an item from the cart table.
 */
export async function removeCartItemFromDB(id: string): Promise<void> {
  try {
    await db.cart.delete(id);
  } catch (err) {
    console.warn(`[Dexie] Failed to remove item ${id}:`, err);
  }
}

/**
 * Clear all items from the cart table.
 */
export async function clearCartInDB(): Promise<void> {
  try {
    await db.cart.clear();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("cart-updated"));
    }
  } catch (err) {
    console.warn("[Dexie] Failed to clear cart:", err);
  }
}

/**
 * Retrieve cart metadata (paid items, active coupon, discount).
 */
export async function getCartMetaFromDB(): Promise<DexieCartMeta> {
  try {
    const meta = await db.cartMeta.get("cart-meta");
    return (
      meta ?? { ...DEFAULT_CART_META, updatedAt: new Date().toISOString() }
    );
  } catch (err) {
    console.warn("[Dexie] Failed to get cart metadata:", err);
    return { ...DEFAULT_CART_META, updatedAt: new Date().toISOString() };
  }
}

/**
 * Save or update cart metadata in Dexie.
 */
export async function saveCartMetaToDB(
  updates: Partial<Omit<DexieCartMeta, "id">>,
): Promise<DexieCartMeta> {
  try {
    const current = await getCartMetaFromDB();
    const updated: DexieCartMeta = {
      ...current,
      ...updates,
      id: "cart-meta",
      updatedAt: new Date().toISOString(),
    };
    await db.cartMeta.put(updated);
    return updated;
  } catch (err) {
    console.warn("[Dexie] Failed to save cart metadata:", err);
    return {
      ...DEFAULT_CART_META,
      ...updates,
      id: "cart-meta",
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Mark specified items as paid in Dexie:
 * - Appends item IDs to cartMeta.paidItems
 * - Deletes the items from the cart table
 */
export async function markItemsPaidInDB(itemIds: string[]): Promise<void> {
  try {
    await db.transaction("rw", db.cart, db.cartMeta, async () => {
      const currentMeta =
        (await db.cartMeta.get("cart-meta")) ?? DEFAULT_CART_META;
      const combined = Array.from(
        new Set([...currentMeta.paidItems, ...itemIds]),
      );

      await db.cartMeta.put({
        ...currentMeta,
        paidItems: combined,
        updatedAt: new Date().toISOString(),
      });

      // Remove paid items from active cart
      for (const id of itemIds) {
        await db.cart.delete(id);
      }
    });
  } catch (err) {
    console.warn("[Dexie] Failed to mark items as paid in DB:", err);
  }
}

/**
 * Fetch all items that have not been successfully synced with the backend.
 *
export async function getUnsyncedCartItemsFromDB(): Promise<DexieCartItem[]> {
  try {
    return await db.cart
      .where("syncStatus")
      .anyOf(["pending", "failed"])
      .toArray();
  } catch {
    // Fallback in case of index issues
    try {
      const all = await db.cart.toArray();
      return all.filter((i) => i.syncStatus !== "synced");
    } catch {
      return [];
    }
  }
}*/

/**
 * Update the synchronization status of a cart item in Dexie.
 *
export async function updateCartItemSyncStatusInDB(
  id: string,
  syncStatus: CartSyncStatus,
): Promise<void> {
  try {
    await db.cart.update(id, {
      syncStatus,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn(`[Dexie] Failed to update syncStatus for ${id}:`, err);
  }
}*/
