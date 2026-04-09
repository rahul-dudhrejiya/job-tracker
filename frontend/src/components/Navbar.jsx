import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { LogOut, Briefcase, Moon, Sun } from 'lucide-react'

const Navbar = ({ isDark, toggleDark }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully!')
    navigate('/login')
  }

  return (
    <nav style={{
      ...styles.nav,
      background: isDark ? '#1e1e2e' : 'white',
      boxShadow: isDark
        ? '0 2px 10px rgba(0,0,0,0.4)'
        : '0 2px 10px rgba(0,0,0,0.08)'
    }}>
      <div style={styles.brand}>
        <Briefcase size={24} color="#4f46e5" />
        <span style={{
          ...styles.brandText,
          color: isDark ? '#a5b4fc' : '#4f46e5'
        }}>
          Job Tracker
        </span>
      </div>

      <div style={styles.right}>
        <span style={{
          ...styles.welcome,
          color: isDark ? '#ccc' : '#555'
        }}>
          👋 Hello, {user?.name}!
        </span>

        {/* Dark Mode Toggle */}
        <button onClick={toggleDark} style={{
          ...styles.darkBtn,
          background: isDark ? '#2d2d3f' : '#f3f4f6',
          color: isDark ? '#a78bfa' : '#555'
        }}>
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? 'Light' : 'Dark'}
        </button>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    background: 'white',
    padding: '0 24px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  brandText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#4f46e5'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  welcome: {
    fontSize: '14px',
    color: '#555',
    fontWeight: '500'
  },
  darkBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  }
}

export default Navbar