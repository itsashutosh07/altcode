import { useCallback, useEffect, useState, type CSSProperties } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";
import type { SignInLocationState } from "@/app/auth/signInNudge";
import { useAuth } from "@/app/auth/AuthContext";
import { useSearchOverlay } from "@/app/context/SearchContext";
import { useTheme } from "@/app/theme/ThemeContext";
import { SearchOverlay } from "@/features/search/SearchOverlay";
import { AltCodeLogo } from "@/shared/brand/AltCodeLogo";
import { TextPressureBrand } from "@/shared/brand/TextPressureBrand";
import { cn } from "@/shared/lib/cn";
import { HamburgerIcon } from "./HamburgerIcon";
import { AUTH_DRAWER_ITEMS } from "./navConfig";
import { shellHeaderClass } from "./shellHeaderClasses";

const SIDEBAR_KEY = "altcode_sidebar_open";

function staggerMenuLinkClass(isActive: boolean) {
  return cn(
    "block font-alt text-[clamp(1.65rem,5vw,2.35rem)] font-extralight uppercase leading-[0.98] tracking-[-0.045em] text-alt-text transition-colors duration-200",
    "hover:text-alt-muted",
    isActive && "text-alt-primary",
  );
}

export function PublicShell() {
  const { isAuthenticated, logout } = useAuth();
  const { theme, preference, toggleTheme } = useTheme();
  const { openSearch, open } = useSearchOverlay();
  const navigate = useNavigate();

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

  type DrawerRow = {
    kind: "nav";
    to: string;
    label: string;
    end?: boolean;
  };

  const drawerRows: DrawerRow[] = isAuthenticated
    ? AUTH_DRAWER_ITEMS.map((item) => ({
        kind: "nav" as const,
        to: item.to,
        label: item.label,
        end: item.end,
      }))
    : [];

  const actionsStartIndex = drawerRows.length;

  return (
    <div className="relative z-10 flex min-h-dvh w-full flex-col">
      <header className={shellHeaderClass(theme)}>
        <button
          type="button"
          className="flex items-center justify-center rounded-alt border border-alt-border p-2 text-alt-text hover:border-alt-primary"
          onClick={toggleSidebar}
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? "Collapse menu" : "Expand menu"}
        >
          <HamburgerIcon sidebarExpanded={sidebarOpen} />
        </button>
        <NavLink
          to="/"
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
        <div className="hidden min-w-0 flex-1 md:block" aria-hidden />
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
          {isAuthenticated ? (
            <button
              type="button"
              className="rounded-alt border border-alt-border px-3 py-1 text-sm text-alt-text hover:border-alt-error hover:text-alt-error"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              state={
                {
                  signInHint:
                    "Sign in to unlock quizzes, flashcards, topics, and analytics.",
                } satisfies SignInLocationState
              }
              className="rounded-alt border border-alt-border px-3 py-1 text-xs font-semibold text-alt-primary hover:border-alt-primary"
            >
              Sign in
            </Link>
          )}
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
              {!isAuthenticated && drawerRows.length === 0 ? (
                <div className="min-h-0 flex-1 px-1 pt-1">
                  <p className="text-sm leading-relaxed text-alt-muted">
                    The full menu appears after you sign in. Use{" "}
                    <Link
                      to="/login"
                      state={
                        {
                          signInHint:
                            "Sign in to unlock the full workspace and rail menu.",
                        } satisfies SignInLocationState
                      }
                      className="font-medium text-alt-primary underline-offset-2 hover:underline"
                    >
                      Sign in
                    </Link>{" "}
                    (top right) or any app shortcut on the page — you’ll see a
                    reminder and go to login. Click the{" "}
                    <span className="text-alt-text">AltCode</span> title anytime
                    to return to this overview.
                  </p>
                </div>
              ) : (
                <nav
                  className={cn(
                    "alt-stagger-nav min-h-0 flex-1",
                    staggerNavOpen && "alt-stagger-nav--open",
                  )}
                  aria-label="Site navigation"
                >
                  {drawerRows.map((row, i) => (
                    <div
                      key={`${row.to}-${row.label}-${i}`}
                      className="alt-stagger-nav__item"
                      style={{ "--alt-s": i } as CSSProperties}
                    >
                      <NavLink
                        to={row.to}
                        end={row.end ?? false}
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
                          <span className="text-left">{row.label}</span>
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
              )}
              <div
                className={cn(
                  "alt-stagger-nav border-t border-alt-border/35 pt-7 dark:border-alt-border/50",
                  staggerNavOpen && "alt-stagger-nav--open",
                )}
              >
                <p
                  className="alt-stagger-nav__item mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-alt-primary"
                  style={{ "--alt-s": actionsStartIndex } as CSSProperties}
                >
                  Actions
                </p>
                <div
                  className="alt-stagger-nav__item flex w-full flex-wrap items-baseline justify-between gap-y-2 bg-transparent"
                  style={
                    { "--alt-s": actionsStartIndex + 1 } as CSSProperties
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
