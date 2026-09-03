import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { createProfile, getMyProfile, updateProfile } from "../api/profile";
import { ProfileForm } from "../components/profile/ProfileForm";
import { ErrorState } from "../components/ui/ErrorState";
import { PageHeader } from "../components/ui/PageHeader";
import { CardSkeleton } from "../components/ui/Skeleton";
import type { CitizenProfile, CitizenProfilePayload } from "../types/api";
import { getErrorMessage } from "../utils/errors";

export function Profile() {
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        setProfile(null);
      } else {
        setError(getErrorMessage(err, "Unable to load your citizen profile."));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  async function handleSubmit(payload: CitizenProfilePayload, exists: boolean) {
    try {
      const saved = exists ? await updateProfile(payload) : await createProfile(payload);
      setProfile(saved);
      setSuccessMessage(
        exists
          ? "Profile updated successfully. CIVORA will use your latest information for scheme eligibility and personalized recommendations."
          : "Profile completed successfully. CIVORA can now check your eligible government schemes and generate personalized recommendations.",
      );
    } catch (err) {
      throw new Error(getErrorMessage(err, "Unable to save your profile."));
    }
  }

  return (
    <div>
      <PageHeader
        description="This profile is used by the backend Rule Engine and AI recommendation service."
        title="Citizen Profile"
      />
      {loading ? <CardSkeleton rows={8} /> : null}
      {!loading && successMessage ? (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            ✓ {successMessage}
          </p>
        </div>
      ) : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadProfile} /> : null}
      {!loading && !error ? <ProfileForm key={profile?.updated_at ?? "new"} onSubmit={handleSubmit} profile={profile} /> : null}
    </div>
  );
}
