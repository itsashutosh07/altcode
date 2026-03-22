import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/app/auth/AuthContext'
import { DEMO_EMAIL } from '@/app/auth/constants'
import { useTheme } from '@/app/theme/ThemeContext'
import { cn } from '@/shared/lib/cn'

export function LoginPage() {
  const { isAuthenticated, checkCredentials, markOtpPending, setReturnUrl } =
    useAuth()
  const { theme } = useTheme()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  useEffect(() => {
    const r = searchParams.get('returnUrl')
    if (r && r.startsWith('/') && !r.startsWith('//')) setReturnUrl(r)
  }, [searchParams, setReturnUrl])

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

  return (
    <div className="live-bg flex min-h-screen items-center justify-center px-4">
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
              autoComplete="current-password"
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
