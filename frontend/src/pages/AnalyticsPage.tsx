import { Link } from 'react-router-dom'
import { useTheme } from '@/app/theme/ThemeContext'
import { staticAnalyticsRepository } from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'

function matrixIntensity(seed: number, week: number, day: number): number {
  const v = Math.sin(seed * 0.08 + week * 1.17 + day * 2.31)
  return Math.min(4, Math.max(0, Math.floor((v + 1) * 2.2)))
}

function matrixCellClass(theme: 'dark' | 'light', level: number): string {
  if (level <= 0) {
    return theme === 'dark'
      ? 'bg-[#1a1a1a] ring-1 ring-alt-border/80'
      : 'bg-stone-200/80 ring-1 ring-alt-border'
  }
  if (theme === 'dark') {
    const d = [
      'bg-[rgba(0,255,65,0.2)]',
      'bg-[rgba(0,255,65,0.45)]',
      'bg-[rgba(0,255,65,0.7)]',
      'bg-alt-primary shadow-[0_0_6px_rgba(0,255,65,0.35)]',
    ]
    return d[Math.min(level, 4) - 1] ?? d[0]
  }
  const l = [
    'bg-[rgba(196,92,62,0.25)]',
    'bg-[rgba(196,92,62,0.45)]',
    'bg-[rgba(196,92,62,0.7)]',
    'bg-alt-primary',
  ]
  return l[Math.min(level, 4) - 1] ?? l[0]
}

