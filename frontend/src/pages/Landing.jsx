import { Link } from 'react-router-dom'
import { Shield, Lock, TrendingUp, Database, Users, Zap, CheckCircle, Link2 } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-xl text-teal-600">
            <Shield size={24} />
            <span>Healthcare Monitoring System</span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 rounded-lg border-2 border-teal-600 text-teal-600 hover:bg-teal-50 transition">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Secure Healthcare Data with Blockchain Integrity
          </h1>
          <p className="text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
            A next-generation healthcare monitoring system combining real-time vitals tracking with blockchain-verified data integrity
          </p>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">
            Leveraging SHA-256 cryptographic hashing and smart contracts to ensure patient data security, authenticity, and protection against illicit tampering
          </p>
          <Link to="/register" className="inline-block px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg transition transform hover:scale-105">
            Get Started Now
          </Link>
        </div>

        {/* Key Objectives Section */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">System Objectives & Capabilities</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Objective 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-teal-600">
              <div className="flex items-center mb-4">
                <Database size={32} className="text-teal-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Secure Data Management</h3>
              </div>
              <p className="text-gray-700">
                Comprehensive system for collecting, storing, and managing patient health records in a structured and secure manner. Sensitive medical information is handled with the highest security standards while enabling efficient data retrieval for healthcare professionals and patients.
              </p>
            </div>

            {/* Objective 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-emerald-600">
              <div className="flex items-center mb-4">
                <Lock size={32} className="text-emerald-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">SHA-256 Data Integrity</h3>
              </div>
              <p className="text-gray-700">
                Cryptographic hashing ensures complete data integrity. Every medical record generates a unique SHA-256 hash value, allowing detection of even the smallest modifications and preserving the authenticity and reliability of patient information over time.
              </p>
            </div>

            {/* Objective 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-blue-600">
              <div className="flex items-center mb-4">
                <Link2 size={32} className="text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Blockchain Verification</h3>
              </div>
              <p className="text-gray-700">
                Immutable blockchain records store cryptographic hashes through smart contracts, creating tamper-proof verification of data integrity. This ensures transparency, trust, and the ability to detect any unauthorized changes to patient records.
              </p>
            </div>

            {/* Objective 4 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-purple-600">
              <div className="flex items-center mb-4">
                <Users size={32} className="text-purple-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Role-Based Access Control</h3>
              </div>
              <p className="text-gray-700">
                Granular permission system with controlled access for administrators, doctors, and patients. Each role receives specific permissions ensuring that sensitive information is accessed only by authorized individuals, enhancing data privacy and system security.
              </p>
            </div>

            {/* Objective 5 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-indigo-600">
              <div className="flex items-center mb-4">
                <TrendingUp size={32} className="text-indigo-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Interactive Dashboard</h3>
              </div>
              <p className="text-gray-700">
                User-friendly web-based interface for real-time monitoring and visualization. Graphical representations, comprehensive tables, and live updates of patient health parameters enable doctors to monitor conditions effectively and patients to track their own health records.
              </p>
            </div>

            {/* Objective 6 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-cyan-600">
              <div className="flex items-center mb-4">
                <Zap size={32} className="text-cyan-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Scalable Architecture</h3>
              </div>
              <p className="text-gray-700">
                Hybrid architecture balancing security with practical complexity. Patient data is stored in a robust backend database while only hash values are anchored on the blockchain, reducing computational overhead while maintaining strong data integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Core Features Section */}
        <div className="mb-24 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg p-12 text-white">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Choose Our System?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureWithCheckmark title="End-to-End Encryption" description="All patient data is encrypted in transit and at rest" />
            <FeatureWithCheckmark title="Real-time Vital Monitoring" description="Track heart rate, oxygen levels, and temperature continuously" />
            <FeatureWithCheckmark title="Immutable Records" description="Blockchain verification ensures records cannot be altered" />
            <FeatureWithCheckmark title="Doctor-Patient Collaboration" description="Seamless communication and data sharing between healthcare providers and patients" />
            <FeatureWithCheckmark title="Audit Trail" description="Complete transparency with tamper-proof records of all data access and modifications" />
            <FeatureWithCheckmark title="Compliance Ready" description="Designed to meet HIPAA and healthcare data protection standards" />
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="mb-24">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Technical Excellence</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TechCard
              icon={Shield}
              title="Advanced Security"
              items={["JWT Authentication", "Role-Based Access Control", "SHA-256 Hashing"]}
            />
            <TechCard
              icon={Link2}
              title="Blockchain Integration"
              items={["Smart Contracts", "Tamper Detection", "Immutable Ledger"]}
            />
            <TechCard
              icon={Zap}
              title="Performance Optimized"
              items={["Hybrid Database", "Real-time Updates", "Scalable API"]}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white p-12 rounded-lg shadow-lg border-2 border-teal-200">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Healthcare Data Management?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join healthcare professionals and patients using our secure, blockchain-verified monitoring system
          </p>
          <div className="space-x-4">
            <Link to="/register" className="inline-block px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition">
              Create Account
            </Link>
            <Link to="/login" className="inline-block px-8 py-3 border-2 border-teal-600 text-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Healthcare Monitoring System. Securing patient data with blockchain technology.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureWithCheckmark({ title, description }) {
  return (
    <div className="flex items-start">
      <CheckCircle size={24} className="mr-4 mt-1 flex-shrink-0" />
      <div>
        <h4 className="font-semibold text-lg mb-1">{title}</h4>
        <p className="text-teal-100">{description}</p>
      </div>
    </div>
  )
}

function TechCard({ icon: Icon, title, items }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
      <Icon size={40} className="text-teal-600 mb-4" />
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center text-gray-700">
            <CheckCircle size={16} className="text-emerald-600 mr-2" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
