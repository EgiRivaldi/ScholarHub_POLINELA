import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, GraduationCap, Building2, Layers, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';

export default function Hero({ searchQuery, setSearchQuery, stats = {}, settings = {} }) {
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const target = document.getElementById('scholarships');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTagClick = (tag) => {
    setSearchQuery?.(tag);
    const target = document.getElementById('scholarships');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickTags = [
    'KIP Kuliah',
    'Bank Indonesia',
    'Djarum Plus',
    'Prestasi Akademik',
    'Pemerintah',
  ];

  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 text-white min-h-[580px] sm:min-h-[640px] flex items-center justify-center">
      {/* 1. Authentic POLINELA Campus Photo Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/polinela-campus.jpg"
          alt="Gedung Kampus Politeknik Negeri Lampung"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-pulse"
          style={{ animationDuration: '16s' }}
        />
        {/* Multilayered Cinematic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-900/90 to-slate-950/98 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(109,40,217,0.4)_0%,transparent_65%)]" />
        <div className="footer-bg-grid absolute inset-0 opacity-25 pointer-events-none" />
      </div>

      {/* 2. Main Hero Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center w-full"
        >
          {/* Official POLINELA Badge */}
          <div className="inline-flex items-center gap-2.5 sm:gap-3 px-4 sm:px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold mb-6 backdrop-blur-md shadow-lg transition-all">
            <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-white p-0.5 flex items-center justify-center shrink-0 shadow-xs">
              <img
                src="/images/polinela-logo.png"
                alt="Logo POLINELA"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="tracking-wide text-slate-100 font-extrabold uppercase text-[11px] sm:text-xs">
              Politeknik Negeri Lampung • Portal Beasiswa Resmi
            </span>
          </div>

          {/* Majestic Campus Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.18] tracking-tight max-w-4xl mb-5 text-balance">
            {settings.judul_beranda ? (
              <span>{settings.judul_beranda}</span>
            ) : (
              <span>
                Gerbang Informasi Beasiswa Resmi{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-purple-200 to-emerald-300">
                  Politeknik Negeri Lampung
                </span>
              </span>
            )}
          </h1>

          {/* Subtitle with High-contrast readable prose */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-200/95 leading-relaxed max-w-2xl mb-8 font-normal text-balance">
            {settings.deskripsi_beranda ||
              'Akses terpadu seluruh program beasiswa prestasi, bantuan UKT, dan kemitraan industri. Seluruh syarat dan jadwal resmi disajikan secara terbuka tanpa perlu login.'}
          </p>

          {/* Interactive Floating Search Form */}
          <div className="w-full max-w-2xl mb-5">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center rounded-full bg-white/10 backdrop-blur-xl border border-white/25 p-1.5 sm:p-2 shadow-2xl focus-within:border-purple-300 focus-within:bg-white/15 transition-all"
            >
              <div className="pl-3 sm:pl-4 flex items-center pointer-events-none text-slate-300">
                <Search className="h-5 w-5 text-purple-300" />
              </div>
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                placeholder="Cari beasiswa berdasarkan nama, mitra, atau syarat..."
                className="w-full h-11 sm:h-12 px-3 sm:px-4 bg-transparent text-white placeholder:text-slate-300/80 text-xs sm:text-sm font-medium focus:outline-none"
              />
              <MagneticButton
                as="button"
                type="submit"
                strength={0.3}
                className="h-10 sm:h-11 px-5 sm:px-7 rounded-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary-light hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 shrink-0"
              >
                <span>Cari</span>
                <ArrowRight className="h-3.5 w-3.5 hidden sm:inline" />
              </MagneticButton>
            </form>
          </div>

          {/* Quick Filter Topic Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-xl">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Topik Populer:
            </span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition-all cursor-pointer backdrop-blur-sm"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Fast Metric Stats (Glass Cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-3xl pt-2">
            <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {stats.scholarshipsCount || 0}+
              </span>
              <span className="text-[11px] font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                Program Beasiswa
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {stats.providersCount || 0}+
              </span>
              <span className="text-[11px] font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                Mitra Resmi
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {stats.categoriesCount || 0}
              </span>
              <span className="text-[11px] font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                Kategori Program
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-6 w-6" />
                100%
              </span>
              <span className="text-[11px] font-semibold text-slate-300 mt-1 uppercase tracking-wider">
                Akses Terbuka
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade into page content */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none z-10" />
    </section>
  );
}
