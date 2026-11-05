import { apiClient } from "@/lib/api/api-client";
import {
  type RegisterHammetAdminRequest,
  type CreateAiSchoolRequest,
  type CreateAiSchoolResponse,
  type CreateAiSchoolResponseDto,
  type CreateAiCourseRequest,
  type CreateAiCourseResponse,
  type UpdateAiSchoolRequest,
  type UpdateAiSchoolResponse,
  type UpdateAiSchoolResponseDto,
  type UpdateAiCourseRequest,
  type UpdateAiCourseResponse,
  type UpdateAiCourseResponseDto,
  type UpdateAiModuleRequest,
  type AiModule,
  type AiModuleDto,
  type AddAiQuizRequest,
  type AiQuiz,
  type AiQuizDto,
  type AiSchool,
  type AiSchoolsResponseDto,
  fromUpdateAiSchoolRequest,
  toUpdateAiSchoolResponse,
  fromUpdateAiCourseRequest,
  toUpdateAiCourseResponse,
  fromUpdateAiModuleRequest,
  toAiModule,
  fromAddAiQuizRequest,
  toAiQuiz,
  type HammetAiSchoolCoursesResponse,
  type HammetAiSchoolCoursesResponseDto,
  toHammetAiSchoolCoursesResponse,
  fromRegisterHammetAdminRequest,
  fromCreateAiSchoolRequest,
  toCreateAiSchoolResponse,
  toAiSchoolsResponse,
  CreateAiCourseResponseDto,
  toCreateAiCourseResponse,
  type HammetAdmin,
  type HammetAdminDto,
  type HammetAdminsResponse,
  type HammetAdminsResponseDto,
  type GetHammetAdminsParams,
  type EditHammetAdminRequest,
  toHammetAdmin,
  toHammetAdminsResponse,
  fromEditHammetAdminRequest,
  type Coupon,
  type CouponDto,
  type CouponsResponse,
  type CouponsResponseDto,
  type CreateCouponRequest,
  type EditCouponRequest,
  type EditCouponRequestDto,
  toCouponsResponse,
  fromCreateCouponRequest,
  fromEditCouponRequest,
  toCoupon,
} from "@/lib/api/types";

// ------------------------------------------------------------
// Hammet
// ------------------------------------------------------------

