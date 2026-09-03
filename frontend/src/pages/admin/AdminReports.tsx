import {
  BarChart3,
  Brain,
  FileText,
  RefreshCw,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  getAdminReports,
  type AdminReportsResponse,
} from "../../api/adminReports";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { CardSkeleton } from "../../components/ui/Skeleton";

export function AdminReports() {
  const [data, setData] =
    useState<AdminReportsResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadReports() {
    try {
      setLoading(true);
      setError("");

      const result =
        await getAdminReports();

      setData(result);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load reports.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReports();
  }, []);

  const platform =
    data?.platform;

  const ai =
    data?.ai_recommendations;

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
            Administration
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-app-foreground">
            Reports
          </h1>

          <p className="mt-1 text-sm text-app-muted">
            View platform activity, scheme usage,
            and AI recommendation reports.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={
            <RefreshCw className="h-4 w-4" />
          }
          onClick={() =>
            void loadReports()
          }
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-app-danger">
            {error}
          </p>
        </div>
      )}

      {/* PLATFORM REPORT */}

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-app-foreground">
            Platform Overview
          </h2>

          <p className="mt-1 text-sm text-app-muted">
            Current platform statistics.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <ReportStatCard
              icon={
                <Users className="h-5 w-5" />
              }
              label="Citizens"
              value={platform?.citizens ?? 0}
              description="Registered citizen accounts"
            />

            <ReportStatCard
              icon={
                <Users className="h-5 w-5" />
              }
              label="Citizen Profiles"
              value={
                platform?.citizen_profiles ??
                0
              }
              description="Completed citizen profiles"
            />

            <ReportStatCard
              icon={
                <Users className="h-5 w-5" />
              }
              label="Employees"
              value={
                platform?.employees ?? 0
              }
              description="Employee accounts"
            />

            <ReportStatCard
              icon={
                <Users className="h-5 w-5" />
              }
              label="Administrators"
              value={
                platform?.administrators ??
                0
              }
              description="Administrative accounts"
            />

            <ReportStatCard
              icon={
                <FileText className="h-5 w-5" />
              }
              label="Active Schemes"
              value={
                platform?.active_schemes ??
                0
              }
              description="Currently active schemes"
            />

            <ReportStatCard
              icon={
                <BarChart3 className="h-5 w-5" />
              }
              label="Eligibility Rules"
              value={
                platform?.eligibility_rules ??
                0
              }
              description="Configured eligibility rules"
            />
          </div>
        )}
      </div>

      {/* AI REPORT */}

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-app-foreground">
            AI Recommendation Report
          </h2>

          <p className="mt-1 text-sm text-app-muted">
            Summary of the current AI recommendation
            pipeline.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <ReportStatCard
              icon={
                <Users className="h-5 w-5" />
              }
              label="Citizens Evaluated"
              value={
                ai?.citizens_evaluated ??
                0
              }
              description="Active citizens with profiles"
            />

            <ReportStatCard
              icon={
                <Brain className="h-5 w-5" />
              }
              label="Recommendations"
              value={
                ai?.total_recommendations ??
                0
              }
              description="Generated by AI pipeline"
            />

            <ReportStatCard
              icon={
                <Brain className="h-5 w-5" />
              }
              label="Average AI Confidence"
              value={`${(
                ai?.average_ai_confidence ??
                0
              ).toFixed(2)}%`}
              description="Across generated recommendations"
            />

            <ReportStatCard
              icon={
                <BarChart3 className="h-5 w-5" />
              }
              label="Schemes Recommended"
              value={
                ai?.schemes_recommended ??
                0
              }
              description="Unique recommended schemes"
            />
          </div>
        )}
      </div>

      {/* TOP SCHEMES */}

      <Card className="overflow-hidden p-0">
        <div className="border-b border-app-border px-6 py-5">
          <h2 className="text-lg font-semibold text-app-foreground">
            Top Recommended Schemes
          </h2>

          <p className="mt-1 text-sm text-app-muted">
            Schemes most frequently recommended
            by the AI recommendation pipeline.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4 p-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : !data?.top_schemes.length ? (
          <div className="px-6 py-10 text-center">
            <p className="text-sm text-app-muted">
              No recommendation data available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="border-b border-app-border bg-app-background">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Scheme
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Category
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Recommendations
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Avg. Confidence
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-app-border">
                {data.top_schemes.map(
                  (scheme) => (
                    <tr
                      key={scheme.scheme_id}
                      className="transition hover:bg-app-background/60"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-app-foreground">
                          {scheme.scheme_name}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-sm text-app-muted">
                        {scheme.category}
                      </td>

                      <td className="px-6 py-4 text-right text-sm font-medium text-app-foreground">
                        {scheme.recommendation_count}
                      </td>

                      <td className="px-6 py-4 text-right text-sm font-medium text-app-foreground">
                        {scheme.average_ai_confidence.toFixed(
                          2,
                        )}
                        %
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function ReportStatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-app-muted">
            {label}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-app-foreground">
            {value}
          </p>

          <p className="mt-1 text-xs text-app-muted">
            {description}
          </p>
        </div>

        <div className="rounded-lg bg-brand-primary/10 p-3 text-brand-primary">
          {icon}
        </div>
      </div>
    </Card>
  );
}