import { CheckCircle2 } from "lucide-react";

export function RecommendationReasons({ reasons }: { reasons: string[] }) {
  if (!reasons.length) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-app-text">Why this is recommended</h4>
      <ul className="mt-2 space-y-2">
        {reasons.map((reason) => (
          <li className="flex gap-2 text-sm text-app-muted" key={reason}>
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-app-success" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
