import { apiClient } from "./client";

export interface AdminEmployee {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export async function getAdminEmployees(
  search?: string,
  status?: "all" | "active" | "inactive",
): Promise<AdminEmployee[]> {
  const { data } = await apiClient.get<AdminEmployee[]>(
    "/admin/employees/",
    {
      params: {
        ...(search?.trim()
          ? { search: search.trim() }
          : {}),
        status: status ?? "all",
      },
    },
  );

  return data;
}

export async function getAdminEmployee(
  employeeId: number,
): Promise<AdminEmployee> {
  const { data } = await apiClient.get<AdminEmployee>(
    `/admin/employees/${employeeId}`,
  );

  return data;
}

export interface AdminEmployeeCreatePayload {
  full_name: string;
  email: string;
}

export interface AdminEmployeeCreateResponse {
  employee: AdminEmployee;
  temporary_password: string;
}

export async function createAdminEmployee(
  payload: AdminEmployeeCreatePayload,
): Promise<AdminEmployeeCreateResponse> {
  const { data } =
    await apiClient.post<AdminEmployeeCreateResponse>(
      "/admin/employees/",
      payload,
    );

  return data;
}

export interface AdminEmployeeResetPasswordResponse {
  employee: AdminEmployee;
  temporary_password: string;
}

export async function resetAdminEmployeePassword(
  employeeId: number,
): Promise<AdminEmployeeResetPasswordResponse> {
  const { data } =
    await apiClient.post<AdminEmployeeResetPasswordResponse>(
      `/admin/employees/${employeeId}/reset-password`,
    );

  return data;
}

export async function updateAdminEmployeeStatus(
  employeeId: number,
  isActive: boolean,
): Promise<AdminEmployee> {
  const { data } = await apiClient.patch<AdminEmployee>(
    `/admin/employees/${employeeId}/status`,
    {
      is_active: isActive,
    },
  );

  return data;
}

export interface AdminEmployeeUpdatePayload {
  full_name: string;
  email: string;
}

export async function updateAdminEmployee(
  employeeId: number,
  payload: AdminEmployeeUpdatePayload,
): Promise<AdminEmployee> {
  const { data } =
    await apiClient.put<AdminEmployee>(
      `/admin/employees/${employeeId}`,
      payload,
    );

  return data;
}

export async function deleteAdminEmployee(
  employeeId: number,
): Promise<void> {
  await apiClient.delete(
    `/admin/employees/${employeeId}`,
  );
}