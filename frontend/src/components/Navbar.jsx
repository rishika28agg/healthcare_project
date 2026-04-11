import { LogOut } from 'lucide-react'

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Healthcare Monitoring System</h1>
            <p className="text-sm text-emerald-100">Medical Dashboard</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                  {user.role}
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 hover:bg-white/20 px-4 py-2 rounded transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
