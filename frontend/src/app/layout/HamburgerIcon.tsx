import { cn } from "@/shared/lib/cn";

export function HamburgerIcon({ sidebarExpanded }: { sidebarExpanded: boolean }) {
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
