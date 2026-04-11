import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import Alert from '../components/Alert'
import { useAuth } from '../utils/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(searchParams.get('message') || '')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!formData.username || !formData.password) {
      setError('Please enter username and password')
      return
    }

    setLoading(true)
    try {
      // Clear any existing tokens first
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      console.log('Cleared existing tokens')
      
      const user = await login(formData.username, formData.password)
      console.log('Login successful, user object:', user)
      console.log('User role:', user.role, 'Type:', typeof user.role)
      
      // Redirect based on role
      if (user.role === 'DOCTOR') {
        console.log('Redirecting to doctor dashboard')
        navigate('/dashboard/doctor')
      } else if (user.role === 'PATIENT') {
        console.log('Redirecting to patient dashboard')
        navigate('/dashboard/patient')
      } else {
        console.error('Unknown role:', user.role)
        setError(`Unknown user role: ${user.role}`)
      }
    } catch (err) {
      console.error('Login error:', err)
      const errorMsg = err.response?.data?.error || err.message || 'Login failed'
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-emerald-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-8 text-center rounded-t-2xl">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-white/90">Sign in to your account</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-2xl shadow-2xl p-8 space-y-6">
          {success && <Alert type="success" message={success} />}
          {error && <Alert type="error" message={error} />}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
