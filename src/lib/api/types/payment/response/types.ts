// ============================================================
// GET /students/me
// ============================================================

import { BackendProductType } from "../request/types";

export type StudentProfile = {
  id: string;
  fullName: string;
  email: string;
  classLevel: string; // e.g. "SSS1"
  classArm: string; // e.g. "A"
  schoolId: string;
  schoolName: string; // denormalised for display
  roles: string[]; // always ["student"]
  status: "pending" | "active" | "suspended";
  googleId: string | null;
  createdAt: string; // ISO 8601
};

export type CartItemResponse = {
  id: string;
  cartId: string;
  productType: string;
  productId: string;
  productName: string;
  productPrice: number;
};

export type CartResponse = {
  id: string;
  total: number;
  carts: CartItemResponse[] | null;
  invalidCarts: DeletedCartItem[] | null;
};

export type CartItem = {
  productType: string;
  productId: string;
};

export interface DeletedCartItem {
  productName: string;
  productPrice: number;
}

export interface OrderItem {
  productId: string;
  productType: BackendProductType;
  productName: string;
  productPrice: number;
}

export interface OrderResponse {
  id: string;
  total: number;
  subtotal: number;
  invalid: DeletedCartItem[] | null;
  orders: OrderItem[] | null;
}
