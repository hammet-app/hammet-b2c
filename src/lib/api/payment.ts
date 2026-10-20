import { apiClient } from "@/lib/api/api-client";
import type { CartItem } from "@/lib/store/use-cart";

// ── OpenAPI Types (Strictly Matching Backend Schema) ──────────────────────────

export interface CheckoutItemDto {
  id: string;
  type: string;
  title: string;
  price: number;
  quantity?: number;
}

export interface CheckoutRequest {
  items: CheckoutItemDto[];
  amount: number;
  currency?: string;
  customer_email: string;
  customer_name?: string | null;
  reference: string;
  callback_url?: string | null;
}

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
  /**
   * Request an authorized Paystack checkout payment link from the backend.
   * Transparently surfaces backend validation or network errors.
   */
  createPaymentLink: async (
    payload: CreatePaymentLinkPayload,
    token?: string | null
  ): Promise<PaymentApiResponse<PaymentLinkData>> => {
    const reference = `TXN-HMT-${Math.floor(100000 + Math.random() * 900000)}`;
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    if (!payload.email) {
      return {
        success: false,
        error: "Learner email is required to initialize checkout.",
      };
    }

    try {
      const checkoutPayload: CheckoutRequest = {
        items: payload.items.map((i) => ({
          id: i.id,
          type: i.type,
          title: i.title,
          price: i.price,
          quantity: i.quantity || 1,
        })),
        amount: payload.amount,
        currency: payload.currency || "NGN",
        customer_email: payload.email,
        customer_name: payload.customerName || null,
        reference,
        callback_url:
          payload.callbackUrl ||
          `${typeof window !== "undefined" ? window.location.origin : ""}/learner/checkout/callback`,
      };

      const response = await apiClient.post<CheckoutResponse>(
        "/learner/checkout",
        checkoutPayload,
        token,
        { skipSessionExpired: true }
      );

      const url =
        response?.authorization_url ||
        (response as any)?.data?.authorization_url ||
        "";

      const finalRef =
        response?.reference ||
        (response as any)?.data?.reference ||
        reference;

      if (!url) {
        return {
          success: false,
          error:
            "The backend did not return a valid Paystack authorization URL. Please contact support.",
        };
      }

      return {
        success: true,
        data: {
          paymentUrl: url,
          reference: finalRef,
          amount: payload.amount,
          currency: payload.currency || "NGN",
          expiresAt,
          provider: "paystack",
        },
      };
    } catch (err: any) {
      console.error("[paymentApi.createPaymentLink] Backend error:", err);
      return {
        success: false,
        error:
          err?.message ||
          "Failed to connect to backend checkout service. Please check your network and try again.",
      };
    }
  },

  /**
   * Verify transaction settlement status with backend ledger.
   * Surfaces failure transparently if the payment is unverified or declined.
   */
  verifyPayment: async (
    reference: string,
    token?: string | null
  ): Promise<PaymentApiResponse<VerifyPaymentResponse>> => {
    try {
      const response = await apiClient.get<VerifyPaymentResponse>(
        `/learner/payment/verify/${reference}`,
        token,
        { skipSessionExpired: true }
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
