import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/app/auth/AuthContext";
import { useSearchOverlay } from "@/app/context/SearchContext";
import { useTheme } from "@/app/theme/ThemeContext";
import { SearchOverlay } from "@/features/search/SearchOverlay";
import { staticAnalyticsRepository } from "@/data/repositories/staticRepositories";
import { AltCodeLogo } from "@/shared/brand/AltCodeLogo";
import { TextPressureBrand } from "@/shared/brand/TextPressureBrand";
import { cn } from "@/shared/lib/cn";

const SIDEBAR_KEY = "altcode_sidebar_open";

const STAGGER_NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/quiz/new", label: "Quiz" },
  { to: "/review", label: "Flashcards" },
  { to: "/topics", label: "Topics" },
  { to: "/analytics", label: "Analytics" },
  { to: "/settings", label: "Profile" },
] as const;

function staggerMenuLinkClass(isActive: boolean) {
  return cn(
    "block font-alt text-[clamp(1.65rem,5vw,2.35rem)] font-extralight uppercase leading-[0.98] tracking-[-0.045em] text-alt-text transition-colors duration-200",
    "hover:text-alt-muted",
    isActive && "text-alt-primary",
  );
}

function HamburgerIcon({ sidebarExpanded }: { sidebarExpanded: boolean }) {
  return (
    <span
      className="flex h-5 w-6 flex-col justify-center gap-[5px]"
      aria-hidden
    >
      <span
        className={cn(
          "h-0.5 origin-center bg-alt-text transition-all duration-200",
          sidebarExpanded
            ? "w-full translate-y-[7px] rotate-45"
            : "w-[58%] self-start",
        )}
      />
      <span
        className={cn(
          "h-0.5 w-full bg-alt-text transition-all duration-200",
          sidebarExpanded ? "scale-x-0 opacity-0" : "opacity-100",
        )}
      />
      <span
        className={cn(
          "h-0.5 origin-center bg-alt-text transition-all duration-200",
          sidebarExpanded
            ? "w-full -translate-y-[7px] -rotate-45"
            : "w-[72%] self-end",
        )}
      />
    </span>
  );
}

