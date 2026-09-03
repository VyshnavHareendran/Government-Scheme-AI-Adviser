import {
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  createAdminScheme,
  deleteAdminScheme,
  getAdminSchemes,
  updateAdminScheme,
  type AdminSchemeCreatePayload,
} from "../../api/adminSchemes";

import type { Scheme } from "../../types/api";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { CardSkeleton } from "../../components/ui/Skeleton";

type FormState = {
  scheme_name: string;
  category: string;
  department: string;
  description: string;
  official_url: string;
  income_limit: string;
  minimum_age: string;
  maximum_age: string;
  requires_land: boolean;
  requires_bpl: boolean;
  disability_priority: boolean;
  target_occupations: string;
  preferred_employment: string;
  preferred_education: string;
};

const emptyForm: FormState = {
  scheme_name: "",
  category: "",
  department: "",
  description: "",
  official_url: "",
  income_limit: "",
  minimum_age: "",
  maximum_age: "",
  requires_land: false,
  requires_bpl: false,
  disability_priority: false,
  target_occupations: "",
  preferred_employment: "",
  preferred_education: "",
};

function schemeToForm(scheme: Scheme): FormState {
  return {
    scheme_name: scheme.scheme_name,
    category: scheme.category,
    department: scheme.department,
    description: scheme.description,
    official_url: scheme.official_url,
    income_limit: scheme.income_limit?.toString() ?? "",
    minimum_age: scheme.minimum_age?.toString() ?? "",
    maximum_age: scheme.maximum_age?.toString() ?? "",
    requires_land: scheme.requires_land,
    requires_bpl: scheme.requires_bpl,
    disability_priority: scheme.disability_priority,
    target_occupations: scheme.target_occupations.join(", "),
    preferred_employment: scheme.preferred_employment.join(", "),
    preferred_education: scheme.preferred_education.join(", "),
  };
}

function listFromText(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function nullableNumber(value: string): number | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const number = Number(trimmed);

  return Number.isFinite(number) ? number : null;
}

