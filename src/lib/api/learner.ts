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
  completeOnboarding: async (body: ProfileOnboarding, token: string, onRefresh: () => Promise<string | null>): Promise<boolean> => {
    const response = await apiClient.patch<boolean>("/learner/onboarding", fromProfileOnboarding(body), token, { onRefresh })

    return response
  },

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
    const response = await apiClient.get<AiSchoolsResponseDto>(`/learner/ai-schools??${params.toString()}`, token, { onRefresh })

    return toAiSchoolsResponse(response)
  },

  getAiSchoolCourses: async (
    schoolId: string,
    token: string,
    onRefresh: () => Promise<string | null>
  ): Promise<AiSchoolCoursesResponse> => {
    const response = await apiClient.get<AiSchoolCoursesResponseDto>(`/learner/ai-schools/${schoolId}/courses`, token, { onRefresh })
    return toAiSchoolCoursesResponse(response)
  },

  getCart: async (
    token: string,
    onRefresh: () => Promise<string | null>
  ): Promise<CartResponse> => {
    const response = await apiClient.get<CartResponseDto>("/learner/cart", token, { onRefresh })

    return toCartResponse(response)
  }
};

