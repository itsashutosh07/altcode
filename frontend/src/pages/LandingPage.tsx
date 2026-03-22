import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/app/auth/AuthContext";
import type { SignInLocationState } from "@/app/auth/signInNudge";
import { useTheme } from "@/app/theme/ThemeContext";
import { ElectricBorder } from "@/shared/ui/ElectricBorder";
import { ShinyText } from "@/shared/ui/ShinyText";
import { cn } from "@/shared/lib/cn";

/** Brief overview + purpose; details live in “What you get”. */
const SHINY_HERO_COPY =
  "AltCode is a static v1 prototype for interview prep. Quizzes, flashcards, and topic navigation share one map so practice stays in one place. Demo OTP lives in the README; after sign-in, set themes in Settings, use the rail to move, and tap the header lockup to return here.";

const PILLARS = [
  {
    to: "/quiz/new",
    title: "Timed quiz",
    body: "Configure length, run through questions, and review result disection with XP.",
  },
  {
    to: "/review",
    title: "Flashcards",
    body: "Spaced repetition sessions with keyboard grading and optional remediation decks.",
  },
  {
    to: "/topics",
    title: "Topics",
    body: "Browse modules, progress, and jump into quizzes or study per topic.",
  },
  {
    to: "/analytics",
    title: "Analytics",
    body: "KPIs, streaks, and a matrix view of where to focus next.",
  },
] as const;

function entryLinkProps(
  path: string,
  signedIn: boolean,
  hint: string,
): { to: string; state?: SignInLocationState } {
  if (signedIn) return { to: path };
  return {
    to: `/login?returnUrl=${encodeURIComponent(path)}`,
    state: { signInHint: hint },
  };
}

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const [dashboardHover, setDashboardHover] = useState(false);
  const [dashboardFocus, setDashboardFocus] = useState(false);
  const [quizHover, setQuizHover] = useState(false);
  const [quizFocus, setQuizFocus] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const electricColor = theme === "dark" ? "#00ff41" : "#c45c3e";
  const electricRadius = theme === "light" ? 4 : 0;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className="w-full">
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col px-5 py-10 md:px-10 md:py-12">
        <div
          className={cn(
            "grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-start",
          )}
        >
          <div>
            <p
              className={cn(
                "text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-alt-primary",
                theme === "dark" && "font-mono",
              )}
            >
              v1.0 · static prototype
            </p>

            <h1
              className={cn(
                "mt-6 max-w-xl text-balance font-alt text-xl font-bold leading-snug tracking-[-0.03em] text-alt-text sm:text-2xl",
                theme === "dark" &&
                  "[text-shadow:0_0_40px_rgba(0,255,65,0.06)]",
              )}
            >
              Interview loops on one surface—pressure when you need it, depth
              when you don&apos;t.
            </h1>

            <div className="mt-4 max-w-xl">
              <ShinyText
                text={SHINY_HERO_COPY}
                className="text-sm leading-relaxed sm:text-[0.9375rem]"
                speed={3.6}
                delay={0.45}
                spread={125}
                direction="left"
                baseColor={theme === "light" ? "#78716c" : "#6b7280"}
                shineColor={theme === "light" ? "#fafaf9" : "#e5e7eb"}
              />
            </div>

            {!isAuthenticated ? (
              <p className="mt-4 max-w-xl text-sm text-alt-muted">
                Shortcuts remember where you were headed after authentication.
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <ElectricBorder
                active={
                  (dashboardHover || dashboardFocus) && !reduceMotion
                }
                color={electricColor}
                borderRadius={electricRadius}
                className="inline-flex rounded-alt"
                onMouseEnter={() => setDashboardHover(true)}
                onMouseLeave={() => setDashboardHover(false)}
              >
                <Link
                  {...entryLinkProps(
                    "/dashboard",
                    isAuthenticated,
                    "Sign in to open the dashboard.",
                  )}
                  onFocus={() => setDashboardFocus(true)}
                  onBlur={() => setDashboardFocus(false)}
                  className={cn(
                    "inline-flex w-full items-center justify-center rounded-alt px-5 py-2.5 text-sm font-semibold transition-colors",
                    "border border-alt-primary text-alt-primary hover:bg-alt-primary/10",
                  )}
                >
                  Open dashboard
                </Link>
              </ElectricBorder>
              <ElectricBorder
                active={(quizHover || quizFocus) && !reduceMotion}
                color={electricColor}
                borderRadius={electricRadius}
                className="inline-flex rounded-alt"
                onMouseEnter={() => setQuizHover(true)}
                onMouseLeave={() => setQuizHover(false)}
              >
                <Link
                  {...entryLinkProps(
                    "/quiz/new",
                    isAuthenticated,
                    "Sign in to start a quiz.",
                  )}
                  onFocus={() => setQuizFocus(true)}
                  onBlur={() => setQuizFocus(false)}
                  className="inline-flex w-full items-center justify-center rounded-alt border border-alt-border px-5 py-2.5 text-sm font-medium text-alt-text transition-colors hover:border-alt-primary"
                >
                  Start a quiz
                </Link>
              </ElectricBorder>
            </div>
          </div>

          <div
            className={cn(
              "rounded-alt border p-8 border-alt-border bg-alt-surface landing-angled-panel",
              theme === "light" && "border-2 shadow-brutal",
              theme === "dark" &&
                "shadow-[0_0_40px_-8px_rgba(0,255,65,0.1)]",
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
                  <strong className="text-alt-text">Quiz flow</strong> — length
                  presets, live timer, in-quiz navigator, results disection with
                  XP, plus a remediation handoff into a deck.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-alt-primary">02</span>
                <span>
                  <strong className="text-alt-text">Flashcards</strong> — review
                  hub, in-session progress bar, keyboard grading, and
                  bookmarkable deck URLs.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-alt-primary">03</span>
                <span>
                  <strong className="text-alt-text">Topics + analytics</strong>{" "}
                  — module tree and directory chrome, progress tags on entries,
                  and the static analytics matrix with KPI tiles.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 w-full max-w-3xl space-y-8 pb-8 md:mt-12 md:pb-10">
          <section>
            <h3
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.18em] text-alt-muted",
                theme === "dark" && "font-mono",
              )}
            >
              Where to go
            </h3>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {PILLARS.map((item) => (
                <li key={item.to}>
                  <Link
                    {...entryLinkProps(
                      item.to,
                      isAuthenticated,
                      `Sign in to open ${item.title.toLowerCase()}.`,
                    )}
                    className={cn(
                      "block h-full rounded-alt border border-alt-border bg-alt-surface p-5 transition-colors",
                      "hover:border-alt-primary hover:text-alt-text",
                      theme === "light" && "shadow-sm hover:shadow-brutal",
                      theme === "dark" &&
                        "hover:shadow-[0_0_24px_-8px_rgba(0,255,65,0.12)]",
                    )}
                  >
                    <span className="text-base font-bold text-alt-text">
                      {item.title}
                    </span>
                    <p className="mt-2 text-sm text-alt-muted">{item.body}</p>
                    {!isAuthenticated ? (
                      <p className="mt-3 text-xs text-alt-muted">
                        Requires sign-in — opens login with a short note.
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <p className="text-center text-xs text-alt-muted">
            After sign-in, press{" "}
            <kbd className="rounded border border-alt-border px-1.5 py-0.5 font-mono text-alt-text">
              /
            </kbd>{" "}
            or{" "}
            <kbd className="rounded border border-alt-border px-1.5 py-0.5 font-mono text-alt-text">
              ⌘K
            </kbd>{" "}
            for search anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
