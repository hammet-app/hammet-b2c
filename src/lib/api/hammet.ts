import { apiClient } from "@/lib/api/api-client";
import {
  type RegisterHammetAdminRequest,
  type CreateAiSchoolRequest,
  fromRegisterHammetAdminRequest,
  fromCreateAiSchoolRequest,
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
): Promise<unknown> {
  const payload = fromCreateAiSchoolRequest(body)
  return await apiClient.post<unknown>(
    "/hammet/create/ai_school",
    payload,
    token,
    { onRefresh }
  )
}