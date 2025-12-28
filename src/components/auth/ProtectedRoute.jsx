import { Navigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useStore();

  if (loading) return <div className="bg-black min-vh-100"></div>;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
