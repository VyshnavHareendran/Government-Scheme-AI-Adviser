import { apiClient } from "./client";

import type {
  CitizenProfile,
  CitizenProfilePayload,
  EligibilityResponse,
  Application,
  RecommendationsResponse,
} from "../types/api";

export interface EmployeeCustomer {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
  must_change_password: boolean;
}

export interface CreateCustomerPayload {
  full_name: string;
  email: string;
}

export interface CreateCustomerResponse {
  customer: EmployeeCustomer;
  temporary_password: string;
}

export interface UpdateCustomerPayload {
  full_name: string;
  email: string;
}

export interface CustomerStatusPayload {
  is_active: boolean;
}

export interface ResetCustomerPasswordResponse {
  customer: EmployeeCustomer;
  temporary_password: string;
}

export async function getEmployeeCustomers(
  search = "",
  status: "all" | "active" | "inactive" = "all",
): Promise<EmployeeCustomer[]> {
  const { data } = await apiClient.get<EmployeeCustomer[]>(
    "/employee/customers/",
    {
      params: {
        search: search.trim() || undefined,
        status,
      },
    },
  );

  return data;
}

export async function getEmployeeCustomer(
  customerId: number,
): Promise<EmployeeCustomer> {
  const { data } = await apiClient.get<EmployeeCustomer>(
    `/employee/customers/${customerId}`,
  );

  return data;
}

export async function createEmployeeCustomer(
  payload: CreateCustomerPayload,
): Promise<CreateCustomerResponse> {
  const { data } =
    await apiClient.post<CreateCustomerResponse>(
      "/employee/customers/",
      payload,
    );

  return data;
}

export async function updateEmployeeCustomer(
  customerId: number,
  payload: UpdateCustomerPayload,
): Promise<EmployeeCustomer> {
  const { data } =
    await apiClient.put<EmployeeCustomer>(
      `/employee/customers/${customerId}`,
      payload,
    );

  return data;
}

export async function updateEmployeeCustomerStatus(
  customerId: number,
  payload: CustomerStatusPayload,
): Promise<EmployeeCustomer> {
  const { data } =
    await apiClient.patch<EmployeeCustomer>(
      `/employee/customers/${customerId}/status`,
      payload,
    );

  return data;
}

export async function resetEmployeeCustomerPassword(
  customerId: number,
): Promise<ResetCustomerPasswordResponse> {
  const { data } =
    await apiClient.post<ResetCustomerPasswordResponse>(
      `/employee/customers/${customerId}/reset-password`,
    );

  return data;
}

export async function deleteEmployeeCustomer(
  customerId: number,
): Promise<void> {
  await apiClient.delete(
    `/employee/customers/${customerId}`,
  );
}

export async function getEmployeeCustomerProfile(
  customerId: number,
): Promise<CitizenProfile> {
  const { data } = await apiClient.get<CitizenProfile>(
    `/employee/customers/${customerId}/profile`,
  );

  return data;
}

export async function createEmployeeCustomerProfile(
  customerId: number,
  payload: CitizenProfilePayload,
): Promise<CitizenProfile> {
  const { data } =
    await apiClient.post<CitizenProfile>(
      `/employee/customers/${customerId}/profile`,
      payload,
    );

  return data;
}

export async function updateEmployeeCustomerProfile(
  customerId: number,
  payload: Partial<CitizenProfilePayload>,
): Promise<CitizenProfile> {
  const { data } =
    await apiClient.put<CitizenProfile>(
      `/employee/customers/${customerId}/profile`,
      payload,
    );

  return data;
}

export async function getEmployeeCustomerEligibility(
  customerId: number,
): Promise<EligibilityResponse> {
  const { data } =
    await apiClient.get<EligibilityResponse>(
      `/employee/customers/${customerId}/eligibility`,
    );

  return data;
}


export async function getEmployeeCustomerRecommendations(
  customerId: number,
): Promise<RecommendationsResponse> {
  const { data } =
    await apiClient.get<RecommendationsResponse>(
      `/employee/customers/${customerId}/recommendations`,
    );

  return data;
}

export async function getEmployeeCustomerApplications(
  customerId: number,
): Promise<Application[]> {
  const { data } =
    await apiClient.get<Application[]>(
      `/employee/customers/${customerId}/applications`,
    );

  return data;
}
