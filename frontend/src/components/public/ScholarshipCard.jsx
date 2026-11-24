import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ScholarshipCard({ scholarship }) {
  const navigate = useNavigate();

  const regStatus = scholarship.status_pendaftaran || (scholarship.status === 'active' ? 'dibuka' : 'ditutup');

  // Calculate deadline countdown & progress percentage for bottom progress bar
  const getDeadlineProgress = () => {
    if (!scholarship.tanggal_tutup) {
      return { label: null, percent: 0, barColor: 'bg-slate-300', textColor: 'text-slate-500' };
    }

    if (regStatus === 'ditutup') {
      return {
        label: 'Pendaftaran Berakhir',
        percent: 100,
        barColor: 'bg-slate-300',
        textColor: 'text-slate-400',
      };
    }

    const now = new Date();
    const closeDate = new Date(scholarship.tanggal_tutup);
    if (isNaN(closeDate.getTime())) {
      return { label: null, percent: 0, barColor: 'bg-slate-300', textColor: 'text-slate-500' };
    }

    const diffMs = closeDate - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // Calculate elapsed percentage between tanggal_buka and tanggal_tutup
    let percent = 45;
    if (scholarship.tanggal_buka) {
      const openDate = new Date(scholarship.tanggal_buka);
      if (!isNaN(openDate.getTime()) && closeDate > openDate) {
        const totalSpan = closeDate - openDate;
        const elapsed = now - openDate;
        percent = Math.min(96, Math.max(12, Math.round((elapsed / totalSpan) * 100)));
      }
    }

    if (diffDays <= 0) {
      return {
        label: 'Hari Terakhir!',
        percent: 95,
        barColor: 'bg-rose-500',
        textColor: 'text-rose-600',
      };
    }

    if (diffDays <= 14) {
      return {
        label: `⏳ Sisa ${diffDays} Hari`,
        percent: Math.max(70, percent),
        barColor: 'bg-amber-500',
        textColor: 'text-amber-600',
      };
    }

    if (diffDays <= 45) {
      return {
        label: `Sisa ${diffDays} Hari`,
        percent,
        barColor: 'bg-[#00478f]',
        textColor: 'text-[#00478f]',
      };
    }

    const months = Math.floor(diffDays / 30);
    return {
      label: `Sisa ${months} Bulan`,
      percent: Math.min(35, percent),
      barColor: 'bg-[#00478f]',
      textColor: 'text-[#00478f]',
    };
  };

  const deadlineInfo = getDeadlineProgress();

  const renderCleanStatusText = () => {
    if (regStatus === 'dibuka') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Pendaftaran Dibuka</span>
        </span>
      );
    }
    if (regStatus === 'belum_dibuka') {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-700">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Segera Dibuka</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400">
        <span className="h-2 w-2 rounded-full bg-slate-300" />
        <span>Pendaftaran Ditutup</span>
      </span>
    );
  };

  return (
    <div
      onClick={() => navigate(`/scholarship/${scholarship.id}`)}
      className="scholarship-card-interactive group overflow-hidden flex flex-col justify-between h-full bg-white rounded-xl border border-slate-200 shadow-xs cursor-pointer p-5 select-none"
    >
      <div>
        {/* Top Header: Logo Left + Clean Status Text Right (No Stacked Bubbles) */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="card-logo-box h-14 w-14 rounded-xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
            {scholarship.gambar || scholarship.url_gambar ? (
              <img
                src={scholarship.gambar || scholarship.url_gambar}
                alt={scholarship.nama_beasiswa || scholarship.judul}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full text-[#00478f]">
                <GraduationCap className="h-7 w-7 text-[#00478f]" />
              </div>
            )}
          </div>

          <div className="pt-1 shrink-0">
            {renderCleanStatusText()}
          </div>
        </div>

        {/* Provider & Category Inline Breadcrumb Text */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          <span className="truncate max-w-[180px]">{scholarship.penyedia_nama || 'Mitra Resmi'}</span>
          {scholarship.kategori_nama && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-[#00478f] font-extrabold">{scholarship.kategori_nama}</span>
            </>
          )}
        </div>

        {/* Scholarship Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug line-clamp-2 mb-2 group-hover:text-[#00478f] transition-colors">
          {scholarship.nama_beasiswa || scholarship.judul}
        </h3>

        {/* Brief Summary */}
        {scholarship.ringkasan && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-5 leading-relaxed font-normal">
            {scholarship.ringkasan}
          </p>
        )}
      </div>

      {/* Bottom Deadline Progress Bar & Action Button */}
      <div className="mt-auto pt-3.5 border-t border-slate-100 space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-slate-500">
              Tenggat: <strong className="text-slate-700">{formatDate(scholarship.tanggal_tutup)}</strong>
            </span>
            {deadlineInfo.label && (
              <span className={`font-extrabold ${deadlineInfo.textColor}`}>
                {deadlineInfo.label}
              </span>
            )}
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 group-hover:brightness-110 ${deadlineInfo.barColor}`}
              style={{ width: `${deadlineInfo.percent}%` }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            to={`/scholarship/${scholarship.id}`}
            onClick={(e) => e.stopPropagation()}
            className="card-detail-btn px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#00478f] inline-flex items-center gap-1.5"
          >
            <span>Detail</span>
            <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
}
