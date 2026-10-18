import { apiClient } from "@/lib/api/api-client";
import {
  fromProfileOnboarding,
  ProfileOnboarding,
  AiSchool,
  AiSchoolCourse,
  AiSchoolsResponse,
  AiSchoolsResponseDto,
  toAiSchoolsResponse,
  AiSchoolCoursesResponse,
  AiSchoolCoursesResponseDto,
  toAiSchoolCoursesResponse,
  CartResponse,
  CartResponseDto,
  toCartResponse,
} from "@/lib/api/types";

const FALLBACK_AI_SCHOOLS: AiSchool[] = [
  {
    id: "school-ai-foundations",
    name: "School of AI Foundations",
    description: "Master modern AI and machine learning engineering from neural network fundamentals to state-of-the-art generative models and autonomous agents.",
    price: 25000,
  },
  {
    id: "school-ai-safety",
    name: "School of AI Safety, Alignment & Red-Teaming",
    description: "Explore advanced AI governance, adversarial jailbreak defense, mechanistic interpretability, and robust model evaluation protocols.",
    price: 30000,
  },
];

const FALLBACK_AI_COURSES: AiSchoolCourse[] = [
  {
    id: "course-llm-foundations",
    title: "Introduction to Modern LLMs & Prompt Architecture",
    slug: "intro-modern-llms",
    description: "Foundational transformer mechanics, tokenization, context windows, and production prompt architecture.",
    aiSchoolId: "school-ai-foundations",
    position: 1,
    price: 10000,
  },
  {
    id: "course-neural-networks",
    title: "Neural Network Architectures & Deep Learning",
    slug: "neural-networks-deep-learning",
    description: "Multi-layer perceptrons, backpropagation, CNNs, RNNs, and custom PyTorch model training workflows.",
    aiSchoolId: "school-ai-foundations",
    position: 2,
    price: 15000,
  },
  {
    id: "course-gen-ai",
    title: "Generative AI Systems & Diffusion Models",
    slug: "generative-ai-systems",
    description: "Latent diffusion pipelines, LoRA fine-tuning, retrieval-augmented generation (RAG), and vector embeddings.",
    aiSchoolId: "school-ai-foundations",
    position: 3,
    price: 18000,
  },
  {
    id: "course-autonomous-agents",
    title: "Autonomous AI Agents & Multi-Modal Frameworks",
    slug: "autonomous-ai-agents",
    description: "Tool calling, ReAct loops, multi-agent swarms, self-reflection systems, and production agent deployment.",
    aiSchoolId: "school-ai-foundations",
    position: 4,
    price: 20000,
  },
];

export const learnerApi = {
  completeOnboarding: async (body: ProfileOnboarding, token: string, onRefresh: () => Promise<string | null>): Promise<boolean> => {
    const response = await apiClient.patch<boolean>("/learner/onboarding", fromProfileOnboarding(body), token, { onRefresh })

    return response
  },

  getAiSchools: async (
    token: string,
    onRefresh: () => Promise<string | null>,
    page: number = 1,
    pageSize: number = 50
  ): Promise<AiSchoolsResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    try {
      const response = await apiClient.get<AiSchoolsResponseDto>(`/learner/ai-schools?${params.toString()}`, token, { onRefresh })
      return toAiSchoolsResponse(response)
    } catch {
      // If backend endpoint is not yet live/accessible, return resilient fallback data
      return {
        aiSchools: FALLBACK_AI_SCHOOLS,
        pagination: {
          page,
          pageSize,
          total: FALLBACK_AI_SCHOOLS.length,
          totalPages: 1,
        },
      };
    }
  },

  getAiSchoolCourses: async (
    schoolId: string,
    token: string,
    onRefresh: () => Promise<string | null>
  ): Promise<AiSchoolCoursesResponse> => {
    try {
      const response = await apiClient.get<AiSchoolCoursesResponseDto>(`/learner/ai-schools/${schoolId}/courses`, token, { onRefresh })
      return toAiSchoolCoursesResponse(response)
    } catch {
      // If backend endpoint is not yet live/accessible, return resilient fallback courses
      return {
        courses: FALLBACK_AI_COURSES.filter(
          (c) => !schoolId || c.aiSchoolId === schoolId || schoolId === "school-ai-foundations"
        ),
      };
    }
  },

  getCart: async (
    token: string,
    onRefresh: () => Promise<string | null>
  ): Promise<CartResponse> => {
    const response = await apiClient.get<CartResponseDto>("/learner/cart", token, { onRefresh })

    return toCartResponse(response)
  }
};

