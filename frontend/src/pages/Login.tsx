import { Eye, EyeOff, LogIn } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../components/layout/Logo";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errors";

export function Login() {
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (isAuthenticated) {
    const destination =
      user?.role?.toLowerCase() === "admin"
        ? "/admin"
        : "/dashboard";

    return <Navigate to={destination} replace />;
  }

  function validate() {
    const nextErrors: Record<string, string> = {};
    if (!email.trim()) nextErrors.email = "Email is required.";
    if (!password) nextErrors.password = "Password is required.";
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const authenticatedUser = await login(email, password);

      const role = authenticatedUser.role?.toLowerCase();

      const from = (
        location.state as { from?: { pathname?: string } } | null
      )?.from?.pathname;

      if (authenticatedUser.must_change_password) {
        navigate("/change-password", { replace: true });
      } else if (role === "admin") {
        navigate(
          from?.startsWith("/admin")
            ? from
            : "/admin",
          { replace: true }
        );
      } else if (role === "employee") {
        navigate(
          from?.startsWith("/employee")
            ? from
            : "/employee",
          { replace: true }
        );
      } else {
        navigate(
          from && !from.startsWith("/admin") && !from.startsWith("/employee")
            ? from
            : "/dashboard",
          { replace: true }
        );
      }
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to sign in. Check your credentials and try again."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-app-background">
      <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
        <section className="flex items-center px-6 py-12 md:px-12">
          <div className="max-w-2xl">
            <Logo />
            <h1 className="mt-10 text-4xl font-semibold tracking-normal text-app-text md:text-5xl">
              CIVORA
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-app-muted">
              Discover eligible Indian government schemes and review AI-ranked recommendations based
              on your verified citizen profile.
            </p>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {["Rule Engine", "CatBoost V2", "Secure Profile"].map((item) => (
                <div className="rounded-lg border border-app-border bg-white p-4 shadow-soft" key={item}>
                  <p className="text-sm font-semibold text-app-text">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="flex items-center border-l border-app-border bg-white px-6 py-12">
          <Card className="mx-auto w-full max-w-md border-0 shadow-none">
            <h2 className="text-2xl font-semibold text-app-text">Sign in</h2>
            <p className="mt-2 text-sm text-app-muted">
              Sign in with your registered account.
            </p>
            {error ? (
              <div className="mt-5 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-app-danger">
                {error}
              </div>
            ) : null}
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <Input
                autoComplete="email"
                error={fieldErrors.email}
                label="Email"
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                value={email}
              />
              <div className="relative">
                <Input
                  autoComplete="current-password"
                  error={fieldErrors.password}
                  label="Password"
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <button
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-8 rounded p-1 text-app-muted hover:bg-slate-100"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button
                className="w-full"
                icon={<LogIn className="h-4 w-4" />}
                isLoading={loading}
                type="submit"
              >
                Sign In
              </Button>
              <div className="mt-5 text-center text-sm text-app-muted">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-medium text-brand-primary hover:underline"
                >
                  Create New Account
                </button>
              </div>
            </form>
          </Card>
        </section>
      </div>
    </main>
  );
}
