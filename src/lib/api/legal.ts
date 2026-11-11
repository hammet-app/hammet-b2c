import { apiClient } from "@/lib/api/api-client";
import {
  fromCookieConsentRequest,
  toPublicLegalDocument,
  type CookieConsentRequest,
  type PublicLegalDocument,
  type PublicLegalDocumentDto,
  type PublicLegalDocumentType,
} from "@/lib/api/types/legal";

export const legalApi = {
  async getPublishedDocument(
    documentType: PublicLegalDocumentType,
    domain: "b2b" | "b2c" = "b2c",
  ): Promise<PublicLegalDocument> {
    const query = new URLSearchParams({ domain });
    const dto = await apiClient.get<PublicLegalDocumentDto>(
      `/legal/${documentType}?${query.toString()}`,
    );
    return toPublicLegalDocument(dto);
  },

  async saveCookieConsent(
    payload: CookieConsentRequest,
    token?: string | null,
  ): Promise<boolean> {
    return apiClient.post<boolean>(
      "/legal/consent",
      fromCookieConsentRequest(payload),
      token,
    );
  },
};
