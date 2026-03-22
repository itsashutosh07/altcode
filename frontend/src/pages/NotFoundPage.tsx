import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">404</h1>
      <p className="text-slate-600">This route is not part of the v0.1 map.</p>
      <Link to="/dashboard" className="text-sm underline">
        Dashboard
      </Link>
    </div>
  )
}
