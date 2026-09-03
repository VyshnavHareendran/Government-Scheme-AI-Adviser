import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry, title = "Unable to load data" }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-100 bg-red-50 p-5">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-app-danger" />
        <div>
          <h3 className="font-semibold text-app-text">{title}</h3>
          <p className="mt-1 text-sm text-app-muted">{message}</p>
          {onRetry ? (
            <Button className="mt-4" onClick={onRetry} variant="secondary">
              Retry
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
