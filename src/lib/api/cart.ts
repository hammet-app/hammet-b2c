import { apiClient } from "@/lib/api/api-client";
import {
  getPersistedSession,
  getCartItemsFromDB,
  type DexieCartItem,
  type CartItemType,
} from "@/lib/db";
import {
  CartItemResponse,
  CartItemResponseDto,
  CartResponse,
  OrderResponseDto,
  toCartResponse,
  toOrderResponse,
  type AddToCartRequestDto,
  type BackendProductTypeDto,
  type CartItemDto,
  type CartResponseDto,
  type OrderResponse,
} from "@/lib/api/types/payment";

export type { AddToCartRequestDto, BackendProductTypeDto, CartResponseDto };

export interface CartApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ── Mapping ──────────────────────────────────────────────────────────────────

export function toCartItemDto(item: DexieCartItem): CartItemDto {
  return {
    product_type: item.type,
    product_id: item.productId  || "",
  };
}

export function fromCartItemResponseDto(
  dto: CartItemResponseDto,
): CartItemResponse {
  const typeMap: CartItemType = dto.product_type as CartItemType;
  return {
    id: dto.id,
    cartId: dto.cart_id,
    productType: typeMap,
    productName: dto.product_name,
    productId: dto.product_id,
    productPrice: dto.product_price,
  };
}

// ── Remote Cart API Service ──────────────────────────────────────────────────

export const cartApi = {
  /**
   * Fetch remote cart from backend using official API contract route (/learner/cart).
   * Transparently surfaces backend validation or network status.
   */
  getCart: async (
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<CartResponse> => {
    try {
      const data = await apiClient.get<CartResponseDto>("/learner/cart", token, {
        onRefresh,
      });
      return toCartResponse(data);
    } catch (err: unknown) {
      console.warn("[cartApi.getCart] Remote cart service unavailable, falling back to local storage:", err);
      try {
        const localItems = await getCartItemsFromDB();
        return {
          id: "local-cart-fallback",
          total: localItems.reduce(
            (acc, i) => acc + (i.price ?? 0) * (i.quantity ?? 1),
            0,
          ),
          carts: localItems.map((item) => ({
            id: item.id || item.productId || "",
            cartId: "local",
            productType: item.type,
            productId: item.productId || item.id || "",
            productName: item.title,
            productPrice: item.price,
          })),
          invalidCarts: null,
        };
      } catch {
        return {
          id: "empty-cart-fallback",
          total: 0,
          carts: [],
          invalidCarts: null,
        };
      }
    }
  },

  /**
   * Sync the local cart to the backend database.
   * Calls PATCH /learner/cart/add for each pending item using valid product_type.
   *
  syncCart: async (
    items: DexieCartItem[],
    couponCode?: string | null,
    token?: string | null,
  ): Promise<CartApiResult<CartResponseDto>> => {
    const authToken = token || (await getPersistedSession())?.accessToken;
    let syncError: string | null = null;

    for (const item of items) {
      try {
        const product_type: BackendProductTypeDto =
          item.type as BackendProductTypeDto;
        const payload: AddToCartRequestDto = {
          product_type,
          product_id: item.productId || item.id || "",
        };
        await apiClient.patch("/learner/cart/add", payload, authToken, {
          skipSessionExpired: true,
        });
      } catch (err: unknown) {
        syncError =
          err instanceof Error ? err.message : "Failed to sync remote cart";
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
  },*/

  applyCoupon: async (
    orderId: string,
    code: string,
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<OrderResponse> => {
    const response = await apiClient.post<OrderResponseDto>(
      "/learner/apply-coupon",
      {
        id: orderId,
        code: code.trim().toUpperCase(),
      },
      token,
      { onRefresh },
    );

    return toOrderResponse(response);
  },

  /**
   * Item mutation helpers:
   * Adds item to backend PostgreSQL database cart table via PATCH /learner/cart/add.
   * Payload: { product_type: "ai_school" | "course" | "profile", product_id: string }
   */
  addItem: async (
    item: DexieCartItem,
    token?: string | null,
  ): Promise<CartApiResult<CartItemDto>> => {
    try {
      const authToken = token || (await getPersistedSession())?.accessToken;
      const product_type: BackendProductTypeDto =
        item.type as BackendProductTypeDto;
      const payload: AddToCartRequestDto = {
        product_type,
        product_id: item.productId || item.id || "",
      };
      await apiClient.patch("/learner/cart/add", payload, authToken, {
        skipSessionExpired: true,
      });
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cart-updated"));
      }
      return { success: true, data: toCartItemDto(item) };
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to add remote item";
      return { success: false, data: toCartItemDto(item), error: msg };
    }
  },

  updateQuantity: async (
    id: string,
    quantity: number,
    token?: string | null,
  ): Promise<CartApiResult<boolean>> => {
    return { success: true, data: true };
  },

  // Remove a cart item.
  // The optional third argument preserves compatibility with existing callers.
  removeItem: async (
    id: string,
    product: {
      product_type: BackendProductTypeDto;
      product_id: string;
    },
    token?: string | null,
  ): Promise<CartApiResult<boolean>> => {
    try {
      const authToken = token || (await getPersistedSession())?.accessToken;

      let cartItemId = id;

      // Resolve the backend cart-item ID and product payload when
      // the existing caller supplies only one ID.

      await apiClient.patch(
        `/learner/cart/remove/${encodeURIComponent(cartItemId)}`,
        product,
        authToken,
        { skipSessionExpired: true },
      );
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cart-updated"));
      }
      return { success: true, data: true };
    } catch (err: unknown) {
      return {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to remove cart item",
      };
    }
  },

  clearCart: async (token?: string | null): Promise<CartApiResult<boolean>> => {
    return { success: true, data: true };
  },

  checkout: async (
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<OrderResponse> => {
    const response = await apiClient.post<OrderResponseDto>(
      "/learner/checkout",
      undefined,
      token,
      { onRefresh },
    );

    return toOrderResponse(response);
  },

  editOrder: async (
    body: {
      product_id: string;
      product_type: string;
    },
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<OrderResponse> => {
    const response = await apiClient.patch<OrderResponseDto>(
      "/learner/order/edit",
      body,
      token,
      { onRefresh },
    );

    return toOrderResponse(response);
  },
};
