import { apiClient } from "./client";

export interface AdminCitizenListItem {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  has_profile: boolean;
  profile_completion: number;
}

export interface CitizenProfile {
  id: number;
  user_id: number;
  date_of_birth: string;
  gender: string;
  state: string;
  district: string;
  pincode: string;
  education_level: string;
  employment_status: string;
  occupation: string;
  annual_income: number;
  bpl_card: boolean;
  category: string;
  disability_status: boolean;
  marital_status: string;
  land_holding: number;
  family_size: number;
  created_at: string;
  updated_at: string;
}

export interface AdminCitizenDetail {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profile: CitizenProfile | null;
}

export async function getAdminCitizens(
  search?: string,
  status?: "all" | "active" | "inactive",
): Promise<AdminCitizenListItem[]> {
  const { data } = await apiClient.get<AdminCitizenListItem[]>(
    "/admin/citizens/",
    {
      params: {
        ...(search?.trim() ? { search: search.trim() } : {}),
        status: status ?? "all",
      },
    },
  );

  return data;
}

export async function getAdminCitizen(
  citizenId: number,
): Promise<AdminCitizenDetail> {
  const { data } = await apiClient.get<AdminCitizenDetail>(
    `/admin/citizens/${citizenId}`,
  );

  return data;
}