import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import AnimatedBackground from '@/components/public/AnimatedBackground';
import { checkSession } from '@/services/api';

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/scholarships': 'Beasiswa',
  '/admin/categories': 'Kategori',
  '/admin/providers': 'Penyedia',
  '/admin/requirements': 'Persyaratan',
  '/admin/administrators': 'Administrator',
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    checkSession()
      .then((user) => {
        if (!user) {
          localStorage.removeItem('admin_logged_in');
          localStorage.removeItem('admin');
          localStorage.removeItem('token');
          navigate('/login');
        }
      })
      .catch(() => {
        localStorage.removeItem('admin_logged_in');
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate, location.pathname]);

  const title = pageTitles[location.pathname] || 'Admin';

  return (
    <div className="relative min-h-screen bg-slate-50/20 overflow-hidden">
      <AnimatedBackground variant="admin" />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-[260px]">
        <TopNav
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
        />

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
