export type AnalyticsEventName = 
  // Acquisition
  | "landing_page_viewed"
  | "signup_started"
  | "signup_completed"
  | "login_started"
  | "login_completed"
  // Onboarding
  | "onboarding_started"
  | "onboarding_step_completed"
  | "onboarding_completed"
  // Learning
  | "course_viewed"
  | "course_started"
  | "lesson_started"
  | "lesson_completed"
  | "activity_started"
  | "activity_completed"
  | "quiz_attempted"
  // Payment/Commerce
  | "checkout_started"
  | "payment_started"
  | "payment_completed"
  | "payment_failed"
  // UI/UX
  | "cta_clicked"
  | "navigation_clicked"
  | "dashboard_action_clicked";

export type AnalyticsEventPayloadDto = {
  event_name: AnalyticsEventName;
  domain: string;
  user_id?: string | null;
  anonymous_id?: string | null;
  session_id?: string | null;
  page: string;
  element?: string | null;
  variant?: string | null;
  properties?: Record<string, any> | null;
  device_type?: string | null;
  referrer?: string | null;
};

