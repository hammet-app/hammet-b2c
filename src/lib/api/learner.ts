import { apiClient } from "@/lib/api/api-client";
import {

  fromProfileOnboarding,
  ProfileOnboarding,

} from "@/lib/api/types";

export const learnerApi = {
  completeOnboarding: async (body: ProfileOnboarding, token: string, onRefresh: () => Promise<string | null>): Promise<boolean> =>{
    const response = await apiClient.patch<boolean>("/learner/onboarding", fromProfileOnboarding(body), token, { onRefresh })

    return response
  },
};

