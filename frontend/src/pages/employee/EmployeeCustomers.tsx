import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getEmployeeCustomers,
  type EmployeeCustomer,
} from "../../api/employeeCustomers";

export function EmployeeCustomers() {
  const [customers, setCustomers] = useState<EmployeeCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");

      const data = await getEmployeeCustomers("", "all");

      setCustomers(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load customers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return customers;
    }

    return customers.filter(
      (customer) =>
        customer.full_name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query),
    );
  }, [customers, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-brand-primary">
            Employee Portal
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-app-foreground">
            Customers
          </h1>

          <p className="mt-2 text-sm text-app-muted">
            View and manage citizens created through the service center.
          </p>
        </div>

        <Link
          to="/employee/customers/new"
          className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          + Create Customer
        </Link>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-app-border bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-app-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-primary"
          />

          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="rounded-lg border border-app-border px-4 py-2.5 text-sm font-medium text-app-foreground hover:bg-app-background"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {/* Customer list */}
      <div className="rounded-xl border border-app-border bg-white shadow-soft">
        <div className="border-b border-app-border px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-semibold text-app-foreground">
              Customer Accounts
            </h2>

            {!loading ? (
              <span className="text-sm text-app-muted">
                {filteredCustomers.length} customer
                {filteredCustomers.length === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-sm text-app-muted">
              Loading customers...
            </p>
          </div>
        ) : null}

        {/* Error */}
        {!loading && error ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadCustomers()}
              className="mt-4 rounded-lg border border-app-border px-4 py-2.5 text-sm font-medium text-app-foreground hover:bg-app-background"
            >
              Retry
            </button>
          </div>
        ) : null}

        {/* Empty */}
        {!loading && !error && filteredCustomers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-app-muted">
              {search
                ? "No customers match your search."
                : "No customer accounts found."}
            </p>

            {!search ? (
              <Link
                to="/employee/customers/new"
                className="mt-4 inline-flex rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                + Create Customer
              </Link>
            ) : null}
          </div>
        ) : null}

        {/* Customers */}
        {!loading && !error && filteredCustomers.length > 0 ? (
          <div className="divide-y divide-app-border">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium text-app-foreground">
                      {customer.full_name}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        customer.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {customer.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-app-muted">
                    {customer.email}
                  </p>

                  <p className="mt-1 text-xs text-app-muted">
                    Customer ID: {customer.id}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {customer.must_change_password ? (
                    <span className="text-xs text-amber-600">
                      Password change required
                    </span>
                  ) : null}

                  <Link
                    to={`/employee/customers/${customer.id}`}
                    className="rounded-lg border border-app-border px-4 py-2.5 text-sm font-medium text-app-foreground hover:bg-app-background"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}