import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/shared/lib/cn";

type ShinyTextProps = {
  text: string;
  className?: string;
  disabled?: boolean;
  /** Cycle duration in seconds (React Bits default ~3.3). */
  speed?: number;
  /** Pause at end of sweep in seconds. */
  delay?: number;
  baseColor: string;
  shineColor: string;
  /** Gradient angle in degrees. */
  spread?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
};

/**
 * Animated gradient “shine” sweep on text (CSS clip + moving background).
 * Inspired by [React Bits — Shiny Text](https://reactbits.dev/text-animations/shiny-text).
 */
export function ShinyText({
  text,
  className,
  disabled = false,
  speed = 3.3,
  delay = 0.5,
  baseColor,
  shineColor,
  spread = 120,
  direction = "left",
  pauseOnHover = false,
}: ShinyTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduceMotion(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const gradientStyle: CSSProperties = {
    backgroundImage: `linear-gradient(${spread}deg, ${baseColor} 0%, ${baseColor} 35%, ${shineColor} 50%, ${baseColor} 65%, ${baseColor} 100%)`,
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
    backgroundPosition: "150% center",
  };

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled || reduceMotion || paused) return;

    const animMs = speed * 1000;
    const delayMs = delay * 1000;
    const dir = direction === "left" ? 1 : -1;
    let last: number | null = null;
    let elapsed = 0;

    const frame = (time: number) => {
      if (last === null) {
        last = time;
        rafRef.current = requestAnimationFrame(frame);
        return;
      }
      elapsed += time - last;
      last = time;

      const cycle = animMs + delayMs;
      const t = elapsed % cycle;
      let p: number;
      if (t < animMs) {
        p = (t / animMs) * 100;
      } else {
        p = 100;
      }
      const progress = dir === 1 ? p : 100 - p;
      const pos = `${150 - progress * 2}% center`;
      el.style.backgroundPosition = pos;
      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [delay, direction, disabled, paused, reduceMotion, speed, baseColor, shineColor]);

  if (reduceMotion || disabled) {
    return (
      <span className={cn(className)} style={{ color: baseColor }}>
        {text}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={cn("inline-block w-full max-w-full", className)}
      style={gradientStyle}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      {text}
    </span>
  );
}
