import { 
    ProfileOnboardingDto,
    AddToCartRequestDto,
    CheckoutRequestDto,
} from "@/lib/api/types/payment/request/types-dto";
import {
    ProfileOnboarding,
    AddToCartRequest,
    CheckoutRequest,
} from "@/lib/api/types/payment/request/types";

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
export function fromProfileOnboarding(model: ProfileOnboarding): ProfileOnboardingDto {
    return {
        learning_mode: model.learningMode,
        interests: model.interests
    }
}

export function fromAddToCartRequest(model: AddToCartRequest): AddToCartRequestDto {
    return {
        product_type: model.productType,
        product_id: model.productId,
    };
}

export function fromCheckoutRequest(model: CheckoutRequest): CheckoutRequestDto {
    return {
        items: model.items.map((i) => ({
            id: i.id,
            type: i.type,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
        })),
        amount: model.amount,
        currency: model.currency,
        customer_email: model.customerEmail,
        customer_name: model.customerName,
        reference: model.reference,
        callback_url: model.callbackUrl,
    };
}