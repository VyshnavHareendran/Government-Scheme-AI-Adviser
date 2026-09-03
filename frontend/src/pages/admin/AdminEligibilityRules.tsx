import {
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  createEligibilityRule,
  deleteEligibilityRule,
  getEligibilityRules,
  updateEligibilityRule,
  type EligibilityRule,
} from "../../api/eligibilityRules";

import { getAdminSchemes } from "../../api/adminSchemes";
import type { Scheme } from "../../types/api";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { CardSkeleton } from "../../components/ui/Skeleton";

type FormState = {
  scheme_id: string;
  field_name: string;
  operator: string;
  value: string;
};

const emptyForm: FormState = {
  scheme_id: "",
  field_name: "",
  operator: "",
  value: "",
};

const FIELD_OPTIONS = [
  "date_of_birth",
  "gender",
  "state",
  "district",
  "education_level",
  "employment_status",
  "occupation",
  "annual_income",
  "bpl_card",
  "category",
  "disability_status",
  "marital_status",
  "land_holding",
  "family_size",
];

const OPERATOR_OPTIONS = [
  "=",
  "!=",
  ">",
  ">=",
  "<",
  "<=",
];

export function AdminEligibilityRules() {
  const [rules, setRules] = useState<EligibilityRule[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [query, setQuery] = useState("");
  const [schemeFilter, setSchemeFilter] =
    useState("");

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [editingRule, setEditingRule] =
    useState<EligibilityRule | null>(null);

  const [form, setForm] =
    useState<FormState>(emptyForm);

  const [formError, setFormError] =
    useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [rulesData, schemesData] =
        await Promise.all([
          getEligibilityRules(),
          getAdminSchemes(),
        ]);

      setRules(rulesData);
      setSchemes(schemesData);
    } catch (err) {
      console.error(err);
      setError(
        "Unable to load eligibility rules.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const schemeMap = useMemo(() => {
    return new Map(
      schemes.map((scheme) => [
        scheme.id,
        scheme.scheme_name,
      ]),
    );
  }, [schemes]);

  const filteredRules = useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase();

    return rules.filter((rule) => {
      if (
        schemeFilter &&
        String(rule.scheme_id) !== schemeFilter
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const schemeName =
        schemeMap.get(rule.scheme_id) ?? "";

      return [
        schemeName,
        rule.field_name,
        rule.operator,
        rule.value,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [
    query,
    rules,
    schemeFilter,
    schemeMap,
  ]);

  function openCreateForm() {
    setEditingRule(null);
    setForm(emptyForm);
    setFormError("");
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  }

  function openEditForm(rule: EligibilityRule) {
    setEditingRule(rule);

    setForm({
      scheme_id: String(rule.scheme_id),
      field_name: rule.field_name,
      operator: rule.operator,
      value: rule.value,
    });

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
    setEditingRule(null);
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

  function validateForm(): string | null {
    if (!form.scheme_id) {
      return "Please select a scheme.";
    }

    if (!form.field_name) {
      return "Please select a field.";
    }

    if (!form.operator) {
      return "Please select an operator.";
    }

    if (!form.value.trim()) {
      return "Rule value is required.";
    }

    return null;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setFormError("");
    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      setSaving(true);

      if (editingRule) {
        const updated =
          await updateEligibilityRule(
            editingRule.id,
            {
              field_name:
                form.field_name,
              operator:
                form.operator,
              value:
                form.value.trim(),
            },
          );

        setRules((current) =>
          current.map((rule) =>
            rule.id === updated.id
              ? updated
              : rule,
          ),
        );

        setSuccess(
          "Eligibility rule updated successfully.",
        );
      } else {
        const created =
          await createEligibilityRule({
            scheme_id: Number(
              form.scheme_id,
            ),
            field_name:
              form.field_name,
            operator:
              form.operator,
            value:
              form.value.trim(),
          });

        setRules((current) => [
          created,
          ...current,
        ]);

        setSuccess(
          "Eligibility rule created successfully.",
        );
      }

      setIsFormOpen(false);
      setEditingRule(null);
      setForm(emptyForm);
    } catch (err) {
      console.error(err);

      setFormError(
        "Unable to save the eligibility rule.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(
    rule: EligibilityRule,
  ) {
    const schemeName =
      schemeMap.get(rule.scheme_id) ??
      "this scheme";

    const confirmed =
      window.confirm(
        `Delete this rule from "${schemeName}"? This action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(rule.id);
      setError("");
      setSuccess("");

      await deleteEligibilityRule(
        rule.id,
      );

      setRules((current) =>
        current.filter(
          (item) => item.id !== rule.id,
        ),
      );

      setSuccess(
        "Eligibility rule deleted successfully.",
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to delete the eligibility rule.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
            Administration
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-app-foreground">
            Eligibility Rules
          </h1>

          <p className="mt-1 text-sm text-app-muted">
            Manage eligibility rules used by
            the government scheme rule engine.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={
              <RefreshCw className="h-4 w-4" />
            }
            onClick={() =>
              void loadData()
            }
            disabled={loading}
          >
            Refresh
          </Button>

          <Button
            icon={
              <Plus className="h-4 w-4" />
            }
            onClick={openCreateForm}
          >
            Add Rule
          </Button>
        </div>
      </div>

      {/* ERROR */}

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

      {/* SUCCESS */}

      {success && (
        <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <p className="text-sm text-app-success">
            {success}
          </p>

          <button
            type="button"
            onClick={() =>
              setSuccess("")
            }
            className="text-app-success"
            aria-label="Dismiss success"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* FILTERS */}

      <Card>
        <div className="grid gap-4 md:grid-cols-[1fr_300px]">
          <Input
            label="Search"
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value,
              )
            }
            placeholder="Search schemes, fields, operators..."
          />

          <Select
            label="Scheme"
            value={schemeFilter}
            onChange={(event) =>
              setSchemeFilter(event.target.value)
            }
            options={schemes.map((scheme) => ({
              value: String(scheme.id),
              label: scheme.scheme_name,
            }))}
            placeholder="All schemes"
          />
        </div>
      </Card>

      {/* TABLE */}

      <Card className="overflow-hidden p-0">
        {loading ? (
          <div className="space-y-4 p-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredRules.length ===
          0 ? (
          <EmptyState
            title="No eligibility rules found"
            message="Add a rule or adjust your search and filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="border-b border-app-border bg-app-background">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Scheme
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Field
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Operator
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Value
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-app-muted">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-app-border">
                {filteredRules.map(
                  (rule) => (
                    <tr
                      key={rule.id}
                      className="transition hover:bg-app-background/60"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-app-foreground">
                          {schemeMap.get(
                            rule.scheme_id,
                          ) ??
                            `Scheme #${rule.scheme_id}`}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <Badge variant="teal">
                          {rule.field_name}
                        </Badge>
                      </td>

                      <td className="px-5 py-4">
                        <span className="font-mono text-sm font-semibold text-app-foreground">
                          {rule.operator}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-app-muted">
                        {rule.value}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            className="px-2"
                            onClick={() =>
                              openEditForm(
                                rule,
                              )
                            }
                            icon={
                              <Pencil className="h-4 w-4" />
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            variant="danger"
                            className="px-2"
                            disabled={
                              deletingId ===
                              rule.id
                            }
                            isLoading={
                              deletingId ===
                              rule.id
                            }
                            onClick={() =>
                              void handleDelete(
                                rule,
                              )
                            }
                            icon={
                              deletingId ===
                              rule.id ? (
                                undefined
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* FORM MODAL */}

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="eligibility-rule-form-title"
        >
          <div className="w-full max-w-2xl rounded-xl border border-app-border bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-app-border px-6 py-4">
              <div>
                <h2
                  id="eligibility-rule-form-title"
                  className="text-lg font-semibold text-app-foreground"
                >
                  {editingRule
                    ? "Edit Eligibility Rule"
                    : "Add Eligibility Rule"}
                </h2>

                <p className="mt-1 text-sm text-app-muted">
                  Define a condition used by
                  the scheme eligibility engine.
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

              <div className="space-y-4">
                <Select
                  label="Scheme"
                  value={form.scheme_id}
                  onChange={(event) =>
                    updateField(
                      "scheme_id",
                      event.target.value,
                    )
                  }
                  options={schemes.map((scheme) => ({
                    label: scheme.scheme_name,
                    value: String(scheme.id),
                  }))}
                  placeholder="Select a scheme"
                  disabled={Boolean(editingRule)}
                />

                <Select
                  label="Field"
                  value={form.field_name}
                  onChange={(event) =>
                    updateField(
                      "field_name",
                      event.target.value,
                    )
                  }
                  options={FIELD_OPTIONS}
                  placeholder="Select a citizen field"
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Select
                    label="Operator"
                    value={form.operator}
                    onChange={(event) =>
                      updateField(
                        "operator",
                        event.target.value,
                      )
                    }
                    options={
                      OPERATOR_OPTIONS
                    }
                    placeholder="Select operator"
                  />

                  <Input
                    label="Value"
                    value={form.value}
                    onChange={(event) =>
                      updateField(
                        "value",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. 500000"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-app-border bg-app-background p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-app-muted">
                  Rule Preview
                </p>

                <p className="mt-2 text-sm text-app-foreground">
                  {form.field_name ||
                    "field"}{" "}
                  <span className="font-semibold">
                    {form.operator ||
                      "operator"}
                  </span>{" "}
                  {form.value ||
                    "value"}
                </p>
              </div>

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
                  {editingRule
                    ? "Save Changes"
                    : "Create Rule"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}