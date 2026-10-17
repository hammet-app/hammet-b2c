
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
