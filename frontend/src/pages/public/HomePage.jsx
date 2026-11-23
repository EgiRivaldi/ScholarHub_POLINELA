import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  GraduationCap,
  Sparkles,
  HelpCircle,
  ChevronDown,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import Hero from '@/components/public/Hero';
import CategoryCard from '@/components/public/CategoryCard';
import ScholarshipGrid from '@/components/public/ScholarshipGrid';
import AnimatedBackground from '@/components/public/AnimatedBackground';
import MagneticButton from '@/components/ui/MagneticButton';
import { getScholarships, getCategories, getProviders, getPublicSettings } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('semua');
  const [sortOption, setSortOption] = useState('terbaru');
  const [scholarships, setScholarships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    scholarshipsCount: 0,
    providersCount: 0,
    categoriesCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [scholarshipsData, categoriesData, providersData, settingsData] = await Promise.all([
          getScholarships({ limit: 100 }),
          getCategories(),
          getProviders(),
          getPublicSettings().catch(() => ({})),
        ]);
        setScholarships(scholarshipsData);
        setCategories(categoriesData);
        setSiteSettings(settingsData || {});
        setStats({
          scholarshipsCount: scholarshipsData.length,
          categoriesCount: categoriesData.length,
          providersCount: providersData.length,
        });
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const debouncedSearch = useDebounce(searchQuery, 250);

  // Sync search query with URL params
  useEffect(() => {
    if (debouncedSearch) {
      setSearchParams({ search: debouncedSearch }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [debouncedSearch, setSearchParams]);

  const filteredScholarships = useMemo(() => {
    let results = [...scholarships];

    // Filter Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase().trim();
      results = results.filter(
        (s) =>
          (s.nama_beasiswa?.toLowerCase() || '').includes(q) ||
          (s.judul?.toLowerCase() || '').includes(q) ||
          (s.penyedia_nama?.toLowerCase() || '').includes(q) ||
          (s.deskripsi?.toLowerCase() || '').includes(q)
      );
    }

    // Filter Category
    if (selectedCategory) {
      results = results.filter((s) => s.kategori_id === selectedCategory.id);
    }

    // Filter Registration Status
    if (selectedStatus !== 'semua') {
      results = results.filter((s) => {
        const regStatus = s.status_pendaftaran || (s.status === 'active' ? 'dibuka' : 'ditutup');
        return regStatus === selectedStatus;
      });
    }

    // Sort
    if (sortOption === 'terbaru') {
      results.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else if (sortOption === 'deadline') {
      results.sort((a, b) => {
        if (!a.tanggal_tutup) return 1;
        if (!b.tanggal_tutup) return -1;
        return new Date(a.tanggal_tutup) - new Date(b.tanggal_tutup);
      });
    } else if (sortOption === 'az') {
      results.sort((a, b) =>
        (a.nama_beasiswa || a.judul || '').localeCompare(b.nama_beasiswa || b.judul || '')
      );
    }

    return results;
  }, [debouncedSearch, selectedCategory, selectedStatus, sortOption, scholarships]);

  const handleCategoryClick = (category) => {
    setSelectedCategory((prev) => (prev?.id === category.id ? null : category));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedStatus('semua');
    setSortOption('terbaru');
  };

  const isFiltering = !!(debouncedSearch || selectedCategory || selectedStatus !== 'semua');

  // FAQ state
  const [faqOpen, setFaqOpen] = useState({ 0: true });
  const toggleFaq = (index) => {
    setFaqOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const faqItems = [
    {
      q: 'Bagaimana cara mendaftar beasiswa di ScholarHub POLINELA?',
      a: 'ScholarHub POLINELA adalah portal informasi resmi. Anda dapat membuka kartu beasiswa untuk membaca seluruh persyaratan dan jadwal pendaftaran, kemudian klik tombol "Kunjungi Situs Resmi" untuk mendaftar langsung pada website resmi penyelenggara program.',
    },
    {
      q: 'Apakah mahasiswa perlu membuat akun untuk melihat informasi beasiswa?',
      a: 'Tidak. Mahasiswa dan publik dapat mengakses seluruh daftar beasiswa, detail kriteria, jadwal, dan tautan eksternal secara gratis dan terbuka tanpa perlu login atau registrasi akun.',
    },
    {
      q: 'Apakah beasiswa yang sudah ditutup masih bisa dilihat?',
      a: 'Ya, beasiswa yang telah melewati tanggal penutupan tetap dapat diakses di portal dengan status "Ditutup" sebagai bahan referensi persyaratan untuk periode pendaftaran tahun berikutnya.',
    },
    {
      q: 'Dari mana sumber data beasiswa yang ditampilkan?',
      a: 'Seluruh informasi program beasiswa dikurasi dan diverifikasi langsung oleh Tim Pengelola Beasiswa Politeknik Negeri Lampung berdasarkan pengumuman resmi instansi pemerintah, BUMN, dan mitra swasta.',
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900">
      <AnimatedBackground />

      {/* Hero Section */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stats={stats}
        settings={siteSettings}
      />

      <div id="scholarships" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Categories Section */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Jelajahi Berdasarkan Kategori
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Pilih kategori untuk memfilter beasiswa sesuai jenis mitra penyelenggara.
              </p>
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-bold text-primary hover:underline mt-2 sm:mt-0 cursor-pointer"
              >
                Hapus Filter Kategori ({selectedCategory.nama_kategori})
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategory?.id === category.id}
                onClick={handleCategoryClick}
              />
            ))}
          </div>
        </section>

        {/* Scholarships List & Filter Bar Section */}
        <section className="space-y-6">
          {/* Header & Controls */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <span>Daftar Program Beasiswa</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {filteredScholarships.length}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Informasi program beasiswa aktif, segera dibuka, dan arsip referensi.
                </p>
              </div>

              {/* Status Magnetic Pills */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/90 shadow-2xs">
                {[
                  { id: 'semua', label: 'Semua Status' },
                  { id: 'dibuka', label: 'Dibuka' },
                  { id: 'belum_dibuka', label: 'Segera' },
                  { id: 'ditutup', label: 'Ditutup' },
                ].map((s) => (
                  <MagneticButton
                    key={s.id}
                    onClick={() => setSelectedStatus(s.id)}
                    strength={0.25}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedStatus === s.id
                        ? 'bg-white text-primary shadow-xs border border-purple-200/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    {s.label}
                  </MagneticButton>
                ))}
              </div>
            </div>

            {/* Sub-controls: Search & Sort */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter nama atau syarat..."
                  className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">Urutkan:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer w-full sm:w-auto"
                >
                  <option value="terbaru">Terbaru Ditambahkan</option>
                  <option value="deadline">Batas Waktu Terdekat</option>
                  <option value="az">Nama Beasiswa (A-Z)</option>
                </select>

                {isFiltering && (
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 h-9 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
                    title="Reset Filter"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Grid Cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse">
                  <div className="h-44 bg-slate-100 rounded-xl" />
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-5 bg-slate-100 rounded w-4/5" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <ScholarshipGrid scholarships={filteredScholarships} />
          )}
        </section>

        {/* How It Works Section */}
        <section className="py-10 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-wider bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Panduan Mahasiswa
            </span>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-3">
              3 Langkah Mudah Menemukan Beasiswa
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Cara efisien mendapatkan informasi beasiswa di Politeknik Negeri Lampung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                title: 'Jelajahi & Cari',
                desc: 'Gunakan fitur pencarian dan filter status untuk menemukan program beasiswa yang sesuai dengan kriteria studi Anda.',
              },
              {
                step: '02',
                title: 'Periksa Matriks Persyaratan',
                desc: 'Buka detail program untuk melihat daftar persyaratan wajib, dokumen administratif, serta tenggat jadwal pembukaan.',
              },
              {
                step: '03',
                title: 'Akses Pendaftaran Resmi',
                desc: 'Klik tautan eksternal resmi untuk mendaftar langsung pada portal instansi atau yayasan mitra beasiswa.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black text-primary/30 block mb-2">{item.step}</span>
                  <h3 className="text-base font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-10 border-t border-slate-200">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-wider bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              Bantuan & Informasi
            </span>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-3">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqItems.map((faq, index) => {
              const isOpen = Boolean(faqOpen[index]);
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-slate-800 hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
