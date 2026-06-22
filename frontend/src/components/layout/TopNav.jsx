import { Menu, Bell, User } from 'lucide-react';

export default function TopNav({ onMenuClick, title }) {
  return (
    <header className="sticky top-0 z-30 h-16 glass-ios bg-white/35 border-b border-white/40 shadow-sm">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-slate-500 hover:bg-white/40 lg:hidden transition-colors border border-transparent hover:border-white/20"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-[14px] font-black text-slate-800 tracking-tight text-glow">{title}</h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            className="relative p-2 rounded-lg text-slate-500 hover:bg-white/40 transition-colors border border-transparent hover:border-white/20"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white/80" />
          </button>

          <div className="flex items-center gap-2.5 ml-2 pl-3 border-l border-white/40">
            <div className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary shadow-sm">
              <User className="h-4.5 w-4.5 text-primary" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">Admin</p>
              <p className="text-[9px] font-black text-slate-400 leading-tight uppercase tracking-wider">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
