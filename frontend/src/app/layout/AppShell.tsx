import { useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/auth/AuthContext'
import { useSearchOverlay } from '@/app/context/SearchContext'
import { SearchOverlay } from '@/features/search/SearchOverlay'

const navCls = ({ isActive }: { isActive: boolean }) =>
  `rounded px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-200'
  }`

export function AppShell() {
  const { logout } = useAuth()
  const { openSearch, open } = useSearchOverlay()
  const navigate = useNavigate()

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
    <div className="flex min-h-screen bg-slate-100">
      <aside className="flex w-52 flex-col border-r border-slate-300 bg-white p-4">
        <div className="mb-6 font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
          AltCode
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink to="/dashboard" className={navCls} end>
            Dashboard
          </NavLink>
          <NavLink to="/topics" className={navCls}>
            Topics
          </NavLink>
          <NavLink to="/analytics" className={navCls}>
            Analytics
          </NavLink>
          <NavLink to="/settings" className={navCls}>
            Settings
          </NavLink>
        </nav>
        <div className="mt-auto border-t border-slate-200 pt-4 text-xs text-slate-500">
          <button
            type="button"
            className="w-full rounded border border-dashed border-slate-300 px-2 py-1 text-left hover:bg-slate-50"
            onClick={() => openSearch()}
          >
            Search <kbd className="float-right font-mono">/</kbd>
          </button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-end gap-2 border-b border-slate-300 bg-white px-4 py-2">
          <span className="text-xs text-slate-500">v0.1 prototype</span>
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-1 text-sm"
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            Log out
          </button>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
      {open ? <SearchOverlay /> : null}
    </div>
  )
}
