import { AxiosError } from "axios";
import type { ApiErrorShape } from "../types/api";

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorShape | undefined;
    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.message === "string") return data.message;
    if (error.response?.status === 401) return "Your session has expired. Please sign in again.";
    if (error.response?.status === 403) return "You do not have permission to access this resource.";
    if (error.response?.status === 404) return fallback;
    if (error.response?.status && error.response.status >= 500) {
      return "The server is unavailable right now. Please try again.";
    }
    if (error.message) return error.message;
  }
  return fallback;
}
