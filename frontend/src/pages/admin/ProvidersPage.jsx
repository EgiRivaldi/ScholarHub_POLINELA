import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import { getProviders, createProvider, updateProvider, deleteProvider } from '@/services/api';

const columns = [
  {
    key: 'nama_penyedia',
    label: 'Nama Penyedia',
    render: (value) => <span className="font-medium text-slate-700">{value}</span>,
  },
  {
    key: 'singkatan',
    label: 'Singkatan',
    render: (value) => (
      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
        {value}
      </span>
    ),
  },
  {
    key: 'website',
    label: 'Website',
    render: (value) => (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline text-xs truncate max-w-[200px] block"
      >
        {value}
      </a>
    ),
  },
];

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    nama_penyedia: '',
    singkatan: '',
    website: '',
  });

  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      const data = await getProviders();
      setProviders(data);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat penyedia');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchProviders();
    };
    load();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      nama_penyedia: item.nama_penyedia,
      singkatan: item.singkatan || '',
      website: item.website || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus penyedia "${item.nama_penyedia}"?`)) return;
    try {
      await deleteProvider(item.id);
      toast.success(`Penyedia "${item.nama_penyedia}" berhasil dihapus.`);
      fetchProviders();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal menghapus penyedia');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateProvider(editingItem.id, formData);
        toast.success('Penyedia berhasil diperbarui.');
      } else {
        await createProvider(formData);
        toast.success('Penyedia berhasil dibuat.');
      }
      fetchProviders();
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan penyedia');
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({ nama_penyedia: '', singkatan: '', website: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Kelola Penyedia</h2>
          <p className="text-sm text-slate-500">Kelola organisasi penyedia beasiswa.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white text-sm font-medium shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Penyedia
        </button>
      </div>

      <DataTable
        columns={columns}
        data={providers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Cari penyedia..."
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
                  {editingItem ? 'Ubah Penyedia' : 'Tambah Penyedia'}
                </h2>
                <button onClick={handleClose} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="prov-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nama Penyedia <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="prov-name"
                    type="text"
                    required
                    value={formData.nama_penyedia}
                    onChange={(e) => setFormData((p) => ({ ...p, nama_penyedia: e.target.value }))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="mis. Kementerian Pendidikan"
                  />
                </div>
                <div>
                  <label htmlFor="prov-abbr" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Singkatan
                  </label>
                  <input
                    id="prov-abbr"
                    type="text"
                    value={formData.singkatan}
                    onChange={(e) => setFormData((p) => ({ ...p, singkatan: e.target.value }))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="mis. Kemendikbud"
                  />
                </div>
                <div>
                  <label htmlFor="prov-web" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Website
                  </label>
                  <input
                    id="prov-web"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData((p) => ({ ...p, website: e.target.value }))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="https://..."
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
