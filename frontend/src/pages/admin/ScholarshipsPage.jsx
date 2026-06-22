import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import CrudForm from '@/components/admin/CrudForm';
import { 
  getScholarships, 
  createScholarship, 
  updateScholarship, 
  deleteScholarship,
  getCategories,
  getProviders
} from '@/services/api';
import { formatDate } from '@/lib/utils';

const columns = [
  {
    key: 'nama_beasiswa',
    label: 'Nama Beasiswa',
    render: (value) => (
      <span className="font-medium text-slate-700 line-clamp-1 max-w-[200px]">{value}</span>
    ),
  },
  {
    key: 'nama_kategori',
    label: 'Kategori',
    render: (value) => (
      <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
        {value}
      </span>
    ),
  },
  {
    key: 'nama_penyedia',
    label: 'Penyedia',
  },
  {
    key: 'tanggal_tutup',
    label: 'Batas Waktu',
    render: (value) => formatDate(value),
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          value === 'active'
            ? 'bg-emerald-500/15 text-emerald-755 border border-emerald-500/20'
            : 'bg-rose-500/15 text-rose-755 border border-rose-500/20'
        }`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${value === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
        {value === 'active' ? 'Aktif' : 'Tutup'}
      </span>
    ),
  },
];

export default function ScholarshipsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [scholarshipsData, categoriesData, providersData] = await Promise.all([
        getScholarships({ limit: 100 }),
        getCategories(),
        getProviders()
      ]);
      setScholarships(scholarshipsData);
      setCategories(categoriesData);
      setProviders(providersData);
    } catch (error) {
      toast.error("Gagal memuat data.");
      console.error(error);
    } finally {
      setLoading(false);
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
    setIsFormOpen(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus "${item.nama_beasiswa}"?`)) return;
    try {
      await deleteScholarship(item.id);
      toast.success(`"${item.nama_beasiswa}" berhasil dihapus.`);
      fetchData(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus beasiswa');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        await updateScholarship(editingItem.id, formData);
        toast.success('Beasiswa berhasil diperbarui.');
      } else {
        await createScholarship(formData);
        toast.success('Beasiswa berhasil dibuat.');
      }
      setIsFormOpen(false);
      setEditingItem(null);
      fetchData(); // Refresh list
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan beasiswa');
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Kelola Beasiswa</h2>
          <p className="text-sm text-slate-500">Buat, ubah, dan hapus informasi beasiswa.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white text-sm font-medium shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Beasiswa
        </button>
      </div>

      <DataTable
        columns={columns}
        data={scholarships}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Cari beasiswa..."
        isLoading={loading}
      />

      <CrudForm
        isOpen={isFormOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={editingItem}
        categories={categories}
        providers={providers}
      />
    </div>
  );
}
