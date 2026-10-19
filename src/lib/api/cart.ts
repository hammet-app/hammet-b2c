import { apiClient } from "@/lib/api/api-client";
import type { DexieCartItem, CartItemType } from "@/lib/db";

// ── Types & DTOs ─────────────────────────────────────────────────────────────

export interface CartItemDto {
  id: string;
  item_type: CartItemType;
  title: string;
  price: number;
  quantity: number;
  school_id?: string;
}

export interface CartResponseDto {
  items: CartItemDto[];
  total?: number;
  discount?: number;
  final_total?: number;
  coupon_code?: string | null;
}

export interface SyncCartPayloadDto {
  items: CartItemDto[];
  coupon_code?: string | null;
}

export interface CartApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ── Mapping ──────────────────────────────────────────────────────────────────

export function toCartItemDto(item: DexieCartItem): CartItemDto {
  return {
    id: item.id,
    item_type: item.type,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    school_id: item.schoolId,
  };
}

export function fromCartItemDto(dto: CartItemDto): Omit<DexieCartItem, 'createdAt' | 'updatedAt' | 'syncStatus'> {
  return {
    id: dto.id,
    type: dto.item_type,
    title: dto.title,
    price: dto.price,
    quantity: dto.quantity || 1,
    schoolId: dto.school_id,
  };
}

// ── Remote Cart API Service ──────────────────────────────────────────────────

export const cartApi = {
  /**
   * Fetch remote cart from backend using official API contract route (/learner/cart).
   * Fails gracefully if backend is unavailable or offline.
   */
  getCart: async (token?: string | null): Promise<CartApiResult<CartResponseDto>> => {
    try {
      const data = await apiClient.get<CartResponseDto>("/learner/cart", token, { skipSessionExpired: true });
      return { success: true, data };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch remote cart";
      return { success: false, error: msg };
    }
  },

  /**
   * Sync the local cart.
   * Note: The backend API contract does not implement a dedicated POST /cart/sync route.
   * Primary local persistence is managed offline-first in Dexie/IndexedDB.
   */
  syncCart: async (
    items: DexieCartItem[],
    couponCode?: string | null,
    token?: string | null
  ): Promise<CartApiResult<CartResponseDto>> => {
    return {
      success: true,
      data: {
        items: items.map(toCartItemDto),
        coupon_code: couponCode ?? null,
      },
    };
  },

  /**
   * Item mutation helpers:
   * Local Dexie is the source of truth. Does not spam non-existent endpoints.
   */
  addItem: async (item: DexieCartItem, token?: string | null): Promise<CartApiResult<CartItemDto>> => {
    return { success: true, data: toCartItemDto(item) };
  },

  updateQuantity: async (
    id: string,
    quantity: number,
    token?: string | null
  ): Promise<CartApiResult<boolean>> => {
    return { success: true, data: true };
  },

  removeItem: async (id: string, token?: string | null): Promise<CartApiResult<boolean>> => {
    return { success: true, data: true };
  },

  clearCart: async (token?: string | null): Promise<CartApiResult<boolean>> => {
    return { success: true, data: true };
  },
};

