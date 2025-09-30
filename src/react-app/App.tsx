import { BrowserRouter as Router, Routes, Route } from "react-router";
import { AuthProvider } from "@getmocha/users-service/react";
import HomePage from "@/react-app/pages/Home";
import ChatPage from "@/react-app/pages/Chat";
import AuthCallbackPage from "@/react-app/pages/AuthCallback";
import CounselorLogin from "@/react-app/pages/CounselorLogin";
import CounselorDashboard from "@/react-app/pages/CounselorDashboard";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/counselor/login" element={<CounselorLogin />} />
          <Route path="/counselor/dashboard" element={<CounselorDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
