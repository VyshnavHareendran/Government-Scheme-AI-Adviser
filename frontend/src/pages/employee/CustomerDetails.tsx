import { AlertTriangle, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getEmployeeCustomer,
  updateEmployeeCustomer,
  updateEmployeeCustomerStatus,
  resetEmployeeCustomerPassword,
  deleteEmployeeCustomer,
  getEmployeeCustomerProfile,
  createEmployeeCustomerProfile,
  updateEmployeeCustomerProfile,
  getEmployeeCustomerEligibility,
  getEmployeeCustomerRecommendations,
  getEmployeeCustomerApplications,
  type EmployeeCustomer,
} from "../../api/employeeCustomers";


import { getErrorMessage } from "../../utils/errors";

import { ProfileForm } from "../../components/profile/ProfileForm";

import type {
  CitizenProfile,
  CitizenProfilePayload,
  EligibilityResponse,
  RecommendationsResponse,
  Application,
  ApplicationStatus,
} from "../../types/api";

import {
  updateApplicationStatus,
} from "../../api/applications";

const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Not Started",
  "In Progress",
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
];

export function CustomerDetails() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<EmployeeCustomer | null>(null);

  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const [eligibility, setEligibility] =
    useState<EligibilityResponse | null>(null);

  const [eligibilityLoading, setEligibilityLoading] =
    useState(true);

  const [eligibilityError, setEligibilityError] =
    useState("");

  const [recommendations, setRecommendations] =
    useState<RecommendationsResponse | null>(null);

  const [recommendationsLoading, setRecommendationsLoading] =
    useState(true);

  const [recommendationsError, setRecommendationsError] =
    useState("");

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [applicationsLoading, setApplicationsLoading] =
    useState(true);

  const [applicationsError, setApplicationsError] =
    useState("");

  const [applicationActionLoading, setApplicationActionLoading] =
    useState<number | null>(null);

  const [applicationDrafts, setApplicationDrafts] =
    useState<Record<number, { status: ApplicationStatus; notes: string }>>({});

  const [applicationUpdateSuccess, setApplicationUpdateSuccess] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [temporaryPassword, setTemporaryPassword] = useState("");

  async function loadCustomer() {
    if (!customerId) {
      setError("Invalid customer ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getEmployeeCustomer(
        Number(customerId),
      );

      setCustomer(data);
      setFullName(data.full_name);
      setEmail(data.email);
    } catch (err) {
      console.error(err);

      setError(
        getErrorMessage(
          err,
          "Unable to load customer.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadCustomerProfile() {
    if (!customerId) {
        setProfileError("Invalid customer ID.");
        setProfileLoading(false);
        return;
    }

    try {
        setProfileLoading(true);
        setProfileError("");

        const data = await getEmployeeCustomerProfile(
        Number(customerId),
        );

        setProfile(data);
    } catch (err) {
        console.error(err);

        if (
        err &&
        typeof err === "object" &&
        "response" in err
        ) {
        const response = (
            err as {
            response?: {
                status?: number;
            };
            }
        ).response;

        if (response?.status === 404) {
            // Customer exists, but profile does not.
            setProfile(null);
            return;
        }
        }

        setProfileError(
        getErrorMessage(
            err,
            "Unable to load customer profile.",
        ),
        );
    } finally {
        setProfileLoading(false);
    }
  }

  async function loadCustomerEligibility() {
  if (!customerId) {
    setEligibilityError("Invalid customer ID.");
    setEligibilityLoading(false);
    return;
  }

  try {
    setEligibilityLoading(true);
    setEligibilityError("");

    const data =
      await getEmployeeCustomerEligibility(
        Number(customerId),
      );

    setEligibility(data);
  } catch (err) {
    console.error(err);

    setEligibilityError(
      getErrorMessage(
        err,
        "Unable to load eligibility.",
      ),
    );
  } finally {
    setEligibilityLoading(false);
  }
}


async function loadCustomerRecommendations() {
    if (!customerId) {
      setRecommendationsError("Invalid customer ID.");
      setRecommendationsLoading(false);
      return;
    }

    try {
      setRecommendationsLoading(true);
      setRecommendationsError("");

      const data =
        await getEmployeeCustomerRecommendations(
          Number(customerId),
        );

      setRecommendations(data);
    } catch (err) {
      console.error(err);

      setRecommendationsError(
        getErrorMessage(
          err,
          "Unable to load AI recommendations.",
        ),
      );
    } finally {
      setRecommendationsLoading(false);
    }
}

async function loadCustomerApplications() {
  if (!customerId) {
    setApplicationsError("Invalid customer ID.");
    setApplicationsLoading(false);
    return;
  }

  try {
    setApplicationsLoading(true);
    setApplicationsError("");

    const data = await getEmployeeCustomerApplications(
      Number(customerId),
    );

    setApplications(data);
    setApplicationDrafts(
      Object.fromEntries(
        data.map((application) => [
          application.id,
          {
            status: application.status,
            notes: application.notes ?? "",
          },
        ]),
      ),
    );
  } catch (err) {
    console.error(err);

    setApplicationsError(
      getErrorMessage(
        err,
        "Unable to load customer applications.",
      ),
    );
  } finally {
    setApplicationsLoading(false);
  }
}



  useEffect(() => {
    void loadCustomer();
    void loadCustomerProfile();
    void loadCustomerEligibility();
    void loadCustomerRecommendations();
    void loadCustomerApplications();
  }, [customerId]);

  async function handleProfileSubmit(
    payload: CitizenProfilePayload,
    exists: boolean,
    ) {
    if (!customer) {
        throw new Error("Customer not found.");
    }

    try {
        setProfileError("");

        const saved = exists
        ? await updateEmployeeCustomerProfile(
            customer.id,
            payload,
            )
        : await createEmployeeCustomerProfile(
            customer.id,
            payload,
            );

        setProfile(saved);
    } catch (err) {
        console.error(err);

        throw new Error(
        getErrorMessage(
            err,
            "Unable to save customer profile.",
        ),
        );
    }
    }

  async function handleApplicationStatusUpdate(
    application: Application,
  ) {
    const draft = applicationDrafts[application.id] ?? {
      status: application.status,
      notes: application.notes ?? "",
    };

    try {
      setApplicationActionLoading(application.id);
      setError("");
      setSuccess("");

      const updated = await updateApplicationStatus(
        application.id,
        {
          status: draft.status,
          notes: draft.notes.trim() || null,
        },
      );

      setApplicationUpdateSuccess(application.id);

      setApplications((current) =>
        current.map((currentApplication) =>
          currentApplication.id === application.id
            ? updated
            : currentApplication,
        ),
      );
      setApplicationDrafts((current) => ({
        ...current,
        [updated.id]: {
          status: updated.status,
          notes: updated.notes ?? "",
        },
      }));

      setSuccess(
        `Application #${updated.id} updated successfully.`,
      );
    } catch (err) {
      console.error(err);

      setError(
        getErrorMessage(
          err,
          "Unable to update application status.",
        ),
      );
    } finally {
      setApplicationActionLoading(null);
    }
  }

  async function handleSave() {
    if (!customer) {
      return;
    }

    const name = fullName.trim();
    const customerEmail = email.trim().toLowerCase();

    if (!name) {
      setError("Full name is required.");
      return;
    }

    if (!customerEmail) {
      setError("Email is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await updateEmployeeCustomer(
        customer.id,
        {
          full_name: name,
          email: customerEmail,
        },
      );

      setCustomer(updated);
      setFullName(updated.full_name);
      setEmail(updated.email);

      setSuccess("Customer details updated successfully.");
    } catch (err) {
      console.error(err);

      setError(
        getErrorMessage(
          err,
          "Unable to update customer.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange() {
    if (!customer) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const updated =
        await updateEmployeeCustomerStatus(
            customer.id,
            {
            is_active: !customer.is_active,
            },
        );

      setCustomer(updated);

      setSuccess(
        updated.is_active
          ? "Customer account activated."
          : "Customer account deactivated.",
      );
    } catch (err) {
      console.error(err);

      setError(
        getErrorMessage(
          err,
          "Unable to update customer status.",
        ),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!customer) {
      return;
    }

    const confirmed = window.confirm(
      "Reset this customer's password?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");
      setTemporaryPassword("");

      const response =
        await resetEmployeeCustomerPassword(
          customer.id,
        );

      setCustomer(response.customer);
      setTemporaryPassword(
        response.temporary_password,
      );

      setSuccess(
        "Password reset successfully. Share the temporary password securely with the customer.",
      );
    } catch (err) {
      console.error(err);

      setError(
        getErrorMessage(
          err,
          "Unable to reset customer password.",
        ),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!customer) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await deleteEmployeeCustomer(
        customer.id,
      );

      navigate("/employee/customers");
    } catch (err) {
      console.error(err);

      setError(
        getErrorMessage(
          err,
          "Unable to delete customer.",
        ),
      );

      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-app-border bg-white p-8 shadow-soft">
        <p className="text-sm text-app-muted">
          Loading customer...
        </p>
      </div>
    );
  }

  if (error && !customer) {
    return (
      <div className="space-y-5">
        <Link
          to="/employee/customers"
          className="text-sm text-app-muted hover:text-app-foreground"
        >
          &lt;- Back to Customers
        </Link>

        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-soft">
          <p className="text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={loadCustomer}
            className="mt-4 rounded-lg border border-app-border px-4 py-2 text-sm font-medium hover:bg-app-background"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to="/employee/customers"
        className="text-sm text-app-muted hover:text-app-foreground"
      >
        &lt;- Back to Customers
      </Link>

      <div>
        <p className="text-sm font-medium text-brand-primary">
          Employee Portal
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-app-foreground">
          Customer Details
        </h1>

        <p className="mt-2 text-sm text-app-muted">
          View and manage this citizen account.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      ) : null}

      {temporaryPassword ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-medium text-amber-800">
            Temporary Password
          </p>

          <p className="mt-2 break-all rounded-lg border border-amber-200 bg-white px-4 py-3 font-mono text-lg font-semibold text-app-foreground">
            {temporaryPassword}
          </p>

          <p className="mt-2 text-xs text-amber-700">
            This password is shown only here. Ask the
            customer to change it after signing in.
          </p>
        </div>
      ) : null}

      <div className="rounded-xl border border-app-border bg-white p-6 shadow-soft">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-lg font-semibold text-app-foreground">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-app-muted">
              Customer ID: {customer.id}
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-sm font-medium ${
              customer.is_active
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {customer.is_active
              ? "Active"
              : "Inactive"}
          </span>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-app-foreground">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-app-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-app-foreground">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-app-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={saving || actionLoading}
            onClick={handleSave}
            className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            disabled={actionLoading || saving}
            onClick={handleStatusChange}
            className="rounded-lg border border-app-border px-4 py-2.5 text-sm font-medium text-app-foreground hover:bg-app-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            {actionLoading
              ? "Processing..."
              : customer.is_active
                ? "Deactivate Account"
                : "Activate Account"}
          </button>

          <button
            type="button"
            disabled={actionLoading || saving}
            onClick={handleResetPassword}
            className="rounded-lg border border-app-border px-4 py-2.5 text-sm font-medium text-app-foreground hover:bg-app-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reset Password
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
            <h2 className="text-lg font-semibold text-app-foreground">
            Citizen Profile
            </h2>

            <p className="mt-1 text-sm text-app-muted">
            Manage the citizen information used for
            eligibility checking and AI recommendations.
            </p>
        </div>

        {profileLoading ? (
            <div className="rounded-xl border border-app-border bg-white p-6 shadow-soft">
            <p className="text-sm text-app-muted">
                Loading citizen profile...
            </p>
            </div>
        ) : null}

        {!profileLoading && profileError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm text-red-600">
                {profileError}
            </p>

            <button
                type="button"
                onClick={() => void loadCustomerProfile()}
                className="mt-4 rounded-lg border border-app-border bg-white px-4 py-2.5 text-sm font-medium text-app-foreground hover:bg-app-background"
            >
                Retry
            </button>
            </div>
        ) : null}

        {!profileLoading && !profileError ? (
            <ProfileForm
            key={profile?.updated_at ?? `new-${customer.id}`}
            profile={profile}
            onSubmit={handleProfileSubmit}
            />
        ) : null}
      </div>

      <div className="space-y-6">

        {/* Eligibility */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-app-foreground">
              Eligibility
            </h2>

            <p className="mt-1 text-sm text-app-muted">
              Government schemes this customer currently qualifies for.
            </p>
          </div>

          {eligibilityLoading ? (
            <div className="rounded-xl border border-app-border bg-white p-6 shadow-soft">
              <p className="text-sm text-app-muted">
                Checking eligibility...
              </p>
            </div>
          ) : null}

          {!eligibilityLoading && eligibilityError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm text-red-600">
                {eligibilityError}
              </p>

              <button
                type="button"
                onClick={() => void loadCustomerEligibility()}
                className="mt-4 rounded-lg border border-app-border bg-white px-4 py-2.5 text-sm font-medium text-app-foreground hover:bg-app-background"
              >
                Retry
              </button>
            </div>
          ) : null}

          {!eligibilityLoading &&
          !eligibilityError &&
          eligibility ? (
            <div className="rounded-xl border border-app-border bg-white p-6 shadow-soft">

              <p className="text-sm text-app-muted">
                {eligibility.eligible_count} eligible scheme
                {eligibility.eligible_count === 1 ? "" : "s"}
              </p>

              {eligibility.eligible_schemes.length === 0 ? (
                <p className="mt-4 text-sm text-app-muted">
                  No eligible schemes found for this customer.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {eligibility.eligible_schemes.map((scheme) => (
                    <div
                      key={scheme.id}
                      className="rounded-lg border border-app-border p-4"
                    >
                      <h3 className="font-semibold text-app-foreground">
                        {scheme.scheme_name}
                      </h3>

                      <p className="mt-1 text-sm text-app-muted">
                        {scheme.department}
                      </p>

                      <p className="mt-2 text-sm text-app-muted">
                        {scheme.description}
                      </p>

                      {scheme.official_url ? (
                        <a
                          href={scheme.official_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-block text-sm font-medium text-brand-primary hover:underline"
                        >
                          View Official Scheme
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>


        {/* AI Recommendations */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-app-foreground">
              AI Recommendations
            </h2>

            <p className="mt-1 text-sm text-app-muted">
              AI-ranked government schemes recommended for this customer.
            </p>
          </div>

          {recommendationsLoading ? (
            <div className="rounded-xl border border-app-border bg-white p-6 shadow-soft">
              <p className="text-sm text-app-muted">
                Generating AI recommendations...
              </p>
            </div>
          ) : null}

          {!recommendationsLoading && recommendationsError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm text-red-600">
                {recommendationsError}
              </p>

              <button
                type="button"
                onClick={() => void loadCustomerRecommendations()}
                className="mt-4 rounded-lg border border-app-border bg-white px-4 py-2.5 text-sm font-medium text-app-foreground hover:bg-app-background"
              >
                Retry
              </button>
            </div>
          ) : null}

          {!recommendationsLoading &&
          !recommendationsError &&
          recommendations ? (
            <div className="rounded-xl border border-app-border bg-white p-6 shadow-soft">

              <p className="text-sm text-app-muted">
                {recommendations.recommendation_count} recommendation
                {recommendations.recommendation_count === 1 ? "" : "s"}
              </p>

              {recommendations.recommendations.length === 0 ? (
                <p className="mt-4 text-sm text-app-muted">
                  No recommendations available for this customer.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {recommendations.recommendations.map(
                    (recommendation) => (
                      <div
                        key={recommendation.id}
                        className="rounded-lg border border-app-border p-4"
                      >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div>
                            <h3 className="font-semibold text-app-foreground">
                              {recommendation.scheme_name}
                            </h3>

                            <p className="mt-1 text-sm text-app-muted">
                              {recommendation.department}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <span className="rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-medium text-brand-primary">
                              Score: {recommendation.score}
                            </span>

                              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                                AI: {Math.round(recommendation.ai_confidence)}%
                              </span>
                          </div>
                        </div>

                        <p className="mt-3 text-sm text-app-muted">
                          {recommendation.description}
                        </p>

                        {recommendation.reasons.length > 0 ? (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-app-foreground">
                              Why this is recommended
                            </p>

                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-app-muted">
                              {recommendation.reasons.map(
                                (reason, index) => (
                                  <li key={index}>
                                    {reason}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        ) : null}

                        {recommendation.official_url ? (
                          <a
                            href={recommendation.official_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-block text-sm font-medium text-brand-primary hover:underline"
                          >
                            View Official Scheme
                          </a>
                        ) : null}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>

      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-app-foreground">
            Applications
          </h2>

          <p className="mt-1 text-sm text-app-muted">
            View and manage applications submitted by this customer.
          </p>
        </div>

        {applicationsLoading ? (
          <div className="rounded-xl border border-app-border bg-white p-6 shadow-soft">
            <p className="text-sm text-app-muted">
              Loading applications...
            </p>
          </div>
        ) : null}

        {!applicationsLoading && applicationsError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm text-red-600">
              {applicationsError}
            </p>

            <button
              type="button"
              onClick={() => void loadCustomerApplications()}
              className="mt-4 rounded-lg border border-app-border bg-white px-4 py-2.5 text-sm font-medium text-app-foreground hover:bg-app-background"
            >
              Retry
            </button>
          </div>
        ) : null}

        {!applicationsLoading && !applicationsError ? (
          <div className="rounded-xl border border-app-border bg-white p-6 shadow-soft">
            <p className="text-sm text-app-muted">
              {applications.length} application
              {applications.length === 1 ? "" : "s"}
            </p>

            {applications.length === 0 ? (
              <p className="mt-4 text-sm text-app-muted">
                This customer has not submitted any applications yet.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {applications.map((application) => {
                  const draft = applicationDrafts[application.id] ?? {
                    status: application.status,
                    notes: application.notes ?? "",
                  };

                  return (
                    <div
                      key={application.id}
                      className="rounded-lg border border-app-border p-4"
                    >
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                          <h3 className="font-semibold text-app-foreground">
                            Application #{application.id}
                          </h3>

                          <p className="mt-1 text-sm text-app-muted">
                            {application.scheme.scheme_name}
                          </p>

                          <p className="mt-1 text-xs text-app-muted">
                            {application.scheme.department}
                          </p>

                          <p className="mt-1 text-xs text-app-muted">
                            Application started{" "}
                            {new Date(
                              application.created_at,
                            ).toLocaleDateString()}
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${getApplicationStatusClass(application.status)}`}
                        >
                          {application.status}
                        </span>
                      </div>

                      {application.scheme.official_url ? (
                        <a
                          href={application.scheme.official_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-block rounded-lg border border-app-border px-3 py-2 text-sm font-medium text-brand-primary hover:bg-app-background"
                        >
                          Open Official Portal
                        </a>
                      ) : null}

                      <div className="mt-5 rounded-lg bg-app-background p-4">
                        <p className="text-sm font-medium text-app-foreground">
                          Status Management
                        </p>
                        <p className="mt-1 text-xs text-app-muted">
                          Update the tracking status and add notes visible to the citizen.
                        </p>

                        <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr]">
                          <div>
                            <label className="text-sm font-medium text-app-foreground">
                              Current Status
                            </label>
                            <select
                              value={draft.status}
                              onChange={(event) =>
                                setApplicationDrafts((current) => ({
                                  ...current,
                                  [application.id]: {
                                    ...draft,
                                    status: event.target.value as ApplicationStatus,
                                  },
                                }))
                              }
                              className="mt-2 w-full rounded-lg border border-app-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-primary"
                            >
                              {APPLICATION_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-app-foreground">
                              Notes
                            </label>
                            <textarea
                              value={draft.notes}
                              onChange={(event) =>
                                setApplicationDrafts((current) => ({
                                  ...current,
                                  [application.id]: {
                                    ...draft,
                                    notes: event.target.value,
                                  },
                                }))
                              }
                              rows={3}
                              className="mt-2 w-full resize-y rounded-lg border border-app-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-primary"
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                          <button
                            type="button"
                            disabled={applicationActionLoading === application.id}
                            onClick={() =>
                              void handleApplicationStatusUpdate(application)
                            }
                            className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {applicationActionLoading === application.id
                              ? "Updating..."
                              : "Update Application"}
                          </button>

                          {applicationUpdateSuccess === application.id && (
                            <p className="text-sm font-medium text-green-700">
                              ✓ Application #{application.id} updated successfully.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
      </div>
      


      <div className="rounded-xl border border-red-200 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-red-700">
          Danger Zone
        </h2>

        <p className="mt-2 text-sm text-app-muted">
          Deleting this customer permanently removes
          their account and associated citizen profile.
        </p>

        <button
          type="button"
          disabled={actionLoading || saving}
          onClick={() => setDeleteConfirmOpen(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
          Delete Customer
        </button>
      </div>
        
      {/* Delete Customer Confirmation Modal */}
      {deleteConfirmOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-customer-title"
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-app-border bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <h2
                    id="delete-customer-title"
                    className="text-lg font-semibold text-app-foreground"
                  >
                    Delete Customer?
                  </h2>

                  <p className="mt-1 text-sm text-app-muted">
                    You are about to permanently delete this customer
                    account.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm font-semibold text-red-800">
                  {customer.full_name}
                </p>

                <p className="mt-1 break-all text-sm text-red-700">
                  {customer.email}
                </p>

                <p className="mt-3 text-xs leading-5 text-red-700">
                  This action cannot be undone. The customer account and
                  associated citizen profile will be permanently removed.
                </p>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  disabled={actionLoading}
                  className="rounded-lg border border-app-border px-4 py-2.5 text-sm font-medium text-app-foreground hover:bg-app-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void handleDelete()}
                  disabled={actionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />

                  {actionLoading
                    ? "Deleting..."
                    : "Delete Customer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
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

