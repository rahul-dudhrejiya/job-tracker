import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import API from '../utils/api'

const Register = () => {
    const navigate = useNavigate()
    const { login } = useAuth()

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [loading, setLoading] = useState(false)

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault() //stop pages refresh!

        //validate
        if (!formData.name || !formData.email || !formData.password) {
            toast.error('Please fill all fields!')
            return
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters!')
            return
        }

        try {
            setLoading(true)

            // Call our backend API
            const response = await API.post('/auth/register', formData)

            // Save user and token
            login(response.data.user, response.data.token)

            toast.success('Account created successfully')
            navigate('/dashboard')

        } catch (error) {
            toast.error(error.response?.data?.message || 'Register failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.title}>Job Tracker</h1>
                    <p style={styles.subtitle}>Create your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={styles.form}>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input 
                        type="text" 
                        name="name"
                        placeholder="Rahul Dudharejiya"
                        value={formData.name}
                        onChange={handleChange}
                        style={styles.input}
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input 
                        type="email" 
                        name="email"
                        placeholder="rahul@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input 
                        type="password" 
                        name="password"
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        style={styles.input}
                        />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        ...styles.button,
                        opacity: loading ? 0.7 : 1,
                      }}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                </form>

                {/* Footer */}
                <p style={styles.footer}>
                    Already have an account?{' '}
                    <Link to = "/login" style={styles.link}>
                        Login here
                    </Link>
                </p> 
            </div>
        </div>
    )
}

// Styles
const styles = {
    container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#4f46e5',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#666',
    fontSize: '15px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#444'
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  button: {
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '8px'
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    color: '#666',
    fontSize: '14px'
  },
  link: {
    color: '#4f46e5',
    fontWeight: '600',
    textDecoration: 'none'
  }
}

export default Register