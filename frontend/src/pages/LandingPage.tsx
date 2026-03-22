import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/auth/AuthContext'
import { useTheme } from '@/app/theme/ThemeContext'
import { cn } from '@/shared/lib/cn'

export function LandingPage() {
  const { isAuthenticated } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  return (
    <div className="live-bg min-h-screen">
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
        <div
          className={cn(
            'w-full max-w-xl border bg-alt-surface p-10 rounded-alt',
            theme === 'dark' &&
              'border-alt-border shadow-[0_0_40px_rgba(0,255,65,0.06)]',
            theme === 'light' &&
              'angled-panel border-2 border-alt-border shadow-brutal',
          )}
        >
          <p
            className={cn(
              'text-alt-muted',
              theme === 'dark' && 'font-mono text-xs uppercase tracking-widest',
              theme === 'light' && 'text-xs font-semibold uppercase tracking-wide',
            )}
          >
            v0.2 prototype · dual theme
          </p>
          <h1
            className={cn(
              'mt-2 text-3xl font-bold text-alt-text',
              theme === 'dark' && 'font-mono uppercase tracking-tight',
            )}
          >
            AltCode
          </h1>
          <p className="mt-4 text-alt-muted">
            Quiz and flashcards for interview prep. Toggle Light/Dark after sign-in
            to preview both PRD themes.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className="alt-btn-primary">
              Log in
            </Link>
            <span className="self-center font-mono text-xs text-alt-muted">
              demo user + OTP in README
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
