import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  FolderOpen,
  Building2,
  ClipboardList,
  Users,
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
  { label: 'Administrator', path: '/admin/administrators', icon: Users },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

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
    <div className="flex h-full flex-col glass-ios border-r border-white/50">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-white/40">
        <Link to="/admin" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200/50 shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0">
            <svg className="h-8.5 w-8.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6D28D9" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="limeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#84CC16" />
                  <stop offset="100%" stopColor="#A3E635" />
                </linearGradient>
              </defs>
              <path d="M50 15 L82 32 L50 49 L18 32 Z" fill="url(#purpleGrad)" />
              <path d="M32 38 V48 C32 58 68 58 68 48 V38" fill="url(#purpleGrad)" opacity="0.9" />
              <path d="M50 32 C50 32 74 34 74 46 C74 58 46 55 46 67 C46 78 74 78 74 78" stroke="url(#limeGrad)" strokeWidth="8" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-black text-slate-800 leading-tight group-hover:text-primary transition-colors duration-300">ScholarHub</span>
            <span className="text-[8px] font-black text-slate-400 leading-none tracking-wider uppercase">
              Panel Admin
            </span>
          </div>
        </Link>

        {/* Close button - Mobile */}
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-white/40 lg:hidden transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
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
                  ? 'text-primary bg-white/60 border-white/50 shadow-sm'
                  : 'text-slate-600 border-transparent hover:bg-white/30 hover:border-white/20 hover:text-slate-900'
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
      <div className="px-3 py-4 border-t border-white/40">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200 cursor-pointer"
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
