import {
  CalendarDays,
  Eye,
  MapPin,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  getAdminCitizen,
  getAdminCitizens,
  type AdminCitizenDetail,
  type AdminCitizenListItem,
} from "../../api/adminCitizens";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { CardSkeleton } from "../../components/ui/Skeleton";

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getProfileStatus(citizen: AdminCitizenListItem) {
  if (!citizen.has_profile) {
    return {
      label: "Incomplete",
      variant: "amber" as const,
    };
  }

  return {
    label: "Complete",
    variant: "green" as const,
  };
}

export function AdminCitizens() {
  const [citizens, setCitizens] = useState<AdminCitizenListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [selectedCitizen, setSelectedCitizen] =
    useState<AdminCitizenDetail | null>(null);

  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  async function loadCitizens() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminCitizens(
        undefined,
        "all",
      );

      setCitizens(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load registered citizens.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCitizens();
  }, []);

  const filteredCitizens = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return citizens
      .filter((citizen) => {
        if (statusFilter === "active") {
          return citizen.is_active;
        }

        if (statusFilter === "inactive") {
          return !citizen.is_active;
        }

        return true;
      })
      .filter((citizen) => {
        if (!normalizedQuery) {
          return true;
        }

        return [citizen.full_name, citizen.email]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) =>
        a.full_name.localeCompare(b.full_name),
      );
  }, [citizens, query, statusFilter]);

  async function handleViewCitizen(citizenId: number) {
    try {
      setLoadingDetails(true);
      setDetailsError("");
      setSelectedCitizen(null);

      const data = await getAdminCitizen(citizenId);

      setSelectedCitizen(data);
    } catch (err) {
      console.error(err);
      setDetailsError(
        "Unable to load the citizen details. Please try again.",
      );
    } finally {
      setLoadingDetails(false);
    }
  }

  function closeDetails() {
    if (loadingDetails) {
      return;
    }

    setSelectedCitizen(null);
    setDetailsError("");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
            Administration
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-app-foreground">
            Citizen Management
          </h1>

          <p className="mt-1 text-sm text-app-muted">
            View and manage registered citizens and their profiles.
          </p>
        </div>

        <Button
          variant="secondary"
          icon={<RefreshCw className="h-4 w-4" />}
          onClick={() => void loadCitizens()}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-app-danger">{error}</p>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-app-danger"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <Card>
        <div className="grid gap-4 md:grid-cols-[1fr_200px]">
          <div className="relative">
            <Input
              label="Search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search citizens by name or email..."
            />

            <Search className="pointer-events-none absolute right-3 top-8 h-4 w-4 text-app-muted" />
          </div>

          <Select
            label="Status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | "all"
                  | "active"
                  | "inactive",
              )
            }
            options={["all", "active", "inactive"]}
          />
        </div>
      </Card>

      {/* Citizen Table */}
      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="space-y-4 p-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredCitizens.length === 0 ? (
          <EmptyState
            icon={<UserRound className="h-8 w-8" />}
            title="No citizens found"
            message={
              query.trim()
                ? "No citizens match your search. Try a different name or email."
                : "There are currently no registered citizens to display."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="border-b border-app-border bg-app-background">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Citizen
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Profile
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Status
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Registered
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-app-border">
                {filteredCitizens.map((citizen) => {
                  const profileStatus =
                    getProfileStatus(citizen);

                  return (
                    <tr
                      key={citizen.id}
                      className="transition hover:bg-app-background/60"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand-dark">
                            <UserRound className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate font-medium text-app-foreground">
                              {citizen.full_name}
                            </p>

                            <p className="mt-1 truncate text-xs text-app-muted">
                              {citizen.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-[150px]">
                          <div className="flex items-center justify-between gap-3">
                            <Badge
                              variant={profileStatus.variant}
                            >
                              {profileStatus.label}
                            </Badge>

                            <span className="text-xs font-medium text-app-muted">
                              {citizen.profile_completion}%
                            </span>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-brand-primary transition-all"
                              style={{
                                width: `${citizen.profile_completion}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <Badge
                          variant={
                            citizen.is_active
                              ? "green"
                              : "slate"
                          }
                        >
                          {citizen.is_active
                            ? "Active"
                            : "Inactive"}
                        </Badge>
                      </td>

                      <td className="px-5 py-4 text-sm text-app-muted">
                        {formatDate(citizen.created_at)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            className="px-2"
                            icon={
                              <Eye className="h-4 w-4" />
                            }
                            onClick={() =>
                              void handleViewCitizen(
                                citizen.id,
                              )
                            }
                          >
                            View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail Loading */}
      {loadingDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Loading citizen details"
        >
          <div className="w-full max-w-md rounded-xl border border-app-border bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
              <p className="text-sm font-medium text-app-foreground">
                Loading citizen details...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Detail Error */}
      {detailsError && !loadingDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-app-foreground">
                  Unable to load details
                </h2>

                <p className="mt-2 text-sm text-app-muted">
                  {detailsError}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDetailsError("")}
                className="rounded-md p-2 text-app-muted hover:bg-slate-100 hover:text-app-foreground"
                aria-label="Close error"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Button
              variant="secondary"
              className="mt-5"
              onClick={() => setDetailsError("")}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Citizen Details Modal */}
      {selectedCitizen && !loadingDetails && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="citizen-details-title"
        >
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-app-border bg-white shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-app-border bg-white px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
                  Citizen Details
                </p>

                <h2
                  id="citizen-details-title"
                  className="mt-1 text-lg font-semibold text-app-foreground"
                >
                  {selectedCitizen.full_name}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeDetails}
                className="rounded-md p-2 text-app-muted hover:bg-slate-100 hover:text-app-foreground"
                aria-label="Close citizen details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Account Information */}
              <section>
                <h3 className="text-sm font-semibold text-app-foreground">
                  Account Information
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-app-border p-4">
                    <div className="flex items-center gap-2 text-app-muted">
                      <UserRound className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        Full Name
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-medium text-app-foreground">
                      {selectedCitizen.full_name}
                    </p>
                  </div>

                  <div className="rounded-lg border border-app-border p-4">
                    <div className="flex items-center gap-2 text-app-muted">
                      <span className="text-xs font-medium">
                        Email
                      </span>
                    </div>

                    <p className="mt-2 break-all text-sm font-medium text-app-foreground">
                      {selectedCitizen.email}
                    </p>
                  </div>

                  <div className="rounded-lg border border-app-border p-4">
                    <div className="flex items-center gap-2 text-app-muted">
                      <CalendarDays className="h-4 w-4" />
                      <span className="text-xs font-medium">
                        Registered
                      </span>
                    </div>

                    <p className="mt-2 text-sm font-medium text-app-foreground">
                      {formatDate(
                        selectedCitizen.created_at,
                      )}
                    </p>
                  </div>

                  <div className="rounded-lg border border-app-border p-4">
                    <div className="text-xs font-medium text-app-muted">
                      Account Status
                    </div>

                    <div className="mt-2">
                      <Badge
                        variant={
                          selectedCitizen.is_active
                            ? "green"
                            : "slate"
                        }
                      >
                        {selectedCitizen.is_active
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </section>

              {/* Profile */}
              <section className="border-t border-app-border pt-6">
                <h3 className="text-sm font-semibold text-app-foreground">
                  Citizen Profile
                </h3>

                {!selectedCitizen.profile ? (
                  <EmptyState
                    icon={<UserRound className="h-7 w-7" />}
                    title="Profile not completed"
                    message="This citizen has registered an account but has not completed their citizen profile yet."
                  />
                ) : (
                  <div className="mt-4 space-y-5">
                    {/* Personal */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                        Personal Information
                      </h4>

                      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <InfoItem
                          label="Date of Birth"
                          value={formatDate(
                            selectedCitizen.profile
                              .date_of_birth,
                          )}
                        />

                        <InfoItem
                          label="Gender"
                          value={
                            selectedCitizen.profile.gender
                          }
                        />

                        <InfoItem
                          label="Marital Status"
                          value={
                            selectedCitizen.profile
                              .marital_status
                          }
                        />

                        <InfoItem
                          label="Category"
                          value={
                            selectedCitizen.profile.category
                          }
                        />

                        <InfoItem
                          label="Family Size"
                          value={String(
                            selectedCitizen.profile
                              .family_size,
                          )}
                        />

                        <InfoItem
                          label="Disability"
                          value={
                            selectedCitizen.profile
                              .disability_status
                              ? "Yes"
                              : "No"
                          }
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-brand-primary" />

                        <h4 className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                          Location
                        </h4>
                      </div>

                      <div className="mt-3 grid gap-4 sm:grid-cols-3">
                        <InfoItem
                          label="State"
                          value={
                            selectedCitizen.profile.state
                          }
                        />

                        <InfoItem
                          label="District"
                          value={
                            selectedCitizen.profile.district
                          }
                        />

                        <InfoItem
                          label="Pincode"
                          value={
                            selectedCitizen.profile.pincode
                          }
                        />
                      </div>
                    </div>

                    {/* Education & Employment */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                        Education & Employment
                      </h4>

                      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <InfoItem
                          label="Education"
                          value={
                            selectedCitizen.profile
                              .education_level
                          }
                        />

                        <InfoItem
                          label="Employment"
                          value={
                            selectedCitizen.profile
                              .employment_status
                          }
                        />

                        <InfoItem
                          label="Occupation"
                          value={
                            selectedCitizen.profile
                              .occupation
                          }
                        />
                      </div>
                    </div>

                    {/* Financial */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                        Financial Information
                      </h4>

                      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoItem
                          label="Annual Income"
                          value={formatCurrency(
                            selectedCitizen.profile
                              .annual_income,
                          )}
                        />

                        <InfoItem
                          label="BPL Card"
                          value={
                            selectedCitizen.profile
                              .bpl_card
                              ? "Yes"
                              : "No"
                          }
                        />

                        <InfoItem
                          label="Land Holding"
                          value={`${selectedCitizen.profile.land_holding} units`}
                        />

                        <InfoItem
                          label="Profile Updated"
                          value={formatDate(
                            selectedCitizen.profile
                              .updated_at,
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-app-border px-6 py-4">
              <Button
                variant="secondary"
                onClick={closeDetails}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-app-border bg-app-background/40 p-3">
      <p className="text-xs font-medium text-app-muted">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-app-foreground">
        {value || "—"}
      </p>
    </div>
  );
}