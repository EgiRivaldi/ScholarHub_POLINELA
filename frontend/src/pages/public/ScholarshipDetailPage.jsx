import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Building2,
  BookOpen,
  Award,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { getScholarshipById, getRequirementsByScholarshipId } from '@/services/api';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import AnimatedBackground from '@/components/public/AnimatedBackground';

export default function ScholarshipDetailPage() {
  const { id } = useParams();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getScholarshipById(id);

        let reqList = [];
        try {
          const reqData = await getRequirementsByScholarshipId(id);
          reqList = Array.isArray(reqData) ? reqData : reqData ? [reqData] : [];
        } catch (reqErr) {
          console.warn('Persyaratan tidak ditemukan untuk beasiswa ini', reqErr);
        }

        if (data) {
          const combinedReqs =
            data.persyaratan && data.persyaratan.length > 0 ? data.persyaratan : reqList;

          setScholarship({
            ...data,
            persyaratan: combinedReqs,
          });
        }
      } catch (err) {
        console.error('Gagal mengambil detail beasiswa:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 flex justify-center items-center min-h-[60vh] bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Memuat detail beasiswa...</span>
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4 bg-slate-50">
        <h1 className="text-xl font-bold text-slate-800">Program beasiswa tidak ditemukan.</h1>
        <p className="text-xs text-slate-500 mt-2">
          Program beasiswa ini mungkin belum diterbitkan atau telah ditarik.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    );
  }

  const regStatus = scholarship.status_pendaftaran || (scholarship.status === 'active' ? 'dibuka' : 'ditutup');

  return (
    <div className="relative py-8 sm:py-12 min-h-screen bg-slate-50 text-slate-900">
      <AnimatedBackground />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium overflow-x-auto py-1">
          <Link to="/" className="hover:text-primary transition-colors shrink-0">
            Beranda
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <Link to="/#scholarships" className="hover:text-primary transition-colors shrink-0">
            Beasiswa
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-800 font-bold truncate max-w-xs sm:max-w-md">
            {scholarship.nama_beasiswa || scholarship.judul}
          </span>
        </nav>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column (Poster & Quick Info) */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Logo & Status Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
              <div className="h-40 rounded-xl overflow-hidden bg-slate-50/80 border border-slate-100 flex items-center justify-center p-4 relative">
                {scholarship.gambar || scholarship.url_gambar ? (
                  <img
                    src={scholarship.gambar || scholarship.url_gambar}
                    alt={scholarship.nama_beasiswa || scholarship.judul}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                    <Building2 className="h-12 w-12 text-primary/30" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      ScholarHub POLINELA
                    </span>
                  </div>
                )}
              </div>

              {/* Status Banner */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Status Pendaftaran:</span>
                {regStatus === 'dibuka' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Pendaftaran Dibuka
                  </span>
                ) : regStatus === 'belum_dibuka' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Segera Dibuka
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    Pendaftaran Ditutup
                  </span>
                )}
              </div>
            </div>

            {/* Provider Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Mitra Penyelenggara
              </span>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-purple-50 text-primary flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {scholarship.penyedia_nama || 'Instansi Penyelenggara'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Mitra Resmi POLINELA</p>
                </div>
              </div>

              {scholarship.url_sumber_resmi && (
                <a
                  href={scholarship.url_sumber_resmi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline pt-2 border-t border-slate-100 w-full"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Website Resmi Penyelenggara</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column (Details, Requirements & CTA) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-purple-50 text-primary text-xs font-bold uppercase tracking-wider border border-purple-200">
                  {scholarship.kategori_nama}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {scholarship.nama_beasiswa || scholarship.judul}
              </h1>

              {scholarship.ringkasan && (
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {scholarship.ringkasan}
                </p>
              )}

              {/* Schedules Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Tanggal Pembukaan
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {formatDate(scholarship.tanggal_buka)}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-rose-500 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Batas Akhir (Deadline)
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {formatDate(scholarship.tanggal_tutup)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Deskripsi & Ketentuan Program</span>
              </h3>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {scholarship.deskripsi || 'Tidak ada deskripsi rinci untuk beasiswa ini.'}
              </div>
            </div>

            {/* Requirements Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span>Matriks Persyaratan Beasiswa</span>
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  {scholarship.persyaratan?.length || 0} Butir
                </span>
              </div>

              {scholarship.persyaratan && scholarship.persyaratan.length > 0 ? (
                <div className="space-y-2.5">
                  {scholarship.persyaratan.map((req, idx) => (
                    <div
                      key={req.id || idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-800">
                            {req.nama_persyaratan}
                          </p>
                          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-0.5 block">
                            Jenis: {req.jenis_persyaratan || 'Umum'}
                          </span>
                        </div>
                      </div>

                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 border',
                          req.wajib
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        )}
                      >
                        {req.wajib ? 'Wajib' : 'Opsional'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
                  Belum ada butir persyaratan khusus yang tercatat untuk beasiswa ini. Silakan periksa tautan resmi penyelenggara.
                </div>
              )}
            </div>

            {/* Official CTA Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Pendaftaran diproses secara eksternal pada portal resmi penyelenggara.</span>
              </div>

              {scholarship.url_pendaftaran ? (
                <a
                  href={scholarship.url_pendaftaran}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-sm transition-colors cursor-pointer"
                >
                  <span>Kunjungi Situs Pendaftaran Resmi</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 rounded-xl bg-slate-100 text-slate-400 text-sm font-bold cursor-not-allowed"
                >
                  Tautan Pendaftaran Belum Tersedia
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
