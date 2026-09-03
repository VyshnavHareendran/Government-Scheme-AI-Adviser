import { Brain, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Recommendation } from "../../types/api";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { RecommendationReasons } from "./RecommendationReasons";

export function RecommendationCard({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  return (
    <Card>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="amber">
                <Brain className="mr-1 h-3.5 w-3.5" />
                AI Recommended
              </Badge>

              <Badge variant={recommendation.eligible ? "green" : "slate"}>
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                {recommendation.eligible ? "Eligible" : "Not verified"}
              </Badge>
            </div>

            <h3 className="break-words text-lg font-semibold text-app-text">
              {recommendation.scheme_name}
            </h3>

            <p className="mt-1 break-words text-sm text-app-muted">
              {recommendation.category} · {recommendation.department}
            </p>
          </div>

          <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:w-auto xl:min-w-64">
            <div className="min-w-0 rounded-md border border-app-border bg-slate-50 p-3">
              <p className="break-words text-xs font-medium uppercase tracking-normal text-app-muted">
                Recommendation Score
              </p>

              <p className="mt-1 text-2xl font-semibold text-app-text">
                {recommendation.score}
              </p>
            </div>

            <div className="min-w-0 overflow-hidden rounded-md border border-amber-100 bg-amber-50 p-3">
              <ConfidenceIndicator value={recommendation.ai_confidence} />
            </div>
          </div>
        </div>

        <p className="break-words text-sm leading-6 text-app-muted">
          {recommendation.description}
        </p>

        <RecommendationReasons reasons={recommendation.reasons} />

        <div className="mt-1">
          <Link to={`/schemes/${recommendation.id}`}>
            <Button variant="secondary">View Scheme</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}