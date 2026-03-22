import { cn } from '@/shared/lib/cn'

export function heatmapIntensityClass(theme: 'dark' | 'light', level: number): string {
  if (level <= 0) {
    return theme === 'dark'
      ? 'bg-[#1a1a1a] border border-alt-border'
      : 'bg-stone-200/80 border border-alt-border'
  }
  if (theme === 'dark') {
    const d = [
      'bg-[rgba(0,255,65,0.25)]',
      'bg-[rgba(0,255,65,0.45)]',
      'bg-[rgba(0,255,65,0.65)]',
      'bg-alt-primary shadow-[0_0_6px_rgba(0,255,65,0.35)]',
    ]
    return d[Math.min(level, 4) - 1] ?? d[0]
  }
  const l = [
    'bg-[rgba(196,92,62,0.28)]',
    'bg-[rgba(196,92,62,0.48)]',
    'bg-[rgba(196,92,62,0.72)]',
    'bg-alt-primary',
  ]
  return l[Math.min(level, 4) - 1] ?? l[0]
}

export function heatmapLegendSwatch(theme: 'dark' | 'light', level: number) {
  return cn('size-3 rounded-[2px]', heatmapIntensityClass(theme, level))
}
