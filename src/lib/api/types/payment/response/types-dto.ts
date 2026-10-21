// ============================================================
// GET /students/me
// ============================================================

import { BackendProductTypeDto } from "../request/types-dto";

export type StudentProfileDto = {
  id: string;
  full_name: string;
  email: string;
  class_level: string; // e.g. "SSS1"
  class_arm: string; // e.g. "A"
  school_id: string;
  school_name: string; // denormalised for display
  roles: string[]; // always ["student"]
  status: "pending" | "active" | "suspended";
  google_id: string | null;
  has_pin_set: boolean; // frontend uses this to know whether to prompt PIN setup
  created_at: string; // ISO 8601
};

export type CartItemResponseDto = {
  id: string;
  cart_id: string;
  product_type: string;
  product_id: string;
  product_name: string;
  product_price: number;
};

export type DeletedCartItemDto = {
  product_name: string;
  product_price: number;
};

export type CartResponseDto = {
  id: string;
  total: number;
  carts: CartItemResponseDto[] | null;
  invalid_carts: DeletedCartItemDto[] | null;
};

export type CartItemDto = {
  product_type: string;
  product_id: string;
};

export interface OrderItemDto {
  product_id: string;
  product_type: BackendProductTypeDto;
  product_name: string;
  product_price: number;
}

export interface OrderResponseDto {
  id: string;
  total: number;
  subtotal: number;
  invalid: DeletedCartItemDto[] | null;
  orders: OrderItemDto[] | null;
}
