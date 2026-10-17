

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

