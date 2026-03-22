import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/app/theme/ThemeContext";
import { AltCodeLogo } from "@/shared/brand/AltCodeLogo";
import { ElectricBorder } from "@/shared/ui/ElectricBorder";
import { ShinyText } from "@/shared/ui/ShinyText";
import { cn } from "@/shared/lib/cn";

const HOME_HERO_BLURB =
  "Quizzes and flashcards share the same topics and progression. Use the rail to move fast — or jump straight into a flow below.";

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
    <div className="mx-auto max-w-3xl space-y-12 px-1 pb-16 pt-2 md:pt-4">
      <section
        className={cn(
          "app-home-hero rounded-alt border p-8 md:p-10",
          "border-alt-border/80",
          theme === "light" && "shadow-brutal",
          theme === "dark" &&
            "border-alt-border shadow-[0_0_48px_-12px_rgba(0,255,65,0.08)]",
        )}
      >
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <AltCodeLogo theme={theme} className="h-32 w-auto sm:h-40 md:h-44" />
          <div className="min-w-0">
            <h1
              className={cn(
                "font-alt text-balance text-3xl font-bold leading-[1.12] tracking-[-0.03em] text-alt-text md:text-[2.35rem] md:leading-[1.1]",
                theme === "dark" &&
                  "[text-shadow:0_0_48px_rgba(0,255,65,0.07)]",
              )}
            >
              Prepare for technical interviews—quizzes and flashcards in one place.
            </h1>
            <p className="mt-3 max-w-xl">
              <ShinyText
                text={HOME_HERO_BLURB}
                className="text-base leading-relaxed"
                speed={3.3}
                delay={0.5}
                spread={120}
                direction="left"
                baseColor={theme === "light" ? "#78716c" : "#6b7280"}
                shineColor={theme === "light" ? "#fafaf9" : "#d1d5db"}
              />
            </p>
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
                  to="/dashboard"
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
                  to="/quiz/new"
                  onFocus={() => setQuizFocus(true)}
                  onBlur={() => setQuizFocus(false)}
                  className="inline-flex w-full items-center justify-center rounded-alt border border-alt-border px-5 py-2.5 text-sm font-medium text-alt-text transition-colors hover:border-alt-primary"
                >
                  Start a quiz
                </Link>
              </ElectricBorder>
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
