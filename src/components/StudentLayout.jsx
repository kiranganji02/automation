import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './Header';

const StudentLayout = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Main content area */}
      <div className="min-h-screen">
        <Header />

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
