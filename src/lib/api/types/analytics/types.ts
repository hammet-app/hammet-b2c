import { AnalyticsEventName } from "./types-dto";

export type { AnalyticsEventName };

export type AnalyticsEventPayload = {
  eventName: AnalyticsEventName;
  domain: "main" | "b2b" | "b2c";
  userId?: string | null;
  anonymousId?: string | null;
  sessionId?: string | null;
  page: string;
  element?: string | null;
  variant?: string | null;
  properties?: Record<string, any> | null;
  deviceType?: string | null;
  referrer?: string | null;
};

