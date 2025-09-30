import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Shield, Users, AlertTriangle, TrendingUp, TrendingDown, Minus, ArrowLeft, Calendar, MessageCircle, User } from 'lucide-react';
import type { UserSession, ChatMessage } from '@/shared/types';

interface DashboardData {
  sessions: UserSession[];
  messages: ChatMessage[];
  userProfiles: { [key: string]: { name: string; email: string; picture: string } };
}

export default function CounselorDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData>({ sessions: [], messages: [], userProfiles: {} });
  const [selectedSession, setSelectedSession] = useState<UserSession | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

  useEffect(() => {
    // Check access
    if (!localStorage.getItem('counselorAccess')) {
      navigate('/counselor/login');
      return;
    }

    // Load data from localStorage (simulating database)
    const sessions = JSON.parse(localStorage.getItem('userSessions') || '[]');
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const profiles = JSON.parse(localStorage.getItem('userProfiles') || '{}');

    setData({ sessions, messages, userProfiles: profiles });
    setLoading(false);
  }, [navigate]);

  const handleSessionSelect = (session: UserSession) => {
    setSelectedSession(session);
    const sessionMessages = data.messages.filter((msg: any) => msg.session_id === session.session_id);
    setSelectedMessages(sessionMessages);
  };

  const getRiskIcon = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'High': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'Medium': return <TrendingUp className="w-5 h-5 text-yellow-500" />;
      case 'Low': return <Minus className="w-5 h-5 text-green-500" />;
    }
  };

  const getRiskColor = (level: 'Low' | 'Medium' | 'High') => {
    switch (level) {
      case 'High': return 'bg-red-50 border-red-200 text-red-800';
      case 'Medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'Low': return 'bg-green-50 border-green-200 text-green-800';
    }
  };

  const filteredSessions = filter === 'All' 
    ? data.sessions 
    : data.sessions.filter(session => session.overall_risk_level === filter);

  const riskCounts = {
    High: data.sessions.filter(s => s.overall_risk_level === 'High').length,
    Medium: data.sessions.filter(s => s.overall_risk_level === 'Medium').length,
    Low: data.sessions.filter(s => s.overall_risk_level === 'Low').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-pulse text-purple-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Counselor Dashboard
              </h1>
              <p className="text-sm text-gray-500">Monitor and support user sessions</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('counselorAccess');
              navigate('/');
            }}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Exit Dashboard</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{data.sessions.length}</p>
                <p className="text-sm text-gray-600">Active Sessions</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-red-600">{riskCounts.High}</p>
                <p className="text-sm text-gray-600">High Risk</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">{riskCounts.Medium}</p>
                <p className="text-sm text-gray-600">Medium Risk</p>
              </div>
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <TrendingDown className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-green-600">{riskCounts.Low}</p>
                <p className="text-sm text-gray-600">Low Risk</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sessions List */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">User Sessions</h2>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="All">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No sessions found</p>
                </div>
              ) : (
                filteredSessions.map((session) => {
                  const profile = data.userProfiles[session.user_id];
                  return (
                    <div
                      key={session.id}
                      onClick={() => handleSessionSelect(session)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedSession?.id === session.id 
                          ? 'border-purple-300 bg-purple-50' 
                          : 'border-gray-200 bg-white hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {profile ? (
                            <img src={profile.picture} alt="User" className="w-8 h-8 rounded-full" />
                          ) : (
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">
                              {profile?.name || 'Anonymous User'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(session.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getRiskColor(session.overall_risk_level)}`}>
                          {getRiskIcon(session.overall_risk_level)}
                          <span className="text-xs font-medium">{session.overall_risk_level}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Latest concern:</strong> {session.latest_concern || 'No specific concern noted'}
                      </p>
                      <p className="text-sm text-gray-500">
                        <strong>Summary:</strong> {session.last_three_messages_summary || 'No messages yet'}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Session Details */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Session Details</h2>
            
            {selectedSession ? (
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    {data.userProfiles[selectedSession.user_id] ? (
                      <img 
                        src={data.userProfiles[selectedSession.user_id].picture} 
                        alt="User" 
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {data.userProfiles[selectedSession.user_id]?.name || 'Anonymous User'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {data.userProfiles[selectedSession.user_id]?.email || 'Email not available'}
                      </p>
                    </div>
                  </div>
                  
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getRiskColor(selectedSession.overall_risk_level)}`}>
                    {getRiskIcon(selectedSession.overall_risk_level)}
                    <span className="text-sm font-medium">Risk Level: {selectedSession.overall_risk_level}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Conversation History</span>
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedMessages.length === 0 ? (
                      <p className="text-gray-500 text-sm">No messages in this session</p>
                    ) : (
                      selectedMessages.map((message) => (
                        <div key={message.id} className="space-y-2">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>User:</strong> {message.user_message}
                            </p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm text-green-800">
                              <strong>AI:</strong> {message.ai_response}
                            </p>
                            {message.coping_tip_title && (
                              <div className="mt-2 p-2 bg-green-100 rounded border-l-4 border-green-400">
                                <p className="text-xs font-medium text-green-800">{message.coping_tip_title}</p>
                                <p className="text-xs text-green-700">{message.coping_tip_content}</p>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(message.created_at).toLocaleString()}</span>
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Suggested Next Steps</h4>
                  <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    {selectedSession.suggested_next_step || 'No specific recommendations at this time'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a session to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