export async function registerHammet(
  body: RegisterHammetAdminRequest,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<boolean> {
  const payload = fromRegisterHammetAdminRequest(body);

  const response = await apiClient.post<boolean>(
    "/auth/register/hammet",
    payload,
    token,
    { onRefresh },
  );

  return response;
}

export async function getHammetAdmins(
  params: GetHammetAdminsParams,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<HammetAdminsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("page_size", String(params.pageSize));
  if (params.scope) query.set("scope", params.scope);
  if (params.access) query.set("access", params.access);
  if (params.search?.trim()) query.set("search", params.search.trim());

  const queryString = query.toString();
  const response = await apiClient.get<HammetAdminsResponseDto>(
    `/hammet/admins${queryString ? `?${queryString}` : ""}`,
    token,
    { onRefresh },
  );

  return toHammetAdminsResponse(response);
}

export async function editHammetAdmin(
  adminId: string,
  body: EditHammetAdminRequest,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<HammetAdmin> {
  const payload = fromEditHammetAdminRequest(body);
  const response = await apiClient.patch<HammetAdminDto>(
    `/hammet/admins/${encodeURIComponent(adminId)}`,
    payload,
    token,
    { onRefresh },
  );

  return toHammetAdmin(response);
}

// Deactivates the admin; the record stays and its status changes.
export async function deactivateHammetAdmin(
  adminId: string,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<boolean> {
  return apiClient.delete<boolean>(
    `/hammet/admins/${encodeURIComponent(adminId)}`,
    undefined,
    token,
    { onRefresh },
  );
}

// ------------------------------------------------------------
// AI SCHOOLS
// ------------------------------------------------------------

export async function createAiSchool(
  body: CreateAiSchoolRequest,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<CreateAiSchoolResponse> {
  const payload = fromCreateAiSchoolRequest(body);
  const response = await apiClient.post<CreateAiSchoolResponseDto>(
    "/hammet/create/ai-school",
    payload,
    token,
    { onRefresh },
  );

  return toCreateAiSchoolResponse(response);
}

// The backend rejects a body with no fields set, and treats false/0 as unset.
export async function updateAiSchool(
  schoolId: string,
  body: UpdateAiSchoolRequest,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<UpdateAiSchoolResponse> {
  const payload = fromUpdateAiSchoolRequest(schoolId, body);
  const response = await apiClient.patch<UpdateAiSchoolResponseDto>(
    `/hammet/edit/ai-school/${encodeURIComponent(schoolId)}`,
    payload,
    token,
    { onRefresh },
  );

  return toUpdateAiSchoolResponse(response);
}

// There is no create-course route; courses are created through the school edit route.
export async function createAiCourse(
  body: CreateAiCourseRequest,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<CreateAiCourseResponse> {
  const response = await updateAiSchool(
    body.aiSchoolId,
    { courses: [body] },
    token,
    onRefresh,
  );

  return response.courses[0];
}

// Modules listed in body.modules are created under the course.
export async function updateAiCourse(
  courseId: string,
  body: UpdateAiCourseRequest,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<UpdateAiCourseResponse> {
  const payload = fromUpdateAiCourseRequest(courseId, body);
  const response = await apiClient.patch<UpdateAiCourseResponseDto>(
    `/hammet/edit/ai-courses/${encodeURIComponent(courseId)}`,
    payload,
    token,
    { onRefresh },
  );

  return toUpdateAiCourseResponse(response);
}

// Resources listed in body.resources are added to the module.
// The returned module's resources only holds the ones added by this request.
export async function updateAiModule(
  moduleId: string,
  body: UpdateAiModuleRequest,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<AiModule> {
  const payload = fromUpdateAiModuleRequest(moduleId, body);
  const response = await apiClient.patch<AiModuleDto>(
    `/hammet/edit/ai-modules/${encodeURIComponent(moduleId)}`,
    payload,
    token,
    { onRefresh },
  );

  return toAiModule(response);
}

export async function addAiQuiz(
  moduleId: string,
  body: AddAiQuizRequest,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<AiQuiz> {
  const payload = fromAddAiQuizRequest(body);
  const response = await apiClient.patch<AiQuizDto>(
    `/hammet/edit/ai-modules/${encodeURIComponent(moduleId)}/quiz/add`,
    payload,
    token,
    { onRefresh },
  );

  return toAiQuiz(response);
}

export async function getHammetAiSchools(
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<AiSchool[]> {
  const response = await apiClient.get<AiSchoolsResponseDto>(
    "/hammet/ai-schools",
    token,
    { onRefresh },
  );

  return toAiSchoolsResponse(response).aiSchools;
}

// Returns the school (drafts included) together with its courses.
export async function getHammetAiSchoolCourses(
  schoolId: string,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<HammetAiSchoolCoursesResponse> {
  const response = await apiClient.get<HammetAiSchoolCoursesResponseDto>(
    `/hammet/ai-schools/${encodeURIComponent(schoolId)}/courses`,
    token,
    { onRefresh },
  );

  return toHammetAiSchoolCoursesResponse(response);
}

export async function getHammetAiCourse(
  courseId: string,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<CreateAiCourseResponse> {
  const response = await apiClient.get<CreateAiCourseResponseDto>(
    `/hammet/courses/${encodeURIComponent(courseId)}`,
    token,
    { onRefresh },
  );

  return toCreateAiCourseResponse(response);
}

export async function getHammetCoupons(
  page: number,
  pageSize: number,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<CouponsResponse> {
  const query = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  const response = await apiClient.get<CouponsResponseDto>(
    `/hammet/coupon?${query.toString()}`,
    token,
    { onRefresh },
  );
  return toCouponsResponse(response);
}

export async function getHammetCoupon(
  couponId: string,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<Coupon> {
  const response = await apiClient.get<CouponDto>(
    `/hammet/coupon/${encodeURIComponent(couponId)}`,
    token,
    { onRefresh },
  );
  return toCoupon(response);
}

export async function createHammetCoupon(
  body: CreateCouponRequest,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<Coupon> {
  const payload = fromCreateCouponRequest(body);
  const response = await apiClient.post<CouponDto>(
    "/hammet/coupon/add",
    payload,
    token,
    { onRefresh },
  );
  return toCoupon(response);
}

export async function editHammetCoupon(
  couponId: string,
  body: EditCouponRequest,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<boolean> {
  return apiClient.patch<boolean>(
    `/hammet/coupon/${encodeURIComponent(couponId)}`,
    fromEditCouponRequest(body),
    token,
    { onRefresh },
  );
}

export async function deleteHammetCoupon(
  couponId: string,
  token: string,
  onRefresh: () => Promise<string | null>,
): Promise<boolean> {
  return apiClient.delete<boolean>(
    `/hammet/coupon/${encodeURIComponent(couponId)}`,
    undefined,
    token,
    { onRefresh },
  );
}
