import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getApplications } from "../../api/applications";
import {
  getEmployeeCustomers,
  getEmployeeCustomerProfile,
} from "../../api/employeeCustomers";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/errors";

export function EmployeeDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [metrics, setMetrics] = useState({
    customers: 0,
    profilesPending: 0,
    applications: 0,
  });

  async function loadMetrics() {
    try {
      setLoading(true);
      setError("");

      const [customers, applications] = await Promise.all([
        getEmployeeCustomers(),
        getApplications(),
      ]);

      const profileResults = await Promise.allSettled(
        customers.map((customer) =>
          getEmployeeCustomerProfile(customer.id),
        ),
      );

      const profilesCreated = profileResults.filter(
        (result) => result.status === "fulfilled",
      ).length;

      setMetrics({
        customers: customers.length,
        profilesPending: customers.length - profilesCreated,
        applications: applications.length,
      });
    } catch (err) {
      console.error(err);
      setError(
        getErrorMessage(
          err,
          "Unable to load employee dashboard metrics.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadMetrics();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-primary">
          Employee Portal
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-app-foreground">
          Welcome, {user?.full_name}
        </h1>

        <p className="mt-2 text-sm text-app-muted">
          Manage citizen accounts and assist customers with government
          scheme services.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-app-danger">
            {error}
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-app-border bg-white p-5 shadow-soft">
          <p className="text-sm text-app-muted">
            Total Customers
          </p>

          <p className="mt-3 text-3xl font-semibold text-app-foreground">
            {loading ? "..." : metrics.customers}
          </p>
        </div>

        <div className="rounded-xl border border-app-border bg-white p-5 shadow-soft">
          <p className="text-sm text-app-muted">
            Profiles Pending
          </p>

          <p className="mt-3 text-3xl font-semibold text-app-foreground">
            {loading ? "..." : metrics.profilesPending}
          </p>
        </div>

        <div className="rounded-xl border border-app-border bg-white p-5 shadow-soft">
          <p className="text-sm text-app-muted">
            Applications Assisted
          </p>

          <p className="mt-3 text-3xl font-semibold text-app-foreground">
            {loading ? "..." : metrics.applications}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-app-border bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-app-foreground">
          Quick Actions
        </h2>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/employee/customers/new"
            className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            + Create New Customer
          </Link>

          <Link
            to="/employee/customers"
            className="rounded-lg border border-app-border px-4 py-2.5 text-sm font-medium text-app-foreground transition hover:bg-app-background"
          >
            View Customers
          </Link>
        </div>
      </div>
    </div>
  );
}
