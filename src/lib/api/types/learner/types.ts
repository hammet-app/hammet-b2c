
export type Interest =
  | "generative_ai"
  | "ai_agents"
  | "automation"
  | "machine_learning"
  | "programming"
  | "data_analytics"
  | "ai_business";

export type ProfileOnboarding = {
  learningMode: "focus" | "guided"
  interests: Interest[]
}


// ============================================================
// GET /students/me
// ============================================================

export type StudentProfile = {
  id: string;
  fullName: string;
  email: string;
  classLevel: string;       // e.g. "SSS1"
  classArm: string;         // e.g. "A"
  schoolId: string;
  schoolName: string;       // denormalised for display
  roles: string[];           // always ["student"]
  status: "pending" | "active" | "suspended";
  googleId: string | null;
  hasPinSet: boolean;      // frontend uses this to know whether to prompt PIN setup
  createdAt: string;        // ISO 8601
};
