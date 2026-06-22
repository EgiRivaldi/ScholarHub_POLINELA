import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layouts
import PublicLayout from '@/components/layout/PublicLayout';
import AdminLayout from '@/components/layout/AdminLayout';

// Lazy Loaded Pages
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const ScholarshipDetailPage = lazy(() => import('@/pages/public/ScholarshipDetailPage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const LoginPage = lazy(() => import('@/pages/public/LoginPage'));

const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const ScholarshipsPage = lazy(() => import('@/pages/admin/ScholarshipsPage'));
const CategoriesPage = lazy(() => import('@/pages/admin/CategoriesPage'));
const ProvidersPage = lazy(() => import('@/pages/admin/ProvidersPage'));
const RequirementsPage = lazy(() => import('@/pages/admin/RequirementsPage'));
const AdminsPage = lazy(() => import('@/pages/admin/AdminsPage'));

const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));

const PageLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-white">
    <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function App() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const card = e.target.closest('.glass-ios-shine, .glass-card, .scholarship-card, .category-card, .sidebar-item');
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
            borderRadius: '12px',
          },
        }}
        richColors
        closeButton
      />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/scholarship/:id" element={<ScholarshipDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="scholarships" element={<ScholarshipsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="providers" element={<ProvidersPage />} />
            <Route path="requirements" element={<RequirementsPage />} />
            <Route path="administrators" element={<AdminsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
