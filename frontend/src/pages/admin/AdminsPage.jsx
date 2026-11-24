import { useState, useEffect } from 'react';
import { Plus, X, Shield, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import DataTable from '@/components/admin/DataTable';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin, toggleAdminStatus } from '@/services/api';

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    nama_lengkap: '',
    password: '',
    peran: 'admin',
  });

  const storedUser = localStorage.getItem('admin');
  let currentUser = null;
  try {
    currentUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {}

  const isSuperAdmin = true;

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Gagal memuat administrator');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAdmins();
    }
  }, [isSuperAdmin]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      username: item.username || item.nama_pengguna,
      nama_lengkap: item.nama_lengkap,
      password: '',
      peran: item.peran || item.role || 'admin',
    });
    setIsFormOpen(true);
  };

  const handleToggleStatus = async (item) => {
    if (currentUser && currentUser.id === item.id) {
      toast.error('Anda tidak dapat mengubah status akun Anda sendiri.');
      return;
    }

    try {
      const updated = await toggleAdminStatus(item.id);
      toast.success(updated.aktif ? 'Akun berhasil diaktifkan' : 'Akun berhasil dinonaktifkan');
      fetchAdmins();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal mengubah status akun');
    }
  };

  const handleDelete = async (item) => {
    if (currentUser && currentUser.id === item.id) {
      toast.error('Anda tidak dapat menghapus akun admin Anda sendiri.');
      return;
    }

    if (!window.confirm(`Apakah Anda yakin ingin menghapus atau menonaktifkan akun "${item.username || item.nama_pengguna}"?`)) return;
    try {
      const res = await deleteAdmin(item.id);
      toast.success(res.message || `Admin berhasil diproses.`);
      fetchAdmins();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Gagal menghapus administrator');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: formData.username,
        nama_pengguna: formData.username,
        nama_lengkap: formData.nama_lengkap,
        peran: formData.peran,
      };
      if (formData.password && formData.password.trim() !== '') {
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
    setFormData({ username: '', nama_lengkap: '', password: '', peran: 'admin' });
  };

  const columns = [
    {
      key: 'username',
      label: 'Nama Pengguna',
      render: (value, row) => (
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${row.peran === 'admin_utama' ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'}`}>
            {row.peran === 'admin_utama' ? <ShieldCheck className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
          </div>
          <span className="font-semibold text-slate-800">{value || row.nama_pengguna}</span>
        </div>
      ),
    },
    {
      key: 'nama_lengkap',
      label: 'Nama Lengkap',
    },
    {
      key: 'peran',
      label: 'Peran',
      render: (value) => {
        const isUtama = value === 'admin_utama';
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isUtama ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
            {isUtama ? 'Admin Utama' : 'Admin Konten'}
          </span>
        );
      },
    },
    {
      key: 'aktif',
      label: 'Status Akun',
      render: (value, row) => {
        const isActive = Boolean(value);
        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(row);
            }}
            title="Klik untuk ubah status aktif/nonaktif"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'}`}
          >
            {isActive ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <XCircle className="h-3.5 w-3.5 text-rose-600" />}
            {isActive ? 'Aktif' : 'Nonaktif'}
          </button>
        );
      },
    },
  ];

  if (!isSuperAdmin) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center max-w-lg mx-auto mt-12">
        <Shield className="h-12 w-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">Akses Terbatas</h3>
        <p className="text-sm text-slate-600 mt-1">
          Halaman manajemen akun administrator hanya dapat diakses oleh peran <strong>Admin Utama</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Kelola Administrator</h2>
          <p className="text-sm text-slate-500">Kelola akun administrator, peran sistem, dan status aktif/nonaktif.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white text-sm font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer"
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
        searchPlaceholder="Cari nama pengguna atau administrator..."
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
                <h2 className="text-lg font-bold text-slate-800">
                  {editingItem ? 'Ubah Akun Admin' : 'Tambah Akun Admin Baru'}
                </h2>
                <button onClick={handleClose} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="admin-user" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Nama Pengguna (Username) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="admin-user"
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                    placeholder="Contoh: operator_kemahasiswaan"
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
                    placeholder="Nama lengkap admin"
                  />
                </div>
                <div>
                  <label htmlFor="admin-role" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Peran Sistem <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="admin-role"
                    value={formData.peran}
                    onChange={(e) => setFormData((p) => ({ ...p, peran: e.target.value }))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  >
                    <option value="admin">Admin (Pengelola Konten Beasiswa)</option>
                    <option value="admin_utama">Admin Utama (Super Administrator & Akses Log)</option>
                  </select>
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
                    placeholder={editingItem ? 'Kosongkan jika tidak ingin mengganti kata sandi' : 'Minimal 6 karakter'}
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={handleClose} className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    Batal
                  </button>
                  <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white text-sm font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer">
                    {editingItem ? 'Perbarui Akun' : 'Simpan Akun'}
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
