import { apiClient } from "@/lib/api/api-client";
import { getPersistedSession } from "@/lib/db";
import type { CartItem } from "@/lib/store/use-cart";
import type {
  AddToCartRequestDto,
  BackendProductTypeDto,
  CheckoutRequestDto as CheckoutRequest,
  CheckoutItemRequestDto as CheckoutItemDto,
} from "@/lib/api/types/payment";

export type { CheckoutItemDto, CheckoutRequest };

export interface CheckoutResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface VerifyPaymentResponse {
  status: "success" | "pending" | "failed" | string;
  reference: string;
  amount: number;
  currency: string;
  paid_at?: string | null;
  channel?: string | null;
  enrolled_items: string[];
}

export interface CreatePaymentLinkPayload {
  items: CartItem[];
  amount: number;
  currency?: string;
  email?: string;
  customerName?: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentLinkData {
  paymentUrl: string;
  reference: string;
  amount: number;
  currency: string;
  expiresAt: string;
  provider: "paystack";
}

export interface PaymentApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const paymentApi = {
  initPayment: async (
    orderId: string,
    token: string,
    onRefresh?: () => Promise<string | null>,
  ): Promise<string> => {
    const res = await apiClient.post<any>(
      "/payment/init",
      { order_id: orderId },
      token,
      onRefresh ? { onRefresh } : { skipSessionExpired: true },
    );

    if (typeof res === "string") {
      return res;
    }
    if (res?.authorization_url) {
      return res.authorization_url;
    }
    if (typeof res?.data === "string") {
      return res.data;
    }
    if (res?.data?.authorization_url) {
      return res.data.authorization_url;
    }
    if (res?.data?.link) {
      return res.data.link;
    }
    if (res?.payment_url) {
      return res.payment_url;
    }
    if (res?.url) {
      return res.url;
    }
    return String(res || "");
  },

  /**
   * Verify transaction settlement status with backend ledger.
   * Surfaces failure transparently if the payment is unverified or declined.
   */
  verifyPayment: async (
    reference: string,
    token?: string | null,
  ): Promise<PaymentApiResponse<VerifyPaymentResponse>> => {
    try {
      const authToken = token || (await getPersistedSession())?.accessToken;
      const response = await apiClient.get<VerifyPaymentResponse>(
        `/learner/payment/verify/${reference}`,
        authToken,
        { skipSessionExpired: true },
      );

      if (!response) {
        return {
          success: false,
          error: "Empty response from verification endpoint.",
        };
      }

      if (response.status !== "success") {
        return {
          success: false,
          data: response,
          error: `Payment status is '${response.status || "unverified"}'. The transaction was not confirmed.`,
        };
      }

      return {
        success: true,
        data: response,
      };
    } catch (err: any) {
      console.error("[paymentApi.verifyPayment] Backend error:", err);
      return {
        success: false,
        error:
          err?.message ||
          `Backend payment verification failed for reference ${reference}.`,
      };
    }
  },
};
