import { apiClient } from "./client";
import type { EligibilityResponse } from "../types/api";

export async function getMyEligibleSchemes(): Promise<EligibilityResponse> {
  const { data } = await apiClient.get<EligibilityResponse>("/rule-engine/me");
  return data;
}
