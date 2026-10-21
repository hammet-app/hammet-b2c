import { apiClient } from "@/lib/api/api-client";
import { getPersistedSession, type DexieCartItem, type CartItemType } from "@/lib/db";
import type {
  AddToCartRequestDto,
  BackendProductTypeDto,
  CartItemDto,
  CartResponseDto,
} from "@/lib/api/types/payment";

export type { AddToCartRequestDto, BackendProductTypeDto, CartItemDto, CartResponseDto };

export interface CartApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ── Mapping ──────────────────────────────────────────────────────────────────

export function toCartItemDto(item: DexieCartItem): CartItemDto {
  return {
    id: item.id,
    cart_id: "local",
    product_type: item.type === "school" ? "ai_school" : item.type,
    product_id: item.id,
    product_name: item.title,
    product_price: item.price,
  };
}

export function fromCartItemDto(dto: CartItemDto): Omit<DexieCartItem, "createdAt" | "updatedAt" | "syncStatus"> {
  const typeMap: CartItemType =
    dto.product_type === "ai_school" || dto.product_type === "school"
      ? "ai_school"
      : (dto.product_type as CartItemType);

  return {
    id: dto.product_id || dto.id,
    type: typeMap,
    title: dto.product_name,
    price: dto.product_price,
    quantity: 1,
  };
}

// ── Remote Cart API Service ──────────────────────────────────────────────────

export const cartApi = {
  /**
   * Fetch remote cart from backend using official API contract route (/learner/cart).
   * Transparently surfaces backend validation or network status.
   */
  getCart: async (token?: string | null): Promise<CartApiResult<CartResponseDto>> => {
    try {
      const authToken = token || (await getPersistedSession())?.accessToken;
      const data = await apiClient.get<CartResponseDto>("/learner/cart", authToken, { skipSessionExpired: true });
      return { success: true, data };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch remote cart";
      return { success: false, error: msg };
    }
  },

  /**
   * Sync the local cart to the backend database.
   * Calls PATCH /learner/cart/add for each pending item using valid product_type.
   */
  syncCart: async (
    items: DexieCartItem[],
    couponCode?: string | null,
    token?: string | null
  ): Promise<CartApiResult<CartResponseDto>> => {
    const authToken = token || (await getPersistedSession())?.accessToken;
    let syncError: string | null = null;

    for (const item of items) {
      try {
        const product_type: BackendProductTypeDto =
          item.type === "school" ? "ai_school" : (item.type as BackendProductTypeDto);
        const payload: AddToCartRequestDto = {
          product_type,
          product_id: item.id,
        };
        await apiClient.patch("/learner/cart/add", payload, authToken, { skipSessionExpired: true });
      } catch (err: unknown) {
        syncError = err instanceof Error ? err.message : "Failed to sync remote cart";
      }
    }

    return {
      success: !syncError,
      error: syncError ?? undefined,
      data: {
        id: "cart-sync",
        total: items.reduce((acc, i) => acc + i.price * (i.quantity ?? 1), 0),
        carts: items.map(toCartItemDto),
        invalid_carts: null,
      },
    };
  },

  /**
   * Item mutation helpers:
   * Adds item to backend PostgreSQL database cart table via PATCH /learner/cart/add.
   * Payload: { product_type: "ai_school" | "course" | "profile", product_id: string }
   */
  addItem: async (item: DexieCartItem, token?: string | null): Promise<CartApiResult<CartItemDto>> => {
    try {
      const authToken = token || (await getPersistedSession())?.accessToken;
      const product_type: BackendProductTypeDto =
        item.type === "school" ? "ai_school" : (item.type as BackendProductTypeDto);
      const payload: AddToCartRequestDto = {
        product_type,
        product_id: item.id,
      };
      await apiClient.patch("/learner/cart/add", payload, authToken, { skipSessionExpired: true });
      return { success: true, data: toCartItemDto(item) };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add remote item";
      return { success: false, data: toCartItemDto(item), error: msg };
    }
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
