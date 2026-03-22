import { FormEvent, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/auth/AuthContext'
import { OTP_PENDING_KEY } from '@/app/auth/constants'
import { useTheme } from '@/app/theme/ThemeContext'
import { cn } from '@/shared/lib/cn'

export function OtpPage() {
  const { isAuthenticated, verifyOtp, consumeReturnUrl } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  const pending =
    typeof window !== 'undefined' &&
    sessionStorage.getItem(OTP_PENDING_KEY) === '1'

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  if (!pending && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!verifyOtp(otp)) {
      setError('Invalid OTP.')
      return
    }
    const next = consumeReturnUrl()
    navigate(next && next.startsWith('/') ? next : '/dashboard', {
      replace: true,
    })
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
          Verify OTP
        </h1>
        <p className="mt-1 font-mono text-sm text-alt-muted">Static demo code</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-alt-text" htmlFor="otp">
              6-digit code
            </label>
            <input
              id="otp"
              inputMode="numeric"
              className="alt-input mt-1 font-mono tracking-widest"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
              placeholder="888888"
              autoComplete="one-time-code"
            />
          </div>
          {error ? (
            <p className="text-sm text-alt-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="alt-btn-primary w-full">
            Verify
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-alt-muted">
          <Link to="/login" className="underline hover:text-alt-primary">
            Back
          </Link>
        </p>
      </div>
    </div>
  )
}
