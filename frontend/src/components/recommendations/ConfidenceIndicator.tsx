import { formatPercent } from "../../utils/format";

export function ConfidenceIndicator({ value }: { value: number }) {
  const normalized = Math.max(0, Math.min(100, value <= 1 ? value * 100 : value));

  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-normal text-app-muted">
          AI Confidence
        </span>
        <span className="text-sm font-semibold text-app-warning">{formatPercent(value)}</span>
      </div>
      <div className="h-2 rounded-full bg-amber-100">
        <div
          className="h-2 rounded-full bg-brand-amber"
          style={{ width: `${normalized}%` }}
        />
      </div>
    </div>
  );
}
