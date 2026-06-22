import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero from '@/components/public/Hero';
import CategoryCard from '@/components/public/CategoryCard';
import ScholarshipGrid from '@/components/public/ScholarshipGrid';
import AnimatedBackground from '@/components/public/AnimatedBackground';
import { getScholarships, getCategories, getProviders } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';

export default function HomePage() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [scholarships, setScholarships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    scholarshipsCount: 30,
    providersCount: 15,
    categoriesCount: 4,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // By default limit to 100 to emulate getting all, or backend might support larger limits
        const [scholarshipsData, categoriesData, providersData] = await Promise.all([
          getScholarships({ limit: 100 }),
          getCategories(),
          getProviders()
        ]);
        setScholarships(scholarshipsData);
        setCategories(categoriesData);
        setStats({
          scholarshipsCount: scholarshipsData.length,
          categoriesCount: categoriesData.length,
          providersCount: providersData.length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredScholarships = useMemo(() => {
    let results = scholarships;

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      results = results.filter(
        (s) =>
          (s.nama_beasiswa?.toLowerCase() || '').includes(query) ||
          (s.penyedia_nama?.toLowerCase() || '').includes(query) ||
          (s.deskripsi?.toLowerCase() || '').includes(query)
      );
    }

    if (selectedCategory) {
      results = results.filter((s) => s.kategori_id === selectedCategory.id);
    }

    return results;
  }, [debouncedSearch, selectedCategory, scholarships]);

  const handleCategoryClick = (category) => {
    setSelectedCategory((prev) =>
      prev?.id === category.id ? null : category
    );
  };

  const [faqOpen, setFaqOpen] = useState({});
  const toggleFaq = (index) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const faqItems = [
    { q: 'Bagaimana cara mendaftar beasiswa di ScholarHub?', a: 'ScholarHub POLINELA menyediakan informasi detail dan link pendaftaran resmi. Anda dapat mengklik tombol "Lihat Detail" pada kartu beasiswa untuk melihat syarat berkas, lalu klik "Kunjungi Situs Resmi" untuk mendaftar.' },
    { q: 'Apakah ada batas minimum IPK untuk mendaftar?', a: 'Ya, setiap beasiswa menetapkan kriteria IPK minimum yang bervariasi (mulai dari 3.00 hingga 3.30). Anda wajib memenuhi persyaratan tersebut sebelum mengajukan pendaftaran.' },
    { q: 'Siapa yang mengelola informasi beasiswa di portal ini?', a: 'Portal ini dikelola secara terpusat oleh Admin Politeknik Negeri Lampung untuk menyajikan data terverifikasi secara berkala bagi mahasiswa.' },
    { q: 'Apakah beasiswa yang sudah ditutup masih bisa diakses?', a: 'Informasi beasiswa yang telah melewati tenggat waktu (deadline) tetap dapat dilihat sebagai riwayat referensi, namun statusnya akan berubah menjadi "Tutup" dan pendaftaran tidak dapat diakses.' }
  ];

  const isSearchingOrFiltering = !!(debouncedSearch || selectedCategory);

  const latestScholarships = useMemo(() => {
    return [...scholarships]
      .sort((a, b) => b.id - a.id)
      .slice(0, 3);
  }, [scholarships]);

  const popularScholarships = useMemo(() => {
    return scholarships.slice(1, 4);
  }, [scholarships]);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />

      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        stats={stats}
      />

      {/* Main scholarships interactive anchor */}
      <div id="scholarships">
        {/* Categories */}
        <section className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                Jelajahi Berdasarkan Kategori
              </h2>
              <p className="text-sm text-slate-500 font-medium mb-8">
                Temukan beasiswa berdasarkan kategori penyelenggara.
              </p>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                >
                  <CategoryCard
                    category={category}
                    isSelected={selectedCategory?.id === category.id}
                    onClick={handleCategoryClick}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dynamic Results Grid or Default showcases */}
      {isSearchingOrFiltering ? (
        <section className="py-8 sm:py-12 pb-16 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4 }}
              className="flex items-end justify-between mb-8"
            >
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {selectedCategory
                    ? `Kategori Beasiswa: ${selectedCategory.nama_kategori}`
                    : 'Hasil Pencarian'}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Ditemukan {filteredScholarships.length} beasiswa
                </p>
              </div>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-sm text-primary font-bold hover:text-primary-dark hover:underline transition-colors"
                >
                  Hapus filter
                </button>
              )}
            </motion.div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ScholarshipGrid scholarships={filteredScholarships} />
            )}
          </div>
        </section>
      ) : (
        <>
          {/* Latest Scholarships */}
          <section className="py-8 sm:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Beasiswa Terbaru
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Program beasiswa paling baru yang ditambahkan di portal.
                </p>
              </div>
              <ScholarshipGrid scholarships={latestScholarships} />
            </div>
          </section>

          {/* Popular Scholarships */}
          <section className="py-8 sm:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Beasiswa Populer
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Program beasiswa yang paling banyak diminati oleh mahasiswa.
                </p>
              </div>
              <ScholarshipGrid scholarships={popularScholarships} />
            </div>
          </section>

          {/* How It Works */}
          <section className="py-12 sm:py-16 bg-slate-50/50 border-y border-slate-200/40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Cara Kerja Portal Beasiswa
                </h2>
                <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
                  4 langkah mudah untuk menemukan dan mendaftar beasiswa impian Anda di Politeknik Negeri Lampung.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: '01', title: 'Cari Beasiswa', desc: 'Jelajahi berbagai pilihan beasiswa berdasarkan kategori dan penyedia yang tersedia.' },
                  { step: '02', title: 'Periksa Kriteria', desc: 'Periksa persyaratan IPK minimum, semester minimum, dan berkas yang diperlukan.' },
                  { step: '03', title: 'Siapkan Berkas', desc: 'Lengkapi seluruh dokumen pendukung seperti KTP, KTM, dan transkrip nilai.' },
                  { step: '04', title: 'Kunjungi Tautan', desc: 'Gunakan tautan pendaftaran resmi penyedia beasiswa untuk mengajukan lamaran.' },
                ].map((item) => (
                  <div key={item.step} className="p-6 rounded-2xl bg-white border border-slate-200/50 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <span className="absolute top-2 right-4 text-5xl font-black text-slate-100 group-hover:text-primary/10 transition-colors">{item.step}</span>
                    <h3 className="text-base font-bold text-slate-800 mb-2 relative z-10">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed relative z-10">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ Accordion Section */}
          <section className="py-12 sm:py-16 pb-20 sm:pb-28">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Pertanyaan Umum (FAQ)
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Punya pertanyaan seputar program beasiswa? Temukan jawabannya di sini.
                </p>
              </div>

              <div className="space-y-4">
                {faqItems.map((item, idx) => {
                  const isOpen = !!faqOpen[idx];
                  return (
                    <div key={idx} className="border border-slate-200/60 rounded-2xl bg-white overflow-hidden shadow-sm hover:border-slate-300 transition-colors">
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-800 hover:text-primary transition-colors text-sm"
                      >
                        <span>{item.q}</span>
                        <span className="text-xl leading-none font-medium ml-4">{isOpen ? '−' : '+'}</span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed font-medium border-t border-slate-100 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      )}
      </div>
    </div>
  );
}
