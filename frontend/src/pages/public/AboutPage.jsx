import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Globe,
  ClipboardCheck,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import AnimatedBackground from '@/components/public/AnimatedBackground';
import { getPublicSettings } from '@/services/api';

export default function AboutPage() {
  const [settings, setSettings] = useState({});
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Splash screen transition timer when entering "Tentang"
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 950);

    getPublicSettings()
      .then((data) => setSettings(data || {}))
      .catch((err) => console.error('Failed to load settings in about page:', err));

    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      num: '1',
      title: 'Pilih Kategori atau Cari Kata Kunci',
      desc: 'Gunakan filter kategori beasiswa di halaman beranda atau kotak pencarian untuk menemukan program beasiswa yang relevan dengan profil Anda.',
    },
    {
      num: '2',
      title: 'Pelajari Detail & Syarat Pendaftaran',
      desc: 'Buka halaman detail beasiswa untuk membaca deskripsi lengkap, batas tanggal penutupan, dan daftar persyaratan yang wajib dipenuhi.',
    },
    {
      num: '3',
      title: 'Siapkan Berkas & Buka Website Resmi',
      desc: 'Klik tombol "Kunjungi Situs Pendaftaran Resmi" untuk diarahkan langsung ke sistem pendaftaran resmi milik mitra atau kementerian penyelenggara beasiswa.',
    },
  ];

  return (
    <div className="relative py-10 sm:py-14 min-h-screen bg-slate-50 text-slate-900">
      <AnimatedBackground />

      {/* 1. SPLASH SCREEN TRANSITION OVERLAY WHEN ENTERING "TENTANG" */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="about-splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-white/96 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 select-none"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative flex flex-col items-center"
            >
              {/* Soft Blue Ambient Glow Behind Logo */}
              <div className="absolute -inset-10 bg-blue-100/70 rounded-full blur-2xl pointer-events-none" />

              <div className="relative h-24 w-24 sm:h-28 sm:w-28 mb-4 flex items-center justify-center">
                <img
                  src={settings.url_logo || '/images/polinela-logo.png'}
                  alt="Logo Politeknik Negeri Lampung"
                  className="h-full w-full object-contain drop-shadow-sm"
                />
              </div>

              <h2 className="relative text-base sm:text-lg font-black tracking-wider text-[#00478f] uppercase">
                POLITEKNIK NEGERI LAMPUNG
              </h2>
              <p className="relative text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mt-1">
                SISTEM INFORMASI BEASISWA
              </p>

              {/* Animated Progress Bar */}
              <div className="relative w-44 h-1 bg-slate-200 rounded-full overflow-hidden mt-4">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.85, ease: 'easeOut' }}
                  className="h-full bg-[#00478f] rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN ABOUT PAGE CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 16 : 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-7"
      >
        {/* Top Header */}
        <div className="text-center space-y-2 pb-2">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#00478f] text-xs font-extrabold uppercase tracking-wider border border-blue-200 shadow-2xs">
            <GraduationCap className="h-4 w-4 text-[#00478f]" />
            <span>TENTANG SISTEM</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#003366] tracking-tight uppercase pt-1">
            SISTEM INFORMASI BEASISWA
          </h1>
          <p className="text-sm sm:text-base text-slate-500 font-medium">
            Politeknik Negeri Lampung
          </p>
        </div>

        {/* Card 1: PROFIL SISTEM INFORMASI BEASISWA */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="border-b-2 border-[#00478f] mb-5">
            <span className="inline-flex items-center gap-2 bg-[#00478f] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider px-4 py-2">
              <BookOpen className="h-4 w-4" />
              <span>PROFIL SISTEM INFORMASI BEASISWA</span>
            </span>
          </div>

          <div className="space-y-4 text-sm sm:text-[15px] text-slate-600 leading-relaxed">
            <p>
              <strong className="font-bold text-slate-900">
                Sistem Informasi Beasiswa Politeknik Negeri Lampung
              </strong>{' '}
              {settings.tentang_website
                ? settings.tentang_website.replace(/ScholarHub POLINELA/gi, '').replace(/^adalah\s*/i, 'adalah ')
                : 'adalah portal informasi terpadu yang dirancang untuk memfasilitasi mahasiswa POLINELA dalam memperoleh informasi valid, akurat, dan mutakhir mengenai berbagai program beasiswa pendidikan tinggi.'}
            </p>
            <p>
              Portal ini menghimpun beasiswa dari berbagai kategori, meliputi beasiswa pemerintah (seperti KIP Kuliah Merdeka dan Bank Indonesia), beasiswa kemitraan swasta dan yayasan (seperti Djarum Beasiswa Plus), beasiswa internal Politeknik Negeri Lampung, hingga beasiswa BUMN dan internasional.
            </p>
          </div>
        </section>

        {/* Card 2: 2-Column Highlight Cards (Tujuan & Transparansi) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-[#00478f]/50 transition-colors">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#00478f] border border-blue-100 mb-4">
                <Globe className="h-5 w-5" />
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-800 mb-2">
                Pemerataan Akses Informasi
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Memastikan seluruh mahasiswa dari berbagai jurusan dan jenjang (D2, D3, Sarjana Terapan) memiliki akses informasi yang setara dan terbuka tanpa perlu login.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#00478f]">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Terbuka untuk Seluruh Mahasiswa POLINELA</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-[#00478f]/50 transition-colors">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#00478f] border border-blue-100 mb-4">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-800 mb-2">
                Kejelasan Matriks Persyaratan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Rincian persyaratan akademik, administrasi, dan umum dicantumkan secara gamblang agar mahasiswa dapat mempersiapkan berkas lebih awal sebelum tenggat waktu.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-[#00478f]">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Terverifikasi oleh Pengelola Beasiswa</span>
            </div>
          </div>
        </section>

        {/* Card 3: ALUR MEMANFAATKAN PORTAL */}
        <section className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="border-b-2 border-[#00478f] mb-6">
            <span className="inline-block bg-[#00478f] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider px-4 py-2">
              ALUR MEMANFAATKAN PORTAL
            </span>
          </div>

          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.num} className="flex items-start gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#00478f] text-white text-xs sm:text-sm font-extrabold shrink-0 mt-0.5 shadow-2xs">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-800">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
