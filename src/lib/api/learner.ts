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
} from "@/lib/api/types";

export const learnerApi = {
  completeOnboarding: async (body: ProfileOnboarding, token: string, onRefresh: () => Promise<string | null>): Promise<boolean> =>{
    const response = await apiClient.patch<boolean>("/learner/onboarding", fromProfileOnboarding(body), token, { onRefresh })

    return response
  },

  getAiSchools: async (
    token: string,
    onRefresh: () => Promise<string | null>,
    page: number = 1,
    pageSize: number = 50
  ): Promise<AiSchoolsResponse> => {
    return {
      aiSchools: [
        { id: "school-1", name: "School of AI foundation", description: "Learn the basics of AI", price: 25000 },
      ],
      pagination: { page: 1, pageSize: 50, total: 1, totalPages: 1 }
    };
  },

  getAiSchoolCourses: async (
    schoolId: string,
    token: string,
    onRefresh: () => Promise<string | null>
  ): Promise<AiSchoolCoursesResponse> => {
    return {
      courses: [
        { id: "course-1", title: "Introduction to AI", slug: "intro-to-ai", description: "Learn the foundational principles of Artificial Intelligence.", price: 10000, aiSchoolId: schoolId, position: 1 },
      ]
    };
  },
};

