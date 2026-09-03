import { Save } from "lucide-react";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { CitizenProfile, CitizenProfilePayload } from "../../types/api";
import {
  categoryOptions,
  educationOptions,
  employmentOptions,
  genderOptions,
  maritalOptions,
} from "../../types/forms";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { ProfileSection } from "./ProfileSection";

const emptyProfile: CitizenProfilePayload = {
  date_of_birth: "",
  gender: "Male",
  state: "",
  district: "",
  pincode: "",
  education_level: "SSLC",
  employment_status: "Student",
  occupation: "",
  annual_income: "",
  bpl_card: false,
  category: "General",
  disability_status: false,
  marital_status: "Single",
  land_holding: "0",
  family_size: 1,
};

interface ProfileFormProps {
  profile: CitizenProfile | null;
  onSubmit: (payload: CitizenProfilePayload, exists: boolean) => Promise<void>;
}

export function ProfileForm({ onSubmit, profile }: ProfileFormProps) {
  const initial = useMemo<CitizenProfilePayload>(
    () => (profile ? { ...emptyProfile, ...profile } : emptyProfile),
    [profile],
  );
  const [form, setForm] = useState<CitizenProfilePayload>(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setField<K extends keyof CitizenProfilePayload>(
    key: K,
    value: CitizenProfilePayload[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function validate() {
    const nextErrors: Record<string, string> = {};
    if (!form.date_of_birth) nextErrors.date_of_birth = "Date of birth is required.";
    if (!form.state.trim()) nextErrors.state = "State is required.";
    if (!form.district.trim()) nextErrors.district = "District is required.";
    if (!/^\d{6}$/.test(form.pincode)) nextErrors.pincode = "Enter a valid 6-digit pincode.";
    if (!form.occupation.trim()) nextErrors.occupation = "Occupation is required.";
    if (Number(form.annual_income) < 0 || form.annual_income === "") {
      nextErrors.annual_income = "Annual income must be zero or more.";
    }
    if (Number(form.land_holding) < 0 || form.land_holding === "") {
      nextErrors.land_holding = "Land holding must be zero or more.";
    }
    if (!Number.isInteger(Number(form.family_size)) || Number(form.family_size) < 1) {
      nextErrors.family_size = "Family size must be at least 1.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit(form, Boolean(profile));
      setStatus("Profile saved successfully.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="space-y-6">
        <ProfileSection title="Personal Information">
          <Input
            error={errors.date_of_birth}
            label="Date of Birth"
            max={new Date().toISOString().slice(0, 10)}
            onChange={(event) => setField("date_of_birth", event.target.value)}
            type="date"
            value={form.date_of_birth}
          />
          <Select
            label="Gender"
            onChange={(event) => setField("gender", event.target.value as CitizenProfilePayload["gender"])}
            options={genderOptions}
            value={form.gender}
          />
          <Select
            label="Category"
            onChange={(event) => setField("category", event.target.value as CitizenProfilePayload["category"])}
            options={categoryOptions}
            value={form.category}
          />
          <Select
            label="Marital Status"
            onChange={(event) =>
              setField("marital_status", event.target.value as CitizenProfilePayload["marital_status"])
            }
            options={maritalOptions}
            value={form.marital_status}
          />
        </ProfileSection>

        <ProfileSection title="Location">
          <Input label="State" onChange={(event) => setField("state", event.target.value)} value={form.state} error={errors.state} />
          <Input label="District" onChange={(event) => setField("district", event.target.value)} value={form.district} error={errors.district} />
          <Input label="Pincode" maxLength={6} onChange={(event) => setField("pincode", event.target.value)} value={form.pincode} error={errors.pincode} />
        </ProfileSection>

        <ProfileSection title="Education & Employment">
          <Select label="Education Level" onChange={(event) => setField("education_level", event.target.value as CitizenProfilePayload["education_level"])} options={educationOptions} value={form.education_level} />
          <Select label="Employment Status" onChange={(event) => setField("employment_status", event.target.value as CitizenProfilePayload["employment_status"])} options={employmentOptions} value={form.employment_status} />
          <Input label="Occupation" onChange={(event) => setField("occupation", event.target.value)} value={form.occupation} error={errors.occupation} />
        </ProfileSection>

        <ProfileSection title="Financial Information">
          <Input error={errors.annual_income} label="Annual Income" min={0} onChange={(event) => setField("annual_income", event.target.value)} type="number" value={form.annual_income} />
          <Input error={errors.land_holding} label="Land Holding" min={0} onChange={(event) => setField("land_holding", event.target.value)} step="0.01" type="number" value={form.land_holding} />
          <label className="flex min-h-10 items-center gap-3 rounded-md border border-app-border bg-white px-3 text-sm text-app-text shadow-soft">
            <input checked={form.bpl_card} className="h-4 w-4 accent-brand-primary" onChange={(event) => setField("bpl_card", event.target.checked)} type="checkbox" />
            BPL Card
          </label>
        </ProfileSection>

        <ProfileSection title="Family">
          <Input error={errors.family_size} label="Family Size" min={1} onChange={(event) => setField("family_size", Number(event.target.value))} type="number" value={form.family_size} />
        </ProfileSection>

        <ProfileSection title="Accessibility">
          <label className="flex min-h-10 items-center gap-3 rounded-md border border-app-border bg-white px-3 text-sm text-app-text shadow-soft">
            <input checked={form.disability_status} className="h-4 w-4 accent-brand-primary" onChange={(event) => setField("disability_status", event.target.checked)} type="checkbox" />
            Disability Status
          </label>
        </ProfileSection>

        <div className="flex flex-col gap-3 border-t border-app-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-app-muted">{status}</p>
          <Button icon={<Save className="h-4 w-4" />} isLoading={saving} type="submit">
            {profile ? "Update Profile" : "Create Profile"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
