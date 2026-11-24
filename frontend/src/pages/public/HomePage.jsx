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
import {
  getScholarships,
  getCategories,
  getProviders,
  getPublicSettings,
  getPublicAnnouncements,
} from '@/services/api';
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
  const [announcements, setAnnouncements] = useState([]);
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
        const [scholarshipsData, categoriesData, providersData, settingsData, announcementsData] =
          await Promise.all([
            getScholarships({ limit: 100 }),
            getCategories(),
            getProviders(),
            getPublicSettings().catch(() => ({})),
            getPublicAnnouncements().catch(() => []),
          ]);
        setScholarships(scholarshipsData);
        setCategories(categoriesData);
        setSiteSettings(settingsData || {});
        setAnnouncements(announcementsData || []);
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
      q: 'Bagaimana cara mendaftar beasiswa di Sistem Informasi Beasiswa POLINELA?',
      a: 'Sistem Informasi Beasiswa POLINELA adalah portal informasi resmi. Anda dapat membuka kartu beasiswa untuk membaca seluruh persyaratan dan jadwal pendaftaran, kemudian klik tombol "Kunjungi Situs Resmi" untuk mendaftar langsung pada website resmi penyelenggara program.',
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

      {/* Hero Section: Daftar Program Beasiswa & Daftar Kartu + Pengumuman di Samping */}
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sortOption={sortOption}
        setSortOption={setSortOption}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        scholarships={filteredScholarships}
        announcements={announcements}
        loading={loading}
        isFiltering={isFiltering}
        onResetFilters={handleResetFilters}
        stats={stats}
        settings={siteSettings}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10 space-y-12">
        {/* FAQ Section: Sesuai Referensi Gambar (Header Tengah & Kartu Bernomor Halus) */}
        <section className="py-12 border-t border-slate-200">
          <div className="max-w-4xl mx-auto">
            {/* Header: BANTUAN & INFORMASI Pill + Title Tengah (Persis Gambar Referensi 1 & 3) */}
            <div className="flex flex-col items-center text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#00478f] text-xs font-black tracking-wider uppercase mb-3 shadow-2xs">
                BANTUAN & INFORMASI
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Pertanyaan yang Sering Diajukan
              </h2>
            </div>

            {/* Accordion Cards (Persis Gambar Referensi 2) */}
            <div className="space-y-4">
              {faqItems.map((faq, index) => {
                const isOpen = Boolean(faqOpen[index]);
                const numLabel = String(index + 1).padStart(2, '0');
                return (
                  <div
                    key={index}
                    onClick={() => toggleFaq(index)}
                    className={`rounded-2xl border transition-all duration-300 ease-out cursor-pointer overflow-hidden select-none ${
                      isOpen
                        ? 'bg-white border-2 border-[#00478f] shadow-lg shadow-blue-900/5'
                        : 'bg-white border-2 border-slate-100 hover:border-blue-200 hover:shadow-md'
                    }`}
                  >
                    <div className="p-5 sm:p-6 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isOpen
                              ? 'bg-[#00478f] text-white shadow-xs'
                              : 'bg-blue-50 text-[#00478f]'
                          }`}
                        >
                          {numLabel}
                        </span>
                        <span
                          className={`text-sm sm:text-base font-extrabold transition-colors duration-300 ${
                            isOpen ? 'text-[#00478f]' : 'text-slate-800'
                          }`}
                        >
                          {faq.q}
                        </span>
                      </div>

                      <span
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ease-out ${
                          isOpen
                            ? 'bg-[#00478f] text-white rotate-180 shadow-xs'
                            : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </div>

                    {/* Smooth Expand/Collapse with CSS Grid */}
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1 pl-18 sm:pl-20">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
