
export type Interest =
  | "generative_ai"
  | "ai_agents"
  | "automation"
  | "machine_learning"
  | "programming"
  | "data_analytics"
  | "ai_business";

export type ProfileOnboarding = {
  learningMode: "focus" | "guided";
  interests: Interest[];
};

export type BackendProductType = "course" | "profile" | "ai_school";

export interface AddToCartRequest {
  productType: BackendProductType;
  productId: string;
}

export interface CheckoutItemRequest {
  id: string;
  type: string;
  title: string;
  price: number;
  quantity?: number;
}

export interface CheckoutRequest {
  items: CheckoutItemRequest[];
  amount: number;
  currency?: string;
  customerEmail: string;
  customerName?: string | null;
  reference: string;
  callbackUrl?: string | null;
}
