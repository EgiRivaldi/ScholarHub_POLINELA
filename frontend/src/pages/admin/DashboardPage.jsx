import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  FolderOpen,
  Building2,
  TrendingUp,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardCard from '@/components/admin/DashboardCard';
import { formatDate } from '@/lib/utils';
import { getDashboardStats, getDashboardRecent } from '@/services/api';

export default function DashboardPage() {
  const [statsData, setStatsData] = useState({
    totalScholarships: 0,
    totalCategories: 0,
    totalProviders: 0,
    activeScholarships: 0,
  });
  const [recentScholarships, setRecentScholarships] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [stats, recent] = await Promise.all([
          getDashboardStats(),
          getDashboardRecent(5)
        ]);
        if (stats) setStatsData(stats);
        setRecentScholarships(recent);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      title: 'Total Penyedia',
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

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
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

      {/* Recent Scholarships */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="glass-ios rounded-[24px] border-slate-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.03)] overflow-hidden bg-white"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">Beasiswa Terbaru</h2>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5">Entri beasiswa terbaru</p>
          </div>
          <Link
            to="/admin/scholarships"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
          >
            Lihat semua
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
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="px-6 py-3.5 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Beasiswa
                  </th>
                  <th className="px-6 py-3.5 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Kategori
                  </th>
                  <th className="px-6 py-3.5 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Penyedia
                  </th>
                  <th className="px-6 py-3.5 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Batas Waktu
                  </th>
                  <th className="px-6 py-3.5 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentScholarships.map((scholarship) => (
                  <tr
                    key={scholarship.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                          <GraduationCap className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <span className="font-bold text-slate-700 line-clamp-1">
                          {scholarship.nama_beasiswa}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/20">
                        {scholarship.nama_kategori || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-500">
                      {scholarship.nama_penyedia || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-500">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {formatDate(scholarship.tanggal_tutup)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border backdrop-blur-md ${
                          scholarship.status === 'active'
                            ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/25'
                            : 'bg-rose-500/15 text-rose-700 border-rose-500/25'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            scholarship.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'
                          }`}
                        />
                        {scholarship.status === 'active' ? 'Aktif' : 'Tutup'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
