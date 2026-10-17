
// ============================================================
// GET /students/me
// ============================================================

export type StudentProfile = {
  id: string;
  fullName: string;
  email: string;
  classLevel: string;       // e.g. "SSS1"
  classArm: string;         // e.g. "A"
  schoolId: string;
  schoolName: string;       // denormalised for display
  roles: string[];           // always ["student"]
  status: "pending" | "active" | "suspended";
  googleId: string | null;
  createdAt: string;        // ISO 8601
};


export type CartItem = {
  id: string;
  cartId: string;
  productType: string;
  productId: string;
  productName: string;
  productPrice: number;
}

export type DeletedCartItem = {
  productName: string;
  productPrice: string;
}

export type CartResponse = {
  id: string;
  total: number;
  carts: CartItem[] | null;
  invalidCarts: DeletedCartItem[] | null
}