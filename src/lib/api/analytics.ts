import { apiClient } from "@/lib/api/api-client";
import { AnalyticsEventPayload, fromAnalyticsEventPayload } from "@/lib/api/types/analytics";

export const analyticsApi = {
  /**
   * Tracks an event on the backend
   */
  trackEvent: async (
    payload: AnalyticsEventPayload,
    token?: string | null,
    onRefresh?: () => Promise<string | null>
  ): Promise<boolean> => {
    // We send a POST to /analytics
    // Return true on success.
    await apiClient.post<any>(
      "/analytics",
      fromAnalyticsEventPayload(payload),
      token,
      { onRefresh }
    );
    return true;
  },
};

