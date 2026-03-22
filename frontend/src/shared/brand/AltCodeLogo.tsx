import type { Theme } from "@/app/theme/ThemeContext";
import { cn } from "@/shared/lib/cn";

type AltCodeLogoProps = {
  theme: Theme;
  className?: string;
};

/** Stacked terminal cards — dark: source SVG palette; light: PRD terracotta / success tones. */
export function AltCodeLogo({ theme, className }: AltCodeLogoProps) {
  const isDark = theme === "dark";

  const backFill = isDark ? "#bbf7d0" : "#fcefe9";
  const backStroke = isDark ? "#86efac" : "#e8c9be";
  const midFill = isDark ? "#14532d" : "#c9a88f";
  const midStroke = isDark ? "#22c55e" : "#b45309";
  const frontFill = isDark ? "#000000" : "#1c1917";
  const frontStroke = isDark ? "#22c55e" : "#c45c3e";
  const topBar = isDark ? "#0a0a0a" : "#292524";
  const prompt = isDark ? "#22c55e" : "#c45c3e";

  return (
    <svg
      className={cn("h-11 w-auto shrink-0 sm:h-12", className)}
      width="260"
      height="200"
      viewBox="0 0 260 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g transform="rotate(-30 130 100)">
        <rect
          x="70"
          y="55"
          width="150"
          height="95"
          rx="14"
          ry="14"
          fill={backFill}
          stroke={backStroke}
          strokeWidth="2"
        />
      </g>
      <g transform="rotate(-15 130 100)">
        <rect
          x="55"
          y="50"
          width="150"
          height="95"
          rx="14"
          ry="14"
          fill={midFill}
          stroke={midStroke}
          strokeWidth="2"
        />
      </g>
      <g transform="rotate(-5 130 100)">
        <rect
          x="40"
          y="45"
          width="150"
          height="95"
          rx="14"
          ry="14"
          fill={frontFill}
          stroke={frontStroke}
          strokeWidth="2"
        />
        <rect
          x="40"
          y="45"
          width="150"
          height="92"
          rx="14"
          ry="14"
          fill={topBar}
        />
        <circle cx="55" cy="56" r="4" fill="#ff5f56" />
        <circle cx="68" cy="56" r="4" fill="#ffbd2e" />
        <circle cx="81" cy="56" r="4" fill="#27c93f" />
        <text
          x="105"
          y="95"
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-mono"
          fontSize="64"
          fontWeight="900"
          fill={prompt}
        >
          {">_"}
        </text>
      </g>
    </svg>
  );
}
