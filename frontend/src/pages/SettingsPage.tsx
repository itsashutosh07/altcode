import { Link } from 'react-router-dom'
import { DEMO_EMAIL } from '@/app/auth/constants'

export function SettingsPage() {
  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <div className="rounded border border-slate-300 bg-white p-4 text-sm">
        <p className="font-medium text-slate-700">Account (v0.1)</p>
        <p className="mt-1 text-slate-600">{DEMO_EMAIL}</p>
      </div>
      <div className="rounded border border-slate-300 bg-white p-4 text-sm">
        <p className="font-medium text-slate-700">Theme</p>
        <p className="mt-1 text-slate-500">Dual themes ship in v1.0 FE pass.</p>
      </div>
      <div className="rounded border border-slate-300 bg-white p-4 text-sm">
        <p className="font-medium text-slate-700">Keyboard</p>
        <ul className="mt-2 list-inside list-disc text-slate-600">
          <li>
            <kbd className="font-mono">/</kbd> or{' '}
            <kbd className="font-mono">⌘K</kbd> — search
          </li>
          <li>
            Review: <kbd className="font-mono">Space</kbd> flip,{' '}
            <kbd className="font-mono">1–4</kbd> grade
          </li>
        </ul>
      </div>
      <p className="text-sm text-slate-500">
        Use <strong>Log out</strong> in the header.{' '}
        <Link to="/dashboard" className="underline">
          Dashboard
        </Link>
      </p>
    </div>
  )
}
