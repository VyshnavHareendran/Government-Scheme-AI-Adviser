import { apiClient } from "./client";
import type { CitizenProfile, CitizenProfilePayload } from "../types/api";

export async function getMyProfile(): Promise<CitizenProfile> {
  const { data } = await apiClient.get<CitizenProfile>("/citizen-profile/me");
  return data;
}

export async function createProfile(payload: CitizenProfilePayload): Promise<CitizenProfile> {
  const { data } = await apiClient.post<CitizenProfile>("/citizen-profile/", payload);
  return data;
}

export async function updateProfile(
  payload: Partial<CitizenProfilePayload>,
): Promise<CitizenProfile> {
  const { data } = await apiClient.put<CitizenProfile>("/citizen-profile/me", payload);
  return data;
}
