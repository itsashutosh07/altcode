import { Link } from "react-router-dom";
import { useTheme } from "@/app/theme/ThemeContext";
import { AltCodeLogo } from "@/shared/brand/AltCodeLogo";
import { cn } from "@/shared/lib/cn";

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

export function AppHomePage() {
  const { theme } = useTheme();

  return (
    <div className="mx-auto max-w-3xl space-y-12 px-1 pb-16 pt-2 md:pt-4">
      <section
        className={cn(
          "rounded-alt border p-8 md:p-10",
          "border-alt-border/80 bg-alt-surface/80",
          theme === "light" && "shadow-brutal",
          theme === "dark" &&
            "border-alt-border shadow-[0_0_48px_-12px_rgba(0,255,65,0.08)]",
        )}
      >
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <AltCodeLogo theme={theme} className="h-14 w-auto shrink-0 sm:h-16" />
          <div className="min-w-0">
            <p
              className={cn(
                "text-sm font-semibold uppercase tracking-[0.2em] text-alt-primary",
                theme === "dark" && "font-mono",
              )}
            >
              AltCode
            </p>
            <h1
              className={cn(
                "mt-1 text-3xl font-black tracking-tight text-alt-text md:text-4xl",
                theme === "dark" && "font-mono uppercase",
              )}
            >
              Interview prep, one shell.
            </h1>
            <p className="mt-3 max-w-xl text-alt-muted">
              Quizzes and flashcards share the same topics and progression. Use the
              rail to move fast — or jump straight into a flow below.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/dashboard"
                className={cn(
                  "inline-flex items-center justify-center rounded-alt px-5 py-2.5 text-sm font-semibold transition-colors",
                  theme === "dark"
                    ? "border border-alt-primary text-alt-primary hover:bg-alt-primary/10"
                    : "alt-btn-primary",
                )}
              >
                Open dashboard
              </Link>
              <Link
                to="/quiz/new"
                className="inline-flex items-center justify-center rounded-alt border border-alt-border px-5 py-2.5 text-sm font-medium text-alt-text transition-colors hover:border-alt-primary"
              >
                Start a quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.18em] text-alt-muted",
            theme === "dark" && "font-mono",
          )}
        >
          Where to go
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {PILLARS.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "block h-full rounded-alt border border-alt-border bg-alt-surface p-5 transition-colors",
                  "hover:border-alt-primary hover:text-alt-text",
                  theme === "light" && "shadow-sm hover:shadow-brutal",
                  theme === "dark" && "hover:shadow-[0_0_24px_-8px_rgba(0,255,65,0.12)]",
                )}
              >
                <span className="text-base font-bold text-alt-text">
                  {item.title}
                </span>
                <p className="mt-2 text-sm text-alt-muted">{item.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-xs text-alt-muted">
        Press{" "}
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
  );
}
