import { Navigate } from 'react-router'
import { isLoggedIn } from '../lib/auth'

// حارس الصفحات المحمية: إلا ما كاينش login، كيردك لـ /login
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}