export function AnalyticsPage() {
  const { theme } = useTheme()
  const s = staticAnalyticsRepository.getSummary()
  const { weekCount, datalinkWeekIndex, seed } = s.activityMatrix

  const isDark = theme === 'dark'

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2 font-mono text-sm text-alt-muted">
          <span className="font-bold text-alt-primary">~</span>
          <span>/</span>
          <span className="font-medium tracking-wide text-alt-text">analytics_matrix</span>
          {isDark ? (
            <span className="ml-1 animate-pulse text-alt-primary">_</span>
          ) : null}
        </div>
        <h1
          className={cn(
            'text-3xl font-bold tracking-tight text-alt-text',
            isDark && 'font-mono uppercase tracking-widest',
          )}
        >
          {isDark ? 'System analytics' : 'Analytics'}
        </h1>
        <div className="relative mt-2 h-px w-full bg-alt-border">
          <div
            className={cn(
              'absolute left-0 top-0 h-full w-24',
              isDark
                ? 'bg-alt-primary shadow-[0_0_8px_rgba(0,255,65,0.4)]'
                : 'bg-alt-primary',
            )}
          />
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div
          className={cn(
            'flex flex-col bg-alt-surface p-5 transition-all',
            isDark
              ? 'border-b border-l border-r border-alt-border border-t-2 border-t-alt-primary hover:border-l-alt-primary hover:border-r-alt-primary hover:border-b-alt-primary hover:shadow-[0_0_8px_rgba(0,255,65,0.15)]'
              : 'rounded-alt border-2 border-alt-border border-t-alt-primary shadow-brutal hover:-translate-y-px',
          )}
        >
          <div className="mb-4 flex items-start justify-between">
            <span className="text-xs uppercase tracking-widest text-alt-muted">
              Retention rate
            </span>
          </div>
          <span className="text-4xl font-bold tracking-tighter text-alt-primary">
            {s.retentionPercent}
            <span className="text-2xl">%</span>
          </span>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="flex items-center text-alt-primary">
              +{s.retentionDeltaPct}%{' '}
            </span>
            <span className="text-alt-muted">vs last cycle</span>
          </div>
        </div>

        <div
          className={cn(
            'flex flex-col bg-alt-surface p-5 transition-all',
            isDark
              ? 'border-b border-l border-r border-alt-border border-t-2 border-t-alt-primary hover:border-l-alt-primary hover:border-r-alt-primary hover:border-b-alt-primary hover:shadow-[0_0_8px_rgba(0,255,65,0.15)]'
              : 'rounded-alt border-2 border-alt-border border-t-alt-primary shadow-brutal',
          )}
        >
          <div className="mb-4 flex items-start justify-between">
            <span className="text-xs uppercase tracking-widest text-alt-muted">
              Current streak
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold tracking-tighter text-alt-text">
              {s.streakDays}
            </span>
            <span className="pb-1 text-sm uppercase tracking-wide text-alt-muted">days</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-alt-muted">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'size-1.5 rounded-full',
                    i < Math.min(5, s.streakDays) ? 'bg-alt-primary' : 'bg-alt-border',
                  )}
                />
              ))}
            </div>
            <span className="ml-auto">Optimum flow</span>
          </div>
        </div>

        <div
          className={cn(
            'flex flex-col bg-alt-surface p-5 transition-all',
            isDark
              ? 'border-b border-l border-r border-alt-border border-t-2 border-t-alt-primary hover:border-l-alt-primary hover:border-r-alt-primary hover:border-b-alt-primary hover:shadow-[0_0_8px_rgba(0,255,65,0.15)]'
              : 'rounded-alt border-2 border-alt-border border-t-alt-primary shadow-brutal',
          )}
        >
          <div className="mb-4 flex items-start justify-between">
            <span className="text-xs uppercase tracking-widest text-alt-muted">
              Cards learned
            </span>
          </div>
          <span className="text-4xl font-bold tracking-tighter text-alt-text">
            {s.cardsLearned.toLocaleString()}
          </span>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <div className="relative mt-1 h-1 w-full bg-alt-border">
              <div
                className="absolute left-0 top-0 h-full bg-alt-primary"
                style={{ width: `${s.deckProgressPct}%` }}
              />
            </div>
            <span className="ml-2 whitespace-nowrap text-alt-muted">
              {s.deckProgressPct}% deck
            </span>
          </div>
        </div>

        <div
          className={cn(
            'flex flex-col bg-alt-surface p-5 transition-all',
            isDark
              ? 'border-b border-l border-r border-alt-border border-t-2 border-t-alt-primary hover:border-l-alt-primary hover:border-r-alt-primary hover:border-b-alt-primary hover:shadow-[0_0_8px_rgba(0,255,65,0.15)]'
              : 'rounded-alt border-2 border-alt-border border-t-alt-primary shadow-brutal',
          )}
        >
          <div className="mb-4 flex items-start justify-between">
            <span className="text-xs uppercase tracking-widest text-alt-muted">
              Avg time/card
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold tracking-tighter text-alt-text">
              {s.avgTimePerCardSec}
            </span>
            <span className="pb-1 text-2xl text-alt-muted">s</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs">
            <span className="flex items-center text-alt-error">
              {s.avgTimeDeltaSec > 0 ? '+' : ''}
              {s.avgTimeDeltaSec}s
            </span>
            <span className="text-alt-muted">vs avg</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div
          className={cn(
            'flex min-h-[400px] flex-col border border-alt-border bg-alt-surface p-5',
            !isDark && 'rounded-alt shadow-brutal',
          )}
        >
          <div className="mb-6 flex items-center justify-between">
            <h3
              className={cn(
                'flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-alt-text',
                isDark && 'font-mono',
              )}
            >
              <span className="size-2 animate-pulse bg-alt-primary" />
              14-day forecast
            </h3>
            <span className="font-mono text-xs text-alt-muted">
              [WORKLOAD_PROJECTION]
            </span>
          </div>
          <div className="relative flex flex-1 flex-col">
            <div className="absolute left-0 top-0 flex h-full w-8 flex-col justify-between border-r border-alt-border py-4 font-mono text-[10px] text-alt-muted">
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
            <div className="pointer-events-none absolute left-8 right-0 top-0 flex h-full flex-col justify-between py-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-full border-t border-dashed border-alt-border opacity-50"
                />
              ))}
              <div className="w-full border-t border-alt-border" />
            </div>
            <div className="relative z-10 ml-8 flex flex-1 items-end justify-between gap-1 pl-2 pr-1 pt-4 sm:gap-2">
              {s.forecast14.map((bar) => (
                <div
                  key={bar.label}
                  className="group relative flex h-full w-full flex-col items-center justify-end"
                >
                  <div
                    className="pointer-events-none absolute bottom-full mb-1 whitespace-nowrap rounded border border-alt-border bg-alt-bg px-2 py-1 font-mono text-[10px] text-alt-primary opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    {bar.tooltip}
                  </div>
                  <div
                    className={cn(
                      'chart-bar w-full rounded-t-sm transition-all hover:opacity-100',
                      bar.error
                        ? 'border border-alt-error bg-alt-error/80 hover:shadow-[0_0_8px_rgba(255,0,122,0.4)]'
                        : cn(
                            'bg-alt-primary/60 hover:shadow-[0_0_8px_rgba(0,255,65,0.4)]',
                            isDark && 'opacity-80 group-hover:opacity-100',
                          ),
                    )}
                    style={{ height: `${bar.heightPct}%` }}
                  />
                  <div
                    className={cn(
                      'mt-2 origin-left text-[9px] sm:rotate-0',
                      bar.error ? 'text-alt-error' : 'text-alt-muted',
                      'rotate-45 sm:rotate-0',
                    )}
                  >
                    {bar.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            'flex min-h-[400px] flex-col border border-alt-border bg-alt-surface p-5',
            !isDark && 'rounded-alt shadow-brutal',
          )}
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <h3
              className={cn(
                'flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-alt-text',
                isDark && 'font-mono',
              )}
            >
              <span className="text-alt-primary">▦</span>
              Activity matrix
            </h3>
            <div className="flex items-center gap-2 text-xs text-alt-muted">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((lv) => (
                  <div
                    key={lv}
                    className={cn(
                      'size-3 rounded-sm',
                      matrixCellClass(theme, lv),
                    )}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-x-auto pb-2">
            <div className="flex min-w-[640px] flex-col">
              <div className="mb-2 ml-6 flex justify-between pr-2 font-mono text-[10px] text-alt-muted">
                {Array.from({ length: Math.ceil(weekCount / 4) }, (_, i) => (
                  <span key={i}>M{i + 1}</span>
                ))}
              </div>
              <div className="flex gap-1">
                <div className="flex w-5 shrink-0 flex-col justify-around pt-1 font-mono text-[9px] text-alt-muted">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                    <span key={i}>{d}</span>
                  ))}
                </div>
                <div className="flex flex-1 gap-1">
                  {Array.from({ length: weekCount }, (_, week) => {
                    if (week === datalinkWeekIndex) {
                      return (
                        <div
                          key={`dl-${week}`}
                          className="relative flex flex-1 flex-col gap-1 border-x border-dashed border-alt-error bg-alt-error/10 py-1"
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="-rotate-90 whitespace-nowrap font-mono text-[8px] font-bold tracking-widest text-alt-error">
                              DATALINK_SEVERED
                            </span>
                          </div>
                          {Array.from({ length: 7 }).map((__, day) => (
                            <div key={day} className="min-h-[10px] flex-1 opacity-30" />
                          ))}
                        </div>
                      )
                    }
                    return (
                      <div key={week} className="flex flex-1 flex-col gap-1">
                        {Array.from({ length: 7 }, (_, day) => {
                          const level = matrixIntensity(seed, week, day)
                          return (
                            <div
                              key={day}
                              className="group relative min-h-[10px] flex-1"
                              title={`${level} intensity`}
                            >
                              <div
                                className={cn(
                                  'h-full w-full rounded-[1px] transition-transform hover:z-10 hover:scale-125 hover:shadow-[0_0_4px_rgba(0,255,65,0.8)]',
                                  matrixCellClass(theme, level),
                                )}
                              />
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={cn(
          'border border-alt-border bg-alt-surface p-5',
          !isDark && 'rounded-alt shadow-brutal',
        )}
      >
        <h3
          className={cn(
            'mb-4 text-sm font-semibold text-alt-text',
            isDark && 'font-mono uppercase tracking-wide',
          )}
        >
          Week overview (static)
        </h3>
        <div className="flex h-28 items-end gap-2">
          {s.forecast.map((f) => (
            <div key={f.date} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-alt-primary/70"
                style={{ height: `${Math.min(100, f.count * 2)}px` }}
                title={`${f.date}: ${f.count}`}
              />
              <span className="font-mono text-[10px] text-alt-muted">{f.date}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-alt-border pt-6">
        <p className="text-sm text-alt-muted">
          Plan reviews from the dashboard daily objective (PRD §8.4).
        </p>
        <Link to="/dashboard#daily" className="alt-btn-secondary text-sm">
          Schedule review →
        </Link>
      </div>
    </div>
  )
}
