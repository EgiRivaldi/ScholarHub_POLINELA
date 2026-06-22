import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/useMobile';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMobile();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Tentang', path: '/about' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 lg:px-8',
        isScrolled ? 'py-3.5' : 'py-5'
      )}
    >
      <nav
        className={cn(
          'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 rounded-2xl transition-all duration-300 border',
          isScrolled
            ? 'glass-ios shadow-[0_12px_32px_-4px_rgba(0,0,0,0.04)] border-white/50'
            : 'bg-white/20 backdrop-blur-[6px] border-white/30 shadow-sm'
        )}
      >
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
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
              <span className="text-[14px] font-black text-slate-800 leading-tight tracking-tight group-hover:text-primary transition-colors duration-300">
                ScholarHub
              </span>
              <span className="text-[8px] font-black text-slate-400 leading-none tracking-wider uppercase">
                POLINELA
              </span>
            </div>
          </Link>

          {/* Center Search - Desktop */}
          {!isMobile && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors duration-200" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari beasiswa..."
                  className="w-full h-9 pl-9.5 pr-4 rounded-xl bg-white/5 border border-white/10 text-xs text-text placeholder:text-text-secondary focus:outline-none focus:bg-white/10 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all duration-200"
                />
              </div>
            </form>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-2.5">
            {/* Nav Links - Desktop */}
            {!isMobile && (
              <div className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const active = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        'px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 border border-transparent',
                        active
                          ? 'text-primary bg-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_4px_rgba(0,0,0,0.02)] border-white/40'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/30 hover:border-white/20'
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Login Button */}
            <Link
              to="/login"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#6D28D9] bg-white/70 border border-white/80 hover:bg-[#6D28D9] hover:text-white hover:border-[#6D28D9] shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-lg hover:shadow-[#6D28D9]/20 transition-all duration-300"
            >
              <LogIn className="h-3.5 w-3.5" />
              {!isMobile && <span>Masuk</span>}
            </Link>

            {/* Hamburger - Mobile */}
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-white/40 border border-transparent hover:border-white/20 transition-all"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-2.5 mx-auto max-w-7xl rounded-2xl glass-ios border border-white/40 shadow-[0_12px_32px_rgba(0,0,0,0.08)] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari beasiswa..."
                    className="w-full h-9 pl-9.5 pr-4 rounded-xl bg-white/5 border border-white/10 text-xs text-text placeholder:text-text-secondary focus:outline-none focus:bg-white/10 focus:ring-4 focus:ring-primary-50 focus:border-primary transition-all"
                  />
                </div>
              </form>

              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'block px-3.5 py-2 text-xs font-bold rounded-xl transition-all border border-transparent',
                    location.pathname === link.path
                      ? 'text-primary bg-white/60 border-white/40 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/30'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
