export type PublicLegalDocumentType =
  | "cookie_policy"
  | "privacy_policy"
  | "terms_and_conditions";

export type PublicLegalDocumentDto = {
  id: string;
  document_type: PublicLegalDocumentType;
  domain: "b2b" | "b2c";
  variation: string | null;
  version: number;
  content: string;
  updated_at: string;
};

export type PublicLegalDocument = {
  id: string;
  documentType: PublicLegalDocumentType;
  domain: "b2b" | "b2c";
  variation: string | null;
  version: number;
  content: string;
  updatedAt: string;
};

export type CookieConsentRequest = {
  anonymousId: string;
  cookiePolicyVersion: string;
  privacyPolicyVersion: string;
  analyticsConsent: boolean;
};

export type CookieConsentRequestDto = {
  anonymous_id: string;
  cookie_policy_version: string;
  privacy_policy_version: string;
  analytics_consent: boolean;
};

export function toPublicLegalDocument(dto: PublicLegalDocumentDto): PublicLegalDocument {
  return {
    id: dto.id,
    documentType: dto.document_type,
    domain: dto.domain,
    variation: dto.variation,
    version: dto.version,
    content: dto.content,
    updatedAt: dto.updated_at,
  };
}

export function fromCookieConsentRequest(
  payload: CookieConsentRequest,
): CookieConsentRequestDto {
  return {
    anonymous_id: payload.anonymousId,
    cookie_policy_version: payload.cookiePolicyVersion,
    privacy_policy_version: payload.privacyPolicyVersion,
    analytics_consent: payload.analyticsConsent,
  };
}
