import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  login: (username, password) => 
    api.post('/accounts/login/', { username, password }),
  register: (username, email, password, first_name) =>
    api.post('/accounts/register/', { 
      username, 
      email, 
      password, 
      first_name,
      role: 'PATIENT'
    }),
  getSelf: () => api.get('/accounts/self/'),
}

export const vitalsAPI = {
  getPatientVitals: () => api.get('/patient/vitals/'),
  getDoctorPatients: (patientId) => api.get(`/vitals/doctor/${patientId}/`),
  verifyRecord: (recordId) => api.get(`/verify/${recordId}/`),
  getPatientDoctor: () => api.get('/patient/doctor/'),
}

export const assignmentAPI = {
  assignDoctor: (doctorId, patientId) =>
    api.post('/assign/', { doctor_id: doctorId, patient_id: patientId }),
  getAvailableDoctors: () => api.get('/accounts/doctors/'),
}

export const patientAPI = {
  getAccessKey: () => api.get('/patient/access-key/'),
  regenerateAccessKey: () => api.post('/patient/regenerate-access-key/'),
  updateAccessKey: (newKey) => api.post('/patient/regenerate-access-key/', { access_key: newKey }),
}

export const doctorAPI = {
  getPatients: () => api.get('/doctor/patients/'),
  getPatientVitals: (patientId) => api.get(`/doctor/patient/${patientId}/vitals/`),
  getPatientVitalsWithKey: (patientId, accessKey) => 
    api.post(`/doctor/patient/${patientId}/vitals/`, { access_key: accessKey }),
}

export default api
