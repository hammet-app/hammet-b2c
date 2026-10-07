import { AnalyticsEventPayload } from "./types";
import { AnalyticsEventPayloadDto } from "./types-dto";

export function fromAnalyticsEventPayload(payload: AnalyticsEventPayload): AnalyticsEventPayloadDto {
  return {
    event_name: payload.eventName,
    domain: payload.domain,
    user_id: payload.userId,
    anonymous_id: payload.anonymousId,
    session_id: payload.sessionId,
    page: payload.page,
    element: payload.element,
    variant: payload.variant,
    properties: payload.properties,
    device_type: payload.deviceType,
    referrer: payload.referrer,
  };
}

