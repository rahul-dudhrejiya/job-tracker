import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Loader from './components/Loader'
import './App.css'

// Protect Route Components
// If not logged in -> redirect to login page!
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" />
}

// Public Route Component  
// If already logged in → redirect to dashboard!
const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuth()

  return !isLoggedIn ? children : <Navigate to="/dashboard" />
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        <PublicRoute><Login /></PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute><Register /></PublicRoute>
      } />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />

       {/* Default redirect */}
       <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App