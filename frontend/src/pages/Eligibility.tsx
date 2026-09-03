import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getMyEligibleSchemes } from "../api/eligibility";
import { SchemeCard } from "../components/schemes/SchemeCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { PageHeader } from "../components/ui/PageHeader";
import { CardSkeleton } from "../components/ui/Skeleton";
import { useAsyncData } from "../hooks/useAsyncData";

export function Eligibility() {
  const { data, error, loading, reload } = useAsyncData(
    getMyEligibleSchemes,
    "Unable to load your eligible schemes.",
  );

  return (
    <div>
      <PageHeader
        description="Government schemes you currently qualify for based on your profile."
        title="Eligible Schemes"
      />
      <Card className="mb-5 flex items-center gap-4">
        <div className="rounded-md bg-green-50 p-3 text-app-success">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-app-muted">Eligible schemes count</p>
          <p className="text-2xl font-semibold text-app-text">{data?.eligible_count ?? "-"}</p>
        </div>
      </Card>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : null}
      {!loading && error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!loading && !error && !data?.eligible_schemes.length ? (
        <EmptyState
          action={
            <Link to="/profile">
              <Button variant="secondary">Review Profile</Button>
            </Link>
          }
          title="No eligible schemes found"
          message="Review or update your citizen profile so the Rule Engine can evaluate your latest details."
        />
      ) : null}
      {!loading && !error && data?.eligible_schemes.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {data.eligible_schemes.map((scheme) => (
            <SchemeCard eligible key={scheme.id} scheme={scheme} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
