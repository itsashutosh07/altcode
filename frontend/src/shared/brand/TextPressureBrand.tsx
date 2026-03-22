import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Theme } from "@/app/theme/ThemeContext";
import { cn } from "@/shared/lib/cn";

const BRAND_TEXT = "AltCode";

function dist(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/** Near cursor → `maxVal`; far → `minVal` (Space Grotesk wght 300–700). */
function getAttr(
  distance: number,
  maxDist: number,
  minVal: number,
  maxVal: number,
): number {
  const t = Math.min(1, Math.max(0, distance / maxDist));
  return Math.round(minVal + (1 - t) * (maxVal - minVal));
}

function debounce<F extends (...args: unknown[]) => void>(fn: F, ms: number) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

type TextPressureBrandProps = {
  theme: Theme;
  className?: string;
  /** Minimum font size (px) for the responsive fit calculation. */
  minFontSize?: number;
};

/**
 * Cursor-reactive weight on Space Grotesk (wght axis) + stroke, inspired by
 * [React Bits Text Pressure](https://reactbits.dev/text-animations/text-pressure).
 */
export function TextPressureBrand({
  theme,
  className,
  minFontSize = 26,
}: TextPressureBrandProps) {
  const uid = useId().replace(/:/g, "");
  const scope = `tpb-${uid}`;
  const isDark = theme === "dark";
  const textColor = isDark ? "#e0e0e0" : "#1c1917";
  const strokeColor = isDark ? "#00ff41" : "#c45c3e";

  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const spansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const [fontSize, setFontSize] = useState(minFontSize);
  const [reduceMotion, setReduceMotion] = useState(false);

  const chars = useMemo(() => BRAND_TEXT.split(""), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setReduceMotion(mq.matches);
    onMq();
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) {
        cursorRef.current.x = t.clientX;
        cursorRef.current.y = t.clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = r.left + r.width / 2;
      mouseRef.current.y = r.top + r.height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current) return;
    const { width: w } = containerRef.current.getBoundingClientRect();
    let next = w / (chars.length / 2);
    next = Math.max(next, minFontSize);
    setFontSize(next);
  }, [chars.length, minFontSize]);

  useEffect(() => {
    const d = debounce(setSize, 100);
    d();
    window.addEventListener("resize", d);
    return () => window.removeEventListener("resize", d);
  }, [setSize]);

  useEffect(() => {
    if (reduceMotion) return;

    let rafId = 0;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = Math.max(titleRect.width / 2, 1);

        spansRef.current.forEach((span) => {
          if (!span) return;
          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          };
          const d = dist(mouseRef.current, charCenter);
          const wght = Math.floor(getAttr(d, maxDist, 300, 700));
          const next = `'wght' ${wght}`;
          if (span.style.fontVariationSettings !== next) {
            span.style.fontVariationSettings = next;
          }
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [reduceMotion]);

  const css = useMemo(
    () => `
      .${scope} .${scope}-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin: 0;
      }
      .${scope} .${scope}-stroke span {
        position: relative;
        color: ${textColor};
      }
      .${scope} .${scope}-stroke span::after {
        content: attr(data-char);
        position: absolute;
        left: 0;
        top: 0;
        color: transparent;
        z-index: -1;
        -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: ${strokeColor};
        pointer-events: none;
      }
      .${scope} .${scope}-title {
        color: ${textColor};
        font-family: var(--alt-font-ui), system-ui, sans-serif;
        text-transform: none;
        user-select: none;
        white-space: nowrap;
        width: 100%;
        line-height: 1;
        letter-spacing: -0.04em;
      }
    `,
    [scope, strokeColor, textColor],
  );

  if (reduceMotion) {
    return (
      <span
        className={cn(
          "font-alt text-[30px] font-semibold leading-none tracking-[-0.04em]",
          className,
        )}
        style={{ color: textColor }}
      >
        {BRAND_TEXT}
      </span>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        scope,
        "relative h-9 min-w-[7.5rem] sm:h-10 sm:min-w-[8.75rem]",
        className,
      )}
    >
      <style>{css}</style>
      <div
        ref={titleRef}
        className={`${scope}-title ${scope}-row ${scope}-stroke`}
        style={{
          fontSize,
          fontWeight: 400,
          fontVariationSettings: "'wght' 400",
        }}
      >
        {chars.map((char, i) => (
          <span
            key={`${char}-${i}`}
            ref={(el) => {
              spansRef.current[i] = el;
            }}
            data-char={char}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}
