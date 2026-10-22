export interface AISchoolEntitlement {
  id: string;
  name: string;
  description: string;
  isEntitled: boolean;
  isEnrolled: boolean;
  hasFinished: boolean;
}

export interface CourseEntitlement {
  id: string;
  title: string;
  slug: string;
  description: string;
  isEntitled: boolean;
  isEnrolled: boolean;
  hasFinished: boolean;
  position: number;
  aiSchoolId: string;
}

export interface EntitlementResponse {
  schools: AISchoolEntitlement[] | null;
  courses: CourseEntitlement[] | null;
}
