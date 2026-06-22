import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  Building2,
  BookOpen,
  Award,
  FileText,
  CheckCircle2,
  ExternalLink,
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
        
        let reqData = null;
        try {
          reqData = await getRequirementsByScholarshipId(id);
        } catch (reqErr) {
          console.warn("Persyaratan tidak ditemukan untuk beasiswa ini", reqErr);
        }

        // Combine for the UI
        if (data) {
          setScholarship({
            ...data,
            ipk_minimum: reqData?.ipk_minimum ? Number(reqData.ipk_minimum) : 0,
            semester_minimum: reqData?.semester_minimum || 1,
            dokumen_persyaratan: reqData?.dokumen_persyaratan || '',
          });
        }
      } catch (err) {
        console.error("Gagal mengambil detail beasiswa:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-xl font-bold text-slate-800">Beasiswa tidak ditemukan.</h1>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block font-bold">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const documents = scholarship.dokumen_persyaratan
    ? scholarship.dokumen_persyaratan.split(',').map((d) => d.trim())
    : [];

  const isActive = scholarship.status === 'active';

  return (
    <div className="relative py-8 sm:py-12 min-h-screen">
      <AnimatedBackground />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Kembali ke Beasiswa
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 lg:sticky lg:top-24"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 border border-slate-200/50 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)]">
              {scholarship.gambar ? (
                <img
                  src={scholarship.gambar}
                  alt={scholarship.nama_beasiswa}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-primary/20">
                  <svg className="h-16 w-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">ScholarHub</span>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="mt-5 flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider border shadow-sm backdrop-blur-md",
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25'
                    : 'bg-rose-500/15 text-rose-700 border-rose-500/25'
                )}
              >
                <span className={cn("h-2 w-2 rounded-full", isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400')} />
                {isActive ? 'Pendaftaran Dibuka' : 'Pendaftaran Ditutup'}
              </span>
            </div>
          </motion.div>

          {/* Right - Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Header */}
            <div className="border-b border-slate-200 pb-6">
              <span className="inline-flex px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/20 mb-3.5">
                {scholarship.kategori_nama}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                {scholarship.nama_beasiswa}
              </h1>
              <div className="flex items-center gap-2 text-slate-600">
                <Building2 className="h-4.5 w-4.5 text-slate-400" />
                <span className="text-sm font-bold">{scholarship.penyedia_nama}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Deskripsi Beasiswa
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed glass-ios border-slate-200/50 p-5.5 rounded-[22px] shadow-sm">
                {scholarship.deskripsi}
              </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl glass-ios border-slate-200/50 shadow-sm">
                <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Buka</p>
                  <p className="text-sm font-bold text-slate-800">{formatDate(scholarship.tanggal_buka)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3.5 p-4 rounded-2xl glass-ios border-slate-200/50 shadow-sm">
                <Calendar className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tanggal Tutup</p>
                  <p className="text-sm font-bold text-slate-800">{formatDate(scholarship.tanggal_tutup)}</p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Persyaratan Beasiswa
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Number(scholarship.ipk_minimum) > 0 && (
                  <div className="flex items-start gap-3.5 p-4.5 rounded-[22px] glass-ios border-slate-200/50 shadow-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shrink-0 shadow-sm">
                      <span className="text-[10px] font-black text-primary">IPK</span>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">IPK Minimum</p>
                      <p className="text-lg font-black text-slate-800">{Number(scholarship.ipk_minimum).toFixed(2)}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3.5 p-4.5 rounded-[22px] glass-ios border-slate-200/50 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 border border-secondary/20 shrink-0 shadow-sm">
                    <span className="text-[10px] font-black text-secondary">SMT</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Semester Minimum</p>
                    <p className="text-lg font-black text-slate-800">{scholarship.semester_minimum}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {documents.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3.5 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-400" />
                    Dokumen Persyaratan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl glass-ios border-slate-200/50 shadow-sm"
                      >
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                        <span className="text-sm font-semibold text-slate-700">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="pt-6 border-t border-slate-200 flex">
              <a
                href={scholarship.url_pendaftaran}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
              >
                Kunjungi Situs Resmi
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
