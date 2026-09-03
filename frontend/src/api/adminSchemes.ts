import { apiClient } from "./client";

import type { Scheme } from "../types/api";

export interface AdminSchemeCreatePayload {
  scheme_name: string;
  category: string;
  department: string;
  description: string;
  official_url: string;
  income_limit: number | null;
  minimum_age: number | null;
  maximum_age: number | null;
  requires_land: boolean;
  requires_bpl: boolean;
  disability_priority: boolean;
  target_occupations: string[];
  preferred_employment: string[];
  preferred_education: string[];
}

export interface AdminSchemeUpdatePayload
  extends Partial<AdminSchemeCreatePayload> {
  is_active?: boolean;
}

export async function getAdminSchemes(): Promise<Scheme[]> {
  const { data } = await apiClient.get<Scheme[]>("/schemes/");
  return data;
}

export async function createAdminScheme(
  payload: AdminSchemeCreatePayload,
): Promise<Scheme> {
  const { data } = await apiClient.post<Scheme>(
    "/schemes/",
    payload,
  );

  return data;
}

export async function updateAdminScheme(
  id: number,
  payload: AdminSchemeUpdatePayload,
): Promise<Scheme> {
  const { data } = await apiClient.put<Scheme>(
    `/schemes/${id}`,
    payload,
  );

  return data;
}

export async function deleteAdminScheme(
  id: number,
): Promise<void> {
  await apiClient.delete(`/schemes/${id}`);
}