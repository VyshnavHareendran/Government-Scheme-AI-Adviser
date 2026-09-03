import { apiClient } from "./client";
import type { RecommendationsResponse } from "../types/api";

export async function getMyRecommendations(): Promise<RecommendationsResponse> {
  const { data } = await apiClient.get<RecommendationsResponse>("/recommendations/me");
  return data;
}
