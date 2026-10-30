import { UserAccess, UserRole, UserScope } from "@/lib/utils/roles";
import { Pagination, PaginationDto } from "../support";

export type RegisterHammetAdminRequest = {
  fullName: string;
  email: string;
  username: string;
  scope: UserScope;
  access: UserAccess[] | null;
}

// GET /hammet/admins
export type HammetAdmin = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  scope: UserScope;
  access: UserAccess[] | null;
  status: string;
  createdAt: string;
}

export type HammetAdminsResponse = {
  admins: HammetAdmin[];
  pagination: Pagination;
}

export type GetHammetAdminsParams = {
  page?: number;
  pageSize?: number;
  scope?: UserScope | null;
  access?: UserAccess | null;
  search?: string | null;
}

// PATCH /hammet/admins/{admin_id}
// Leave a field out to keep its current value.
export type EditHammetAdminRequest = {
  scope?: UserScope | null;
  access?: UserAccess[] | null;
}

export type CouponProduct = {
  couponId: string;
  productType: string;
  productId: string;
};

export type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discountType: "FIXED" | "PERCENTAGE";
  discountValue: number;
  currency: string | null;
  maxDiscountAmount: number | null;
  minPurchaseAmount: number | null;
  startsAt: string | null;
  expiresAt: string | null;
  usageLimit: number | null;
  usageLimitPerUser: number;
  usedCount: number;
  appliesToAllProducts: boolean;
  status: string;
  products: CouponProduct[] | null;
};

export type CouponsResponse = {
  coupons: Coupon[];
  pagination: Pagination;
};

export type CreateCouponRequest = {
  code: string;
  description: string | null;
  discountType: "FIXED" | "PERCENTAGE";
  discountValue: string;
  currency: string | null;
  maxDiscountAmount: string | null;
  minPurchaseAmount: string | null;
  startsAt: string | null;
  expiresAt: string | null;
  usageLimit: number | null;
  usageLimitPerUser: number;
};

export type EditCouponRequest = {
  activate: boolean;
  expiresAt?: string | null;
};
