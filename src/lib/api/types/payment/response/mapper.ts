import { 
    CartItemDto, 
    CartResponseDto,
    StudentProfileDto, 
    DeletedCartItemDto,

} from "@/lib/api/types/payment/response/types-dto";
import {
    CartItem, 
    CartResponse,
    StudentProfile, 
    DeletedCartItem,
} from "@/lib/api/types/payment/response/types";

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


export function toStudentProfile(dto: StudentProfileDto): StudentProfile {
    return {
        id: dto.id,
        fullName: dto.full_name,
        email: dto.email,
        classLevel: dto.class_level,
        classArm: dto.class_arm,
        schoolId: dto.school_id,
        schoolName: dto.school_name,
        roles: dto.roles,
        status: dto.status,
        googleId: dto.google_id,
        createdAt: dto.created_at
    }
}

function toDeletedCartItem(dto: DeletedCartItemDto): DeletedCartItem {
    return {
        productName: dto.product_name,
        productPrice: dto.product_price
    }
}

function toCartItem(dto: CartItemDto): CartItem {
    return {
        id: dto.id,
        cartId: dto.cart_id,
        productType: dto.product_type,
        productId: dto.product_id,
        productName: dto.product_name,
        productPrice: dto.product_price
    }
}

export function toCartResponse(dto: CartResponseDto): CartResponse {
    return {
        id: dto.id,
        total: dto.total,
        carts: dto.carts ? dto.carts.map(toCartItem) : null,
        invalidCarts: dto.invalid_carts ? dto.invalid_carts.map(toDeletedCartItem) : null
    }
}

