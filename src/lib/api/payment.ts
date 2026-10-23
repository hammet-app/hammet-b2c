import { apiClient } from "@/lib/api/api-client";
import type { CartItem } from "@/lib/store/use-cart";
import type {
  CheckoutRequestDto as CheckoutRequest,
  CheckoutItemRequestDto as CheckoutItemDto,
} from "@/lib/api/types/payment";

export type { CheckoutItemDto, CheckoutRequest };

export interface CheckoutResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

type InitPaymentResponse =
  | boolean
  | string
  | {
      authorization_url?: string;
      data?: string | { authorization_url?: string; link?: string };
      payment_url?: string;
      url?: string;
    };

export interface VerifyPaymentResponse {
  status: "successful" | "pending" | "failed" | string;
  //reference: string;
  //amount: number;
  //currency: string;
  //paid_at?: string | null;
  //channel?: string | null;
  //enrolled_items: string[];
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
    const res = await apiClient.post<InitPaymentResponse>(
      "/payment/init",
      { order_id: orderId },
      token,
      onRefresh ? { onRefresh } : { skipSessionExpired: true },
    );

    if (typeof res === "boolean") {
      return "/learner/checkout/callback?free=1";
    }

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
    orderId: string,
    token: string | null,
    onRefresh?: () => Promise<string | null>,
  ): Promise<PaymentApiResponse<VerifyPaymentResponse>> => {
    try {
      const response = await apiClient.get<string | VerifyPaymentResponse>(
        `/payment/verify/${orderId}`,
        token,
        { onRefresh, skipSessionExpired: true },
      );

      if (!response) {
        return {
          success: false,
          error: "Empty response from verification endpoint.",
        };
      }

      const normalized: VerifyPaymentResponse =
        typeof response === "string" ? { status: response } : response;

      if (normalized.status !== "successful") {
        return {
          success: false,
          data: normalized,
          error: `Payment status is '${normalized.status || "unverified"}'. The transaction was not confirmed.`,
        };
      }

      return {
        success: true,
        data: normalized,
      };
    } catch (err: unknown) {
      console.error("[paymentApi.verifyPayment] Backend error:", err);
      const error = err instanceof Error ? err.message : undefined;
      return {
        success: false,
        error:
          error ||
          `Backend payment verification failed for reference ${orderId}.`,
      };
    }
  },
};
