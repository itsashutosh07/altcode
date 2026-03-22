import { useEffect, useState } from "react";
import { DEMO_EMAIL } from "@/app/auth/constants";
import type { ThemePreference } from "@/app/theme/ThemeContext";
import { useTheme } from "@/app/theme/ThemeContext";
import { cn } from "@/shared/lib/cn";
import { ProfileCard } from "@/shared/ui/ProfileCard";
import subjectPortrait from "@/assets/profile/Subject.png";
import iconPattern from "@/assets/profile/Icon Pattern.png";
import grainTexture from "@/assets/profile/Grain.webp";

function ThemeOption({
  label,
  active,
  onClick,
  theme,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  theme: "dark" | "light";
}) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-alt border px-3 py-1.5 text-left text-xs font-medium transition-colors",
        active
          ? theme === "dark"
            ? "border-alt-primary text-alt-primary"
            : "border-alt-primary text-alt-text shadow-brutal"
          : "border-alt-border text-alt-muted hover:border-alt-border hover:text-alt-text",
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

const DEMO_PROFILE = {
  name: "Ashutosh Jaiswal",
  title: "Sr. Software Engineer",
  handle: "7.ashutoshj",
  status: "Online",
} as const;

export function SettingsPage() {
  const { theme, preference, setPreference } = useTheme();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const setPref = (p: ThemePreference) => () => setPreference(p);

  const openContact = () => {
    window.location.href = `mailto:${DEMO_EMAIL}?subject=AltCode`;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="alt-page-title">Profile</h1>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <div className="min-w-0 flex-1 space-y-6 lg:max-w-xl">
          <div className="alt-card p-4 text-sm">
            <p className="font-medium text-alt-text">Account</p>
            <p className="mt-1 text-alt-muted">{DEMO_EMAIL}</p>
          </div>
          <div className="alt-card p-4 text-sm">
            <p className="font-medium text-alt-text">Appearance</p>
            <p className="mt-1 text-alt-muted">
              Match your OS, or pin dark / light. Maps to PRD §5 tokens.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <ThemeOption
                label="System (follow OS)"
                active={preference === "system"}
                onClick={setPref("system")}
                theme={theme}
              />
              <ThemeOption
                label="Dark — Terminal / dystopian"
                active={preference === "dark"}
                onClick={setPref("dark")}
                theme={theme}
              />
              <ThemeOption
                label="Light — Earthy brutalist"
                active={preference === "light"}
                onClick={setPref("light")}
                theme={theme}
              />
            </div>
            <p className="mt-3 text-xs text-alt-muted">
              Currently rendering:{" "}
              <strong className="text-alt-text">{theme}</strong>
              {preference === "system" ? " (from system)" : ""}.
            </p>
          </div>
          <div className="alt-card p-4 text-sm">
            <p className="font-medium text-alt-text">Keyboard</p>
            <ul className="mt-2 list-inside list-disc text-alt-muted">
              <li>
                <kbd className="font-mono text-alt-text">/</kbd> or{" "}
                <kbd className="font-mono text-alt-text">⌘K</kbd> — search
              </li>
              <li>
                Review: <kbd className="font-mono text-alt-text">Space</kbd>{" "}
                flip, <kbd className="font-mono text-alt-text">1–4</kbd> grade
              </li>
            </ul>
          </div>
        </div>

        <aside className="mx-auto flex w-full shrink-0 justify-center lg:mx-0 lg:w-[min(100%,380px)] xl:w-[min(100%,420px)]">
          <ProfileCard
            avatarUrl={subjectPortrait}
            iconUrl={iconPattern}
            grainUrl={grainTexture}
            enableTilt={!reduceMotion}
            name={DEMO_PROFILE.name}
            title={DEMO_PROFILE.title}
            handle={DEMO_PROFILE.handle}
            status={DEMO_PROFILE.status}
            contactText="Contact me"
            showUserInfo
            onContactClick={openContact}
          />
        </aside>
      </div>
    </div>
  );
}
