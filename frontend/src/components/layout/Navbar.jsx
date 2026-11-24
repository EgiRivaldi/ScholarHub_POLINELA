import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMobile } from '@/hooks/useMobile';
import AnnouncementTicker from '@/components/public/AnnouncementTicker';
import { getPublicSettings } from '@/services/api';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [siteSettings, setSiteSettings] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMobile();

  useEffect(() => {
    getPublicSettings()
      .then((data) => setSiteSettings(data || {}))
      .catch((e) => console.error('Failed to load settings in navbar:', e));
  }, []);

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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <AnnouncementTicker />
      <div
        className={cn(
          'transition-all duration-300 px-4 sm:px-6 lg:px-8',
          isScrolled ? 'py-3' : 'py-4'
        )}
      >
        <nav
          className={cn(
            'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 rounded-xl transition-all duration-200 border bg-white border-slate-200',
            isScrolled ? 'shadow-md' : 'shadow-sm'
          )}
        >
          <div className="flex h-14 items-center justify-between gap-4">
            {/* Official POLINELA Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-slate-200 group-hover:border-[#00478f] transition-colors shrink-0 p-1">
                <img
                  src={siteSettings.url_logo || '/images/polinela-logo.png'}
                  alt="Logo Politeknik Negeri Lampung"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] sm:text-[15px] font-black text-[#00478f] leading-tight tracking-tight">
                  Sistem Informasi Beasiswa
                </span>
                <span className="text-[9px] font-extrabold text-slate-500 leading-none tracking-widest uppercase mt-0.5">
                  POLINELA
                </span>
              </div>
            </Link>

          {/* Center Search - Desktop */}
          {!isMobile && (
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-[#00478f] transition-colors duration-200" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari beasiswa..."
                  className="w-full h-9 pl-9.5 pr-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#00478f]/20 focus:border-[#00478f] transition-all duration-200"
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
                        'px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200',
                        active
                          ? 'text-[#00478f] bg-blue-50/80 border border-blue-200/80'
                          : 'text-slate-600 hover:text-[#00478f] hover:bg-slate-50'
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}

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
      </div>
    </header>
  );
}
