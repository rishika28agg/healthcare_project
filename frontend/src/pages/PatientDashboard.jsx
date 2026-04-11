import { useEffect, useState } from 'react'
import Card from '../components/Card'
import { vitalsAPI, assignmentAPI } from '../utils/api'
import { Download, Printer, UserPlus, X } from 'lucide-react'
import {
  BarChart,
  Bar,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function PatientDashboard({ user }) {
  const [vitals, setVitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAssignDoctor, setShowAssignDoctor] = useState(false)
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [doctors, setDoctors] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [assignedDoctor, setAssignedDoctor] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch vitals
        const vitalsResponse = await vitalsAPI.getPatientVitals()
        setVitals(vitalsResponse.data)
        
        // Fetch assigned doctor
        console.log('Fetching assigned doctor...')
        const doctorResponse = await vitalsAPI.getPatientDoctor()
        console.log('Doctor response:', doctorResponse.data)
        setAssignedDoctor(doctorResponse.data.doctor || doctorResponse.data)
      } catch (err) {
        setError('Failed to load data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const fetchDoctors = async () => {
    setLoadingDoctors(true)
    try {
      const response = await assignmentAPI.getAvailableDoctors()
      setDoctors(response.data)
    } catch (err) {
      console.error('Failed to load doctors:', err)
    } finally {
      setLoadingDoctors(false)
    }
  }

  const handleOpenAssignDoctor = () => {
    fetchDoctors()
    setShowAssignDoctor(true)
  }

  const handleAssignDoctor = async (e) => {
    e.preventDefault()
    if (!selectedDoctorId) {
      alert('Please select a doctor')
      return
    }
    try {
      await assignmentAPI.assignDoctor(selectedDoctorId, user.user_id)
      alert('Doctor assigned successfully!')
      setShowAssignDoctor(false)
      setSelectedDoctorId('')
      
      // Refresh the assigned doctor
      const doctorResponse = await vitalsAPI.getPatientDoctor()
      setAssignedDoctor(doctorResponse.data.doctor || doctorResponse.data)
    } catch (err) {
      alert('Failed to assign doctor')
      console.error(err)
    }
  }

  const exportCSV = () => {
    if (vitals.length === 0) {
      alert('No vitals data to export')
      return
    }

    const headers = ['Date & Time', 'Heart Rate (BPM)', 'O2 Level (%)', 'Temperature (F)']
    const rows = vitals.map(v => [
      new Date(v.timestamp).toLocaleString(),
      v.heart_rate,
      v.spo2,
      v.body_temperature.toFixed(2),
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vitals_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const printReport = () => {
    const printWindow = window.open('', '_blank')
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Health Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #0d9488; }
            .stat { display: inline-block; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #0d9488; color: white; }
          </style>
        </head>
        <body>
          <h1>Healthcare Monitoring Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          
          <h2>Latest Vitals</h2>
          <div class="stat"><strong>Heart Rate:</strong> ${vitals[0]?.heart_rate || 'N/A'} BPM</div>
          <div class="stat"><strong>O2 Level:</strong> ${vitals[0]?.spo2 || 'N/A'}%</div>
          <div class="stat"><strong>Temperature:</strong> ${vitals[0]?.body_temperature.toFixed(2) || 'N/A'} F</div>
          
          <h2>Vitals History</h2>
          <table>
            <tr>
              <th>Date & Time</th>
              <th>Heart Rate (BPM)</th>
              <th>O2 Level (%)</th>
              <th>Temperature (F)</th>
            </tr>
            ${vitals
              .map(
                v => `
              <tr>
                <td>${new Date(v.timestamp).toLocaleString()}</td>
                <td>${v.heart_rate}</td>
                <td>${v.spo2}</td>
                <td>${v.body_temperature.toFixed(2)}</td>
              </tr>
            `
              )
              .join('')}
          </table>
        </body>
      </html>
    `
    printWindow.document.write(html)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 250)
  }

  const getHealthStatus = () => {
    if (vitals.length === 0) return { status: 'Normal', color: 'bg-teal-500', trend: 'Stable' }
    
    const hr = vitals[0].heart_rate
    const spo2 = vitals[0].spo2
    const temp = vitals[0].body_temperature
    
    // Critical if any value is out of range
    if (hr > 130 || hr < 60 || spo2 < 90 || temp > 100 || temp < 95) {
      return { status: 'Critical', color: 'bg-red-500', trend: 'Alert' }
    } else if (hr > 100 || spo2 < 95 || temp > 99) {
      return { status: 'Warning', color: 'bg-yellow-500', trend: 'Monitor' }
    }
    return { status: 'Normal', color: 'bg-green-500', trend: 'Stable' }
  }

  const lastCheckTime = vitals.length > 0 ? new Date(vitals[0].timestamp).toLocaleString() : 'N/A'
  const healthStatus = getHealthStatus()

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your vitals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Banner */}
      <div className="mb-8 bg-gradient-to-r from-teal-600 to-teal-700 text-white p-8 rounded-2xl">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.username}</h1>
        <p className="text-teal-100 text-lg mb-2">Patient ID: {user?.patient_id}</p>
        <p className="text-teal-100">Track and monitor your vital signs</p>
      </div>

      {/* Error Alert */}
      {error && <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">{error}</div>}

      {/* Health Status Alert */}
      {vitals.length > 0 && (
        <div className={`${healthStatus.color} text-white p-8 rounded-2xl mb-8 flex items-center justify-between`}>
          <div className="flex items-center">
            <div className="text-5xl mr-6">
              {healthStatus.status === 'Critical' ? '!' : ''}
              {healthStatus.status === 'Warning' ? '!' : ''}
              {healthStatus.status === 'Normal' ? '+' : ''}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{healthStatus.status}</h2>
              <p className="text-sm opacity-90">Last checked: {lastCheckTime}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Current Heart Rate"
          value={vitals[0]?.heart_rate || 'N/A'}
          unit="bpm"
          trend="+5%"
          icon="♥"
        />
        <StatCard
          label="Oxygen Level"
          value={vitals[0]?.spo2 || 'N/A'}
          unit="%"
          trend="+2%"
          icon="O2"
        />
        <StatCard
          label="Temperature"
          value={vitals[0]?.body_temperature.toFixed(1) || 'N/A'}
          unit="F"
          trend="+1%"
          icon="T"
        />
        <StatCard
          label="Total Records"
          value={vitals.length}
          unit=""
          trend=""
          icon="#"
        />
      </div>

      {/* Action Buttons */}
      {vitals.length > 0 && (
        <div className="flex gap-4 mb-8 items-center">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            <Download size={20} />
            Export CSV
          </button>
          <button
            onClick={printReport}
            className="flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition font-semibold"
          >
            <Printer size={20} />
            Print Report
          </button>
          
          {!assignedDoctor || !assignedDoctor.id ? (
            <button
              onClick={handleOpenAssignDoctor}
              className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition font-semibold ml-auto"
            >
              <UserPlus size={20} />
              Assign Doctor
            </button>
          ) : (
            <div className="ml-auto bg-teal-50 border border-teal-200 rounded-lg p-4 flex items-center gap-4">
              <div>
                <p className="text-sm text-teal-600">Your Patient ID:</p>
                <p className="font-bold text-teal-900">{user?.patient_id}</p>
                <p className="text-sm text-teal-600 mt-3">Assigned Doctor:</p>
                <p className="font-bold text-teal-900">{assignedDoctor.name}</p>
                <p className="text-xs text-teal-600">{assignedDoctor.email}</p>
              </div>
              <button
                onClick={handleOpenAssignDoctor}
                className="text-teal-600 hover:text-teal-800 ml-4"
              >
                Change
              </button>
            </div>
          )}
        </div>
      )}

      {/* Assign Doctor Modal */}
      {showAssignDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Assign Doctor</h2>
              <button
                onClick={() => setShowAssignDoctor(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAssignDoctor} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Doctor
                </label>
                {loadingDoctors ? (
                  <p className="text-gray-500">Loading doctors...</p>
                ) : doctors.length > 0 ? (
                  <select
                    value={selectedDoctorId}
                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.username})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-500 text-sm">No doctors available</p>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition font-semibold"
                >
                  Assign
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignDoctor(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Charts */}
      {vitals.length > 0 && (
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Heart Rate Chart */}
          <Card title="Heart Rate Readings">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vitals.slice().reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value) => [value, 'Heart Rate (BPM)']}
                />
                <Bar dataKey="heart_rate" fill="#ef4444" name="Heart Rate (bpm)" maxBarSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Oxygen & Temperature Chart */}
          <Card title="Oxygen & Temperature">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={vitals.slice().reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value) => value.toFixed(2)}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="spo2" fill="#14b8a6" name="SpO2 (%)" maxBarSize={12} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="body_temperature"
                  stroke="#f59e0b"
                  name="Temperature (F)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Vitals History Table */}
      {vitals.length > 0 && (
        <Card title="Vitals History">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Heart Rate</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">O2 Level</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Temperature</th>
                </tr>
              </thead>
              <tbody>
                {vitals.map((vital, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">{new Date(vital.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-red-600">{vital.heart_rate} BPM</td>
                    <td className="py-3 px-4 font-semibold text-teal-600">{vital.spo2}%</td>
                    <td className="py-3 px-4 font-semibold text-orange-600">{vital.body_temperature.toFixed(1)} F</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {vitals.length === 0 && (
        <Card title="No Vitals Recorded">
          <p className="text-gray-600">You haven't recorded any vitals yet. Schedule a checkup with your doctor.</p>
        </Card>
      )}
    </div>
  )
}

function StatCard({ label, value, unit, trend, icon }) {
  return (
    <Card>
      <div>
        <p className="text-sm text-gray-600 mb-2">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-gray-900">
            {value}
            {unit && <span className="text-sm font-semibold ml-1">{unit}</span>}
          </p>
          {trend && <span className="text-sm text-green-600 font-semibold">{trend}</span>}
        </div>
      </div>
    </Card>
  )
}
