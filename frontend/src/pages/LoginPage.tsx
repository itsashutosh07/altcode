import { FormEvent, type KeyboardEvent, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/app/auth/AuthContext'
import { DEMO_EMAIL } from '@/app/auth/constants'
import type { SignInLocationState } from '@/app/auth/signInNudge'
import { useTheme } from '@/app/theme/ThemeContext'
import { cn } from '@/shared/lib/cn'

const NUDGE_DISMISS_MS = 14_000

export function LoginPage() {
  const { isAuthenticated, checkCredentials, markOtpPending, setReturnUrl } =
    useAuth()
  const { theme } = useTheme()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const hint = (location.state as SignInLocationState | null)?.signInHint
  const [nudgeVisible, setNudgeVisible] = useState(Boolean(hint))

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  useEffect(() => {
    const r = searchParams.get('returnUrl')
    if (r && r.startsWith('/') && !r.startsWith('//')) setReturnUrl(r)
  }, [searchParams, setReturnUrl])

  useEffect(() => {
    if (!hint || !nudgeVisible) return
    const t = window.setTimeout(() => setNudgeVisible(false), NUDGE_DISMISS_MS)
    return () => window.clearTimeout(t)
  }, [hint, nudgeVisible])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!checkCredentials(email, password)) {
      setError('Invalid email or password.')
      return
    }
    markOtpPending()
    navigate('/login/verify')
  }

  function onFieldEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    e.currentTarget.form?.requestSubmit()
  }

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col items-center justify-center px-4 py-6">
      {nudgeVisible && hint ? (
        <div
          className={cn(
            'fixed bottom-4 right-4 z-[60] max-w-sm transition-opacity duration-300',
            'rounded-alt border p-4 text-sm shadow-lg',
            theme === 'dark' &&
              'border-alt-primary/40 bg-alt-surface/95 text-alt-text backdrop-blur-md',
            theme === 'light' &&
              'border-alt-border bg-alt-surface shadow-brutal',
          )}
          role="status"
        >
          <p className="leading-snug text-alt-text">{hint}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-alt border border-alt-primary px-3 py-1 text-xs font-semibold text-alt-primary hover:bg-alt-primary/10"
              onClick={() => setNudgeVisible(false)}
            >
              Dismiss
            </button>
            <Link
              to="/"
              className="rounded-alt border border-alt-border px-3 py-1 text-xs font-medium text-alt-muted hover:border-alt-primary hover:text-alt-text"
            >
              Back to landing
            </Link>
          </div>
        </div>
      ) : null}
      <div
        className={cn(
          'relative z-10 w-full max-w-md border bg-alt-surface p-8 rounded-alt',
          theme === 'dark' && 'border-alt-border',
          theme === 'light' && 'border-2 border-alt-border shadow-brutal',
        )}
      >
        <h1
          className={cn(
            'text-xl font-semibold text-alt-text',
            theme === 'dark' && 'font-mono uppercase',
          )}
        >
          Sign in
        </h1>
        <p className="mt-1 text-sm text-alt-muted">OTP on next step</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-alt-text" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="alt-input mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onFieldEnter}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-alt-text" htmlFor="pw">
              Password
            </label>
            <input
              id="pw"
              type="password"
              className="alt-input mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onFieldEnter}
              autoComplete="current-password"
              autoFocus
            />
          </div>
          {error ? (
            <p className="text-sm text-alt-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="alt-btn-primary w-full">
            Continue
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-alt-muted">
          <Link to="/" className="underline hover:text-alt-primary">
            Back to landing
          </Link>
        </p>
      </div>
    </div>
  )
}
