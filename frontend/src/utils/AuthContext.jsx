import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token')
      console.log('AuthProvider checkAuth: Token found?', !!token)
      
      if (token) {
        try {
          console.log('AuthProvider checkAuth: Calling getSelf()...')
          const response = await authAPI.getSelf()
          console.log('AuthProvider checkAuth: getSelf() success:', response.data)
          setUser(response.data)
        } catch (err) {
          console.error('AuthProvider checkAuth: getSelf() failed:', err.response?.status, err.message)
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          setUser(null)
        }
      } else {
        console.log('AuthProvider checkAuth: No token found')
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (username, password) => {
    try {
      setError(null)
      console.log('AuthProvider login: Attempting login with:', username)
      const response = await authAPI.login(username, password)
      console.log('AuthProvider login: Response received:', response.data)
      
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      console.log('AuthProvider login: Tokens stored in localStorage')
      
      // Update user state with the response data
      const userData = {
        user_id: response.data.user_id,
        username: response.data.username,
        email: response.data.email || '',
        role: response.data.role,
        patient_id: response.data.patient_id
      }
      
      setUser(userData)
      console.log('AuthProvider login: User state updated:', userData)
      
      return response.data
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Login failed'
      console.error('AuthProvider login: Failed:', message, err)
      setError(message)
      throw err
    }
  }

  const register = async (username, email, password, fullName) => {
    try {
      setError(null)
      const response = await authAPI.register(username, email, password, fullName)
      return response.data
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed'
      setError(message)
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
