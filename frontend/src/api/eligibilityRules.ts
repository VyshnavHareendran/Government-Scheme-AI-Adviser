import { apiClient } from "./client";

export interface EligibilityRule {
  id: number;
  scheme_id: number;
  field_name: string;
  operator: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface EligibilityRuleCreatePayload {
  scheme_id: number;
  field_name: string;
  operator: string;
  value: string;
}

export interface EligibilityRuleUpdatePayload {
  field_name?: string;
  operator?: string;
  value?: string;
}

export async function getEligibilityRules(): Promise<
  EligibilityRule[]
> {
  const { data } = await apiClient.get<EligibilityRule[]>(
    "/eligibility-rules/",
  );

  return data;
}

export async function createEligibilityRule(
  payload: EligibilityRuleCreatePayload,
): Promise<EligibilityRule> {
  const { data } =
    await apiClient.post<EligibilityRule>(
      "/eligibility-rules/",
      payload,
    );

  return data;
}

export async function updateEligibilityRule(
  id: number,
  payload: EligibilityRuleUpdatePayload,
): Promise<EligibilityRule> {
  const { data } =
    await apiClient.put<EligibilityRule>(
      `/eligibility-rules/${id}`,
      payload,
    );

  return data;
}

export async function deleteEligibilityRule(
  id: number,
): Promise<void> {
  await apiClient.delete(`/eligibility-rules/${id}`);
}