import { motion } from 'framer-motion';
import { Search, RotateCcw, GraduationCap } from 'lucide-react';
import ScholarshipGrid from '@/components/public/ScholarshipGrid';
import AnnouncementSidebar from '@/components/public/AnnouncementSidebar';
import CategoryCard from '@/components/public/CategoryCard';

export default function Hero({
  searchQuery,
  setSearchQuery,
  selectedStatus = 'semua',
  setSelectedStatus,
  sortOption = 'terbaru',
  setSortOption,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  scholarships = [],
  announcements = [],
  loading = false,
  isFiltering = false,
  onResetFilters,
}) {
  const handleCategoryToggle = (category) => {
    setSelectedCategory?.((prev) => (prev?.id === category.id ? null : category));
  };

  return (
    <section
      id="scholarships"
      className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-24 min-h-[580px]"
    >
      {/* 1. Authentic POLINELA Campus Photo Background (Clear Building View with Soft Blue Tint) */}
      <div className="absolute inset-x-0 top-0 h-[400px] sm:h-[440px] z-0 overflow-hidden bg-slate-900">
        <img
          src="/images/polinela-campus.jpg"
          alt="Gedung Kampus Politeknik Negeri Lampung"
          className="w-full h-full object-cover object-center"
        />
        {/* Soft Translucent Navy Overlay so the Campus Building is Clearly Visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#002b5c]/60 via-[#003875]/55 to-slate-50" />
      </div>

      {/* 2. Main Hero Content: 2-Column Layout (Daftar Beasiswa Kiri + Pengumuman Kanan) */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="space-y-6"
        >
          {/* Hero Heading — Clean Official White & Blue Typography */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-bold mb-4 shadow-xs">
              <div className="h-5 w-5 rounded-full bg-white p-0.5 flex items-center justify-center shrink-0">
                <img
                  src="/images/polinela-logo.png"
                  alt="Logo POLINELA"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="tracking-wide text-white font-extrabold uppercase text-[11px]">
                Politeknik Negeri Lampung • Portal Beasiswa Resmi
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight max-w-3xl">
              Daftar Program Beasiswa
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-blue-100 mt-2.5 max-w-2xl font-normal">
              Daftar lengkap program beasiswa yang tersedia bagi mahasiswa Politeknik Negeri Lampung beserta pengumuman resmi terbaru.
            </p>
          </div>

          {/* Layout 2 Kolom: Kiri (Daftar Program Beasiswa) & Kanan (Sidebar Pengumuman ala polinela.ac.id) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Kolom Kiri (8 kolom): Filter & Daftar Kartu Program Beasiswa */}
            <div className="lg:col-span-8 space-y-6">
              {/* Filter & Control Bar */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 text-slate-900">
                {/* Header Tab ala POLINELA */}
                <div className="border-b-2 border-[#00478f] pb-0 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                  <div className="inline-flex items-center gap-2 bg-[#00478f] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider px-4 py-2 self-start">
                    <GraduationCap className="h-4 w-4" />
                    <span>DAFTAR PROGRAM BEASISWA</span>
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-[11px]">
                      {scholarships.length}
                    </span>
                  </div>

                  {/* Status Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 mb-2">
                    {[
                      { id: 'semua', label: 'Semua' },
                      { id: 'dibuka', label: 'Dibuka' },
                      { id: 'belum_dibuka', label: 'Segera' },
                      { id: 'ditutup', label: 'Ditutup' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedStatus?.(s.id)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          selectedStatus === s.id
                            ? 'bg-[#00478f] text-white shadow-2xs'
                            : 'text-slate-600 hover:text-[#00478f] hover:bg-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Glass Orb Icons inside Control Bar */}
                {categories.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Pilih Kategori Beasiswa:
                      </span>
                      {selectedCategory && (
                        <button
                          type="button"
                          onClick={() => setSelectedCategory?.(null)}
                          className="text-xs font-bold text-[#00478f] hover:underline cursor-pointer"
                        >
                          Tampilkan Semua Kategori ✕
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
                      {categories.map((cat) => (
                        <CategoryCard
                          key={cat.id}
                          category={cat}
                          isSelected={selectedCategory?.id === cat.id}
                          onClick={handleCategoryToggle}
                          compact
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-controls: Search & Sort */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery || ''}
                      onChange={(e) => setSearchQuery?.(e.target.value)}
                      placeholder="Cari nama beasiswa, mitra, atau syarat..."
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00478f]/20 focus:border-[#00478f]"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">Urutkan:</span>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption?.(e.target.value)}
                      className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#00478f]/20 focus:border-[#00478f] cursor-pointer w-full sm:w-auto"
                    >
                      <option value="terbaru">Terbaru Ditambahkan</option>
                      <option value="deadline">Batas Waktu Terdekat</option>
                      <option value="az">Nama Beasiswa (A-Z)</option>
                    </select>

                    {isFiltering && (
                      <button
                        onClick={onResetFilters}
                        className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer shrink-0"
                        title="Reset Filter"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Reset</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Scholarships Grid Cards (2 Columns inside Left 8-col area) */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse">
                      <div className="h-16 w-16 bg-slate-100 rounded-2xl" />
                      <div className="h-4 bg-slate-100 rounded w-1/3" />
                      <div className="h-5 bg-slate-100 rounded w-4/5" />
                      <div className="h-4 bg-slate-100 rounded w-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <ScholarshipGrid scholarships={scholarships} columns={2} />
              )}
            </div>

            {/* Kolom Kanan (4 kolom): Sidebar PENGUMUMAN ala polinela.ac.id */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <AnnouncementSidebar announcements={announcements} loading={loading} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
