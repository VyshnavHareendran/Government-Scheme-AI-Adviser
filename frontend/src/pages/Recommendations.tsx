import { Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { getMyRecommendations } from "../api/recommendations";
import { RecommendationCard } from "../components/recommendations/RecommendationCard";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { PageHeader } from "../components/ui/PageHeader";
import { CardSkeleton } from "../components/ui/Skeleton";
import { useAsyncData } from "../hooks/useAsyncData";

export function Recommendations() {
  const { data, error, loading, reload } = useAsyncData(
    getMyRecommendations,
    "Unable to load your recommendations.",
  );

  return (
    <div>
      <PageHeader
        description="Personalized government schemes ranked using your eligibility profile and AI analysis."
        title="AI Recommendations"
      />
      {loading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : null}
      {!loading && error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!loading && !error && !data?.recommendations.length ? (
        <EmptyState
          action={
            <Link to="/profile">
              <Button variant="secondary">Review Profile</Button>
            </Link>
          }
          icon={<Brain className="h-8 w-8" />}
          title="No recommendations found"
          message="Complete your profile to allow the backend Rule Engine and CatBoost model to generate personalized recommendations."
        />
      ) : null}
      {!loading && !error && data?.recommendations.length ? (
        <div className="space-y-4">
          {data.recommendations.map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
