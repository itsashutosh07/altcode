import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type Theme = 'dark' | 'light'
export type ThemePreference = 'system' | 'dark' | 'light'

const PREF_KEY = 'altcode_theme_preference'
const LEGACY_THEME_KEY = 'altcode_theme'

type ThemeContextValue = {
  /** Resolved palette: `system` follows OS. */
  theme: Theme
  preference: ThemePreference
  setPreference: (p: ThemePreference) => void
  /** Toggles between dark and light (sets explicit preference). */
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readPreference(): ThemePreference {
  try {
    const p = localStorage.getItem(PREF_KEY) as ThemePreference | null
    if (p === 'system' || p === 'dark' || p === 'light') return p
    const legacy = localStorage.getItem(LEGACY_THEME_KEY) as Theme | null
    if (legacy === 'dark' || legacy === 'light') return legacy
  } catch {
    /* ignore */
  }
  return 'system'
}

function persistPreference(p: ThemePreference) {
  try {
    localStorage.setItem(PREF_KEY, p)
    localStorage.removeItem(LEGACY_THEME_KEY)
  } catch {
    /* ignore */
  }
}

function resolveTheme(preference: ThemePreference, systemIsDark: boolean): Theme {
  if (preference === 'system') return systemIsDark ? 'dark' : 'light'
  return preference
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readPreference)
  const [systemIsDark, setSystemIsDark] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : true,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemIsDark(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const theme = useMemo(
    () => resolveTheme(preference, systemIsDark),
    [preference, systemIsDark],
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p)
    persistPreference(p)
  }, [])

  const toggleTheme = useCallback(() => {
    setPreferenceState((prevPref) => {
      const resolved = resolveTheme(prevPref, systemIsDark)
      const next: ThemePreference = resolved === 'dark' ? 'light' : 'dark'
      persistPreference(next)
      return next
    })
  }, [systemIsDark])

  const value = useMemo(
    () => ({ theme, preference, setPreference, toggleTheme }),
    [theme, preference, setPreference, toggleTheme],
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
