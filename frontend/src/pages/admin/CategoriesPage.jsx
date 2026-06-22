import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/services/api';

const columns = [
  {
    key: 'nama_kategori',
    label: 'Nama Kategori',
    render: (value) => <span className="font-medium text-slate-700">{value}</span>,
  },
  {
    key: 'deskripsi',
    label: 'Deskripsi',
  },
  {
    key: 'jumlah_beasiswa',
    label: 'Jumlah Beasiswa',
    render: (value) => (
      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
        {value || 0}
      </span>
    ),
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ nama_kategori: '', deskripsi: '' });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat kategori');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchCategories();
    };
    load();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ nama_kategori: item.nama_kategori, deskripsi: item.deskripsi || '' });
    setIsFormOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kategori "${item.nama_kategori}"?`)) return;
    try {
      await deleteCategory(item.id);
      toast.success(`Kategori "${item.nama_kategori}" berhasil dihapus.`);
      fetchCategories();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal menghapus kategori');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateCategory(editingItem.id, formData);
        toast.success('Kategori berhasil diperbarui.');
      } else {
        await createCategory(formData);
        toast.success('Kategori berhasil dibuat.');
      }
      fetchCategories();
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan kategori');
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({ nama_kategori: '', deskripsi: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Kelola Kategori</h2>
          <p className="text-sm text-slate-500">Atur beasiswa berdasarkan jenis kategori.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white text-sm font-medium shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Kategori
        </button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Cari kategori..."
        isLoading={isLoading}
      />

      {/* Simple Form Modal */}
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
                  {editingItem ? 'Ubah Kategori' : 'Tambah Kategori'}
                </h2>
                <button onClick={handleClose} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="cat-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nama Kategori <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="cat-name"
                    type="text"
                    required
                    value={formData.nama_kategori}
                    onChange={(e) => setFormData((p) => ({ ...p, nama_kategori: e.target.value }))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="mis. Pemerintah"
                  />
                </div>
                <div>
                  <label htmlFor="cat-desc" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Deskripsi
                  </label>
                  <textarea
                    id="cat-desc"
                    rows={3}
                    value={formData.deskripsi}
                    onChange={(e) => setFormData((p) => ({ ...p, deskripsi: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 resize-none focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="Masukkan deskripsi kategori"
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
