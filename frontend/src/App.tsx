import './App.css'
import AppRoutes from './routes/AppRoutes.tsx'
import { AuthProvider } from './auth/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
