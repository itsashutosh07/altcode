import { useCallback, useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/auth/AuthContext'
import { useSearchOverlay } from '@/app/context/SearchContext'
import { useTheme } from '@/app/theme/ThemeContext'
import { SearchOverlay } from '@/features/search/SearchOverlay'
import { staticAnalyticsRepository } from '@/data/repositories/staticRepositories'
import { cn } from '@/shared/lib/cn'

const SIDEBAR_KEY = 'altcode_sidebar_open'

function navLinkClass(isActive: boolean, theme: 'dark' | 'light') {
  if (theme === 'dark') {
    return cn(
      'block border px-3 py-2 text-sm font-medium transition-all rounded-alt',
      isActive
        ? 'border-alt-primary text-alt-primary shadow-[0_0_12px_rgba(0,255,65,0.12)]'
        : 'border-transparent text-alt-muted hover:border-alt-border hover:text-alt-text',
    )
  }
  return cn(
    'block border-2 px-3 py-2 text-sm font-medium transition-all rounded-alt',
    isActive
      ? 'border-alt-primary bg-alt-surface text-alt-text shadow-brutal'
      : 'border-transparent text-alt-muted hover:border-alt-border hover:text-alt-text',
  )
}

function HamburgerIcon({ sidebarExpanded }: { sidebarExpanded: boolean }) {
  return (
    <span className="flex h-5 w-6 flex-col justify-center gap-1" aria-hidden>
      <span
        className={cn(
          'h-0.5 bg-alt-text transition-transform',
          sidebarExpanded && 'translate-y-1.5 rotate-45',
        )}
      />
      <span
        className={cn(
          'h-0.5 bg-alt-text transition-opacity',
          sidebarExpanded && 'opacity-0',
        )}
      />
      <span
        className={cn(
          'h-0.5 bg-alt-text transition-transform',
          sidebarExpanded && '-translate-y-1.5 -rotate-45',
        )}
      />
    </span>
  )
}

export function AppShell() {
  const { logout } = useAuth()
  const { theme, preference, toggleTheme } = useTheme()
  const { openSearch, open } = useSearchOverlay()
  const navigate = useNavigate()
  const { progression } = staticAnalyticsRepository.getSummary()
  const xpPct =
    progression.xpNextLevel > 0
      ? Math.min(100, (progression.xp / progression.xpNextLevel) * 100)
      : 0

  const [isMd, setIsMd] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 768px)').matches
      : true,
  )

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const v = localStorage.getItem(SIDEBAR_KEY)
      if (v === '0') return false
      if (v === '1') return true
    } catch {
      /* ignore */
    }
    return typeof window !== 'undefined'
      ? window.matchMedia('(min-width: 768px)').matches
      : true
  })

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => setIsMd(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const persistSidebar = useCallback((open: boolean) => {
    setSidebarOpen(open)
    try {
      localStorage.setItem(SIDEBAR_KEY, open ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    persistSidebar(!sidebarOpen)
  }, [persistSidebar, sidebarOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        openSearch()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openSearch])

  return (
    <div className="relative z-10 min-h-dvh w-full">
      <div className="flex min-h-dvh w-full">
        {!isMd && sidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-20 bg-black/50"
            aria-label="Close menu"
            onClick={() => persistSidebar(false)}
          />
        ) : null}

        <aside
          className={cn(
            'relative z-30 flex flex-col overflow-hidden border-alt-border transition-[width,min-width] duration-200 ease-out',
            'border-r supports-[backdrop-filter]:bg-alt-surface/55 supports-[backdrop-filter]:backdrop-blur-2xl supports-[backdrop-filter]:backdrop-saturate-150',
            'dark:supports-[backdrop-filter]:bg-alt-surface/40',
            'supports-[backdrop-filter]:shadow-[inset_1px_0_0_0_rgba(255,255,255,0.22)]',
            'dark:supports-[backdrop-filter]:shadow-[inset_1px_0_0_0_rgba(255,255,255,0.06)]',
            'not-supports-[backdrop-filter]:bg-alt-surface',
            sidebarOpen ? 'w-56 min-w-[14rem]' : 'w-0 min-w-0 border-0',
          )}
        >
          <div
            className={cn(
              'flex h-full w-56 flex-col p-4',
              !sidebarOpen && 'pointer-events-none opacity-0',
            )}
          >
            <nav className="flex flex-col gap-1">
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) => navLinkClass(isActive, theme)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/quiz/new"
                className={({ isActive }) => navLinkClass(isActive, theme)}
              >
                Quiz
              </NavLink>
              <NavLink
                to="/review"
                className={({ isActive }) => navLinkClass(isActive, theme)}
              >
                Flashcards
              </NavLink>
              <NavLink
                to="/topics"
                className={({ isActive }) => navLinkClass(isActive, theme)}
              >
                Topics
              </NavLink>
              <NavLink
                to="/analytics"
                className={({ isActive }) => navLinkClass(isActive, theme)}
              >
                Analytics
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) => navLinkClass(isActive, theme)}
              >
                Settings
              </NavLink>
            </nav>
            <div className="mt-auto space-y-3 border-t border-alt-border pt-4">
              <button
                type="button"
                className="alt-btn-secondary w-full justify-start text-left text-xs"
                onClick={() => openSearch()}
              >
                Search <kbd className="float-right font-mono text-alt-muted">/</kbd>
              </button>
              <p className="text-xs text-alt-muted">v1.0</p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col bg-transparent">
          <header
            className={cn(
              'flex items-center gap-3 border-b px-3 py-2',
              'border-alt-border/60 dark:border-white/[0.08]',
              'supports-[backdrop-filter]:bg-alt-surface/50 supports-[backdrop-filter]:backdrop-blur-2xl supports-[backdrop-filter]:backdrop-saturate-150',
              'dark:supports-[backdrop-filter]:bg-alt-surface/35',
              'supports-[backdrop-filter]:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45)]',
              'dark:supports-[backdrop-filter]:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]',
              'not-supports-[backdrop-filter]:bg-alt-surface',
            )}
          >
            <button
              type="button"
              className="flex items-center justify-center rounded-alt border border-alt-border p-2 text-alt-text hover:border-alt-primary"
              onClick={toggleSidebar}
              aria-expanded={sidebarOpen}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <HamburgerIcon sidebarExpanded={sidebarOpen} />
            </button>
            <NavLink
              to="/dashboard"
              end
              className={cn(
                'shrink-0 font-bold uppercase tracking-wider text-alt-text transition-opacity hover:opacity-80',
                theme === 'dark' ? 'font-mono text-xs' : 'text-sm',
              )}
            >
              AltCode
            </NavLink>
            <div
              className="hidden min-w-0 flex-1 items-center justify-center gap-3 px-2 md:flex"
              title={`${progression.xp} / ${progression.xpNextLevel} XP`}
            >
              <span
                className={cn(
                  'shrink-0 text-xs text-alt-muted',
                  theme === 'dark' && 'font-mono uppercase',
                )}
              >
                Lv {progression.level} · {progression.title}
              </span>
              <div className="h-1.5 w-28 max-w-[30vw] overflow-hidden rounded-full bg-alt-border">
                <div
                  className="h-full rounded-full bg-alt-cyan transition-all dark:bg-alt-primary"
                  style={{ width: `${xpPct}%` }}
                />
              </div>
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-end gap-2 md:flex-initial">
              <button
                type="button"
                className="rounded-alt border border-alt-border px-3 py-1 text-xs font-medium text-alt-text hover:border-alt-primary"
                onClick={toggleTheme}
                title={
                  preference === 'system'
                    ? `Following system (${theme}). Click to set ${theme === 'dark' ? 'light' : 'dark'}.`
                    : `Switch to ${theme === 'dark' ? 'light' : 'dark'}`
                }
              >
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
              <button
                type="button"
                className="rounded-alt border border-alt-border px-3 py-1 text-sm text-alt-text hover:border-alt-error hover:text-alt-error"
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
              >
                Log out
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
      {open ? <SearchOverlay /> : null}
    </div>
  )
}
