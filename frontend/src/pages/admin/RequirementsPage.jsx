import { useState, useEffect } from 'react';
import { Plus, X, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import {
  getRequirements,
  createRequirement,
  updateRequirement,
  deleteRequirement,
  getScholarships,
} from '@/services/api';

const columns = [
  {
    key: 'judul_beasiswa',
    label: 'Program Beasiswa',
    render: (value, row) => (
      <span className="font-bold text-slate-800 line-clamp-1 max-w-[220px]">
        {value || row.nama_beasiswa || 'Beasiswa'}
      </span>
    ),
  },
  {
    key: 'nama_persyaratan',
    label: 'Butir Persyaratan',
    render: (value) => (
      <span className="text-slate-700 font-medium line-clamp-2 max-w-[320px] text-xs">
        {value}
      </span>
    ),
  },
  {
    key: 'jenis_persyaratan',
    label: 'Jenis',
    render: (value) => {
      const typeLabels = {
        umum: { label: 'Umum', color: 'bg-slate-100 text-slate-700 border-slate-200' },
        akademik: { label: 'Akademik', color: 'bg-primary/10 text-primary border-primary/20' },
        administrasi: { label: 'Administrasi', color: 'bg-blue-50 text-blue-700 border-blue-200' },
        lainnya: { label: 'Lainnya', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      };
      const conf = typeLabels[value] || typeLabels.umum;
      return (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${conf.color}`}>
          {conf.label}
        </span>
      );
    },
  },
  {
    key: 'wajib',
    label: 'Sifat',
    render: (value) => (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          value ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-600 border-slate-200'
        }`}
      >
        {value ? 'Wajib' : 'Opsional'}
      </span>
    ),
  },
  {
    key: 'urutan_tampil',
    label: 'Urutan',
    render: (value) => (
      <span className="text-slate-500 font-bold text-xs">
        #{value || 0}
      </span>
    ),
  },
];

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    beasiswa_id: '',
    nama_persyaratan: '',
    jenis_persyaratan: 'umum',
    wajib: 1,
    urutan_tampil: 1,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [reqs, schs] = await Promise.all([
        getRequirements(),
        getScholarships({ limit: 100 }),
      ]);
      setRequirements(reqs);
      setScholarships(schs);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat data persyaratan atau beasiswa');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      beasiswa_id: item.beasiswa_id || '',
      nama_persyaratan: item.nama_persyaratan || '',
      jenis_persyaratan: item.jenis_persyaratan || 'umum',
      wajib: item.wajib ? 1 : 0,
      urutan_tampil: item.urutan_tampil || 1,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus persyaratan "${item.nama_persyaratan}"?`)) return;
    try {
      await deleteRequirement(item.id);
      toast.success('Persyaratan berhasil dihapus.');
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal menghapus persyaratan');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateRequirement(editingItem.id, formData);
        toast.success('Persyaratan berhasil diperbarui.');
      } else {
        await createRequirement(formData);
        toast.success('Persyaratan baru berhasil ditambahkan.');
      }
      fetchData();
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan persyaratan');
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({
      beasiswa_id: '',
      nama_persyaratan: '',
      jenis_persyaratan: 'umum',
      wajib: 1,
      urutan_tampil: 1,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Kelola Persyaratan Beasiswa</h2>
          <p className="text-sm text-slate-500">Kelola butir persyaratan (akademik, administrasi, umum) per program beasiswa.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white text-sm font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Persyaratan
        </button>
      </div>

      <DataTable
        columns={columns}
        data={requirements}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Cari program beasiswa atau butir persyaratan..."
        isLoading={isLoading}
      />

      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm"
              onClick={handleClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg glass-ios rounded-2xl shadow-xl border border-slate-200 bg-white/95 backdrop-blur-[32px]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-800">
                  {editingItem ? 'Ubah Persyaratan' : 'Tambah Butir Persyaratan'}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="req-beasiswa" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Program Beasiswa <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="req-beasiswa"
                    required
                    value={formData.beasiswa_id}
                    onChange={(e) => setFormData((p) => ({ ...p, beasiswa_id: e.target.value }))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  >
                    <option value="">-- Pilih Program Beasiswa --</option>
                    {scholarships.map((sch) => (
                      <option key={sch.id} value={sch.id}>
                        {sch.judul || sch.nama_beasiswa}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="req-nama" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Deskripsi Butir Persyaratan <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="req-nama"
                    required
                    rows={3}
                    value={formData.nama_persyaratan}
                    onChange={(e) => setFormData((p) => ({ ...p, nama_persyaratan: e.target.value }))}
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="Contoh: Mahasiswa aktif POLINELA minimal semester 3 dengan IPK minimal 3.25"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="req-jenis" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Jenis Persyaratan <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="req-jenis"
                      value={formData.jenis_persyaratan}
                      onChange={(e) => setFormData((p) => ({ ...p, jenis_persyaratan: e.target.value }))}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    >
                      <option value="umum">Umum (Kriteria Dasar)</option>
                      <option value="akademik">Akademik (IPK/Semester/Nilai)</option>
                      <option value="administrasi">Administrasi (KTP/KTM/Berkas)</option>
                      <option value="lainnya">Lainnya (Prestasi/SKTM/Tambahan)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="req-wajib" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Sifat Ketentuan <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="req-wajib"
                      value={formData.wajib}
                      onChange={(e) => setFormData((p) => ({ ...p, wajib: parseInt(e.target.value, 10) }))}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    >
                      <option value={1}>Wajib Dipenuhi</option>
                      <option value={0}>Opsional / Nilai Tambah</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="req-urutan" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Urutan Tampil
                  </label>
                  <input
                    id="req-urutan"
                    type="number"
                    min={0}
                    value={formData.urutan_tampil}
                    onChange={(e) => setFormData((p) => ({ ...p, urutan_tampil: e.target.value }))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="1"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white text-sm font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer"
                  >
                    {editingItem ? 'Perbarui Persyaratan' : 'Simpan Persyaratan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
