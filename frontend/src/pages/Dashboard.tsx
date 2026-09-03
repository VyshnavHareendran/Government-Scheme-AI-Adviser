import { Brain, CheckCircle2, ClipboardList, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../api/applications";
import { getMyEligibleSchemes } from "../api/eligibility";
import { getMyProfile } from "../api/profile";
import { getMyRecommendations } from "../api/recommendations";
import { RecommendationCard } from "../components/recommendations/RecommendationCard";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { CardSkeleton } from "../components/ui/Skeleton";
import { useAuth } from "../context/AuthContext";
import { useAsyncData } from "../hooks/useAsyncData";
import { greeting } from "../utils/format";

export function Dashboard() {
  const { user } = useAuth();
  const profile = useAsyncData(getMyProfile, "Profile has not been created yet.");
  const eligibility = useAsyncData(getMyEligibleSchemes, "Unable to load eligible schemes.");
  const recommendations = useAsyncData(getMyRecommendations, "Unable to load recommendations.");
  const applications = useAsyncData(getMyApplications, "Unable to load applications.");
  const topRecommendations = recommendations.data?.recommendations.slice(0, 3) ?? [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-app-text">
          {greeting()}, {user?.full_name}
        </h1>
        <p className="mt-1 text-sm text-app-muted">
          Here is your personalized government scheme overview.
        </p>
      </div>

      {!profile.data && (
        <Card className="mb-6 border border-amber-200 bg-amber-50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-app-text">
                Complete your profile to unlock CIVORA
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-app-muted">
                Your profile is required to check your eligibility for
                government schemes and generate personalized AI recommendations.
              </p>
            </div>

            <Link to="/profile" className="shrink-0">
              <Button>Complete My Profile</Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<UserRound className="h-5 w-5" />}
          label="Profile"
          value={profile.data ? "Complete" : "Needs review"}
          tone={profile.data ? "success" : "warning"}
        />
        <MetricCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Eligible Schemes"
          value={eligibility.data?.eligible_count ?? "-"}
          tone="success"
        />
        <MetricCard
          icon={<Brain className="h-5 w-5" />}
          label="AI Recommendations"
          value={recommendations.data?.recommendation_count ?? "-"}
          tone="ai"
        />
        <MetricCard
          icon={<ClipboardList className="h-5 w-5" />}
          label="Applications"
          value={applications.data?.length ?? "-"}
          tone="neutral"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_340px]">
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-app-text">Recommended for You</h2>
              <p className="text-sm text-app-muted">Top backend-ranked recommendations.</p>
            </div>
            <Link to="/recommendations">
              <Button variant="secondary">View all</Button>
            </Link>
          </div>
          {recommendations.loading ? (
            <div className="space-y-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : topRecommendations.length ? (
            <div className="space-y-4">
              {topRecommendations.map((recommendation) => (
                <RecommendationCard key={recommendation.id} recommendation={recommendation} />
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-sm text-app-muted">
                No recommendations are available yet. Complete your profile to enable analysis.
              </p>
            </Card>
          )}
        </section>

        <aside>
          <Card>
            <h2 className="text-lg font-semibold text-app-text">Quick actions</h2>
            <div className="mt-4 grid gap-3">
              <Link to="/profile">
                <Button className="w-full justify-start" variant="secondary">
                  {profile.data ? "View / Update Profile" : "Complete Profile"}
                </Button>
              </Link>
              <Link to="/eligibility">
                <Button className="w-full justify-start" variant="secondary">
                  View Eligible Schemes
                </Button>
              </Link>
              <Link to="/recommendations">
                <Button className="w-full justify-start" variant="secondary">
                  View AI Recommendations
                </Button>
              </Link>
              <Link to="/schemes">
                <Button className="w-full justify-start" variant="secondary">
                  Browse Schemes
                </Button>
              </Link>
              <Link to="/applications">
                <Button className="w-full justify-start" variant="secondary">
                  Track Applications
                </Button>
              </Link>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  tone,
  value,
}: {
  icon: ReactNode;
  label: string;
  tone: "success" | "warning" | "ai" | "neutral";
  value: string | number;
}) {
  const badgeVariant = tone === "success" ? "green" : tone === "ai" ? "amber" : tone === "warning" ? "amber" : "slate";
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="rounded-md bg-slate-100 p-2 text-brand-primary">{icon}</div>
        <Badge variant={badgeVariant}>{label}</Badge>
      </div>
      <p className="mt-4 line-clamp-2 min-h-14 text-2xl font-semibold text-app-text">{value}</p>
    </Card>
  );
}
