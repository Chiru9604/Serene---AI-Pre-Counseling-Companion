import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shield, ArrowRight, UserCheck } from 'lucide-react';

export default function CounselorLogin() {
  const [accessCode, setAccessCode] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple access without actual authentication
    // In a real app, this would verify credentials
    if (accessCode.trim()) {
      localStorage.setItem('counselorAccess', 'granted');
      navigate('/counselor/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Counselor Access
            </h1>
            <p className="text-gray-600">
              Access the counselor dashboard to monitor user sessions and provide support.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Access Code
                </label>
                <input
                  type="text"
                  id="accessCode"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter access code"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Demo: Enter any text to access the dashboard
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <UserCheck className="w-5 h-5" />
                <span>Access Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/')}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              ← Back to Serene
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
