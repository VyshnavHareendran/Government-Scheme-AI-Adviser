import { apiClient } from "./client";

export interface AdminDashboardStatistics {
  citizens: number;
  employees: number;
  admins: number;
  active_schemes: number;
  eligibility_rules: number;
  citizen_profiles: number;
}

export interface AdminDashboardResponse {
  admin: {
    id: number;
    full_name: string;
    email: string;
  };
  statistics: AdminDashboardStatistics;
}

export async function getAdminDashboard(): Promise<AdminDashboardResponse> {
  const response = await apiClient.get<AdminDashboardResponse>(
    "/admin/dashboard",
  );

  return response.data;
}

export interface AdminAIRecommendationStatistics {
  citizens_evaluated: number;
  total_recommendations: number;
  average_ai_confidence: number;
  schemes_recommended: number;
}

export interface AdminAISchemeStatistic {
  scheme_id: number;
  scheme_name: string;
  category: string;
  recommendation_count: number;
  average_ai_confidence: number;
}

export interface AdminAIRecommendationsResponse {
  statistics: AdminAIRecommendationStatistics;
  top_schemes: AdminAISchemeStatistic[];
}

export async function getAdminAIRecommendations(): Promise<AdminAIRecommendationsResponse> {
  const response =
    await apiClient.get<AdminAIRecommendationsResponse>(
      "/admin/ai-recommendations",
    );

  return response.data;
}
