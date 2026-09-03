import { apiClient } from "./client";

export interface AdminReportsPlatform {
  citizens: number;
  employees: number;
  administrators: number;
  citizen_profiles: number;
  active_schemes: number;
  eligibility_rules: number;
}

export interface AdminReportsAIRecommendations {
  citizens_evaluated: number;
  total_recommendations: number;
  average_ai_confidence: number;
  schemes_recommended: number;
}

export interface AdminReportsTopScheme {
  scheme_id: number;
  scheme_name: string;
  category: string;
  recommendation_count: number;
  average_ai_confidence: number;
}

export interface AdminReportsResponse {
  platform: AdminReportsPlatform;
  ai_recommendations: AdminReportsAIRecommendations;
  top_schemes: AdminReportsTopScheme[];
}

export async function getAdminReports(): Promise<AdminReportsResponse> {
  const { data } =
    await apiClient.get<AdminReportsResponse>(
      "/admin/reports",
    );

  return data;
}