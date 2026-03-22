import { FormEvent, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/auth/AuthContext'
import { OTP_PENDING_KEY } from '@/app/auth/constants'

export function OtpPage() {
  const { isAuthenticated, verifyOtp, consumeReturnUrl } = useAuth()
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
      setError('Invalid OTP (v0.1: use 888888).')
      return
    }
    const next = consumeReturnUrl()
    navigate(next && next.startsWith('/') ? next : '/dashboard', {
      replace: true,
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-200 px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-300 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Verify OTP</h1>
        <p className="mt-1 text-sm text-slate-500">Demo static code</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="otp">
              6-digit code
            </label>
            <input
              id="otp"
              inputMode="numeric"
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 font-mono text-sm tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="888888"
              autoComplete="one-time-code"
            />
          </div>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded bg-slate-900 py-2 text-sm font-medium text-white"
          >
            Verify
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          <Link to="/login" className="underline">
            Back
          </Link>
        </p>
      </div>
    </div>
  )
}
