import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createEmployeeCustomer,
} from "../../api/employeeCustomers";

export function CreateCustomer() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [created, setCreated] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

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
      setLoading(true);

      const response = await createEmployeeCustomer({
        full_name: name,
        email: customerEmail,
      });

      setTemporaryPassword(
        response.temporary_password,
      );

      setCreated(true);
    } catch (err) {
      console.error(err);

      const message =
        err &&
        typeof err === "object" &&
        "response" in err
          ? String(
              (
                err as {
                  response?: {
                    data?: {
                      detail?: string;
                    };
                  };
                }
              ).response?.data?.detail ??
                "Unable to create customer.",
            )
          : "Unable to create customer.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (created) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <Link
            to="/employee/customers"
            className="text-sm text-app-muted hover:text-app-foreground"
          >
            ← Back to Customers
          </Link>

          <p className="mt-6 text-sm font-medium text-brand-primary">
            Employee Portal
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-app-foreground">
            Customer Created
          </h1>

          <p className="mt-2 text-sm text-app-muted">
            The customer account has been created
            successfully.
          </p>
        </div>

        <div className="rounded-xl border border-app-border bg-white p-6 shadow-soft">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-semibold text-green-800">
              Account created successfully
            </p>

            <p className="mt-1 text-sm text-green-700">
              Give the temporary password to the customer.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-app-muted">
                Customer Name
              </p>

              <p className="mt-1 text-sm font-medium text-app-foreground">
                {fullName}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-app-muted">
                Email
              </p>

              <p className="mt-1 text-sm font-medium text-app-foreground">
                {email}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-app-muted">
                Temporary Password
              </p>

              <div className="mt-1 rounded-lg border border-app-border bg-app-background px-4 py-3">
                <p className="font-mono text-sm font-semibold text-app-foreground">
                  {temporaryPassword}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">
                Important
              </p>

              <p className="mt-1 text-sm text-amber-700">
                The customer must change this temporary
                password after their first login.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/employee/customers"
              className="rounded-lg border border-app-border px-4 py-2.5 text-sm font-medium text-app-foreground transition hover:bg-app-background"
            >
              View Customers
            </Link>

            <button
              type="button"
              onClick={() => {
                setFullName("");
                setEmail("");
                setTemporaryPassword("");
                setCreated(false);
              }}
              className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
            >
              Create Another Customer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          to="/employee/customers"
          className="text-sm text-app-muted hover:text-app-foreground"
        >
          ← Back to Customers
        </Link>

        <p className="mt-6 text-sm font-medium text-brand-primary">
          Employee Portal
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-app-foreground">
          Create New Customer
        </h1>

        <p className="mt-2 text-sm text-app-muted">
          Create a citizen account for a customer visiting
          the service center.
        </p>
      </div>

      <div className="rounded-xl border border-app-border bg-white p-6 shadow-soft">
        {error ? (
          <div className="mb-5 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-app-danger">
            {error}
          </div>
        ) : null}

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-app-foreground">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              placeholder="Enter customer's full name"
              autoComplete="name"
              className="w-full rounded-lg border border-app-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-primary"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-app-foreground">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter customer's email"
              autoComplete="email"
              className="w-full rounded-lg border border-app-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-primary"
            />
          </div>

          <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-800">
              Temporary password
            </p>

            <p className="mt-1 text-sm text-blue-700">
              A temporary password will be generated
              automatically after the account is created.
              The customer will be required to change it
              during their first login.
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Link
              to="/employee/customers"
              className="rounded-lg border border-app-border px-4 py-2.5 text-sm font-medium text-app-foreground transition hover:bg-app-background"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-brand-primary px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Customer..."
                : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}