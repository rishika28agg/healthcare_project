import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Printer, Lock, AlertCircle } from 'lucide-react'
import { doctorAPI } from '../utils/api'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function ViewPatientVitals() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const [patientInfo, setPatientInfo] = useState(null)
  const [patientVitals, setPatientVitals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [accessGranted, setAccessGranted] = useState(false)
  const [accessKey, setAccessKey] = useState('')
  const [accessError, setAccessError] = useState('')

  const handleAccessKeySubmit = async (e) => {
    e.preventDefault()
    setAccessError('')
    
    if (!accessKey.trim()) {
      setAccessError('Please enter the access key')
      return
    }

    try {
      setLoading(true)
      const response = await doctorAPI.getPatientVitalsWithKey(patientId, accessKey)
      console.log('Patient vitals:', response.data)
      
      if (response.data.length > 0) {
        setPatientVitals(response.data)
      } else {
        setPatientVitals([])
      }
      setAccessGranted(true)
      setAccessKey('')
    } catch (err) {
      console.error('Failed to fetch patient vitals:', err)
      if (err.response?.status === 403) {
        setAccessError('Invalid access key. Please ask the patient for the correct access key.')
      } else if (err.response?.status === 401) {
        setAccessError('Access denied. You are not assigned to this patient.')
      } else {
        setAccessError('Failed to load patient vitals. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const exportPatientVitalsCSV = () => {
    if (patientVitals.length === 0) {
      alert('No vitals data to export')
      return
    }

    const headers = ['Date & Time', 'Heart Rate (BPM)', 'O2 Level (%)', 'Temperature (F)']
    const rows = patientVitals.map(v => [
      new Date(v.timestamp).toLocaleString(),
      v.heart_rate,
      v.spo2,
      parseFloat(v.body_temperature).toFixed(2),
    ])

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `patient_${patientId}_vitals_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const printPatientReport = () => {
    const printWindow = window.open('', '_blank')
    const latestVital = patientVitals[0]
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Patient Vitals Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #0d9488; }
            .patient-info { background-color: #f0f9f8; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .stat { display: inline-block; margin: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 12px; text-align: left; }
            th { background-color: #0d9488; color: white; }
            .timestamp { color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Patient Vitals Report</h1>
          <div class="patient-info">
            <p><strong>Patient ID:</strong> ${patientId}</p>
            <p class="timestamp"><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <h2>Latest Vitals</h2>
          <div class="stat"><strong>Heart Rate:</strong> ${latestVital?.heart_rate || 'N/A'} BPM</div>
          <div class="stat"><strong>O2 Level:</strong> ${latestVital?.spo2 || 'N/A'}%</div>
          <div class="stat"><strong>Temperature:</strong> ${latestVital ? parseFloat(latestVital.body_temperature).toFixed(1) : 'N/A'} °F</div>
          
          <h2>Vitals History</h2>
          <table>
            <tr>
              <th>Date & Time</th>
              <th>Heart Rate (BPM)</th>
              <th>O2 Level (%)</th>
              <th>Temperature (°F)</th>
            </tr>
            ${patientVitals
              .map(
                v => `
              <tr>
                <td>${new Date(v.timestamp).toLocaleString()}</td>
                <td>${v.heart_rate}</td>
                <td>${v.spo2}</td>
                <td>${parseFloat(v.body_temperature).toFixed(1)}</td>
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

  const chartData = patientVitals.slice().reverse().map(v => ({
    time: new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    heart_rate: v.heart_rate,
    spo2: v.spo2,
    temperature: parseFloat(v.body_temperature.toFixed(1)),
  }))

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/dashboard/doctor')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Patient Vitals</h1>
          <p className="text-gray-600 mt-1">Patient ID: {patientId}</p>
        </div>
      </div>

      {!accessGranted ? (
        // Access Key Modal
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="flex justify-center mb-6">
              <div className="bg-amber-50 rounded-full p-4">
                <Lock size={32} className="text-amber-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Access Required</h2>
            <p className="text-gray-600 text-center mb-6">
              To view this patient's vital data, you need to enter their access key. Please ask the patient for their unique access key.
            </p>

            {accessError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-red-800 text-sm">{accessError}</p>
              </div>
            )}

            <form onSubmit={handleAccessKeySubmit} className="space-y-4">
              <div>
                <label htmlFor="accessKey" className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Access Key
                </label>
                <input
                  type="password"
                  id="accessKey"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="Enter the patient's access key"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Verifying Access Key...' : 'Access Patient Vitals'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        // Patient Vitals Display
        <>
          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button 
              onClick={exportPatientVitalsCSV}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 flex items-center gap-2 font-semibold"
            >
              <Download size={20} />
              Export CSV
            </button>
            <button 
              onClick={printPatientReport}
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 flex items-center gap-2 font-semibold"
            >
              <Printer size={20} />
              Print Report
            </button>
            <button 
              onClick={() => {
                setAccessGranted(false)
                setPatientVitals([])
                setAccessKey('')
              }}
              className="bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 font-semibold ml-auto"
            >
              Change Patient
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {patientVitals.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 text-lg">No vitals data available for this patient</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Two Cards Side by Side */}
              <div className="grid grid-cols-2 gap-6">
                {/* Heart Rate Card */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Heart Rate Readings</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ left: 0, right: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="heart_rate" fill="#ff4757" name="Heart Rate (BPM)" radius={[8, 8, 0, 0]} maxBarSize={15} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Oxygen & Temperature Card */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Oxygen & Temperature</h2>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={chartData} margin={{ left: 0, right: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="spo2" fill="#00d4aa" name="SpO2 (%)" radius={[8, 8, 0, 0]} maxBarSize={12} />
                      <Bar dataKey="temperature" fill="#ffc107" name="Temperature (°F)" radius={[8, 8, 0, 0]} maxBarSize={12} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Vitals History Table */}
              <div className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-teal-600 rounded"></div>
                  <h2 className="text-xl font-bold text-gray-900">Patient Vitals Records</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-4 font-semibold text-gray-700">Date & Time</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Heart Rate</th>
                        <th className="text-left p-4 font-semibold text-gray-700">O2 Level</th>
                        <th className="text-left p-4 font-semibold text-gray-700">Temperature</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patientVitals.map((v, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="p-4">{new Date(v.timestamp).toLocaleString()}</td>
                          <td className="p-4 text-red-600 font-semibold">{v.heart_rate} BPM</td>
                          <td className="p-4 text-teal-600 font-semibold">{v.spo2}%</td>
                          <td className="p-4 text-orange-600 font-semibold">{parseFloat(v.body_temperature).toFixed(1)} °F</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
