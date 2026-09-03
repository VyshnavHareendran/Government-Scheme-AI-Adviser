import { ExternalLink, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../api/applications";
import type { ApplicationStatus } from "../types/api";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorState } from "../components/ui/ErrorState";
import { PageHeader } from "../components/ui/PageHeader";
import { CardSkeleton } from "../components/ui/Skeleton";
import { useAsyncData } from "../hooks/useAsyncData";

export function MyApplications() {
  const {
    data: applications,
    error,
    loading,
    reload,
  } = useAsyncData(
    getMyApplications,
    "Unable to load your applications.",
  );

  return (
    <div>
      <PageHeader
        description="Track the government scheme applications you have started through CIVORA."
        title="My Applications"
      />

      <Card className="mb-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-app-text">
              CIVORA application tracking
            </p>
            <p className="mt-1 text-sm text-app-muted">
              CIVORA helps you track progress here. Complete the actual
              government application, login, OTP, eKYC, documents, and final
              submission on the official portal.
            </p>
          </div>
          <Badge variant="teal">
            {applications?.length ?? 0} application
            {(applications?.length ?? 0) === 1 ? "" : "s"}
          </Badge>
        </div>
      </Card>

      {loading ? (
        <div className="space-y-4">
          <CardSkeleton rows={4} />
          <CardSkeleton rows={4} />
        </div>
      ) : null}

      {!loading && error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : null}

      {!loading && !error && applications?.length === 0 ? (
        <EmptyState
          action={
            <Link to="/schemes">
              <Button>Browse Schemes</Button>
            </Link>
          }
          icon={<FileText className="h-6 w-6" />}
          message="You have not started any applications yet."
          title="No applications"
        />
      ) : null}

      {!loading && !error && applications?.length ? (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id}>
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-app-text">
                      {application.scheme.scheme_name}
                    </h2>
                    <StatusBadge status={application.status} />
                  </div>
                  <p className="mt-1 text-sm text-app-muted">
                    {application.scheme.department}
                  </p>
                </div>

                <div className="text-sm text-app-muted lg:text-right">
                  <p>Application ID: {application.id}</p>
                  <p>
                    Application Started:{" "}
                    {new Date(application.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {application.notes ? (
                <div className="mt-4 rounded-md bg-app-background p-3">
                  <p className="text-xs font-semibold text-app-text">Notes</p>
                  <p className="mt-1 text-sm text-app-muted">
                    {application.notes}
                  </p>
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                {application.scheme.official_url ? (
                  <a
                    href={application.scheme.official_url}
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
                <Link to={`/schemes/${application.scheme.id}`}>
                  <Button variant="ghost">View Scheme Details</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getApplicationStatusClass(status)}`}
    >
      {status}
    </span>
  );
}

function getApplicationStatusClass(status: ApplicationStatus) {
  if (status === "Approved") {
    return "bg-green-50 text-green-700";
  }

  if (status === "Rejected") {
    return "bg-red-50 text-red-700";
  }

  if (status === "Under Review") {
    return "bg-amber-50 text-amber-700";
  }

  if (status === "Submitted") {
    return "bg-brand-primary/10 text-brand-primary";
  }

  if (status === "In Progress") {
    return "bg-sky-50 text-sky-700";
  }

  return "bg-slate-100 text-app-muted";
}
