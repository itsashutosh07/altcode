import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react'
import {
  AUTH_FLAG_KEY,
  DEMO_EMAIL,
  DEMO_OTP,
  DEMO_PASSWORD,
  OTP_PENDING_KEY,
  RETURN_URL_KEY,
  setAuthenticated as persistAuth,
} from './constants'

type AuthState = {
  isAuthenticated: boolean
  checkCredentials: (email: string, password: string) => boolean
  markOtpPending: () => void
  verifyOtp: (otp: string) => boolean
  logout: () => void
  setReturnUrl: (url: string) => void
  consumeReturnUrl: () => string | null
}

const AuthContext = createContext<AuthState | null>(null)

function getSnapshot(): boolean {
  return sessionStorage.getItem(AUTH_FLAG_KEY) === '1'
}

function getServerSnapshot(): boolean {
  return false
}

/** Same-tab auth updates (storage event only fires across tabs). */
let authListeners: (() => void)[] = []
function notifyAuthListeners() {
  authListeners.forEach((l) => l())
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSyncExternalStore(
    (onStoreChange) => {
      authListeners.push(onStoreChange)
      return () => {
        authListeners = authListeners.filter((l) => l !== onStoreChange)
      }
    },
    getSnapshot,
    getServerSnapshot,
  )

  const checkCredentials = useCallback((email: string, password: string) => {
    return email === DEMO_EMAIL && password === DEMO_PASSWORD
  }, [])

  const markOtpPending = useCallback(() => {
    sessionStorage.setItem(OTP_PENDING_KEY, '1')
  }, [])

  const verifyOtp = useCallback((otp: string) => {
    if (sessionStorage.getItem(OTP_PENDING_KEY) !== '1') return false
    if (otp !== DEMO_OTP) return false
    sessionStorage.removeItem(OTP_PENDING_KEY)
    persistAuth(true)
    notifyAuthListeners()
    return true
  }, [])

  const logout = useCallback(() => {
    persistAuth(false)
    sessionStorage.removeItem(RETURN_URL_KEY)
    sessionStorage.removeItem(OTP_PENDING_KEY)
    notifyAuthListeners()
  }, [])

  const setReturnUrl = useCallback((url: string) => {
    sessionStorage.setItem(RETURN_URL_KEY, url)
  }, [])

  const consumeReturnUrl = useCallback(() => {
    const v = sessionStorage.getItem(RETURN_URL_KEY)
    sessionStorage.removeItem(RETURN_URL_KEY)
    return v
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated,
      checkCredentials,
      markOtpPending,
      verifyOtp,
      logout,
      setReturnUrl,
      consumeReturnUrl,
    }),
    [
      isAuthenticated,
      checkCredentials,
      markOtpPending,
      verifyOtp,
      logout,
      setReturnUrl,
      consumeReturnUrl,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
