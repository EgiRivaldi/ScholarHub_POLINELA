import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Tentang', path: '/about' },
    { label: 'Masuk Admin', path: '/login' },
  ];

  return (
    <footer className="bg-slate-900 border-t border-white/5 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-14">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-700/50 shadow-sm shrink-0">
                <svg className="h-7 w-7" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6200EE" />
                      <stop offset="100%" stopColor="#7C3AED" />
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
                <span className="text-base font-bold leading-tight text-white">
                  ScholarHub
                </span>
                <span className="text-[10px] font-medium text-gray-400 leading-none tracking-wider uppercase">
                  POLINELA
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Temukan Beasiswa Impianmu,<br />
              Wujudkan Masa Depanmu.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Tautan Cepat
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Kontak
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">
                  Jl. Soekarno Hatta No. 10, Rajabasa, Bandar Lampung
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-gray-500 shrink-0" />
                <span className="text-sm text-gray-400">(0721) 787309</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-gray-500 shrink-0" />
                <span className="text-sm text-gray-400">info@polinela.ac.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 py-6">
          <p className="text-center text-xs text-gray-500">
            © {currentYear} ScholarHub POLINELA. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
