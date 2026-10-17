
// ============================================================
// GET /students/me
// ============================================================

export type StudentProfileDto = {
  id: string;
  full_name: string;
  email: string;
  class_level: string;       // e.g. "SSS1"
  class_arm: string;         // e.g. "A"
  school_id: string;
  school_name: string;       // denormalised for display
  roles: string[];           // always ["student"]
  status: "pending" | "active" | "suspended";
  google_id: string | null;
  has_pin_set: boolean;      // frontend uses this to know whether to prompt PIN setup
  created_at: string;        // ISO 8601
};

export type CartItemDto = {
  id: string;
  cart_id: string;
  product_type: string;
  product_id: string;
  product_name: string;
  product_price: number;
}

export type DeletedCartItemDto = {
  product_name: string;
  product_price: string;
}

export type CartResponseDto = {
  id: string;
  total: number;
  carts: CartItemDto[] | null;
  invalid_carts: DeletedCartItemDto[] | null
}