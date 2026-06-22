import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Search, GraduationCap } from 'lucide-react';

export default function Hero({ searchQuery, setSearchQuery, stats }) {
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const target = document.getElementById('scholarships');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCariBeasiswaClick = (e) => {
    e.preventDefault();
    const target = document.getElementById('scholarships');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#scholarships');
    }
  };

  const caps = [
    { id: 1, size: 54, top: '10%', left: '6%', delay: 0, duration: 14, rotate: 12, blur: 'blur-[0.5px]', opacity: 0.12 },
    { id: 2, size: 76, top: '22%', right: '8%', delay: 2.5, duration: 18, rotate: -22, blur: 'none', opacity: 0.16 },
    { id: 3, size: 40, bottom: '25%', left: '12%', delay: 1.2, duration: 11, rotate: -15, blur: 'none', opacity: 0.14 },
    { id: 4, size: 60, bottom: '12%', right: '10%', delay: 3.2, duration: 19, rotate: 28, blur: 'blur-[1.5px]', opacity: 0.1 },
    { id: 5, size: 44, top: '60%', left: '4%', delay: 4.1, duration: 15, rotate: 35, blur: 'none', opacity: 0.13 },
    { id: 6, size: 68, top: '65%', right: '5%', delay: 5.3, duration: 22, rotate: -12, blur: 'blur-[1px]', opacity: 0.11 },
    { id: 7, size: 36, top: '6%', right: '28%', delay: 1.8, duration: 12, rotate: 8, blur: 'blur-[2px]', opacity: 0.08 },
    { id: 8, size: 48, bottom: '6%', left: '26%', delay: 2.8, duration: 13, rotate: -28, blur: 'none', opacity: 0.12 },
  ];

  return (
    <section className="relative overflow-hidden bg-transparent border-b border-white/10 min-h-[90vh] flex items-center justify-center py-16 sm:py-24">
      {/* Floating Graduation Caps */}
      {caps.map((cap) => (
        <motion.div
          key={cap.id}
          className={`absolute pointer-events-none select-none ${cap.blur} text-[#6D28D9] hidden sm:block`}
          style={{
            top: cap.top,
            bottom: cap.bottom,
            left: cap.left,
            right: cap.right,
            opacity: cap.opacity,
          }}
          animate={{
            y: [0, -30, 30, 0],
            x: [0, 20, -20, 0],
            rotate: [cap.rotate, cap.rotate + 20, cap.rotate - 20, cap.rotate],
          }}
          transition={{
            duration: cap.duration,
            delay: cap.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <GraduationCap style={{ width: cap.size, height: cap.size }} />
        </motion.div>
      ))}

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full z-10">
        {/* Glass Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full mx-auto px-6 sm:px-12 py-12 sm:py-16 rounded-[2.5rem] border border-white/55 bg-white/30 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.03)] glass-ios-shine flex flex-col items-center text-center"
        >
          {/* Small Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-white/80 text-slate-700 text-xs font-bold mb-8 shadow-[0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-[2px]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#6D28D9] animate-pulse" />
            Politeknik Negeri Lampung
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.2] tracking-tight max-w-3xl mb-6 text-glow"
          >
            <div className="sm:whitespace-nowrap">
              Temukan Beasiswa{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6D28D9] to-[#84CC16] font-black">
                Impianmu
              </span>
            </div>
            <div className="mt-1 sm:whitespace-nowrap">
              Wujudkan Masa{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6D28D9] to-[#84CC16] font-black">
                Depanmu!
              </span>
            </div>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-base sm:text-lg text-slate-700 font-semibold leading-relaxed max-w-2xl mb-8"
          >
            Temukan dan bandingkan berbagai peluang beasiswa untuk mahasiswa Politeknik Negeri Lampung melalui satu portal informasi yang cepat, lengkap, dan terpercaya.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full max-w-xl mb-8 relative group"
          >
            <form onSubmit={handleSearchSubmit}>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6D28D9]/15 via-[#84CC16]/10 to-[#6D28D9]/15 rounded-[22px] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center">
                <Search className="absolute left-4.5 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#6D28D9] transition-colors" />
                <input
                  type="text"
                  value={searchQuery || ''}
                  onChange={(e) => setSearchQuery?.(e.target.value)}
                  placeholder="Cari beasiswa..."
                  className="w-full h-13 pl-12 pr-5 rounded-[20px] bg-white/40 border border-slate-200/60 text-slate-800 placeholder:text-slate-500 shadow-[0_4px_24px_rgba(0,0,0,0.01)] backdrop-blur-[8px] focus:shadow-[0_12px_32px_rgba(109,40,217,0.08)] focus:outline-none focus:bg-white/80 focus:border-[#6D28D9]/50 text-sm font-medium transition-all duration-300"
                />
              </div>
            </form>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mb-12"
          >
            <a
              href="#scholarships"
              onClick={handleCariBeasiswaClick}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#84CC16] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-[#6D28D9]/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              Cari Beasiswa
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-slate-200/80 bg-white/40 text-slate-700 font-bold text-sm hover:bg-white/60 hover:border-slate-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-[4px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Pelajari Lebih Lanjut
            </Link>
          </motion.div>

          {/* Small Statistics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-3 gap-6 max-w-sm w-full border-t border-slate-200/50 pt-8"
          >
            {[
              { value: `${stats?.scholarshipsCount ?? 30}+`, label: 'Beasiswa' },
              { value: `${stats?.providersCount ?? 15}+`, label: 'Penyedia' },
              { value: `${stats?.categoriesCount ?? 4}`, label: 'Kategori' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-3 rounded-2xl bg-white/50 border border-slate-200/40 backdrop-blur-[6px] shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-md hover:bg-white/80 hover:scale-[1.03] transition-all duration-300 group cursor-default"
              >
                <p className="text-xl sm:text-2xl font-black text-[#6D28D9] transition-colors duration-200">
                  {stat.value}
                </p>
                <p className="text-[8px] font-black text-slate-500 mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