export function AppShell() {
  const { logout } = useAuth();
  const { theme, preference, toggleTheme } = useTheme();
  const { openSearch, open } = useSearchOverlay();
  const navigate = useNavigate();
  const { progression } = staticAnalyticsRepository.getSummary();
  const xpPct =
    progression.xpNextLevel > 0
      ? Math.min(100, (progression.xp / progression.xpNextLevel) * 100)
      : 0;

  const [isMd, setIsMd] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : true,
  );

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const v = localStorage.getItem(SIDEBAR_KEY);
      if (v === "0") return false;
      if (v === "1") return true;
    } catch {
      /* ignore */
    }
    return typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : true;
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsMd(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const persistSidebar = useCallback((open: boolean) => {
    setSidebarOpen(open);
    try {
      localStorage.setItem(SIDEBAR_KEY, open ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    persistSidebar(!sidebarOpen);
  }, [persistSidebar, sidebarOpen]);

  const [staggerNavOpen, setStaggerNavOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) {
      setStaggerNavOpen(false);
      return;
    }
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setStaggerNavOpen(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        openSearch();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSearch]);

  return (
    <div className="relative z-10 flex min-h-dvh w-full flex-col">
      <header
        className={cn(
          "sticky top-0 z-40 flex min-h-[4.5rem] w-full shrink-0 items-center gap-3 border-b px-3 py-4 sm:min-h-[5rem] sm:px-6 sm:py-5",
          "border-alt-border/40 dark:border-white/10",
          "supports-[backdrop-filter]:backdrop-blur-2xl supports-[backdrop-filter]:backdrop-saturate-150",
          theme === "light" &&
            "supports-[backdrop-filter]:bg-white/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.65),0_10px_40px_-12px_rgba(0,0,0,0.1)] not-supports-[backdrop-filter]:bg-white",
          theme === "dark" &&
            "supports-[backdrop-filter]:bg-[#0a0a0a]/55 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_12px_48px_-10px_rgba(0,0,0,0.55)] not-supports-[backdrop-filter]:bg-[#0c0c0e]",
        )}
      >
        <button
          type="button"
          className="flex items-center justify-center rounded-alt border border-alt-border p-2 text-alt-text hover:border-alt-primary"
          onClick={toggleSidebar}
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <HamburgerIcon sidebarExpanded={sidebarOpen} />
        </button>
        <NavLink
          to="/home"
          end
          aria-label="AltCode, home"
          className="group inline-flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90"
        >
          <AltCodeLogo
            theme={theme}
            className="h-12 w-auto shrink-0 sm:h-14"
          />
          <TextPressureBrand theme={theme} minFontSize={28} />
        </NavLink>
        <div
          className="hidden min-w-0 flex-1 items-center justify-center gap-3 px-2 md:flex"
          title={`${progression.xp} / ${progression.xpNextLevel} XP`}
        >
          <span
            className={cn(
              "shrink-0 text-xs text-alt-muted",
              theme === "dark" && "font-mono uppercase",
            )}
          >
            Lv {progression.level} · {progression.title}
          </span>
          <div className="h-1.5 w-28 max-w-[30vw] overflow-hidden rounded-full bg-alt-border">
            <div
              className="h-full rounded-full bg-alt-cyan transition-all dark:bg-alt-primary"
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:flex-initial">
          <button
            type="button"
            className="rounded-alt border border-alt-border px-3 py-1 text-xs font-medium text-alt-text hover:border-alt-primary"
            onClick={toggleTheme}
            title={
              preference === "system"
                ? `Following system (${theme}). Click to set ${theme === "dark" ? "light" : "dark"}.`
                : `Switch to ${theme === "dark" ? "light" : "dark"}`
            }
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button
            type="button"
            className="rounded-alt border border-alt-border px-3 py-1 text-sm text-alt-text hover:border-alt-error hover:text-alt-error"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Log out
          </button>
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1">
        {!isMd && sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-black/50"
            aria-label="Close menu"
            onClick={() => persistSidebar(false)}
          />
        ) : null}

        <aside
          className={cn(
            "relative z-30 flex min-h-0 shrink-0 flex-col overflow-visible transition-[width,min-width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            sidebarOpen
              ? "w-[min(22rem,calc(100vw-1.25rem))] min-w-[min(22rem,calc(100vw-1.25rem))]"
              : "w-0 min-w-0 overflow-hidden",
          )}
        >
          <div
            className={cn(
              "flex h-full min-h-0 flex-1 flex-col py-3 pl-2 pr-0 sm:pl-3",
              !sidebarOpen && "pointer-events-none opacity-0",
            )}
          >
            <div
              className={cn(
                "flex min-h-0 flex-1 flex-col rounded-r-[1.75rem] border border-alt-border/25 bg-white/55 px-5 pb-8 pt-9 shadow-[8px_12px_40px_-12px_rgba(0,0,0,0.25)]",
                "dark:border-alt-border dark:bg-[#0c0c0e] dark:shadow-[8px_16px_48px_-8px_rgba(0,0,0,0.65)]",
              )}
            >
              <nav
                className={cn(
                  "alt-stagger-nav min-h-0 flex-1",
                  staggerNavOpen && "alt-stagger-nav--open",
                )}
                aria-label="Main navigation"
              >
                {STAGGER_NAV_ITEMS.map((item, i) => (
                  <div
                    key={item.to}
                    className="alt-stagger-nav__item"
                    style={{ "--alt-s": i } as CSSProperties}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === "/dashboard"}
                      className={({ isActive }) =>
                        cn(
                          "group relative pr-2",
                          staggerMenuLinkClass(isActive),
                        )
                      }
                      onClick={() => {
                        if (!isMd) persistSidebar(false);
                      }}
                    >
                      <span className="flex flex-wrap items-start justify-between gap-0">
                        <span className="text-left">{item.label}</span>
                        <sup
                          className={cn(
                            "mt-1 shrink-0 align-top text-[0.72rem] font-bold leading-none text-alt-primary",
                            "opacity-90 transition-opacity group-hover:opacity-100",
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </sup>
                      </span>
                    </NavLink>
                  </div>
                ))}
              </nav>
              <div
                className={cn(
                  "alt-stagger-nav border-t border-alt-border/35 pt-7 dark:border-alt-border/50",
                  staggerNavOpen && "alt-stagger-nav--open",
                )}
              >
                <p
                  className="alt-stagger-nav__item mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-alt-primary"
                  style={
                    { "--alt-s": STAGGER_NAV_ITEMS.length } as CSSProperties
                  }
                >
                  Actions
                </p>
                <div
                  className="alt-stagger-nav__item flex w-full flex-wrap items-baseline justify-between gap-y-2 bg-white dark:bg-[#0c0c0e]"
                  style={
                    {
                      "--alt-s": STAGGER_NAV_ITEMS.length + 1,
                    } as CSSProperties
                  }
                >
                  <button
                    type="button"
                    className="font-alt shrink-0 text-sm font-semibold text-alt-text underline-offset-4 transition-colors hover:text-alt-primary hover:underline"
                    onClick={() => openSearch()}
                  >
                    Search{" "}
                    <kbd className="font-mono text-xs text-alt-muted">/</kbd>
                  </button>
                  <span className="shrink-0 font-mono text-xs text-alt-muted">
                    v1.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-transparent">
          <main className="min-h-0 flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
      {open ? <SearchOverlay /> : null}
    </div>
  );
}
