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

  const visibleMenuItems = menuItems;

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
    <div className="flex h-full flex-col bg-[#002b5c] text-white border-r border-blue-900/40 select-none">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-white/10">
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-white/20 shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0 p-1">
            <img
              src="/images/polinela-logo.png"
              alt="Logo POLINELA"
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-white leading-tight group-hover:text-amber-300 transition-colors duration-200">
              Sistem Informasi Beasiswa
            </span>
            <span className="text-[8.5px] font-extrabold text-amber-300 leading-none tracking-widest uppercase mt-1">
              POLINELA ADMIN
            </span>
          </div>
        </Link>

        {/* Close button - Mobile */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 lg:hidden transition-colors"
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
                  ? 'text-white bg-[#00478f] border-blue-400/35 shadow-sm font-extrabold'
                  : 'text-blue-100/80 border-transparent hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-amber-300' : 'text-blue-200/80')} />
              <span className="truncate">{item.label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-300 shadow-xs shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:text-white hover:bg-rose-500/25 border border-transparent hover:border-rose-400/30 transition-all duration-200 cursor-pointer"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          <span>Keluar Sistem</span>
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
