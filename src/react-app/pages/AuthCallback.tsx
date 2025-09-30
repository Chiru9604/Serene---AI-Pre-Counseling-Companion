import { useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const { exchangeCodeForSessionToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        await exchangeCodeForSessionToken();
        navigate('/chat');
      } catch (error) {
        console.error('Authentication failed:', error);
        navigate('/');
      }
    };

    handleAuth();
  }, [exchangeCodeForSessionToken, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin mb-4">
          <Loader2 className="w-8 h-8 text-blue-500 mx-auto" />
        </div>
        <p className="text-gray-600">Completing your sign in...</p>
      </div>
    </div>
  );
}
