import { track } from "@vercel/analytics";

export type GloriaAnalyticsEvent =
  | "gloria_school_created"
  | "gloria_school_create_failed"
  | "gloria_course_created"
  | "gloria_course_create_failed"
  | "gloria_modules_created"
  | "gloria_resources_created"
  | "gloria_quiz_created"
  | "gloria_quiz_create_failed"
  | "gloria_payment_success"
  | "gloria_payment_failed";

export function trackGloriaEvent(
  event: GloriaAnalyticsEvent,
  properties: Record<string, string | number | boolean | null> = {}
): void {
  if (process.env.NEXT_PUBLIC_GLORIA_PAYMENT_ANALYTICS !== "true") {
    return;
  }

  void track(event, properties);
}
