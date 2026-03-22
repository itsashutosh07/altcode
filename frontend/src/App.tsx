import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/app/auth/AuthContext'
import { ProtectedRoute } from '@/app/auth/ProtectedRoute'
import { SearchProvider } from '@/app/context/SearchContext'
import { LiveWebGLBackground } from '@/app/background/LiveWebGLBackground'
import { ThemeProvider } from '@/app/theme/ThemeContext'
import { AppShell } from '@/app/layout/AppShell'
import { PublicShell } from '@/app/layout/PublicShell'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OtpPage } from '@/pages/OtpPage'
import { QuizActivePage } from '@/pages/QuizActivePage'
import { QuizNewPage } from '@/pages/QuizNewPage'
import { QuizResultsPage } from '@/pages/QuizResultsPage'
import { ReviewPage } from '@/pages/ReviewPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { TopicDetailPage } from '@/pages/TopicDetailPage'
import { TopicsPage } from '@/pages/TopicsPage'
export default function App() {
  return (
    <ThemeProvider>
      <div className="live-bg min-h-dvh w-full">
        <LiveWebGLBackground />
        <div className="relative z-10 min-h-dvh w-full">
        <AuthProvider>
          <SearchProvider>
            <Routes>
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route element={<PublicShell />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/login/verify" element={<OtpPage />} />
            </Route>

            <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="topics" element={<TopicsPage />} />
              <Route path="topics/:topicId" element={<TopicDetailPage />} />
              <Route path="review" element={<ReviewPage />} />
              <Route path="quiz/new" element={<QuizNewPage />} />
              <Route path="quiz/:sessionId/results" element={<QuizResultsPage />} />
              <Route path="quiz/:sessionId" element={<QuizActivePage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </SearchProvider>
        </AuthProvider>
        </div>
      </div>
    </ThemeProvider>
  )
}
