import { apiClient } from "./client";
import type { Scheme } from "../types/api";

export async function getSchemes(): Promise<Scheme[]> {
  const { data } = await apiClient.get<Scheme[]>("/schemes/");
  return data;
}

export async function getScheme(id: string | number): Promise<Scheme> {
  const { data } = await apiClient.get<Scheme>(`/schemes/${id}`);
  return data;
}
