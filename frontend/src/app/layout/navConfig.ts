/** Shared rail / drawer destinations (after Home). */
export const STAGGER_NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/quiz/new", label: "Quiz" },
  { to: "/review", label: "Flashcards" },
  { to: "/topics", label: "Topics" },
  { to: "/analytics", label: "Analytics" },
  { to: "/settings", label: "Profile" },
] as const;

/** App rail — logo in the header returns to `/`. */
export const AUTH_DRAWER_ITEMS = STAGGER_NAV_ITEMS.map((item) => ({
  to: item.to,
  label: item.label,
  end: item.to === "/dashboard",
}));
