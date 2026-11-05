// GET /hammet/schools

import { UserAccess, UserRole, UserScope } from "@/lib/utils/roles";
import { PaginationDto } from "../support";

export type RegisterHammetAdminRequestDto = {
  full_name: string;
  email: string;
  username: string;
  scope: UserScope;
  access: UserAccess[] | null;
}

// GET /hammet/admins
export type HammetAdminDto = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  scope: UserScope;
  access: UserAccess[] | null;
  status: string;
  created_at: string;
}

export type HammetAdminsResponseDto = {
  admins: HammetAdminDto[];
  pagination: PaginationDto;
}

// PATCH /hammet/admins/{admin_id}
export type EditHammetAdminRequestDto = {
  scope?: UserScope | null;
  access?: UserAccess[] | null;
}

export type CouponProductDto = {
  coupon_id: string;
  product_type: string;
  product_id: string;
};

export type CouponDto = {
  id: string;
  code: string;
  description: string | null;
  discount_type: "FIXED" | "PERCENTAGE";
  discount_value: string | number;
  currency: string | null;
  max_discount_amount: string | number | null;
  min_purchase_amount: string | number | null;
  starts_at: string | null;
  expires_at: string | null;
  usage_limit: number | null;
  usage_limit_per_user: number;
  used_count: number;
  applies_to_all_products: boolean;
  status: string;
  products: CouponProductDto[] | null;
};

export type CouponsResponseDto = {
  coupons: CouponDto[];
  pagination: PaginationDto;
};

export type CreateCouponRequestDto = {
  code: string;
  description: string | null;
  discount_type: "FIXED" | "PERCENTAGE";
  discount_value: string;
  currency: string | null;
  max_discount_amount: string | null;
  min_purchase_amount: string | null;
  starts_at: string | null;
  expires_at: string | null;
  usage_limit: number | null;
  usage_limit_per_user: number;
  applies_to_all_products: boolean;
  products: null;
};

export type EditCouponRequestDto = {
  activate: boolean;
  expires_at?: string | null;
};
