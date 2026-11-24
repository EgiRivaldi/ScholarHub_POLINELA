import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Globe, ExternalLink, Lock } from 'lucide-react';
import { getPublicSettings } from '@/services/api';

export default function Footer() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    let isMounted = true;
    getPublicSettings()
      .then((data) => {
        if (isMounted) setSettings(data || {});
      })
      .catch((e) => console.error('Failed to load settings in footer:', e));
    return () => {
      isMounted = false;
    };
  }, []);

  const currentYear = new Date().getFullYear();
  const emailKontak = settings.email_kontak || 'humas@polinela.ac.id';

  return (
    <footer className="bg-[#002b5c] text-white border-t-4 border-[#00478f] relative z-20 select-none">
      {/* Main 3-Column Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 text-xs sm:text-sm">
        {/* Column 1 (5 cols): Identitas Kampus */}
        <div className="md:col-span-5 space-y-4">
          <Link to="/" className="inline-flex items-center gap-3.5 group">
            <div className="h-12 w-12 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <img
                src={settings.url_logo || '/images/polinela-logo.png'}
                alt="Logo Politeknik Negeri Lampung"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="text-sm sm:text-base font-black tracking-wide text-white uppercase leading-tight">
                POLITEKNIK NEGERI LAMPUNG
              </div>
              <div className="text-xs font-semibold text-blue-200 mt-0.5">
                Sistem Informasi Beasiswa Mahasiswa
              </div>
            </div>
          </Link>

          <p className="text-xs sm:text-[13px] text-blue-100/85 leading-relaxed max-w-md">
            Portal pusat informasi beasiswa bagi mahasiswa Politeknik Negeri Lampung untuk mengakses kesempatan studi, beasiswa prestasi, bantuan ekonomi, dan jejaring industri.
          </p>
        </div>

        {/* Column 2 (4 cols): Kontak & Alamat Kampus */}
        <div className="md:col-span-4 space-y-3">
          <div className="border-b border-white/15 pb-2 mb-3">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
              KONTAK & ALAMAT KAMPUS
            </h3>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-[13px] text-blue-100/90">
            <li className="flex items-start gap-2.5 leading-relaxed">
              <MapPin className="h-4 w-4 text-blue-300 shrink-0 mt-0.5" />
              <span>
                Jl. Soekarno Hatta No.10, Rajabasa Raya, Kec. Rajabasa, Kota Bandar Lampung, Lampung 35144
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-blue-300 shrink-0" />
              <a
                href={`mailto:${emailKontak}`}
                className="hover:text-white hover:underline transition-colors"
              >
                {emailKontak}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Globe className="h-4 w-4 text-blue-300 shrink-0" />
              <a
                href="https://polinela.ac.id"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:underline transition-colors"
              >
                polinela.ac.id
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 (3 cols): Tautan Penting */}
        <div className="md:col-span-3 space-y-3">
          <div className="border-b border-white/15 pb-2 mb-3">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
              TAUTAN PENTING
            </h3>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-[13px] text-blue-100/90 font-medium">
            <li>
              <a
                href="https://polinela.ac.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-blue-300 shrink-0" />
                <span>Website Resmi Polinela</span>
              </a>
            </li>
            <li>
              <a
                href="https://kip-kuliah.kemdikbud.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-blue-300 shrink-0" />
                <span>Portal KIP Kuliah Kemendikbud</span>
              </a>
            </li>
            <li>
              <a
                href="https://lpdp.kemenkeu.go.id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-blue-300 shrink-0" />
                <span>Portal Beasiswa LPDP</span>
              </a>
            </li>
            <li>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 hover:text-white transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-blue-300 shrink-0" />
                <span>Tentang Sistem Informasi Beasiswa</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-[#001f42] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-blue-200/80">
          <span>
            © {currentYear} Politeknik Negeri Lampung. Hak Cipta Dilindungi.
          </span>

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-blue-100/90 hover:text-white font-semibold transition-colors"
          >
            <Lock className="h-3.5 w-3.5 text-blue-300" />
            <span>Login Administrator</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
