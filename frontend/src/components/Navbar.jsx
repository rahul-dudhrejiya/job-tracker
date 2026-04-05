import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { LogOut, Briefcase } from 'lucide-react'

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        toast.success('Logged out successfully!')
        navigate('/login')
    }

    return (
        <nav style={styles.nav}>
            <div style={styles.brand}>
                <Briefcase size={24} color="#4f46e5" />
                <span style={styles.brandText}>Job Tracker</span>
            </div>

            <div style={styles.right}>
                <span style={styles.welcome}>
                    👋 Hello, {user?.name}!
                </span>
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
    fontWeight: '600'
  }
}

export default Navbar