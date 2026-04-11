import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './utils/AuthContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import ViewPatientVitals from './pages/ViewPatientVitals'
import Settings from './pages/Settings'

// Protected Route Component
function ProtectedRoute({ children, user, requiredRole }) {
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to login')
    return <Navigate to="/login" />
  }
  if (requiredRole && user.role !== requiredRole) {
    console.error(`ProtectedRoute: Role mismatch. User role: "${user.role}", Required: "${requiredRole}"`)
    return <Navigate to="/" />
  }
  console.log(`ProtectedRoute: Access granted for role "${user.role}"`)
  return children
}

// Layout with Sidebar
function DashboardLayout({ children, user }) {
  return (
    <div className="flex flex-col">
      <Navbar user={user} onLogout={() => window.location.href = '/login'} />
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}

export default function App() {
  const { user, isAuthenticated, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Patient */}
        <Route
          path="/dashboard/patient"
          element={
            <ProtectedRoute user={user} requiredRole="PATIENT">
              <DashboardLayout user={user}>
                <PatientDashboard user={user} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Doctor */}
        <Route
          path="/dashboard/doctor"
          element={
            <ProtectedRoute user={user} requiredRole="DOCTOR">
              <DashboardLayout user={user}>
                <DoctorDashboard user={user} />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/doctor/patient/:patientId/vitals"
          element={
            <ProtectedRoute user={user} requiredRole="DOCTOR">
              <DashboardLayout user={user}>
                <ViewPatientVitals />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute user={user}>
              <DashboardLayout user={user}>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect all other routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
