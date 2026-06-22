import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ImageUpload from './ImageUpload';

export default function CrudForm({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  providers = [],
}) {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    nama_beasiswa: '',
    kategori_id: '',
    penyedia_id: '',
    deskripsi: '',
    tanggal_buka: '',
    tanggal_tutup: '',
    url_pendaftaran: '',
    gambar: null,
    ipk_minimum: '',
    semester_minimum: '',
    dokumen_persyaratan: '',
  });

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setFormData({
          nama_beasiswa: initialData?.nama_beasiswa || '',
          kategori_id: initialData?.kategori_id || '',
          penyedia_id: initialData?.penyedia_id || '',
          deskripsi: initialData?.deskripsi || '',
          tanggal_buka: initialData?.tanggal_buka ? initialData.tanggal_buka.substring(0, 10) : '',
          tanggal_tutup: initialData?.tanggal_tutup ? initialData.tanggal_tutup.substring(0, 10) : '',
          url_pendaftaran: initialData?.url_pendaftaran || '',
          gambar: initialData?.gambar || null,
          ipk_minimum: initialData?.ipk_minimum || '',
          semester_minimum: initialData?.semester_minimum || '',
          dokumen_persyaratan: initialData?.dokumen_persyaratan || '',
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file) => {
    setFormData((prev) => ({ ...prev, gambar: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (formData.tanggal_buka && formData.tanggal_tutup) {
      if (new Date(formData.tanggal_buka) > new Date(formData.tanggal_tutup)) {
        toast.error("Tanggal buka tidak boleh setelah tanggal tutup.");
        return;
      }
    }

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

    if (formData.url_pendaftaran) {
      try {
        new URL(formData.url_pendaftaran);
      } catch {
        toast.error("Silakan masukkan URL yang valid (termasuk http:// atau https://).");
        return;
      }
    }

    onSubmit?.(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sliding Sheet */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-xl glass-ios border-l border-slate-200 shadow-2xl flex flex-col h-full bg-white/95 backdrop-blur-[32px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 bg-transparent z-10 shrink-0">
              <h2 className="text-base font-bold text-slate-800 tracking-tight">
                {isEditing ? 'Ubah Beasiswa' : 'Tambah Beasiswa Baru'}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-transparent hover:border-slate-200"
                aria-label="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
              {/* Scrollable inputs */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="nama_beasiswa" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Nama Beasiswa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="nama_beasiswa"
                    name="nama_beasiswa"
                    type="text"
                    required
                    value={formData.nama_beasiswa}
                    onChange={handleChange}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
                    placeholder="Masukkan nama beasiswa"
                  />
                </div>

                {/* Category & Provider */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="kategori_id" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Kategori <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="kategori_id"
                      name="kategori_id"
                      required
                      value={formData.kategori_id}
                      onChange={handleChange}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
                    >
                      <option value="">Pilih kategori</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nama_kategori}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="penyedia_id" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Penyedia <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="penyedia_id"
                      name="penyedia_id"
                      required
                      value={formData.penyedia_id}
                      onChange={handleChange}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
                    >
                      <option value="">Pilih penyedia</option>
                      {providers.map((prov) => (
                        <option key={prov.id} value={prov.id}>
                          {prov.nama_penyedia}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="deskripsi" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Deskripsi
                  </label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    rows={4}
                    value={formData.deskripsi}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
                    placeholder="Masukkan deskripsi beasiswa"
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tanggal_buka" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Tanggal Buka <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="tanggal_buka"
                      name="tanggal_buka"
                      type="date"
                      required
                      value={formData.tanggal_buka}
                      onChange={handleChange}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="tanggal_tutup" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Tanggal Tutup <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="tanggal_tutup"
                      name="tanggal_tutup"
                      type="date"
                      required
                      value={formData.tanggal_tutup}
                      onChange={handleChange}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Registration URL */}
                <div>
                  <label htmlFor="url_pendaftaran" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    URL Pendaftaran <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="url_pendaftaran"
                    name="url_pendaftaran"
                    type="url"
                    required
                    value={formData.url_pendaftaran}
                    onChange={handleChange}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
                    placeholder="https://..."
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                    Gambar Beasiswa
                  </label>
                  <ImageUpload
                    value={formData.gambar}
                    onChange={handleImageChange}
                  />
                </div>

                {/* Requirements Section */}
                <div className="pt-5 border-t border-slate-200 space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matriks Persyaratan</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ipk_minimum" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                        IPK Minimum
                      </label>
                      <input
                        id="ipk_minimum"
                        name="ipk_minimum"
                        type="number"
                        step="0.01"
                        min="0"
                        max="4"
                        value={formData.ipk_minimum}
                        onChange={handleChange}
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
                        placeholder="mis. 3.00"
                      />
                    </div>
                    <div>
                      <label htmlFor="semester_minimum" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                        Semester Minimum
                      </label>
                      <input
                        id="semester_minimum"
                        name="semester_minimum"
                        type="number"
                        min="1"
                        max="14"
                        value={formData.semester_minimum}
                        onChange={handleChange}
                        className="w-full h-10 px-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
                        placeholder="mis. 3"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dokumen_persyaratan" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Dokumen Persyaratan
                    </label>
                    <textarea
                      id="dokumen_persyaratan"
                      name="dokumen_persyaratan"
                      rows={3}
                      value={formData.dokumen_persyaratan}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
                      placeholder="KTP, KTM, Transkrip Nilai, ..."
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white text-xs font-bold shadow-md shadow-primary/20 hover:shadow-lg transition-all"
                >
                  {isEditing ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
