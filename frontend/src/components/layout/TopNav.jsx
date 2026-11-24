import { Menu, Globe, ExternalLink, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TopNav({ onMenuClick, title }) {
  const storedUser = localStorage.getItem('admin');
  let currentUser = null;
  try {
    currentUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {}

  const displayName = currentUser?.nama_lengkap || currentUser?.nama_pengguna || 'Administrator POLINELA';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 shadow-2xs">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-sm sm:text-base font-black text-[#003366] tracking-tight">{title}</h1>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sistem Online
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-[#00478f] border border-slate-200 hover:border-blue-200 text-xs font-bold transition-colors"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Lihat Web Publik</span>
            <ExternalLink className="h-3 w-3" />
          </Link>

          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00478f] text-white shadow-xs">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">{displayName}</p>
              <p className="text-[9px] font-black text-[#00478f] leading-tight uppercase tracking-wider mt-0.5">
                ADMINISTRATOR TUNGGAL (FULL AKSES)
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
