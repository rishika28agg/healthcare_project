import { useEffect, useState } from 'react'
import { Eye, EyeOff, Copy, RefreshCw, Lock, AlertCircle } from 'lucide-react'
import { patientAPI, authAPI } from '../utils/api'

export default function Settings({ user }) {
  const [showAccessKey, setShowAccessKey] = useState(false)
  const [accessKey, setAccessKey] = useState('')
  const [newAccessKey, setNewAccessKey] = useState('')
  const [showNewKeyInput, setShowNewKeyInput] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchAccessKey()
  }, [])

  const fetchAccessKey = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await patientAPI.getAccessKey()
      setAccessKey(response.data.access_key)
    } catch (err) {
      console.error('Failed to fetch access key:', err)
      // Only show error if it's not a 403 (e.g., doctor trying to access patient endpoint)
      if (err.response?.status !== 403) {
        setError('Failed to load access key')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateKey = async () => {
    if (!newAccessKey.trim()) {
      setError('Please enter a new access key')
      return
    }

    if (!window.confirm('Are you sure you want to change your access key? Doctors will need the new key to view your vitals.')) {
      return
    }

    try {
      setIsUpdating(true)
      setError('')
      setSuccess('')
      const response = await patientAPI.updateAccessKey(newAccessKey)
      setAccessKey(response.data.access_key)
      setNewAccessKey('')
      setShowNewKeyInput(false)
      setSuccess('Access key updated successfully!')
      setCopied(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Failed to update access key:', err)
      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError('Failed to update access key. Please try again.')
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCopyAccessKey = () => {
    navigator.clipboard.writeText(accessKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Access Key Section (for patients only) */}
        {accessKey && (
          <div className="border-b pb-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock size={24} className="text-teal-600" />
              <div>
                <h2 className="text-xl font-semibold">Doctor Access Key</h2>
                <p className="text-sm text-gray-600">Share this key with your DOCTORS to allow them to view your vital information</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex gap-3">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            )}

            {loading && !accessKey ? (
              <div className="text-gray-500">Loading access key...</div>
            ) : (
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {showAccessKey ? (
                      <code className="text-lg font-mono bg-white px-3 py-2 rounded border border-gray-300 flex-1 text-gray-900">
                        {accessKey}
                      </code>
                    ) : (
                      <code className="text-lg font-mono bg-white px-3 py-2 rounded border border-gray-300 flex-1 text-gray-400">
                        {'•'.repeat(accessKey.length)}
                      </code>
                    )}
                    <button
                      onClick={() => setShowAccessKey(!showAccessKey)}
                      className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-200 rounded"
                      title={showAccessKey ? 'Hide' : 'Show'}
                    >
                      {showAccessKey ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCopyAccessKey}
                    className="flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-lg hover:bg-teal-200 transition font-medium"
                  >
                    <Copy size={18} />
                    {copied ? 'Copied!' : 'Copy Key'}
                  </button>
                  <button
                    onClick={() => setShowNewKeyInput(!showNewKeyInput)}
                    disabled={isUpdating}
                    className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-lg hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                  >
                    <RefreshCw size={18} className={isUpdating ? 'animate-spin' : ''} />
                    {isUpdating ? 'Updating...' : 'Change Key'}
                  </button>
                </div>

                {showNewKeyInput && (
                  <div className="mt-4 p-4 border border-amber-200 bg-amber-50 rounded-lg space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Access Key</label>
                      <input
                        type="text"
                        value={newAccessKey}
                        onChange={(e) => setNewAccessKey(e.target.value)}
                        placeholder="Enter your new access key"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                        disabled={isUpdating}
                      />
                      <p className="text-xs text-gray-600 mt-1">Choose a secure key that you can remember and share with doctors</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateKey}
                        disabled={isUpdating || !newAccessKey.trim()}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                      >
                        Update Key
                      </button>
                      <button
                        onClick={() => {
                          setShowNewKeyInput(false)
                          setNewAccessKey('')
                          setError('')
                        }}
                        disabled={isUpdating}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  <strong>How to share:</strong> Copy your access key and securely send it to your doctor. They will need this key to view your vital information.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Account Settings */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <p className="text-gray-600">Manage your account preferences and security settings.</p>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Privacy</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span>Share vitals with assigned doctors</span>
          </label>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Notifications</h3>
          <label className="flex items-center gap-3 cursor-pointer mb-3">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span>Email notifications for health alerts</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span>In-app notifications</span>
          </label>
        </div>

        <div className="border-t pt-6">
          <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
