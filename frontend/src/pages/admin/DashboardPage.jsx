import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  FolderOpen,
  Building2,
  TrendingUp,
  Calendar,
  ArrowRight,
  Plus,
  Megaphone,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardCard from '@/components/admin/DashboardCard';
import { formatDate } from '@/lib/utils';
import {
  getDashboardStats,
  getDashboardRecent,
  getCategories,
  getAnnouncements,
  updateAnnouncement,
} from '@/services/api';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [statsData, setStatsData] = useState({
    totalScholarships: 0,
    totalCategories: 0,
    totalProviders: 0,
    activeScholarships: 0,
  });
  const [recentScholarships, setRecentScholarships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [stats, recent, cats, anns] = await Promise.all([
          getDashboardStats(),
          getDashboardRecent(5),
          getCategories().catch(() => []),
          getAnnouncements().catch(() => []),
        ]);
        if (stats) setStatsData(stats);
        setRecentScholarships(recent || []);
        setCategories(cats || []);
        setAnnouncements(anns || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleToggleAnnouncement = async (item) => {
    const newActive = item.aktif ? 0 : 1;
    try {
      await updateAnnouncement(item.id, {
        judul: item.judul,
        isi_pengumuman: item.isi_pengumuman,
        url_tujuan: item.url_tujuan,
        aktif: newActive,
        urutan_tampil: item.urutan_tampil,
      });
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === item.id ? { ...a, aktif: Boolean(newActive) } : a))
      );
      toast.success(newActive ? 'Pengumuman diaktifkan' : 'Pengumuman dinonaktifkan');
    } catch (err) {
      toast.error('Gagal memperbarui status pengumuman');
    }
  };

  const stats = [
    {
      title: 'Total Beasiswa',
      value: statsData.totalScholarships,
      icon: GraduationCap,
      color: 'primary',
    },
    {
      title: 'Total Kategori',
      value: statsData.totalCategories,
      icon: FolderOpen,
      color: 'secondary',
    },
    {
      title: 'Mitra Penyedia',
      value: statsData.totalProviders,
      icon: Building2,
      color: 'warning',
    },
    {
      title: 'Beasiswa Aktif',
      value: statsData.activeScholarships,
      icon: TrendingUp,
      color: 'success',
    },
  ];

  const barColors = ['bg-[#00478f]', 'bg-sky-600', 'bg-emerald-600', 'bg-amber-500', 'bg-indigo-600'];

  return (
    <div className="space-y-6">
      {/* 1. Campus Welcome Banner + Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#002b5c] via-[#003d7a] to-[#00478f] p-6 text-white shadow-sm border border-blue-900/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
              <Zap className="h-3.5 w-3.5" />
              <span>Panel Kendali Terpadu POLINELA</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Selamat Datang, Administrator Sistem Informasi Beasiswa
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl">
              Kelola seluruh daftar program beasiswa, kategori mitra, rincian persyaratan, dan pengumuman portal resmi dalam satu dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              to="/admin/scholarships"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Kelola Beasiswa</span>
            </Link>
            <Link
              to="/admin/announcements"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold transition-colors"
            >
              <Megaphone className="h-4 w-4 text-amber-300" />
              <span>Buat Pengumuman</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <DashboardCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            index={index}
          />
        ))}
      </div>

      {/* 3. Two-Column Layout: Left (Recent Scholarships Table) + Right (Distribusi Kategori Widget) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Recent Scholarships */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-8 rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden bg-white"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-5 rounded-full bg-[#00478f]" />
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-800 tracking-tight uppercase">
                  Program Beasiswa Terbaru
                </h2>
                <p className="text-[11px] font-medium text-slate-400">
                  Daftar entri beasiswa yang terakhir diperbarui
                </p>
              </div>
            </div>
            <Link
              to="/admin/scholarships"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00478f] hover:underline transition-colors"
            >
              <span>Kelola Semua</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : recentScholarships.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                <GraduationCap className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-sm">Belum ada beasiswa yang terdaftar.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-100 bg-[#00478f]/5 text-[#003366]">
                    <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider">
                      Nama Beasiswa
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider">
                      Batas Waktu
                    </th>
                    <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentScholarships.map((scholarship) => {
                    const isOpen =
                      scholarship.status_pendaftaran === 'dibuka' || scholarship.status === 'active';
                    return (
                      <tr
                        key={scholarship.id}
                        className="hover:bg-blue-50/40 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 border border-blue-100 shrink-0">
                              <GraduationCap className="h-4.5 w-4.5 text-[#00478f]" />
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 line-clamp-1 text-xs sm:text-sm">
                                {scholarship.nama_beasiswa || scholarship.judul}
                              </span>
                              <span className="text-[11px] text-slate-400 block line-clamp-1">
                                {scholarship.nama_penyedia || scholarship.penyedia_nama || 'Mitra Resmi'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#00478f] text-[10px] font-extrabold uppercase tracking-wider border border-blue-200/80">
                            {scholarship.nama_kategori || scholarship.kategori_nama || 'Umum'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {formatDate(scholarship.tanggal_tutup)}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              isOpen
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                              }`}
                            />
                            {isOpen ? 'Dibuka' : 'Tutup'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Right Column (4 cols): Distribusi Kategori & Pengumuman Tayang Widgets */}
        <div className="lg:col-span-4 space-y-6">
          {/* Widget 1: Distribusi Kategori */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-amber-500" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                  Distribusi Kategori
                </h3>
              </div>
              <Link
                to="/admin/categories"
                className="text-xs font-bold text-[#00478f] hover:underline"
              >
                Atur →
              </Link>
            </div>

            <div className="space-y-3.5">
              {categories.map((cat, idx) => {
                const count =
                  cat.total_beasiswa !== undefined ? cat.total_beasiswa : cat.jumlah_beasiswa || 0;
                const total = Math.max(1, statsData.totalScholarships || 1);
                const pct = Math.min(100, Math.round((count / total) * 100));
                const barColor = barColors[idx % barColors.length];

                return (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">{cat.nama_kategori}</span>
                      <span className="font-extrabold text-[#00478f] bg-blue-50 px-2 py-0.5 rounded-full text-[11px]">
                        {count} Program
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${Math.max(count > 0 ? 15 : 4, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Widget 2: Pengumuman Tayang (Quick Toggle) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-emerald-600" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                  Pengumuman Portal
                </h3>
              </div>
              <Link
                to="/admin/announcements"
                className="text-xs font-bold text-[#00478f] hover:underline"
              >
                Kelola →
              </Link>
            </div>

            {announcements.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Belum ada pengumuman yang dibuat.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 space-y-3">
                {announcements.slice(0, 4).map((ann) => (
                  <div key={ann.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{ann.judul}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {ann.isi_pengumuman}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleAnnouncement(ann)}
                      title="Klik untuk ubah status tayang"
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 cursor-pointer border transition-colors ${
                        ann.aktif
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {ann.aktif ? '● Tayang' : '○ Nonaktif'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
