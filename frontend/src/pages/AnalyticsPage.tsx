import { useTheme } from '@/app/theme/ThemeContext'
import { staticAnalyticsRepository } from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'

export function AnalyticsPage() {
  const { theme } = useTheme()
  const s = staticAnalyticsRepository.getSummary()

  return (
    <div className="space-y-8">
      <h1 className="alt-page-title">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {(
          [
            ['Retention', `${s.retentionPercent}%`],
            ['Due today', String(s.cardsDueToday)],
            ['Streak', `${s.streakDays}d`],
          ] as const
        ).map(([label, value]) => (
          <div
            key={label}
            className={cn(
              'alt-card p-4',
              theme === 'light' && 'shadow-brutal',
              theme === 'dark' && 'hover:border-alt-primary/40',
            )}
          >
            <p className="text-xs uppercase text-alt-muted">{label}</p>
            <p className="text-2xl font-bold text-alt-text">{value}</p>
          </div>
        ))}
      </div>
      <section>
        <h2
          className={cn(
            'mb-2 text-sm font-semibold text-alt-text',
            theme === 'dark' && 'font-mono uppercase tracking-wide',
          )}
        >
          Forecast (static)
        </h2>
        <div className="flex h-32 items-end gap-2 rounded-alt border border-alt-border bg-alt-surface p-3">
          {s.forecast.map((f) => (
            <div key={f.date} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={cn(
                  'w-full rounded-t transition-colors',
                  theme === 'dark' ? 'bg-alt-primary/70' : 'bg-alt-primary/80',
                )}
                style={{ height: `${Math.min(100, f.count * 2)}px` }}
                title={`${f.date}: ${f.count}`}
              />
              <span className="font-mono text-[10px] text-alt-muted">{f.date}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
