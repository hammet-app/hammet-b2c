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
   * Fetch remote cart from backend.
   * Fails gracefully if backend is unavailable or offline.
   */
  getCart: async (token?: string | null): Promise<CartApiResult<CartResponseDto>> => {
    try {
      const data = await apiClient.get<CartResponseDto>("/cart", token, { skipSessionExpired: true });
      return { success: true, data };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch remote cart";
      return { success: false, error: msg };
    }
  },

  /**
   * Sync the entire local cart with the backend.
   */
  syncCart: async (
    items: DexieCartItem[],
    couponCode?: string | null,
    token?: string | null
  ): Promise<CartApiResult<CartResponseDto>> => {
    try {
      const payload: SyncCartPayloadDto = {
        items: items.map(toCartItemDto),
        coupon_code: couponCode ?? null,
      };
      const data = await apiClient.post<CartResponseDto>("/cart/sync", payload, token, { skipSessionExpired: true });
      return { success: true, data };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cart sync failed";
      return { success: false, error: msg };
    }
  },

  /**
   * Notify backend about an added item.
   */
  addItem: async (item: DexieCartItem, token?: string | null): Promise<CartApiResult<CartItemDto>> => {
    try {
      const payload = toCartItemDto(item);
      const data = await apiClient.post<CartItemDto>("/cart/items", payload, token, { skipSessionExpired: true });
      return { success: true, data };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add remote item";
      return { success: false, error: msg };
    }
  },

  /**
   * Update item quantity on backend.
   */
  updateQuantity: async (
    id: string,
    quantity: number,
    token?: string | null
  ): Promise<CartApiResult<boolean>> => {
    try {
      await apiClient.patch<{ success: boolean }>(`/cart/items/${id}`, { quantity }, token, { skipSessionExpired: true });
      return { success: true, data: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update remote item quantity";
      return { success: false, error: msg };
    }
  },

  /**
   * Delete an item on the backend.
   */
  removeItem: async (id: string, token?: string | null): Promise<CartApiResult<boolean>> => {
    try {
      await apiClient.delete<void>(`/cart/items/${id}`, undefined, token, { skipSessionExpired: true });
      return { success: true, data: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to remove remote item";
      return { success: false, error: msg };
    }
  },

  /**
   * Clear the cart on the backend.
   */
  clearCart: async (token?: string | null): Promise<CartApiResult<boolean>> => {
    try {
      await apiClient.delete<void>("/cart", undefined, token, { skipSessionExpired: true });
      return { success: true, data: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to clear remote cart";
      return { success: false, error: msg };
    }
  },
};

