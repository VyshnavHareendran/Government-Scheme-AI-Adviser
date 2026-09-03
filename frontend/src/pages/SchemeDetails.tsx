import { ExternalLink, FileText } from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getScheme } from "../api/schemes";
import { createApplication } from "../api/applications";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ErrorState } from "../components/ui/ErrorState";
import { PageHeader } from "../components/ui/PageHeader";
import { CardSkeleton } from "../components/ui/Skeleton";
import { useAsyncData } from "../hooks/useAsyncData";
import { getErrorMessage } from "../utils/errors";
import { formatCurrency } from "../utils/format";

export function SchemeDetails() {
  const { id } = useParams();
  const loader = useCallback(() => getScheme(id ?? ""), [id]);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applicationStarted, setApplicationStarted] = useState(false);
  const { data: scheme, error, loading, reload } = useAsyncData(loader, "Scheme not found.");


  async function handleStartApplication() {
    if (!scheme) {
      return;
    }

    try {
      setApplicationLoading(true);
      setApplicationMessage("");
      setApplicationStarted(false);

      await createApplication({
        scheme_id: scheme.id,
      });

      setApplicationMessage(
        "Application started successfully. CIVORA is now tracking this application. Next step: complete your application on the official government portal, then return to CIVORA to track its status.",
      );
      setApplicationStarted(true);
    } catch (err) {
      console.error(err);

      setApplicationMessage(
        getErrorMessage(err, "Unable to start application."),
      );
      setApplicationStarted(false);
    } finally {
      setApplicationLoading(false);
    }
  }


  return (
    <div>
      <PageHeader
        action={
          <Link to="/schemes">
            <Button variant="secondary">Back to schemes</Button>
          </Link>
        }
        description="Review scheme details, eligibility settings, and official application options."
        title="Scheme Details"
      />
      {loading ? <CardSkeleton rows={7} /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={reload} /> : null}
      {!loading && scheme ? (
        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-app-text">{scheme.scheme_name}</h1>
                <p className="mt-2 text-sm text-app-muted">{scheme.department}</p>
              </div>
              <Badge variant={scheme.is_active ? "green" : "slate"}>
                {scheme.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge variant="teal">{scheme.category}</Badge>
              {scheme.requires_bpl ? <Badge variant="amber">BPL Required</Badge> : null}
              {scheme.disability_priority ? <Badge variant="amber">Disability Priority</Badge> : null}
            </div>
            <p className="mt-6 text-sm leading-7 text-app-muted">{scheme.description}</p>
            <div className="mt-6 border-t border-app-border pt-5">
              <h2 className="text-lg font-semibold text-app-text">
                Application Actions
              </h2>
              <p className="mt-1 text-sm text-app-muted">
                Start tracking in CIVORA, then complete the actual government
                application on the official portal.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                onClick={() => void handleStartApplication()}
                disabled={applicationLoading}
                icon={<FileText className="h-4 w-4" />}
              >
                {applicationLoading
                  ? "Starting Application..."
                  : "Start Application"}
              </Button>

              {scheme.official_url ? (
                <a
                  href={scheme.official_url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Button
                    variant="secondary"
                    icon={<ExternalLink className="h-4 w-4" />}
                  >
                    Open Official Portal
                  </Button>
                </a>
              ) : null}
            </div>

            {applicationMessage ? (
              <div
                className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
                  applicationStarted
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }`}
              >
                <p>{applicationMessage}</p>
                {applicationStarted ? (
                  <div className="mt-3 flex flex-wrap gap-3">
                    {scheme.official_url ? (
                      <a
                        href={scheme.official_url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <Button
                          icon={<ExternalLink className="h-4 w-4" />}
                          variant="secondary"
                        >
                          Open Official Portal
                        </Button>
                      </a>
                    ) : null}
                    <Link to="/applications">
                      <Button variant="secondary">
                        View My Applications
                      </Button>
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : null}
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-app-text">Eligibility Configuration</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Detail label="Income Limit" value={formatCurrency(scheme.income_limit)} />
              <Detail label="Minimum Age" value={scheme.minimum_age ?? "Not specified"} />
              <Detail label="Maximum Age" value={scheme.maximum_age ?? "Not specified"} />
              <Detail label="Requires Land" value={scheme.requires_land ? "Yes" : "No"} />
              <Detail label="Target Occupations" value={scheme.target_occupations.join(", ") || "Not specified"} />
              <Detail label="Preferred Employment" value={scheme.preferred_employment.join(", ") || "Not specified"} />
              <Detail label="Preferred Education" value={scheme.preferred_education.join(", ") || "Not specified"} />
            </dl>
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-app-border pb-3 last:border-b-0">
      <dt className="text-app-muted">{label}</dt>
      <dd className="text-right font-medium text-app-text">{value}</dd>
    </div>
  );
}
