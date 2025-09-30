import { useEffect, useState } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { MessageCircle, Heart, Brain, Shield } from 'lucide-react';

export default function Home() {
  const { user, redirectToLogin, isPending } = useAuth();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    setIsLoaded(true);
  }, []);

  const handleStartChat = () => {
    if (user) {
      navigate('/chat');
    } else {
      redirectToLogin();
    }
  };

  if (isPending || !isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 flex items-center justify-center">
        <div className="animate-pulse text-blue-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-semibold text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>Serene</span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/counselor/login')}
            className="bg-white/80 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-xl font-medium text-sm border border-white/20 hover:bg-white hover:shadow-md transition-all duration-200 flex items-center space-x-2"
          >
            <Shield className="w-4 h-4" />
            <span>Counselors</span>
          </button>
          {user && (
            <div className="flex items-center space-x-3">
              <img 
                src={user.google_user_data.picture || ''} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              />
              <span className="text-sm text-gray-600">Hi, {user.google_user_data.given_name}</span>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Your AI Companion for{' '}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Emotional Wellness
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            A safe space to share your thoughts and feelings. Get immediate support, 
            coping strategies, and gentle guidance whenever you need it.
          </p>

          {/* CTA Button */}
          <button 
            onClick={handleStartChat}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-3 mx-auto group"
          >
            <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
            <span>Start Chat</span>
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Intelligent Support
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our AI understands emotional context and provides personalized responses tailored to your needs.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Coping Strategies
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Receive practical coping techniques, breathing exercises, and mindfulness practices in real-time.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Safe & Private
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Your conversations are secure and confidential. Share openly in a judgment-free environment.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/20 backdrop-blur-sm bg-white/30 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600">
            Serene is designed to provide emotional support. For crisis situations, please contact a mental health professional.
          </p>
        </div>
      </footer>
    </div>
  );
}
