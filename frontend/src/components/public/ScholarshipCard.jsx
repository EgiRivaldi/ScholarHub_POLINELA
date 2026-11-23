import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, GraduationCap, Building2 } from 'lucide-react';
import { gsap } from 'gsap';
import { formatDate } from '@/lib/utils';
import MagneticButton from '@/components/ui/MagneticButton';

export default function ScholarshipCard({ scholarship, index = 0 }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const regStatus = scholarship.status_pendaftaran || (scholarship.status === 'active' ? 'dibuka' : 'ditutup');

  // GSAP 3D Interactive Card Movement on MouseMove
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const element = cardRef.current;
    if (!element) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const handleMouseMove = (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(element, {
          rotationY: (x / rect.width) * 8,
          rotationX: -(y / rect.height) * 8,
          y: -5,
          transformPerspective: 900,
          transformOrigin: 'center center',
          boxShadow: '0 16px 32px -8px rgba(109, 40, 217, 0.12), 0 6px 16px -4px rgba(15, 23, 42, 0.06)',
          borderColor: 'rgba(109, 40, 217, 0.45)',
          ease: 'power2.out',
          duration: 0.35,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          rotationY: 0,
          rotationX: 0,
          y: 0,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
          borderColor: 'rgba(226, 232, 240, 0.9)',
          ease: 'elastic.out(1, 0.4)',
          duration: 0.8,
        });
      };

      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, element);

    return () => ctx.revert();
  }, []);

  const getStatusBadge = () => {
    if (regStatus === 'dibuka') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Dibuka
        </span>
      );
    } else if (regStatus === 'belum_dibuka') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/90 shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Segera
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/90 shadow-2xs">
          Ditutup
        </span>
      );
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={() => navigate(`/scholarship/${scholarship.id}`)}
      className="group flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 shadow-xs cursor-pointer p-5 sm:p-6 transition-colors will-change-transform"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Top Header: Logo + Status & Category Badges */}
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* Compact Logo Container (Formatted for Logo, not banner) */}
        <div className="h-16 w-16 sm:h-18 sm:w-18 rounded-2xl bg-slate-50/80 border border-slate-200/90 p-2.5 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-primary/40 group-hover:bg-purple-50/30 transition-all">
          {scholarship.gambar || scholarship.url_gambar ? (
            <img
              src={scholarship.gambar || scholarship.url_gambar}
              alt={scholarship.nama_beasiswa || scholarship.judul}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full text-primary/60">
              <GraduationCap className="h-8 w-8 text-primary/70" />
            </div>
          )}
        </div>

        {/* Pill Badges on Top Right */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {getStatusBadge()}
          {scholarship.kategori_nama && (
            <span className="px-3 py-0.5 rounded-full bg-purple-50 text-[10px] font-bold text-primary uppercase tracking-wider border border-purple-100/90 shadow-2xs">
              {scholarship.kategori_nama}
            </span>
          )}
        </div>
      </div>

      {/* Provider Name */}
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
        <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
        <span className="truncate">{scholarship.penyedia_nama}</span>
      </div>

      {/* Scholarship Title */}
      <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
        {scholarship.nama_beasiswa || scholarship.judul}
      </h3>

      {/* Brief Summary */}
      {scholarship.ringkasan && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-5 leading-relaxed font-normal">
          {scholarship.ringkasan}
        </p>
      )}

      {/* Schedule & Magnetic Action Pill Button */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span className="text-[11px]">
            Tenggat: <strong className="text-slate-700">{formatDate(scholarship.tanggal_tutup)}</strong>
          </span>
        </div>

        {/* Magnetic Pill Button */}
        <MagneticButton
          as={Link}
          to={`/scholarship/${scholarship.id}`}
          onClick={(e) => e.stopPropagation()}
          strength={0.4}
          className="px-4 py-1.5 rounded-full text-xs font-bold text-primary bg-purple-50/90 hover:bg-primary hover:text-white border border-purple-200/90 shadow-2xs transition-colors group/btn flex items-center gap-1.5"
        >
          <span>Detail</span>
          <ArrowRight className="h-3 w-3 transform group-hover/btn:translate-x-1 transition-transform" />
        </MagneticButton>
      </div>
    </div>
  );
}
