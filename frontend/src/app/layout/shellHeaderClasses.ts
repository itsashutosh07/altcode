import { cn } from "@/shared/lib/cn";

export function shellHeaderClass(theme: "dark" | "light") {
  return cn(
    "sticky top-0 z-40 flex min-h-[4.5rem] w-full shrink-0 items-center gap-3 border-b px-3 py-4 sm:min-h-[5rem] sm:px-6 sm:py-5",
    "border-alt-border/40 dark:border-white/10",
    "supports-[backdrop-filter]:backdrop-blur-2xl supports-[backdrop-filter]:backdrop-saturate-150",
    theme === "light" &&
      "supports-[backdrop-filter]:bg-white/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.65),0_10px_40px_-12px_rgba(0,0,0,0.1)] not-supports-[backdrop-filter]:bg-white",
    theme === "dark" &&
      "supports-[backdrop-filter]:bg-[#0a0a0a]/55 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_12px_48px_-10px_rgba(0,0,0,0.55)] not-supports-[backdrop-filter]:bg-[#0c0c0e]",
  );
}
