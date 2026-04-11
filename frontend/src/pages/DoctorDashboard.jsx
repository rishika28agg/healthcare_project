import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import { doctorAPI } from '../utils/api'

export default function DoctorDashboard({ user }) {
  const navigate = useNavigate()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      setError('')
      console.log('Fetching doctor patients...')
      const response = await doctorAPI.getPatients()
      console.log('Patients fetched:', response.data)
      setPatients(response.data)
    } catch (err) {
      console.error('Failed to fetch patients:', err)
      setError('Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  const handleViewVitals = (patient) => {
    navigate(`/dashboard/doctor/patient/${patient.id}/vitals`)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Welcome, Dr. {user?.username}</h1>
        <p className="text-gray-600 mt-2">Manage your assigned patients</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">{error}</div>}

      {loading ? (
        <div className="text-center py-12">Loading patients...</div>
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No patients assigned yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{patient.name}</h3>
                  <p className="text-gray-600">Email: {patient.email}</p>
                  <p className="text-sm text-gray-500">Patient ID: {patient.patient_id}</p>
                </div>
                <button 
                  onClick={() => handleViewVitals(patient)}
                  className="bg-teal-100 text-teal-700 px-4 py-2 rounded-lg hover:bg-teal-200"
                >
                  View Vitals
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
