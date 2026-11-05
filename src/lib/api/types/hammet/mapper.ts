import {
    RegisterHammetAdminRequest,
    HammetAdmin,
    HammetAdminsResponse,
    EditHammetAdminRequest,
} from "@/lib/api/types/hammet/types";
import {
    RegisterHammetAdminRequestDto,
    HammetAdminDto,
    HammetAdminsResponseDto,
    EditHammetAdminRequestDto,
} from "@/lib/api/types/hammet/types-dto";
import { toPagination } from "../support";
import type { Coupon, CouponsResponse, CreateCouponRequest, EditCouponRequest } from "@/lib/api/types/hammet/types";
import type { CouponDto, CouponsResponseDto, CreateCouponRequestDto, EditCouponRequestDto } from "@/lib/api/types/hammet/types-dto";

/**
 * Naming convention:
 *
 * fromXxx(...)
 * Converts frontend/domain models into backend DTOs
 * (camelCase -> snake_case, app shape -> API shape)
 *
 * toXxx(...)
 * Converts backend DTOs into frontend/domain models
 * (snake_case -> camelCase, API shape -> app shape)
 */

export function fromRegisterHammetAdminRequest(model: RegisterHammetAdminRequest): RegisterHammetAdminRequestDto {
    return {
        full_name: model.fullName,
        email: model.email,
        username: model.username,
        scope: model.scope,
        access: model.access
    }
}

export function toHammetAdmin(dto: HammetAdminDto): HammetAdmin {
    return {
        id: dto.id,
        fullName: dto.full_name,
        email: dto.email,
        role: dto.role,
        scope: dto.scope,
        access: dto.access,
        status: dto.status,
        createdAt: dto.created_at,
    }
}

export function toHammetAdminsResponse(dto: HammetAdminsResponseDto): HammetAdminsResponse {
    return {
        admins: dto.admins.map(toHammetAdmin),
        pagination: toPagination(dto.pagination),
    }
}

// The backend rejects unknown fields, so only the fields that are set are sent.
export function fromEditHammetAdminRequest(model: EditHammetAdminRequest): EditHammetAdminRequestDto {
    const dto: EditHammetAdminRequestDto = {}
    if (model.scope !== undefined) dto.scope = model.scope
    if (model.access !== undefined) dto.access = model.access
    return dto
}

export function toCoupon(dto: CouponDto): Coupon {
    return {
        id: dto.id, code: dto.code, description: dto.description,
        discountType: dto.discount_type, discountValue: Number(dto.discount_value),
        currency: dto.currency,
        maxDiscountAmount: dto.max_discount_amount === null ? null : Number(dto.max_discount_amount),
        minPurchaseAmount: dto.min_purchase_amount === null ? null : Number(dto.min_purchase_amount),
        startsAt: dto.starts_at, expiresAt: dto.expires_at,
        usageLimit: dto.usage_limit, usageLimitPerUser: dto.usage_limit_per_user,
        usedCount: dto.used_count, appliesToAllProducts: dto.applies_to_all_products,
        status: dto.status,
        products: dto.products?.map((product) => ({
            couponId: product.coupon_id, productType: product.product_type, productId: product.product_id,
        })) ?? null,
    };
}

export function toCouponsResponse(dto: CouponsResponseDto): CouponsResponse {
    return { coupons: dto.coupons.map(toCoupon), pagination: toPagination(dto.pagination) };
}

export function fromCreateCouponRequest(model: CreateCouponRequest): CreateCouponRequestDto {
    return {
        code: model.code, description: model.description,
        discount_type: model.discountType, discount_value: model.discountValue,
        currency: model.currency, max_discount_amount: model.maxDiscountAmount,
        min_purchase_amount: model.minPurchaseAmount, starts_at: model.startsAt,
        expires_at: model.expiresAt, usage_limit: model.usageLimit,
        usage_limit_per_user: model.usageLimitPerUser,
        applies_to_all_products: true, products: null,
    };
}

export function fromEditCouponRequest(model: EditCouponRequest): EditCouponRequestDto {
    const dto: EditCouponRequestDto = { activate: model.activate };
    if (model.expiresAt !== undefined) dto.expires_at = model.expiresAt;
    return dto;
}
