// Liquid glass scholarship card component
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, GraduationCap } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function ScholarshipCard({ scholarship, index = 0 }) {
  const navigate = useNavigate();
  const isActive = scholarship.status === 'active';

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized position from -0.5 to 0.5
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (x - xc) / xc; // -1 to 1
    const dy = (y - yc) / yc; // -1 to 1

    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    e.currentTarget.style.setProperty('--tilt-x', `${dy * -6}deg`); // Max tilt 6deg
    e.currentTarget.style.setProperty('--tilt-y', `${dx * 6}deg`);
    e.currentTarget.style.setProperty('--shift-x', `${dx * 10}px`);
    e.currentTarget.style.setProperty('--shift-y', `${dy * 10}px`);
    e.currentTarget.style.setProperty('--y-offset', '-8px');
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.setProperty('--tilt-x', '0deg');
    e.currentTarget.style.setProperty('--tilt-y', '0deg');
    e.currentTarget.style.setProperty('--shift-x', '0px');
    e.currentTarget.style.setProperty('--shift-y', '0px');
    e.currentTarget.style.setProperty('--y-offset', '0px');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      className="group relative cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/scholarship/${scholarship.id}`)}
    >
      {/* Outer dynamic blurry edge glow */}
      <div
        className="glass-ios-edge-glow opacity-0 group-hover:opacity-100"
        style={{
          transform: 'translate3d(var(--shift-x, 0px), var(--shift-y, 0px), 0)',
        }}
      />

      {/* Main glass content card with tilt */}
      <div 
        className="flex flex-col h-full glass-ios glass-ios-shine rounded-[24px] border-white/60 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.03)]"
        style={{
          transform: 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(var(--y-offset, 0px))',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s, box-shadow 0.3s',
        }}
      >
        {/* Image */}
        <div className="relative h-44 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 overflow-hidden">
          {scholarship.gambar ? (
            <img
              src={scholarship.gambar}
              alt={scholarship.nama_beasiswa}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-2 text-indigo-500/30">
                <GraduationCap className="h-10 w-10" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">ScholarHub</span>
              </div>
            </div>
          )}

          {/* Category Badge */}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/60 backdrop-blur-md text-[9px] font-black text-indigo-600 uppercase tracking-wider shadow-sm border border-white/50">
            {scholarship.kategori_nama}
          </span>

          {/* Status Badge */}
          <span
            className={cn(
              "absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm border backdrop-blur-md",
              isActive
                ? "bg-emerald-500/15 text-emerald-700 border-emerald-500/25"
                : "bg-slate-500/15 text-slate-600 border-slate-500/25"
            )}
          >
            {isActive ? 'Buka' : 'Tutup'}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5">
          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            {scholarship.penyedia_nama}
          </p>
          <h3 className="text-base font-bold text-slate-800 leading-snug line-clamp-2 mb-3 group-hover:text-primary transition-colors duration-200">
            {scholarship.nama_beasiswa}
          </h3>

          {/* Dates */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 mt-auto mb-4 border-t border-white/40 pt-4">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span>
              Tenggat Waktu: <span className="font-semibold text-slate-700">{formatDate(scholarship.tanggal_tutup)}</span>
            </span>
          </div>

          {/* Action */}
          <Link
            to={`/scholarship/${scholarship.id}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="relative z-10 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-[#6200EE] bg-white/55 hover:bg-[#6200EE] hover:text-white hover:border-[#6200EE] hover:shadow-lg hover:shadow-[#6200EE]/20 transition-all duration-300 cursor-pointer"
          >
            Lihat Detail
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
