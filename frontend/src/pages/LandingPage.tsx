import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/auth/AuthContext'

export function LandingPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  return (
    <div className="min-h-screen bg-slate-200 px-6 py-16">
      <div className="mx-auto max-w-xl rounded-lg border-2 border-dashed border-slate-400 bg-white p-10">
        <p className="font-mono text-xs uppercase text-slate-500">v0.1 prototype</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">AltCode</h1>
        <p className="mt-4 text-slate-600">
          Quiz and flashcards for interview prep. This build validates flows and
          navigation only—visual themes come later.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Log in
          </Link>
          <span className="self-center text-xs text-slate-500">
            Use demo credentials after login screen
          </span>
        </div>
      </div>
    </div>
  )
}