export function AdminSchemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState("");

  async function loadSchemes() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminSchemes();
      setSchemes(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load government schemes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSchemes();
  }, []);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(schemes.map((scheme) => scheme.category)),
      ).sort(),
    [schemes],
  );

  const filteredSchemes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return schemes
      .filter((scheme) => {
        if (statusFilter === "active") {
          return scheme.is_active;
        }

        if (statusFilter === "inactive") {
          return !scheme.is_active;
        }

        return true;
      })
      .filter((scheme) => {
        if (!category) {
          return true;
        }

        return scheme.category === category;
      })
      .filter((scheme) => {
        if (!normalizedQuery) {
          return true;
        }

        return [
          scheme.scheme_name,
          scheme.category,
          scheme.department,
          scheme.description,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) =>
        a.scheme_name.localeCompare(b.scheme_name),
      );
  }, [category, query, schemes, statusFilter]);

  function openCreateForm() {
    setEditingScheme(null);
    setForm(emptyForm);
    setFormError("");
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  }

  function openEditForm(scheme: Scheme) {
    setEditingScheme(scheme);
    setForm(schemeToForm(scheme));
    setFormError("");
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setIsFormOpen(false);
    setEditingScheme(null);
    setForm(emptyForm);
    setFormError("");
  }

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function buildPayload(): AdminSchemeCreatePayload {
    return {
      scheme_name: form.scheme_name.trim(),
      category: form.category.trim(),
      department: form.department.trim(),
      description: form.description.trim(),
      official_url: form.official_url.trim(),
      income_limit: nullableNumber(form.income_limit),
      minimum_age: nullableNumber(form.minimum_age),
      maximum_age: nullableNumber(form.maximum_age),
      requires_land: form.requires_land,
      requires_bpl: form.requires_bpl,
      disability_priority: form.disability_priority,
      target_occupations: listFromText(form.target_occupations),
      preferred_employment: listFromText(form.preferred_employment),
      preferred_education: listFromText(form.preferred_education),
    };
  }

  function validateForm(): string | null {
    if (!form.scheme_name.trim()) {
      return "Scheme name is required.";
    }

    if (!form.category.trim()) {
      return "Category is required.";
    }

    if (!form.department.trim()) {
      return "Department is required.";
    }

    if (!form.description.trim()) {
      return "Description is required.";
    }

    if (!form.official_url.trim()) {
      return "Official URL is required.";
    }

    try {
      new URL(form.official_url.trim());
    } catch {
      return "Please enter a valid official URL.";
    }

    if (
      form.income_limit.trim() &&
      nullableNumber(form.income_limit) === null
    ) {
      return "Income limit must be a valid number.";
    }

    if (
      form.minimum_age.trim() &&
      nullableNumber(form.minimum_age) === null
    ) {
      return "Minimum age must be a valid number.";
    }

    if (
      form.maximum_age.trim() &&
      nullableNumber(form.maximum_age) === null
    ) {
      return "Maximum age must be a valid number.";
    }

    if (
      form.minimum_age.trim() &&
      form.maximum_age.trim() &&
      Number(form.minimum_age) > Number(form.maximum_age)
    ) {
      return "Minimum age cannot be greater than maximum age.";
    }

    return null;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setFormError("");
    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload = buildPayload();

    try {
      setSaving(true);

      if (editingScheme) {
        const updated = await updateAdminScheme(
          editingScheme.id,
          payload,
        );

        setSchemes((current) =>
          current.map((scheme) =>
            scheme.id === updated.id ? updated : scheme,
          ),
        );

        setSuccess("Scheme updated successfully.");
      } else {
        const created = await createAdminScheme(payload);

        setSchemes((current) => [
          created,
          ...current,
        ]);

        setSuccess("Scheme created successfully.");
      }

      setIsFormOpen(false);
      setEditingScheme(null);
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
      setFormError(
        "Unable to save the scheme. Please check the entered information.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(scheme: Scheme) {
    try {
      setError("");
      setSuccess("");

      const updated = await updateAdminScheme(
        scheme.id,
        {
          is_active: !scheme.is_active,
        },
      );

      setSchemes((current) =>
        current.map((item) =>
          item.id === updated.id ? updated : item,
        ),
      );

      setSuccess(
        updated.is_active
          ? "Scheme activated successfully."
          : "Scheme deactivated successfully.",
      );
    } catch (err) {
      console.error(err);
      setError("Unable to update scheme status.");
    }
  }

  async function handleDelete(scheme: Scheme) {
    const confirmed = window.confirm(
      `Delete "${scheme.scheme_name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(scheme.id);
      setError("");
      setSuccess("");

      await deleteAdminScheme(scheme.id);

      setSchemes((current) =>
        current.filter((item) => item.id !== scheme.id),
      );

      setSuccess("Scheme deleted successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to delete the scheme.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
            Administration
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-app-foreground">
            Scheme Management
          </h1>

          <p className="mt-1 text-sm text-app-muted">
            Create, configure, update, and manage government schemes.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={() => void loadSchemes()}
            disabled={loading}
          >
            Refresh
          </Button>

          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={openCreateForm}
          >
            Add Scheme
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-app-danger">
            {error}
          </p>

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

      {success && (
        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm text-app-success">
            {success}
          </p>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="text-app-success"
            aria-label="Dismiss success message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <Card>
        <div className="grid gap-4 md:grid-cols-[1fr_220px_180px]">
          <div className="relative">
            <Input
              label="Search"
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search schemes, departments, categories..."
            />

            <Search className="pointer-events-none absolute right-3 top-8 h-4 w-4 text-app-muted" />
          </div>

          <Select
            label="Category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            options={categories}
            placeholder="All categories"
          />

          <Select
            label="Status"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            options={["all", "active", "inactive"]}
          />
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="space-y-4 p-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredSchemes.length === 0 ? (
          <EmptyState
            title="No schemes found"
            message="Try adjusting your search or filters, or add a new government scheme."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b border-app-border bg-app-background">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Scheme
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Category
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Department
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-app-border">
                {filteredSchemes.map((scheme) => (
                  <tr
                    key={scheme.id}
                    className="transition hover:bg-app-background/60"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-app-foreground">
                        {scheme.scheme_name}
                      </p>

                      <p className="mt-1 max-w-md truncate text-xs text-app-muted">
                        {scheme.description}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <Badge variant="teal">
                        {scheme.category}
                      </Badge>
                    </td>

                    <td className="px-5 py-4 text-sm text-app-muted">
                      {scheme.department}
                    </td>

                    <td className="px-5 py-4">
                      <Badge
                        variant={
                          scheme.is_active
                            ? "green"
                            : "slate"
                        }
                      >
                        {scheme.is_active
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          className="px-2"
                          onClick={() =>
                            openEditForm(scheme)
                          }
                          icon={
                            <Pencil className="h-4 w-4" />
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          variant="secondary"
                          className="px-2"
                          onClick={() =>
                            void handleToggleStatus(scheme)
                          }
                        >
                          {scheme.is_active
                            ? "Deactivate"
                            : "Activate"}
                        </Button>

                        <Button
                          variant="danger"
                          className="px-2"
                          disabled={deletingId === scheme.id}
                          isLoading={deletingId === scheme.id}
                          onClick={() =>
                            void handleDelete(scheme)
                          }
                          icon={
                            deletingId === scheme.id ? undefined : (
                              <Trash2 className="h-4 w-4" />
                            )
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="scheme-form-title"
        >
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-app-border bg-white shadow-xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-app-border bg-white px-6 py-4">
              <div>
                <h2
                  id="scheme-form-title"
                  className="text-lg font-semibold text-app-foreground"
                >
                  {editingScheme
                    ? "Edit Government Scheme"
                    : "Add Government Scheme"}
                </h2>

                <p className="mt-1 text-sm text-app-muted">
                  Configure scheme details and eligibility rules.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-md p-2 text-app-muted hover:bg-slate-100 hover:text-app-foreground disabled:opacity-50"
                aria-label="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              className="space-y-6 p-6"
              onSubmit={handleSubmit}
            >
              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-app-danger">
                    {formError}
                  </p>
                </div>
              )}

              <section>
                <h3 className="text-sm font-semibold text-app-foreground">
                  Basic Information
                </h3>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Input
                    label="Scheme Name"
                    value={form.scheme_name}
                    onChange={(event) =>
                      updateField("scheme_name", event.target.value)
                    }
                    placeholder="e.g. PM-KISAN"
                  />

                  <Input
                    label="Category"
                    value={form.category}
                    onChange={(event) =>
                      updateField("category", event.target.value)
                    }
                    placeholder="e.g. Agriculture"
                  />

                  <Input
                    label="Department"
                    value={form.department}
                    onChange={(event) =>
                      updateField("department", event.target.value)
                    }
                    placeholder="e.g. Ministry of Agriculture"
                  />

                  <Input
                    label="Official URL"
                    type="url"
                    value={form.official_url}
                    onChange={(event) =>
                      updateField("official_url", event.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="mt-4">
                  <label
                    className="mb-1.5 block text-sm font-medium text-app-text"
                    htmlFor="scheme-description"
                  >
                    Description
                  </label>

                  <textarea
                    id="scheme-description"
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    rows={4}
                    placeholder="Describe the government scheme..."
                    className="w-full rounded-md border border-app-border bg-white px-3 py-2 text-sm text-app-text shadow-soft focus:border-brand-primary"
                  />
                </div>
              </section>

              <section className="border-t border-app-border pt-6">
                <h3 className="text-sm font-semibold text-app-foreground">
                  Eligibility Configuration
                </h3>

                <p className="mt-1 text-xs text-app-muted">
                  These values are used by the eligibility and recommendation systems.
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <Input
                    label="Income Limit"
                    type="number"
                    min="0"
                    value={form.income_limit}
                    onChange={(event) =>
                      updateField("income_limit", event.target.value)
                    }
                    placeholder="Optional"
                  />

                  <Input
                    label="Minimum Age"
                    type="number"
                    min="0"
                    value={form.minimum_age}
                    onChange={(event) =>
                      updateField("minimum_age", event.target.value)
                    }
                    placeholder="Optional"
                  />

                  <Input
                    label="Maximum Age"
                    type="number"
                    min="0"
                    value={form.maximum_age}
                    onChange={(event) =>
                      updateField("maximum_age", event.target.value)
                    }
                    placeholder="Optional"
                  />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-app-border p-3">
                    <input
                      type="checkbox"
                      checked={form.requires_land}
                      onChange={(event) =>
                        updateField("requires_land", event.target.checked)
                      }
                    />

                    <span>
                      <span className="block text-sm font-medium">
                        Requires Land
                      </span>

                      <span className="text-xs text-app-muted">
                        Applicant must have land.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-app-border p-3">
                    <input
                      type="checkbox"
                      checked={form.requires_bpl}
                      onChange={(event) =>
                        updateField("requires_bpl", event.target.checked)
                      }
                    />

                    <span>
                      <span className="block text-sm font-medium">
                        Requires BPL
                      </span>

                      <span className="text-xs text-app-muted">
                        BPL status is required.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-app-border p-3">
                    <input
                      type="checkbox"
                      checked={form.disability_priority}
                      onChange={(event) =>
                        updateField(
                          "disability_priority",
                          event.target.checked,
                        )
                      }
                    />

                    <span>
                      <span className="block text-sm font-medium">
                        Disability Priority
                      </span>

                      <span className="text-xs text-app-muted">
                        Gives disability applicants priority.
                      </span>
                    </span>
                  </label>
                </div>
              </section>

              <section className="border-t border-app-border pt-6">
                <h3 className="text-sm font-semibold text-app-foreground">
                  Recommendation Configuration
                </h3>

                <p className="mt-1 text-xs text-app-muted">
                  Enter multiple values separated by commas.
                </p>

                <div className="mt-4 space-y-4">
                  <Input
                    label="Target Occupations"
                    value={form.target_occupations}
                    onChange={(event) =>
                      updateField(
                        "target_occupations",
                        event.target.value,
                      )
                    }
                    placeholder="Farmer, Agricultural Worker"
                  />

                  <Input
                    label="Preferred Employment"
                    value={form.preferred_employment}
                    onChange={(event) =>
                      updateField(
                        "preferred_employment",
                        event.target.value,
                      )
                    }
                    placeholder="Student, Unemployed, Self Employed"
                  />

                  <Input
                    label="Preferred Education"
                    value={form.preferred_education}
                    onChange={(event) =>
                      updateField(
                        "preferred_education",
                        event.target.value,
                      )
                    }
                    placeholder="SSLC, Plus Two, UG"
                  />
                </div>
              </section>

              <div className="flex justify-end gap-3 border-t border-app-border pt-6">
                <Button
                  variant="secondary"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  isLoading={saving}
                >
                  {editingScheme
                    ? "Save Changes"
                    : "Create Scheme"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
