import { apiClient } from "./client";

import type { LoginResponse, User } from "../types/api";

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const form = new URLSearchParams();

  form.append("username", email);
  form.append("password", password);

  const { data } = await apiClient.post<LoginResponse>(
    "/auth/login",
    form,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return data;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<User>("/auth/me");

  return data;
}

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

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
}

export async function register(
  payload: RegisterPayload,
): Promise<User> {
  const { data } = await apiClient.post<User>(
    "/auth/register",
    payload,
  );

  return data;
}