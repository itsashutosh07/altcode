import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/app/auth/AuthContext'
import { DEMO_EMAIL } from '@/app/auth/constants'

export function LoginPage() {
  const { isAuthenticated, checkCredentials, markOtpPending, setReturnUrl } =
    useAuth()
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
    if (r) setReturnUrl(r)
  }, [searchParams, setReturnUrl])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!checkCredentials(email, password)) {
      setError('Invalid email or password (v0.1: use plan credentials).')
      return
    }
    markOtpPending()
    navigate('/login/verify')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-200 px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-300 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Sign in</h1>
        <p className="mt-1 text-sm text-slate-500">AltCode v0.1 — OTP step next</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="pw">
              Password
            </label>
            <input
              id="pw"
              type="password"
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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
            Continue
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-500">
          <Link to="/" className="underline">
            Back to landing
          </Link>
        </p>
      </div>
    </div>
  )
}
