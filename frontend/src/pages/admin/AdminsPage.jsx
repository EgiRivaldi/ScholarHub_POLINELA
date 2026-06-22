import { useState, useEffect } from 'react';
import { Plus, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '@/services/api';

const columns = [
  {
    key: 'username',
    label: 'Username',
    render: (value) => (
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="font-medium text-slate-700">{value}</span>
      </div>
    ),
  },
  {
    key: 'nama_lengkap',
    label: 'Nama Lengkap',
  },
];

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    nama_lengkap: '',
    password: '',
  });

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error(error);
      toast.error('Gagal memuat administrator');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchAdmins();
    };
    load();
  }, []);

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      username: item.username,
      nama_lengkap: item.nama_lengkap,
      password: '', // Password empty on edit unless user types a new one
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (item) => {
    // Check if user tries to delete their own account
    const currentUserStr = localStorage.getItem('admin');
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser.id === item.id) {
        toast.error('Anda tidak dapat menghapus akun admin Anda sendiri.');
        return;
      }
    }

    if (!window.confirm(`Apakah Anda yakin ingin menghapus akun administrator "${item.username}"?`)) return;
    try {
      await deleteAdmin(item.id);
      toast.success(`Admin "${item.username}" berhasil dihapus.`);
      fetchAdmins();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal menghapus administrator');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Build clean payload: if updating, exclude empty password
      const payload = {
        username: formData.username,
        nama_lengkap: formData.nama_lengkap,
      };
      if (formData.password) {
        payload.password = formData.password;
      }

      if (editingItem) {
        await updateAdmin(editingItem.id, payload);
        toast.success('Admin berhasil diperbarui.');
      } else {
        await createAdmin(formData);
        toast.success('Admin berhasil dibuat.');
      }
      fetchAdmins();
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal menyimpan akun admin');
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    setFormData({ username: '', nama_lengkap: '', password: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Kelola Administrator</h2>
          <p className="text-sm text-slate-500">Kelola akun admin dan kontrol akses.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white text-sm font-medium shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Admin
        </button>
      </div>

      <DataTable
        columns={columns}
        data={admins}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Cari administrator..."
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
                  {editingItem ? 'Ubah Admin' : 'Tambah Admin'}
                </h2>
                <button onClick={handleClose} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="admin-user" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="admin-user"
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="Masukkan username"
                  />
                </div>
                <div>
                  <label htmlFor="admin-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="admin-name"
                    type="text"
                    required
                    value={formData.nama_lengkap}
                    onChange={(e) => setFormData((p) => ({ ...p, nama_lengkap: e.target.value }))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div>
                  <label htmlFor="admin-pass" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Kata Sandi {!editingItem && <span className="text-rose-500">*</span>}
                  </label>
                  <input
                    id="admin-pass"
                    type="password"
                    required={!editingItem}
                    value={formData.password}
                    onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder={editingItem ? 'Kosongkan jika tidak ingin diubah' : 'Masukkan kata sandi'}
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
