import './App.css'
import AppRoutes from './routes/AppRoutes.tsx'
import { AuthProvider } from './auth/AuthContext'
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
