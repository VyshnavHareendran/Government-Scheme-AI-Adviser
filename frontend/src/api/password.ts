import { apiClient } from "./client";

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export async function changePassword(
  payload: ChangePasswordPayload,
): Promise<void> {
  await apiClient.post(
    "/auth/change-password",
    payload,
  );
}