import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  FolderOpen,
  Building2,
  ClipboardList,
  Users,
  Megaphone,
  Settings,
  History,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutAdmin } from '@/services/api';
import { toast } from 'sonner';

const menuItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Beasiswa', path: '/admin/scholarships', icon: GraduationCap },
  { label: 'Kategori', path: '/admin/categories', icon: FolderOpen },
  { label: 'Penyedia', path: '/admin/providers', icon: Building2 },
  { label: 'Persyaratan', path: '/admin/requirements', icon: ClipboardList },
  { label: 'Pengumuman', path: '/admin/announcements', icon: Megaphone },
  { label: 'Administrator', path: '/admin/administrators', icon: Users, superAdminOnly: true },
  { label: 'Pengaturan Situs', path: '/admin/settings', icon: Settings, superAdminOnly: true },
  { label: 'Log Aktivitas', path: '/admin/logs', icon: History, superAdminOnly: true },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('admin');
  let currentUser = null;
  try {
    currentUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {}

  const isSuperAdmin = currentUser?.peran === 'admin_utama' || currentUser?.role === 'admin_utama';

  const visibleMenuItems = menuItems.filter((item) => {
    if (item.superAdminOnly && !isSuperAdmin) {
      return false;
    }
    return true;
  });

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } catch (e) {
      console.error('Logout API failed:', e);
    }
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin');
    toast.success('Berhasil keluar');
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white border-r border-slate-200/80">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100">
        <Link to="/admin" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200/80 shadow-2xs group-hover:scale-105 transition-transform duration-300 shrink-0 p-1">
            <img
              src="/images/polinela-logo.png"
              alt="Logo POLINELA"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-black text-slate-900 leading-tight group-hover:text-primary transition-colors duration-300">ScholarHub</span>
            <span className="text-[8px] font-bold text-slate-400 leading-none tracking-widest uppercase">
              POLINELA ADMIN
            </span>
          </div>
        </Link>

        {/* Close button - Mobile */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 relative border',
                active
                  ? 'text-primary bg-purple-50 border-purple-200/80 shadow-xs'
                  : 'text-slate-600 border-transparent hover:bg-slate-50 hover:border-slate-200/60 hover:text-slate-900'
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#6D28D9]" />
              )}
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-[260px]">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
