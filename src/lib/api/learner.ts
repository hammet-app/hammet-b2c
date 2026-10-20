import { apiClient } from "@/lib/api/api-client";
import {
  fromProfileOnboarding,
  ProfileOnboarding,
  AiSchoolsResponse,
  AiSchoolsResponseDto,
  toAiSchoolsResponse,
  AiSchoolCoursesResponse,
  AiSchoolCoursesResponseDto,
  toAiSchoolCoursesResponse,
  CartResponse,
  CartResponseDto,
  toCartResponse,
} from "@/lib/api/types";

export const learnerApi = {
  completeOnboarding: async (
    body: ProfileOnboarding,
    token: string,
    onRefresh: () => Promise<string | null>
  ): Promise<boolean> => {
    const response = await apiClient.patch<boolean>(
      "/learner/onboarding",
      fromProfileOnboarding(body),
      token,
      { onRefresh }
    );

    return response;
  },

  /**
   * Fetch list of active AI schools directly from backend API.
   * Throws on failure to transparently surface backend errors.
   */
  getAiSchools: async (
    token: string,
    onRefresh: () => Promise<string | null>,
    page: number = 1,
    pageSize: number = 50
  ): Promise<AiSchoolsResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });

    const response = await apiClient.get<AiSchoolsResponseDto>(
      `/learner/ai-schools?${params.toString()}`,
      token,
      { onRefresh, skipSessionExpired: true }
    );
    return toAiSchoolsResponse(response);
  },

  /**
   * Fetch courses for a specific AI school directly from backend API.
   * Throws on failure to transparently surface backend errors.
   */
  getAiSchoolCourses: async (
    schoolId: string,
    token: string,
    onRefresh: () => Promise<string | null>
  ): Promise<AiSchoolCoursesResponse> => {
    const response = await apiClient.get<AiSchoolCoursesResponseDto>(
      `/learner/ai-schools/${schoolId}/courses`,
      token,
      { onRefresh, skipSessionExpired: true }
    );
    return toAiSchoolCoursesResponse(response);
  },

  /**
   * Fetch learner cart from backend API contract.
   * Throws on failure to transparently surface backend errors.
   */
  getCart: async (
    token: string,
    onRefresh: () => Promise<string | null>
  ): Promise<CartResponse> => {
    const response = await apiClient.get<CartResponseDto>(
      "/learner/cart",
      token,
      { onRefresh, skipSessionExpired: true }
    );
    return toCartResponse(response);
  },
};
