

export type InterestDto =
  | "generative_ai"
  | "ai_agents"
  | "automation"
  | "machine_learning"
  | "programming"
  | "data_analytics"
  | "ai_business";

export type ProfileOnboardingDto = {
  learning_mode: "focus" | "guided";
  interests: InterestDto[];
};

export type BackendProductTypeDto = "course" | "profile" | "ai_school";

export interface AddToCartRequestDto {
  product_type: BackendProductTypeDto;
  product_id: string;
}

export interface CheckoutItemRequestDto {
  id: string;
  type: string;
  title: string;
  price: number;
  quantity?: number;
}

export interface CheckoutRequestDto {
  items: CheckoutItemRequestDto[];
  amount: number;
  currency?: string;
  customer_email: string;
  customer_name?: string | null;
  reference: string;
  callback_url?: string | null;
}

