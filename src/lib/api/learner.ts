import { apiClient } from "@/lib/api/api-client";
import {
  fromProfileOnboarding,
  ProfileOnboarding,
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
import {
  EntitlementResponse,
  EntitlementResponseDto,
  PublishedCourse,
  PublishedCourseDto,
  toEntitlementResponse,
  toPublishedCourse,
  LearnerQuiz,
  LearnerQuizResponseDto,
  toLearnerQuiz,
  QuizAttempt,
  QuizAttemptResponseDto,
  toQuizAttempt,
  SaveQuizAnswerDto,
  CourseModuleProject,
  CourseModuleProjectDto,
  toCourseModuleProject,
  ProjectSubmission,
  ProjectSubmissionCreateDto,
  ProjectSubmissionResponseDto,
  toProjectSubmission,
} from "./types/learner";

export const learnerApi = {
  completeOnboarding: async (
    body: ProfileOnboarding,
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<boolean> => {
    const response = await apiClient.patch<boolean>(
      "/learner/onboarding",
      fromProfileOnboarding(body),
      token,
      { onRefresh },
    );

    return response;
  },

  /**
   * Fetch list of active AI schools directly from backend API.
   * Throws on failure to transparently surface backend errors.
   */
  getAiSchools: async (
    token: string,
    onRefresh: () => Promise<string | null>,
    page: number = 1,
    pageSize: number = 50,
  ): Promise<AiSchoolsResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });

    const response = await apiClient.get<AiSchoolsResponseDto>(
      `/learner/ai-schools?${params.toString()}`,
      token,
      { onRefresh, skipSessionExpired: true },
    );
    return toAiSchoolsResponse(response);
  },

  /**
   * Fetch courses for a specific AI school directly from backend API.
   * Throws on failure to transparently surface backend errors.
   */
  getAiSchoolCourses: async (
    schoolId: string,
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<AiSchoolCoursesResponse> => {
    const response = await apiClient.get<AiSchoolCoursesResponseDto>(
      `/learner/ai-schools/${schoolId}/courses`,
      token,
      { onRefresh, skipSessionExpired: true },
    );
    return toAiSchoolCoursesResponse(response);
  },

  /** Fetch a given course */
  getCourse: async (
    courseId: string,
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<PublishedCourse> => {
    const response = await apiClient.get<PublishedCourseDto>(
      `/learner/courses/${courseId}`,
      token,
      { onRefresh, skipSessionExpired: true },
    );

    return toPublishedCourse(response);
  },

  /**
   * Fetch learner cart from backend API contract.
   * Throws on failure to transparently surface backend errors.
   */
  getCart: async (
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<CartResponse> => {
    const response = await apiClient.get<CartResponseDto>(
      "/learner/cart",
      token,
      { onRefresh, skipSessionExpired: true },
    );
    return toCartResponse(response);
  },

  /**
   * Fetches the ai_schools and courses a learner is entitled to.
   */
  getEntitlements: async (
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<EntitlementResponse> => {
    const response = await apiClient.get<EntitlementResponseDto>(
      "/learner/entitlements",
      token,
      { onRefresh },
    );

    return toEntitlementResponse(response);
  },
  /**
   * Fetches the quiz questions and answer options for a published module.
   * GET /api/v1/learner/modules/{module_id}/quiz
   * Learner-authenticated route. The backend omits is_correct so learners
   * cannot see the answers before submitting.
   */
  getModuleQuiz: async (
    moduleId: string,
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<LearnerQuiz> => {
    const response = await apiClient.get<LearnerQuizResponseDto>(
      `/learner/modules/${encodeURIComponent(moduleId)}/quiz`,
      token,
      { onRefresh, skipSessionExpired: true },
    );

    return toLearnerQuiz(response);
  },
  /**
   * Starts a quiz attempt session for the authenticated learner.
   * POST /api/v1/learner/quizzes/{quiz_id}/attempts
   */
  startQuizAttempt: async (
    quizId: string,
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<QuizAttempt> => {
    const response = await apiClient.post<QuizAttemptResponseDto>(
      `/learner/quizzes/${encodeURIComponent(quizId)}/attempts`,
      undefined,
      token,
      { onRefresh, skipSessionExpired: true },
    );

    return toQuizAttempt(response);
  },

  /**
   * Saves the learner's selected option for a quiz question.
   * Repeating this request replaces that question's previous answer.
   * PUT /api/v1/learner/quiz-attempts/{attempt_id}/answers/{question_id}
   */
  saveQuizAnswer: async (
    attemptId: string,
    questionId: string,
    optionId: string,
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<void> => {
    await apiClient.put<void>(
      `/learner/quiz-attempts/${encodeURIComponent(attemptId)}/answers/${encodeURIComponent(questionId)}`,
      { option_id: optionId } satisfies SaveQuizAnswerDto,
      token,
      { onRefresh, skipSessionExpired: true },
    );
  },

  /**
   * Marks the learner's attempt as submitted.
   * POST /api/v1/learner/quiz-attempts/{attempt_id}/submit
   */
  submitQuizAttempt: async (
    attemptId: string,
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<void> => {
    await apiClient.post<void>(
      `/learner/quiz-attempts/${encodeURIComponent(attemptId)}/submit`,
      undefined,
      token,
      { onRefresh, skipSessionExpired: true },
    );
  },

  /**
   * Retrieves the first project by position for a published module.
   * GET /api/v1/learner/modules/{module_id}/project
   */
  getModuleProject: async (
    moduleId: string,
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<CourseModuleProject> => {
    const response = await apiClient.get<CourseModuleProjectDto>(
      `/learner/modules/${encodeURIComponent(moduleId)}/project`,
      token,
      { onRefresh, skipSessionExpired: true },
    );

    return toCourseModuleProject(response);
  },

  /**
   * Validates and records an external project link for the learner.
   * POST /api/v1/learner/projects/{project_id}/submissions
   */
  submitProject: async (
    projectId: string,
    link: string,
    token: string,
    onRefresh: () => Promise<string | null>,
  ): Promise<ProjectSubmission> => {
    const response = await apiClient.post<ProjectSubmissionResponseDto>(
      `/learner/projects/${encodeURIComponent(projectId)}/submissions`,
      { link } satisfies ProjectSubmissionCreateDto,
      token,
      { onRefresh, skipSessionExpired: true },
    );

    return toProjectSubmission(response);
  },
  /**
   * Enroll in a given course
   */
  enrollCourse: async(
    courseId: string,
    token: string,
    onRefresh: () => Promise<string | null>,
  ) => {
    await apiClient.post(
      `/learner/enrollment/${encodeURIComponent(courseId)}`,
      undefined,
      token,
      { onRefresh, skipSessionExpired: true },
    );
  },
};
