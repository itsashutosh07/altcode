import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { protectedRouteSignInHint, type SignInLocationState } from './signInNudge'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const returnUrl = `${location.pathname}${location.search}`
    const state: SignInLocationState = {
      signInHint: protectedRouteSignInHint(returnUrl),
    }
    return (
      <Navigate
        to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
        replace
        state={state}
      />
    )
  }

  return <>{children}</>
}
