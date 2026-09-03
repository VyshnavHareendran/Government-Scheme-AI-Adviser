import { Brain, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Recommendation } from "../../types/api";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { RecommendationReasons } from "./RecommendationReasons";

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  return (
    <Card>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
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
          <h3 className="text-lg font-semibold text-app-text">{recommendation.scheme_name}</h3>
          <p className="mt-1 text-sm text-app-muted">
            {recommendation.category} · {recommendation.department}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:min-w-64">
          <div className="rounded-md border border-app-border bg-slate-50 p-3">
            <p className="text-xs font-medium uppercase tracking-normal text-app-muted">
              Recommendation Score
            </p>
            <p className="mt-1 text-2xl font-semibold text-app-text">{recommendation.score}</p>
          </div>
          <div className="rounded-md border border-amber-100 bg-amber-50 p-3">
            <ConfidenceIndicator value={recommendation.ai_confidence} />
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-app-muted">{recommendation.description}</p>
      <RecommendationReasons reasons={recommendation.reasons} />
      <div className="mt-5">
        <Link to={`/schemes/${recommendation.id}`}>
          <Button variant="secondary">View Scheme</Button>
        </Link>
      </div>
    </Card>
  );
}
