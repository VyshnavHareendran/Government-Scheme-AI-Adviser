import type {
  Category,
  EducationLevel,
  EmploymentStatus,
  Gender,
  MaritalStatus,
} from "./api";

export const genderOptions: Gender[] = ["Male", "Female", "Other"];
export const categoryOptions: Category[] = ["General", "OBC", "SC", "ST", "EWS"];
export const educationOptions: EducationLevel[] = [
  "SSLC",
  "Plus Two",
  "Diploma",
  "UG",
  "PG",
  "PhD",
];
export const employmentOptions: EmploymentStatus[] = [
  "Student",
  "Employed",
  "Self Employed",
  "Unemployed",
  "Retired",
];
export const maritalOptions: MaritalStatus[] = [
  "Single",
  "Married",
  "Divorced",
  "Widowed",
];
