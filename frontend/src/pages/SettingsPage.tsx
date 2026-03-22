import { Link } from 'react-router-dom'
import { DEMO_EMAIL } from '@/app/auth/constants'
import { useTheme } from '@/app/theme/ThemeContext'
import { cn } from '@/shared/lib/cn'

export function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="alt-page-title">Settings</h1>
      <div className="alt-card p-4 text-sm">
        <p className="font-medium text-alt-text">Account (demo)</p>
        <p className="mt-1 text-alt-muted">{DEMO_EMAIL}</p>
      </div>
      <div className="alt-card p-4 text-sm">
        <p className="font-medium text-alt-text">Theme</p>
        <p className="mt-1 text-alt-muted">
          v0.2 — preview Terminal / Dystopian vs Earthy Brutalist (PRD §5).
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className={cn(
              'rounded-alt border px-3 py-1.5 text-xs font-medium transition-colors',
              theme === 'dark'
                ? 'border-alt-primary text-alt-primary'
                : 'border-alt-border text-alt-muted hover:border-alt-border',
            )}
            onClick={() => setTheme('dark')}
          >
            Dark (terminal)
          </button>
          <button
            type="button"
            className={cn(
              'rounded-alt border px-3 py-1.5 text-xs font-medium transition-colors',
              theme === 'light'
                ? 'border-alt-primary text-alt-text shadow-brutal'
                : 'border-alt-border text-alt-muted hover:border-alt-border',
            )}
            onClick={() => setTheme('light')}
          >
            Light (brutalist)
          </button>
        </div>
      </div>
      <div className="alt-card p-4 text-sm">
        <p className="font-medium text-alt-text">Keyboard</p>
        <ul className="mt-2 list-inside list-disc text-alt-muted">
          <li>
            <kbd className="font-mono text-alt-text">/</kbd> or{' '}
            <kbd className="font-mono text-alt-text">⌘K</kbd> — search
          </li>
          <li>
            Review: <kbd className="font-mono text-alt-text">Space</kbd> flip,{' '}
            <kbd className="font-mono text-alt-text">1–4</kbd> grade
          </li>
        </ul>
      </div>
      <p className="text-sm text-alt-muted">
        Use <strong className="text-alt-text">Log out</strong> in the header.{' '}
        <Link to="/dashboard" className="text-alt-primary underline">
          Dashboard
        </Link>
      </p>
    </div>
  )
}
