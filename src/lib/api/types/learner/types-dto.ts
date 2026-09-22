

export type InterestDto =
  | "generative_ai"
  | "ai_agents"
  | "automation"
  | "machine_learning"
  | "programming"
  | "data_analytics"
  | "ai_business";

export type ProfileOnboardingDto = {
  learning_mode: "focus" | "guided"
  interests: InterestDto[]
}

// ============================================================
// GET /students/me
// ============================================================

export type StudentProfileDto = {
  id: string;
  full_name: string;
  email: string;
  class_level: string;       // e.g. "SSS1"
  class_arm: string;         // e.g. "A"
  school_id: string;
  school_name: string;       // denormalised for display
  roles: string[];           // always ["student"]
  status: "pending" | "active" | "suspended";
  google_id: string | null;
  has_pin_set: boolean;      // frontend uses this to know whether to prompt PIN setup
  created_at: string;        // ISO 8601
};