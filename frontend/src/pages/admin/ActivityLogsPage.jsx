import { useState, useEffect } from 'react';
import {
  History,
  Filter,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  User,
  Activity,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { getActivityLogs } from '@/services/api';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [filterAction, setFilterAction] = useState('');
  const [filterEntity, setFilterEntity] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const storedUser = localStorage.getItem('admin');
  let currentUser = null;
  try {
    currentUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {}

  const isSuperAdmin = currentUser?.peran === 'admin_utama' || currentUser?.role === 'admin_utama';

  const fetchLogs = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await getActivityLogs({
        page,
        limit: pagination.limit,
        aksi: filterAction || undefined,
        jenis_entitas: filterEntity || undefined,
      });
      setLogs(res.data || []);
      setPagination(res.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Gagal memuat log aktivitas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchLogs(1);
    }
  }, [isSuperAdmin, filterAction, filterEntity]);

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-rose-100 shadow-sm text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Akses Terbatas</h2>
        <p className="text-sm text-slate-500 max-w-md mt-2">
          Halaman Log Aktivitas hanya dapat diakses dan diaudit oleh akun dengan hak akses <strong>Admin Utama</strong>.
        </p>
      </div>
    );
  }

  const getActionBadge = (aksi) => {
    const act = (aksi || '').toLowerCase();
    switch (act) {
      case 'tambah':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            TAMBAH
          </span>
        );
      case 'ubah':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            UBAH
          </span>
        );
      case 'hapus':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            HAPUS
          </span>
        );
      case 'masuk':
      case 'login':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            MASUK
          </span>
        );
      case 'keluar':
      case 'logout':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            KELUAR
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {act.toUpperCase()}
          </span>
        );
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            Audit Log Aktivitas
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Rekam jejak seluruh operasi penambahan, perubahan, dan penghapusan data oleh administrator.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 shrink-0">
          <Filter className="h-4 w-4" />
          <span>Filter:</span>
        </div>

        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full sm:w-44"
        >
          <option value="">Semua Aksi</option>
          <option value="tambah">TAMBAH</option>
          <option value="ubah">UBAH</option>
          <option value="hapus">HAPUS</option>
          <option value="masuk">MASUK</option>
          <option value="keluar">KELUAR</option>
        </select>

        <select
          value={filterEntity}
          onChange={(e) => setFilterEntity(e.target.value)}
          className="h-9 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full sm:w-56"
        >
          <option value="">Semua Entitas</option>
          <option value="beasiswa">Beasiswa</option>
          <option value="kategori_beasiswa">Kategori Beasiswa</option>
          <option value="penyelenggara_beasiswa">Penyelenggara Beasiswa</option>
          <option value="persyaratan_beasiswa">Persyaratan Beasiswa</option>
          <option value="pengguna">Pengguna (Admin)</option>
          <option value="pengumuman">Pengumuman</option>
          <option value="pengaturan_situs">Pengaturan Situs</option>
        </select>

        {(filterAction || filterEntity) && (
          <button
            onClick={() => {
              setFilterAction('');
              setFilterEntity('');
            }}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline px-2 cursor-pointer"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Memuat log aktivitas...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">Belum ada catatan log aktivitas yang sesuai.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Waktu</th>
                  <th className="py-3 px-4">Aktor / Admin</th>
                  <th className="py-3 px-4">Aksi</th>
                  <th className="py-3 px-4">Entitas</th>
                  <th className="py-3 px-4">ID Entitas</th>
                  <th className="py-3 px-4 text-center">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {formatDateTime(log.dibuat_pada)}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{log.nama_lengkap || log.nama_pengguna || 'Sistem'}</div>
                      <div className="text-[11px] text-slate-400">@{log.nama_pengguna || 'sistem'} • {log.peran || 'admin'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {getActionBadge(log.aksi)}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {log.jenis_entitas}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {log.id_entitas || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-primary bg-primary/5 hover:bg-primary/10 transition-colors font-bold cursor-pointer"
                        title="Lihat Perubahan"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Audit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Menampilkan halaman {pagination.page} dari {pagination.totalPages} ({pagination.total} total log)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchLogs(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchLogs(pagination.page + 1)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-slate-800">
                    Detail Log #{selectedLog.id} — {selectedLog.jenis_entitas}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
                <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Waktu</span>
                    <span className="font-semibold text-slate-700">{formatDateTime(selectedLog.dibuat_pada)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Aktor</span>
                    <span className="font-semibold text-slate-700">
                      {selectedLog.nama_lengkap} (@{selectedLog.nama_pengguna})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Aksi</span>
                    <span className="font-bold">{selectedLog.aksi?.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">ID Entitas</span>
                    <span className="font-mono font-semibold text-slate-700">{selectedLog.id_entitas || '-'}</span>
                  </div>
                </div>

                {/* Data Sebelum */}
                <div>
                  <h4 className="font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Data Sebelum Perubahan:
                  </h4>
                  {selectedLog.data_sebelum ? (
                    <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
                      {JSON.stringify(selectedLog.data_sebelum, null, 2)}
                    </pre>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 italic">
                      Tidak ada data sebelum (rekaman baru / tambah)
                    </div>
                  )}
                </div>

                {/* Data Sesudah */}
                <div>
                  <h4 className="font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Data Sesudah Perubahan:
                  </h4>
                  {selectedLog.data_sesudah ? (
                    <pre className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-[11px] overflow-x-auto">
                      {JSON.stringify(selectedLog.data_sesudah, null, 2)}
                    </pre>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 italic">
                      Tidak ada data sesudah (rekaman dihapus)
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-3 border-t border-slate-100 flex justify-end bg-slate-50/50">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
