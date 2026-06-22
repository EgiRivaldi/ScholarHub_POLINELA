import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import { getRequirements, createRequirement, updateRequirement, deleteRequirement, getScholarships } from '@/services/api';

const columns = [
  {
    key: 'nama_beasiswa',
    label: 'Beasiswa',
    render: (value) => <span className="font-medium text-slate-700 line-clamp-1 max-w-[200px]">{value}</span>,
  },
  {
    key: 'ipk_minimum',
    label: 'IPK Minimum',
    render: (value) => (
      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
        {Number(value || 0).toFixed(2)}
      </span>
    ),
  },
  {
    key: 'semester_minimum',
    label: 'Semester Minimum',
    render: (value) => (
      <span className="px-2.5 py-1 rounded-full bg-secondary/10 text-secondary-dark text-xs font-semibold">
        Sem. {value || 1}
      </span>
    ),
  },
  {
    key: 'dokumen_persyaratan',
    label: 'Dokumen',
    render: (value) => (
      <span className="text-slate-500 line-clamp-1 max-w-[250px] text-xs">{value || '-'}</span>
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
    ipk_minimum: '',
    semester_minimum: '',
    dokumen_persyaratan: '',
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [reqs, schs] = await Promise.all([
        getRequirements(),
        getScholarships({ limit: 100 }) // Load up to 100 scholarships for selector
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
    const load = async () => {
      await fetchData();
    };
    load();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      beasiswa_id: item.beasiswa_id || '',
      ipk_minimum: item.ipk_minimum || '',
      semester_minimum: item.semester_minimum || '',
      dokumen_persyaratan: item.dokumen_persyaratan || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus persyaratan untuk "${item.nama_beasiswa}"?`)) return;
    try {
      await deleteRequirement(item.id);
      toast.success(`Persyaratan untuk "${item.nama_beasiswa}" berhasil dihapus.`);
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal menghapus persyaratan');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.ipk_minimum !== '' && formData.ipk_minimum !== null && formData.ipk_minimum !== undefined) {
      const gpa = parseFloat(formData.ipk_minimum);
      if (isNaN(gpa) || gpa < 0 || gpa > 4) {
        toast.error("IPK harus di antara 0.00 dan 4.00.");
        return;
      }
    }

    if (formData.semester_minimum !== '' && formData.semester_minimum !== null && formData.semester_minimum !== undefined) {
      const sem = parseInt(formData.semester_minimum, 10);
      if (isNaN(sem) || sem < 1 || sem > 14) {
        toast.error("Semester harus di antara 1 dan 14.");
        return;
      }
    }

    try {
      if (editingItem) {
        await updateRequirement(editingItem.id, formData);
        toast.success('Persyaratan berhasil diperbarui.');
      } else {
        await createRequirement(formData);
        toast.success('Persyaratan berhasil dibuat.');
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
    setFormData({ beasiswa_id: '', ipk_minimum: '', semester_minimum: '', dokumen_persyaratan: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Kelola Persyaratan</h2>
          <p className="text-sm text-slate-500">Atur kriteria kelayakan beasiswa.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white text-sm font-medium shadow-md shadow-primary/20 transition-all cursor-pointer"
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
        searchPlaceholder="Cari persyaratan..."
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
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md glass-ios rounded-2xl shadow-xl border border-slate-200 bg-white/95 backdrop-blur-[32px]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">
                  {editingItem ? 'Ubah Persyaratan' : 'Tambah Persyaratan'}
                </h2>
                <button onClick={handleClose} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="req-scholarship" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Beasiswa <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="req-scholarship"
                    required
                    value={formData.beasiswa_id}
                    onChange={(e) => setFormData((p) => ({ ...p, beasiswa_id: e.target.value }))}
                    disabled={!!editingItem}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  >
                    <option value="">Pilih Beasiswa</option>
                    {scholarships.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nama_beasiswa}
                      </option>
                    ))}
                  </select>
                </div>
 
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="req-gpa" className="block text-sm font-medium text-slate-700 mb-1.5">
                      IPK Minimum
                    </label>
                    <input
                      id="req-gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={formData.ipk_minimum}
                      onChange={(e) => setFormData((p) => ({ ...p, ipk_minimum: e.target.value }))}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                      placeholder="3.00"
                    />
                  </div>
                  <div>
                    <label htmlFor="req-sem" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Semester Minimum
                    </label>
                    <input
                      id="req-sem"
                      type="number"
                      min="1"
                      max="14"
                      value={formData.semester_minimum}
                      onChange={(e) => setFormData((p) => ({ ...p, semester_minimum: e.target.value }))}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                      placeholder="3"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="req-docs" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Dokumen Persyaratan
                  </label>
                  <textarea
                    id="req-docs"
                    rows={3}
                    value={formData.dokumen_persyaratan}
                    onChange={(e) => setFormData((p) => ({ ...p, dokumen_persyaratan: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 resize-none focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="KTP, KTM, Transkrip Nilai, ..."
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={handleClose} className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Batal
                  </button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white text-sm font-medium shadow-md shadow-primary/20 transition-all cursor-pointer">
                    {editingItem ? 'Perbarui' : 'Simpan'}
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
