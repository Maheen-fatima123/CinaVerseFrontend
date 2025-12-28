import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ParentDashboard from './pages/ParentDashboard';
import UserDashboard from './pages/UserDashboard';
import Watchlist from './pages/Watchlist';
import DiscoverMovies from './pages/DiscoverMovies';
import MovieDetails from './pages/MovieDetails';
import WatchTrailer from './pages/WatchTrailer';
import StoreProvider, { useStore, getDashboardPath } from './context/StoreContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useEffect } from 'react';
import Plans from './pages/Plans';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import AiChatWidget from './components/AiChatWidget';

function App() {
  return (
    <StoreProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<ProtectedRoute><AutoDashboard /></ProtectedRoute>} />
          <Route path="/parent-dashboard" element={<ProtectedRoute requireParent><ParentDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
          <Route path="/discover" element={<DiscoverMovies />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/watch/:id" element={<WatchTrailer />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        </Routes>
        <AiChatWidget />
      </Router>
    </StoreProvider>
  );
}

// AutoDashboard: Redirects to the correct dashboard based on user role
function AutoDashboard() {
  const { user } = useStore();
  const navigate = useNavigate();
  useEffect(() => {
    navigate(getDashboardPath(user), { replace: true });
  }, [user, navigate]);
  return null;
}

export default App;
