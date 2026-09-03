import { apiClient } from "./client";
import type {
  Application,
  ApplicationStatusUpdatePayload,
} from "../types/api";

export interface ApplicationCreatePayload {
  scheme_id: number;
}

export async function createApplication(
  payload: ApplicationCreatePayload,
): Promise<Application> {
  const { data } = await apiClient.post<Application>(
    "/applications/",
    payload,
  );

  return data;
}

export async function getApplications(): Promise<Application[]> {
  const { data } = await apiClient.get<Application[]>(
    "/applications/",
  );

  return data;
}

export async function getMyApplications(): Promise<Application[]> {
  const { data } = await apiClient.get<Application[]>(
    "/applications/me",
  );

  return data;
}

export async function updateApplicationStatus(
  applicationId: number,
  payload: ApplicationStatusUpdatePayload,
): Promise<Application> {
  const { data } =
    await apiClient.patch<Application>(
      `/applications/${applicationId}`,
      payload,
    );

  return data;
}
