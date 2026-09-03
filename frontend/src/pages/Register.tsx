import { Eye, EyeOff, UserPlus } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Logo } from "../components/layout/Logo";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { register } from "../api/auth";
import { getErrorMessage } from "../utils/errors";

export function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );

  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string>
  >({});

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Full name is required.";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password =
        "Password must be at least 8 characters long.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword =
        "Please confirm your password.";
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword =
        "Passwords do not match.";
    }

    setFieldErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      });

      navigate("/login", {
        replace: true,
        state: {
          registrationSuccess:
            "Account created successfully. You can now sign in.",
        },
      });
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Unable to create your account. Please try again.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-app-background">
      <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">
        {/* Left branding section */}
        <section className="relative flex items-center overflow-hidden px-6 py-12 md:px-12 lg:px-16">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-light/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-brand-light/30 blur-3xl" />

          <div className="relative max-w-2xl">
            <Logo large />

            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
                Start Your CIVORA Journey
              </p>

              <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-app-text md:text-5xl">
                Discover benefits that are meant for you.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-app-muted md:text-lg">
                Create your citizen profile once and let CIVORA help you
                discover eligible government schemes and personalized
                recommendations.
              </p>
            </div>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-app-border bg-white/80 p-4 shadow-soft backdrop-blur-sm">
                <p className="text-sm font-semibold text-app-text">
                  ✓ Build Your Profile
                </p>

                <p className="mt-1 text-xs leading-5 text-app-muted">
                  Add your details to create your personalized CIVORA
                  profile.
                </p>
              </div>

              <div className="rounded-xl border border-app-border bg-white/80 p-4 shadow-soft backdrop-blur-sm">
                <p className="text-sm font-semibold text-app-text">
                  ✦ Get Personalized Help
                </p>

                <p className="mt-1 text-xs leading-5 text-app-muted">
                  Discover eligible schemes and AI-powered recommendations.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-sm text-app-muted">
              <span className="h-2 w-2 rounded-full bg-brand-primary" />
              <span>One profile. Smarter scheme discovery.</span>
            </div>
          </div>
        </section>

        {/* Registration section */}
        <section className="flex items-center border-l border-app-border bg-white px-6 py-12">
          <Card className="mx-auto w-full max-w-md border-0 shadow-none">
            <h2 className="text-2xl font-semibold text-app-text">
              Create New Account
            </h2>

            <p className="mt-2 text-sm text-app-muted">
              Create a citizen account to get started with CIVORA.
            </p>

            {error ? (
              <div className="mt-5 rounded-md border border-red-100 bg-red-50 p-3 text-sm text-app-danger">
                {error}
              </div>
            ) : null}

            <form
              className="mt-6 space-y-4"
              onSubmit={handleSubmit}
            >
              <Input
                autoComplete="name"
                error={fieldErrors.fullName}
                label="Full Name"
                onChange={(event) => setFullName(event.target.value)}
                type="text"
                value={fullName}
              />

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
                  autoComplete="new-password"
                  error={fieldErrors.password}
                  label="Password"
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  value={password}
                />

                <button
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute right-3 top-8 rounded p-1 text-app-muted hover:bg-slate-100"
                  onClick={() => setShowPassword((current) => !current)}
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Input
                  autoComplete="new-password"
                  error={fieldErrors.confirmPassword}
                  label="Confirm Password"
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                />

                <button
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmation password"
                      : "Show confirmation password"
                  }
                  className="absolute right-3 top-8 rounded p-1 text-app-muted hover:bg-slate-100"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  type="button"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="text-xs text-app-muted">
                Use at least 8 characters for your password.
              </p>

              <Button
                className="w-full"
                icon={<UserPlus className="h-4 w-4" />}
                isLoading={loading}
                type="submit"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-app-muted">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-brand-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}