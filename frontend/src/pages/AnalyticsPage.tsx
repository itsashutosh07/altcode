import { staticAnalyticsRepository } from '@/data/repositories/staticRepositories'

export function AnalyticsPage() {
  const s = staticAnalyticsRepository.getSummary()

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded border border-slate-300 bg-white p-4">
          <p className="text-xs uppercase text-slate-500">Retention</p>
          <p className="text-2xl font-bold text-slate-900">{s.retentionPercent}%</p>
        </div>
        <div className="rounded border border-slate-300 bg-white p-4">
          <p className="text-xs uppercase text-slate-500">Due today</p>
          <p className="text-2xl font-bold text-slate-900">{s.cardsDueToday}</p>
        </div>
        <div className="rounded border border-slate-300 bg-white p-4">
          <p className="text-xs uppercase text-slate-500">Streak</p>
          <p className="text-2xl font-bold text-slate-900">{s.streakDays}d</p>
        </div>
      </div>
      <section>
        <h2 className="mb-2 text-sm font-semibold text-slate-700">Forecast (static)</h2>
        <div className="flex h-32 items-end gap-2">
          {s.forecast.map((f) => (
            <div key={f.date} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-slate-700"
                style={{ height: `${Math.min(100, f.count * 2)}px` }}
                title={`${f.date}: ${f.count}`}
              />
              <span className="text-xs text-slate-500">{f.date}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
