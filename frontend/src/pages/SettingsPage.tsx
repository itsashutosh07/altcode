import { DEMO_EMAIL } from '@/app/auth/constants'
import type { ThemePreference } from '@/app/theme/ThemeContext'
import { useTheme } from '@/app/theme/ThemeContext'
import { cn } from '@/shared/lib/cn'

function ThemeOption({
  label,
  active,
  onClick,
  theme,
}: {
  label: string
  active: boolean
  onClick: () => void
  theme: 'dark' | 'light'
}) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-alt border px-3 py-1.5 text-left text-xs font-medium transition-colors',
        active
          ? theme === 'dark'
            ? 'border-alt-primary text-alt-primary'
            : 'border-alt-primary text-alt-text shadow-brutal'
          : 'border-alt-border text-alt-muted hover:border-alt-border hover:text-alt-text',
      )}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export function SettingsPage() {
  const { theme, preference, setPreference } = useTheme()

  const setPref = (p: ThemePreference) => () => setPreference(p)

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="alt-page-title">Settings</h1>
      <div className="alt-card p-4 text-sm">
        <p className="font-medium text-alt-text">Account (demo)</p>
        <p className="mt-1 text-alt-muted">{DEMO_EMAIL}</p>
      </div>
      <div className="alt-card p-4 text-sm">
        <p className="font-medium text-alt-text">Appearance</p>
        <p className="mt-1 text-alt-muted">
          Match your OS, or pin dark / light. Maps to PRD §5 tokens.
        </p>
        <div className="mt-3 flex flex-col gap-2">
          <ThemeOption
            label="System (follow OS)"
            active={preference === 'system'}
            onClick={setPref('system')}
            theme={theme}
          />
          <ThemeOption
            label="Dark — Terminal / dystopian"
            active={preference === 'dark'}
            onClick={setPref('dark')}
            theme={theme}
          />
          <ThemeOption
            label="Light — Earthy brutalist"
            active={preference === 'light'}
            onClick={setPref('light')}
            theme={theme}
          />
        </div>
        <p className="mt-3 text-xs text-alt-muted">
          Currently rendering: <strong className="text-alt-text">{theme}</strong>
          {preference === 'system' ? ' (from system)' : ''}.
        </p>
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
    </div>
  )
}
