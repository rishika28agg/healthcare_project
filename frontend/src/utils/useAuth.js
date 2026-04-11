import { useState, useEffect } from 'react'
import { authAPI } from './api'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token')
      console.log('useAuth checkAuth: Token found?', !!token)
      
      if (token) {
        try {
          console.log('useAuth checkAuth: Calling getSelf()...')
          const response = await authAPI.getSelf()
          console.log('useAuth checkAuth: getSelf() success:', response.data)
          setUser(response.data)
        } catch (err) {
          console.error('useAuth checkAuth: getSelf() failed:', err.response?.status, err.message)
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          setUser(null)
        }
      } else {
        console.log('useAuth checkAuth: No token found')
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (username, password) => {
    try {
      setError(null)
      console.log('useAuth login: Attempting login with:', username)
      const response = await authAPI.login(username, password)
      console.log('useAuth login: Response received:', response.data)
      
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      console.log('useAuth login: Tokens stored in localStorage')
      
      // Update user state with the response data
      const userData = {
        user_id: response.data.user_id,
        username: response.data.username,
        email: response.data.email || '',
        role: response.data.role,
        patient_id: response.data.patient_id
      }
      
      setUser(userData)
      console.log('useAuth login: User state updated:', userData)
      
      return response.data
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Login failed'
      console.error('useAuth login: Failed:', message, err)
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

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }
}
