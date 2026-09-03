export interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  must_change_password: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  must_change_password: boolean;
}

export type Gender = "Male" | "Female" | "Other";
export type Category = "General" | "OBC" | "SC" | "ST" | "EWS";
export type EducationLevel = "SSLC" | "Plus Two" | "Diploma" | "UG" | "PG" | "PhD";
export type EmploymentStatus =
  | "Student"
  | "Employed"
  | "Self Employed"
  | "Unemployed"
  | "Retired";
export type MaritalStatus = "Single" | "Married" | "Divorced" | "Widowed";

export interface CitizenProfilePayload {
  date_of_birth: string;
  gender: Gender;
  state: string;
  district: string;
  pincode: string;
  education_level: EducationLevel;
  employment_status: EmploymentStatus;
  occupation: string;
  annual_income: string;
  bpl_card: boolean;
  category: Category;
  disability_status: boolean;
  marital_status: MaritalStatus;
  land_holding: string;
  family_size: number;
}

export interface CitizenProfile extends CitizenProfilePayload {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Scheme {
  id: number;
  scheme_name: string;
  category: string;
  department: string;
  description: string;
  official_url: string;
  is_active: boolean;
  income_limit: number | null;
  minimum_age: number | null;
  maximum_age: number | null;
  requires_land: boolean;
  requires_bpl: boolean;
  disability_priority: boolean;
  target_occupations: string[];
  preferred_employment: string[];
  preferred_education: string[];
  created_at: string;
  updated_at: string;
}

export type EligibleScheme = Pick<
  Scheme,
  "id" | "scheme_name" | "category" | "department" | "description" | "official_url"
>;

export interface EligibilityResponse {
  eligible_count: number;
  eligible_schemes: EligibleScheme[];
}

export interface Recommendation extends EligibleScheme {
  score: number;
  ai_confidence: number;
  eligible: boolean;
  reasons: string[];
}

export interface RecommendationsResponse {
  recommendation_count: number;
  recommendations: Recommendation[];
}

export interface ApiErrorShape {
  detail?: string;
  message?: string;
}

export type ApplicationStatus =
  | "Not Started"
  | "In Progress"
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Rejected";

export interface ApplicationSchemeInfo {
  id: number;
  scheme_name: string;
  department: string;
  official_url: string;
}

export interface Application {
  id: number;
  citizen_id: number;
  scheme_id: number;
  status: ApplicationStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  scheme: ApplicationSchemeInfo;
}

export interface ApplicationStatusUpdatePayload {
  status: ApplicationStatus;
  notes?: string | null;
}
