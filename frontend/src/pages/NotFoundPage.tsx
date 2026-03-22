import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="space-y-4">
      <h1 className="alt-page-title">404</h1>
      <p className="text-alt-muted">This route is not part of the prototype map.</p>
      <Link to="/dashboard" className="text-sm text-alt-primary underline">
        Dashboard
      </Link>
    </div>
  )
}
