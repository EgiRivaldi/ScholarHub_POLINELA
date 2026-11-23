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
const AnnouncementsPage = lazy(() => import('@/pages/admin/AnnouncementsPage'));
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'));
const ActivityLogsPage = lazy(() => import('@/pages/admin/ActivityLogsPage'));

const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));

const PageLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-white">
    <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

export default function App() {
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
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="administrators" element={<AdminsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="logs" element={<ActivityLogsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
