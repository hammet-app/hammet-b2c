import {
    ClaimAccountResponseDto,
    forgotPasswordResponseDto,
    SessionDetailsDto,
    SchoolDetailsDto,
    ProfileDetailsDto,
    InviteInfoDto,
    LoginResponseDto,
    RefreshResponseDto
} from "@/lib/api/types/auth/response/types-dto";
import {
    ClaimAccountResponse,
    InviteInfo,
    LoginResponse,
    RefreshResponse,
    SessionDetails,
    ProfileDetails,
    SchoolDetails
} from "@/lib/api/types/auth/response/types";

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

type UserDto = LoginResponseDto["user"]
type User = LoginResponse["user"]

function toSessionDetails(dto: SessionDetailsDto): SessionDetails {
    return {
        country: dto.country,
        city: dto.city
    }
}

function toSchoolDetails(dto: SchoolDetailsDto): SchoolDetails {
    return {
        schoolId: dto.school_id,
        cookieConsent: dto.cookie_consent,
        cookiePolicyVersion: dto.cookie_policy_version,
        classArm: dto.class_arm,
        classLevel: dto.class_level,
        term: dto.term
    }
}

function toProfileDetails(dto: ProfileDetailsDto): ProfileDetails {
    return {
        learningMode: dto.learning_mode,
        tier: dto.tier
    }
}

function toUser(dto: UserDto): User {
    return {
        id: dto.id,
        fullName: dto.full_name,
        email: dto.email,
        username: dto.username,
        role: dto.role,
        scope: dto.scope,
        access: dto.access,
        schoolDetails: dto.school_details ? toSchoolDetails(dto.school_details) : null,
        profileDetails: dto.profile_details ? toProfileDetails(dto.profile_details) : null,
        sessionDetails: dto.session_details ? toSessionDetails(dto.session_details) : null
    }
}

export function toInviteInfo(dto: InviteInfoDto): InviteInfo {
    return {
        fullName: dto.full_name,
        email: dto.email,
        role: dto.role
    }
}


export function toLoginResponse(dto: LoginResponseDto): LoginResponse {
    return {
        accessToken: dto.access_token,
        user: toUser(dto.user)
    }
}

export function toClaimAccountResponse(dto: ClaimAccountResponseDto): ClaimAccountResponse {
    return {
        accessToken: dto.access_token,
        user: toUser(dto.user)
    }
}

export function toRefreshResponse(dto: RefreshResponseDto): RefreshResponse {
    return {
        accessToken: dto.access_token,
        user: toUser(dto.user)
    }
}

export function toForgotPasswordResponse(dto: forgotPasswordResponseDto) {
    return {
        isAdmin: dto.is_admin
    }
}