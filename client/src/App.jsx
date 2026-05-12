import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import AppLayout from './components/AppLayout';
import AuthLayout from './components/AuthLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Referrals from './pages/Referrals';
import Rewards from './pages/Rewards';
import Courses from './pages/Courses';
import MyCourses from './pages/MyCourses';
import VideoPlayer from './pages/VideoPlayer';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Checkout from './pages/Checkout';
import History from './pages/History';
import Notifications from './pages/Notifications';
import Community from './pages/Community';
import FAQ from './pages/FAQ';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  // 1. Session Sync & Auth Guard
  try {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const userParam = params.get('user');

    if (tokenParam && userParam) {
      localStorage.setItem('token', tokenParam);
      localStorage.setItem('user', decodeURIComponent(userParam));
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const currentToken = localStorage.getItem('token');
    const isPublicRoute = window.location.pathname.startsWith('/faq');
    if (!currentToken && !tokenParam && !isPublicRoute) {
      window.location.href = `http://${window.location.hostname}:3000`;
      return null;
    }
  } catch (err) {
    console.error("Auth Guard Error:", err);
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/faq" element={<FAQ />} />
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              <Route element={<AppLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="my-courses" element={<MyCourses />} />
                <Route path="referrals" element={<Referrals />} />
                <Route path="history" element={<History />} />
                <Route path="community" element={<Community />} />
                <Route path="rewards" element={<Rewards />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:id" element={<VideoPlayer />} />
                <Route path="profile" element={<Profile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="/checkout" element={<Checkout />} />
              </Route>
            </Routes>
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
