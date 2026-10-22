import { apiClient } from "@/lib/api/api-client";
import {
  type RegisterHammetAdminRequest,
  type CreateAiSchoolRequest,
  type CreateAiSchoolResponse,
  type CreateAiSchoolResponseDto,
  type CreateAiCourseRequest,
  type CreateAiCourseResponse,
  type CreateAiCourseResponseDto,
  type UpdateAiSchoolRequest,
  type UpdateAiSchoolResponse,
  type UpdateAiSchoolResponseDto,
  type AiSchool,
  type AiSchoolsResponseDto,
  fromUpdateAiSchoolRequest,
  toUpdateAiSchoolResponse,
  type HammetAiSchoolCoursesResponse,
  type HammetAiSchoolCoursesResponseDto,
  toHammetAiSchoolCoursesResponse,
  fromRegisterHammetAdminRequest,
  fromCreateAiSchoolRequest,
  toCreateAiSchoolResponse,
  fromCreateAiCourseRequest,
  toCreateAiCourseResponse,
  toAiSchoolsResponse,
} from "@/lib/api/types";

// ------------------------------------------------------------
// Hammet
// ------------------------------------------------------------

export async function registerHammet(
  body: RegisterHammetAdminRequest,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<boolean> {
  const payload = fromRegisterHammetAdminRequest(body)

  const response = await apiClient.post<boolean>(
    "/auth/register/hammet", 
    payload, token, {onRefresh});
  
  return response

}

// ------------------------------------------------------------
// AI SCHOOLS
// ------------------------------------------------------------

export async function createAiSchool(
  body: CreateAiSchoolRequest,
  token: string,
  onRefresh: () => Promise<string | null>
): Promise<CreateAiSchoolResponse> {
  const payload = fromCreateAiSchoolRequest(body)
  const response = await apiClient.post<CreateAiSchoolResponseDto>(
    "/hammet/create/ai-school",
    payload,
    token,
    { onRefresh }
  )

  return toCreateAiSchoolResponse(response)
}

// TODO: route and method unconfirmed — the backend's /openapi.json is down. Update once known.
export async function updateAiSchool(
  schoolId: string,
  body: UpdateAiSchoolRequest,
  token: string,
  onRefresh: () => Promise<string | null>
): Promise<UpdateAiSchoolResponse> {
  const payload = fromUpdateAiSchoolRequest(body)
  const response = await apiClient.patch<UpdateAiSchoolResponseDto>(
    `/hammet/ai-schools/${encodeURIComponent(schoolId)}`,
    payload,
    token,
    { onRefresh }
  )

  return toUpdateAiSchoolResponse(response)
}

export async function createAiCourse(
  body: CreateAiCourseRequest,
  token: string,
  onRefresh: () => Promise<string | null>
): Promise<CreateAiCourseResponse> {
  const payload = fromCreateAiCourseRequest(body)
  const response = await apiClient.post<CreateAiCourseResponseDto>(
    "/hammet/create/ai_course",
    payload,
    token,
    { onRefresh }
  )

  return toCreateAiCourseResponse(response)
}

export async function getHammetAiSchools(
  token: string,
  onRefresh: () => Promise<string | null>
): Promise<AiSchool[]> {
  const response = await apiClient.get<AiSchoolsResponseDto>(
    "/hammet/ai-schools",
    token,
    { onRefresh }
  )

  return toAiSchoolsResponse(response).aiSchools
}

// Returns the school (drafts included) together with its courses.
export async function getHammetAiSchoolCourses(
  schoolId: string,
  token: string,
  onRefresh: () => Promise<string | null>
): Promise<HammetAiSchoolCoursesResponse> {
  const response = await apiClient.get<HammetAiSchoolCoursesResponseDto>(
    `/hammet/ai-schools/${encodeURIComponent(schoolId)}/courses`,
    token,
    { onRefresh }
  )

  return toHammetAiSchoolCoursesResponse(response)
}
