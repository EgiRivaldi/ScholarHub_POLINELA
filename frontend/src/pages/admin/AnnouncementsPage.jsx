import { useState, useEffect } from 'react';
import { Plus, X, Megaphone, Calendar, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '@/services/api';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    judul: '',
    isi_pengumuman: '',
    url_tujuan: '',
    aktif: true,
    mulai_tayang: '',
    akhir_tayang: '',
    urutan_tampil: 0,
  });

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Gagal memuat daftar pengumuman');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    // Format YYYY-MM-DDTHH:mm
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      judul: item.judul || '',
      isi_pengumuman: item.isi_pengumuman || '',
      url_tujuan: item.url_tujuan || '',
      aktif: Boolean(item.aktif),
      mulai_tayang: formatDateForInput(item.mulai_tayang),
      akhir_tayang: formatDateForInput(item.akhir_tayang),
      urutan_tampil: Number(item.urutan_tampil || 0),
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus pengumuman "${item.judul}"?`)) return;

    try {
      await deleteAnnouncement(item.id);
      toast.success('Pengumuman berhasil dihapus');
      fetchAnnouncements();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Gagal menghapus pengumuman');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.judul.trim()) {
      toast.error('Judul pengumuman wajib diisi');
      return;
    }
    if (!formData.isi_pengumuman.trim()) {
      toast.error('Isi pengumuman wajib diisi');
      return;
    }

    if (formData.mulai_tayang && formData.akhir_tayang) {
      const start = new Date(formData.mulai_tayang);
      const end = new Date(formData.akhir_tayang);
      if (end <= start) {
        toast.error('Waktu akhir tayang harus lebih besar dari mulai tayang');
        return;
      }
    }

    const payload = {
      judul: formData.judul.trim(),
      isi_pengumuman: formData.isi_pengumuman.trim(),
      url_tujuan: formData.url_tujuan.trim() || null,
      aktif: formData.aktif ? 1 : 0,
      mulai_tayang: formData.mulai_tayang || null,
      akhir_tayang: formData.akhir_tayang || null,
      urutan_tampil: Number(formData.urutan_tampil) || 0,
    };

    try {
      if (editingItem) {
        await updateAnnouncement(editingItem.id, payload);
        toast.success('Pengumuman berhasil diperbarui');
      } else {
        await createAnnouncement(payload);
        toast.success('Pengumuman baru berhasil dibuat');
      }
      setIsFormOpen(false);
      fetchAnnouncements();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Terjadi kesalahan saat menyimpan');
    }
  };

  const columns = [
    {
      key: 'urutan_tampil',
      label: 'Urutan',
      render: (val) => (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 font-bold text-xs text-slate-700">
          {val || 0}
        </span>
      ),
    },
    {
      key: 'judul',
      label: 'Pengumuman',
      render: (_, row) => (
        <div className="max-w-md">
          <div className="font-bold text-slate-800 text-sm line-clamp-1">{row.judul}</div>
          <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{row.isi_pengumuman}</p>
          {row.url_tujuan && (
            <a
              href={row.url_tujuan}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-semibold mt-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span>{row.url_tujuan}</span>
            </a>
          )}
        </div>
      ),
    },
    {
      key: 'aktif',
      label: 'Status',
      render: (val) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            val
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          {val ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Aktif</span>
            </>
          ) : (
            <>
              <XCircle className="h-3.5 w-3.5 text-slate-400" />
              <span>Nonaktif</span>
            </>
          )}
        </span>
      ),
    },
    {
      key: 'mulai_tayang',
      label: 'Periode Tayang',
      render: (_, row) => {
        if (!row.mulai_tayang && !row.akhir_tayang) {
          return (
            <span className="text-xs font-medium text-slate-500">
              Selalu Ditampilkan
            </span>
          );
        }
        const formatD = (d) => {
          if (!d) return '∞';
          return new Date(d).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        };
        return (
          <div className="text-xs text-slate-600 space-y-0.5">
            <div>Mulai: <span className="font-medium text-slate-800">{formatD(row.mulai_tayang)}</span></div>
            <div>Selesai: <span className="font-medium text-slate-800">{formatD(row.akhir_tayang)}</span></div>
          </div>
        );
      },
    },
    {
      key: 'pembuat_nama',
      label: 'Pembuat',
      render: (val) => (
        <span className="text-xs font-medium text-slate-600">{val || 'Admin'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-primary" />
            Pengumuman Berjalan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola banner pengumuman bergerak (running text) yang tampil pada halaman portal publik.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setFormData({
              judul: '',
              isi_pengumuman: '',
              url_tujuan: '',
              aktif: true,
              mulai_tayang: '',
              akhir_tayang: '',
              urutan_tampil: (announcements.length + 1) * 1,
            });
            setIsFormOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all shadow-sm hover:shadow-primary/20 shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Pengumuman</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Memuat data pengumuman...</div>
        ) : (
          <DataTable
            columns={columns}
            data={announcements}
            onEdit={handleEdit}
            onDelete={handleDelete}
            searchPlaceholder="Cari pengumuman..."
            pageSize={10}
          />
        )}
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-bold text-slate-800">
                    {editingItem ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Judul Pengumuman <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    placeholder="Contoh: Pembaruan Jadwal Pendaftaran Beasiswa 2026"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Maksimal 160 karakter</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Isi Pengumuman <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    maxLength={500}
                    value={formData.isi_pengumuman}
                    onChange={(e) => setFormData({ ...formData, isi_pengumuman: e.target.value })}
                    placeholder="Deskripsi singkat yang akan bergulir pada running banner..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Maksimal 500 karakter</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    URL Tujuan (Opsional)
                  </label>
                  <input
                    type="url"
                    value={formData.url_tujuan}
                    onChange={(e) => setFormData({ ...formData, url_tujuan: e.target.value })}
                    placeholder="https://polinela.ac.id/beasiswa"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">Tautan rujukan ketika pengunjung mengklik pengumuman</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Mulai Tayang (Opsional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.mulai_tayang}
                      onChange={(e) => setFormData({ ...formData, mulai_tayang: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Akhir Tayang (Opsional)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.akhir_tayang}
                      onChange={(e) => setFormData({ ...formData, akhir_tayang: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Urutan Tampil
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.urutan_tampil}
                      onChange={(e) => setFormData({ ...formData, urutan_tampil: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.aktif}
                        onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-bold text-slate-800">Status Aktif Tayang</span>
                    </label>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all shadow-sm"
                  >
                    {editingItem ? 'Simpan Perubahan' : 'Buat Pengumuman'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
