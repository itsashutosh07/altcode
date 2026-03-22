import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/auth/AuthContext";
import { useTheme } from "@/app/theme/ThemeContext";
import { AltCodeLogo } from "@/shared/brand/AltCodeLogo";
import { cn } from "@/shared/lib/cn";

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/home", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-dvh">
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-5xl flex-col justify-center px-5 py-16 md:px-10">
        <div
          className={cn(
            "grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center",
          )}
        >
          <div>
            <div className="flex items-center gap-4">
              <AltCodeLogo theme={theme} className="h-16 w-auto sm:h-20" />
              <div>
                <p
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.25em] text-alt-primary",
                    theme === "dark" && "font-mono",
                  )}
                >
                  v1.0 · static prototype
                </p>
                <h1
                  className={cn(
                    "mt-1 text-4xl font-black uppercase tracking-tight text-alt-text sm:text-5xl",
                    theme === "dark" && "font-mono",
                  )}
                >
                  AltCode
                </h1>
              </div>
            </div>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-alt-muted">
              Quizzes and flashcards for technical interviews — timed runs, spaced
              review, and a single topic map. Switch{" "}
              <span className="text-alt-text">terminal dark</span> and{" "}
              <span className="text-alt-text">earthy light</span> after sign-in.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/login" className="alt-btn-primary px-8 py-3 text-base">
                Log in
              </Link>
              <span
                className={cn(
                  "max-w-xs text-sm text-alt-muted",
                  theme === "dark" && "font-mono text-xs",
                )}
              >
                Demo user + OTP — see README for credentials.
              </span>
            </div>
          </div>

          <div
            className={cn(
              "rounded-alt border p-8",
              "border-alt-border bg-alt-surface",
              theme === "dark" &&
                "shadow-[0_0_40px_-8px_rgba(0,255,65,0.1)]",
              theme === "light" && "angled-panel border-2 shadow-brutal",
            )}
          >
            <h2
              className={cn(
                "text-sm font-bold uppercase tracking-wider text-alt-text",
                theme === "dark" && "font-mono",
              )}
            >
              What you get
            </h2>
            <ul className="mt-5 space-y-4 text-sm text-alt-muted">
              <li className="flex gap-3">
                <span className="font-mono text-alt-primary">01</span>
                <span>
                  <strong className="text-alt-text">Quiz flow</strong> — setup,
                  timer, navigator, and result disection with remediation hooks.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-alt-primary">02</span>
                <span>
                  <strong className="text-alt-text">Flashcards</strong> — review
                  hub, grading keys, and deck-aware URLs.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-alt-primary">03</span>
                <span>
                  <strong className="text-alt-text">Topics + analytics</strong>{" "}
                  — directory, progress cues, and a static analytics matrix.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
