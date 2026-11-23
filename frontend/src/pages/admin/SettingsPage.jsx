import { useState, useEffect } from 'react';
import {
  Settings,
  Globe,
  Sliders,
  Mail,
  Share2,
  FileText,
  Save,
  ShieldAlert,
  Megaphone,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { getSettings, updateSettings } from '@/services/api';

export default function SettingsPage() {
  const [settingsList, setSettingsList] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('umum');

  const storedUser = localStorage.getItem('admin');
  let currentUser = null;
  try {
    currentUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {}

  const isSuperAdmin = currentUser?.peran === 'admin_utama' || currentUser?.role === 'admin_utama';

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await getSettings();
      setSettingsList(data);
      const initialMap = {};
      data.forEach((s) => {
        initialMap[s.kunci_pengaturan] = s.nilai_parsed !== null && s.nilai_parsed !== undefined ? s.nilai_parsed : s.nilai_pengaturan;
      });
      setFormData(initialMap);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Gagal memuat pengaturan situs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchSettings();
    }
  }, [isSuperAdmin]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formData);
      toast.success('Pengaturan situs berhasil diperbarui');
      fetchSettings();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Gagal menyimpan pengaturan');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-rose-100 shadow-sm text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Akses Terbatas</h2>
        <p className="text-sm text-slate-500 max-w-md mt-2">
          Halaman Pengaturan Situs hanya dapat diakses dan diubah oleh akun dengan hak akses <strong>Admin Utama</strong>.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'umum', label: 'Umum & Hero', icon: Globe },
    { id: 'tentang', label: 'Tentang Situs', icon: FileText },
    { id: 'kontak', label: 'Kontak & Tampilan', icon: Mail },
    { id: 'pengumuman', label: 'Pengumuman Berjalan', icon: Megaphone },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Pengaturan Situs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Konfigurasi metadata portal, teks beranda, kontak, logo, footer, dan durasi running text.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all shadow-sm hover:shadow-primary/20 shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 text-sm border border-slate-200">
          Memuat pengaturan situs...
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50/50 px-4 pt-3 gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold border-t border-x transition-all ${
                    active
                      ? 'bg-white text-primary border-slate-200 shadow-sm relative -mb-px'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
            {/* TAB: UMUM & HERO */}
            {activeTab === 'umum' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Nama Portal Website
                  </label>
                  <input
                    type="text"
                    value={formData.nama_website || ''}
                    onChange={(e) => handleChange('nama_website', e.target.value)}
                    placeholder="Contoh: Informasi Beasiswa Politeknik Negeri Lampung"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Nama identitas utama yang muncul pada header dan title browser.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Judul Utama Beranda (Hero Title)
                  </label>
                  <input
                    type="text"
                    value={formData.judul_beranda || ''}
                    onChange={(e) => handleChange('judul_beranda', e.target.value)}
                    placeholder="Contoh: Temukan Informasi Beasiswa Impianmu"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Teks judul besar di area Hero banner depan.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Deskripsi Ringkas Beranda (Hero Subtitle)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.deskripsi_beranda || ''}
                    onChange={(e) => handleChange('deskripsi_beranda', e.target.value)}
                    placeholder="Cari informasi beasiswa, persyaratan, jadwal, dan tautan pendaftaran dalam satu tempat."
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Teks Hak Cipta Footer
                  </label>
                  <input
                    type="text"
                    value={formData.teks_footer || ''}
                    onChange={(e) => handleChange('teks_footer', e.target.value)}
                    placeholder="Politeknik Negeri Lampung"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}

            {/* TAB: TENTANG */}
            {activeTab === 'tentang' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Deskripsi Halaman Tentang (About)
                  </label>
                  <textarea
                    rows={6}
                    value={formData.tentang_website || ''}
                    onChange={(e) => handleChange('tentang_website', e.target.value)}
                    placeholder="Website ini menyediakan informasi beasiswa bagi mahasiswa Politeknik Negeri Lampung..."
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Isi pengantar pada halaman /about mengenai tujuan dan latar belakang portal ScholarHub.
                  </p>
                </div>
              </div>
            )}

            {/* TAB: KONTAK & TAMPILAN */}
            {activeTab === 'kontak' && (
              <div className="space-y-6 max-w-3xl">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Kontak Resmi
                  </label>
                  <input
                    type="email"
                    value={formData.email_kontak || ''}
                    onChange={(e) => handleChange('email_kontak', e.target.value)}
                    placeholder="beasiswa@polinela.ac.id"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Ditampilkan pada footer portal untuk kontak bantuan mahasiswa.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    URL Logo Instansi (Opsional)
                  </label>
                  <input
                    type="url"
                    value={formData.url_logo || ''}
                    onChange={(e) => handleChange('url_logo', e.target.value)}
                    placeholder="https://polinela.ac.id/images/logo.png"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    URL Akun Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.url_instagram || ''}
                    onChange={(e) => handleChange('url_instagram', e.target.value)}
                    placeholder="https://instagram.com/politeknik_negeri_lampung"
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}

            {/* TAB: PENGUMUMAN BERJALAN */}
            {activeTab === 'pengumuman' && (
              <div className="space-y-6 max-w-3xl">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.pengumuman_bergerak_aktif)}
                      onChange={(e) => handleChange('pengumuman_bergerak_aktif', e.target.checked ? '1' : '0')}
                      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-800 block">
                        Aktifkan Banner Pengumuman Bergerak
                      </span>
                      <span className="text-xs text-slate-500 block">
                        Jika dicentang, banner running text akan tampil di bagian atas halaman publik bagi pengunjung.
                      </span>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Durasi Pergantian Pengumuman (Detik)
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="120"
                    value={formData.durasi_pengumuman_detik || 20}
                    onChange={(e) => handleChange('durasi_pengumuman_detik', e.target.value)}
                    className="w-full max-w-xs h-10 px-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Durasi tayang setiap item pengumuman sebelum berganti ke pengumuman berikutnya (minimal 3 detik).
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all shadow-sm hover:shadow-primary/20 cursor-pointer disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
