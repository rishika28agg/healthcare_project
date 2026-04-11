export default function Sidebar({ role }) {
  return (
    <aside className="w-64 bg-gradient-to-b from-teal-700 to-teal-800 text-white min-h-screen">
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">HC</h2>
          <p className="text-sm text-teal-100">Healthcare Monitoring System</p>
          <div className="mt-6">
            <span className="inline-block bg-teal-600 px-4 py-2 rounded-full text-sm font-semibold">
              {role === 'DOCTOR' ? 'Doctor' : 'Patient'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
