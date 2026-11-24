import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, User, ExternalLink, Megaphone, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnnouncementSidebar({ announcements = [], loading = false }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const formatShortDate = (dateStr) => {
    if (!dateStr) return 'Terbaru';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Terbaru';
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  };

  return (
    <>
      <aside className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-5 sm:p-6 text-slate-900">
        {/* Header Tab ala POLINELA: Tab kotak biru dengan garis bawah tebal */}
        <div className="border-b-2 border-[#00478f] mb-6 flex items-end justify-between">
          <div className="inline-flex items-center gap-2 bg-[#00478f] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider px-4 py-2">
            <Megaphone className="h-3.5 w-3.5" />
            <span>PENGUMUMAN</span>
          </div>
          {announcements.length > 0 && (
            <span className="text-[11px] font-bold text-slate-400 pb-1.5">
              {announcements.length} Info
            </span>
          )}
        </div>

        {/* Content List */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2.5 animate-pulse pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="h-5 w-24 bg-slate-100 rounded" />
                <div className="h-5 w-full bg-slate-100 rounded" />
                <div className="h-3.5 w-40 bg-slate-100 rounded" />
                <div className="h-12 w-full bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">
            Belum ada pengumuman aktif saat ini.
          </div>
        ) : (
          <div className="divide-y divide-slate-200/80 space-y-2">
            {announcements.map((item) => {
              const displayDate = formatShortDate(item.mulai_tayang || item.dibuat_pada);
              const authorName = item.pembuat_nama || 'humas polinela';

              return (
                <article
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="announcement-item-interactive p-3 -mx-2 group cursor-pointer select-none"
                >
                  {/* Badge Hijau "Pengumuman" */}
                  <div className="mb-2 flex items-center justify-between">
                    <span className="inline-block bg-[#15803d] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-xs tracking-wide">
                      Pengumuman
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-[#00478f] group-hover:translate-x-0.5 transition-all">
                      <Eye className="h-3 w-3" />
                      <span>Baca Detail →</span>
                    </span>
                  </div>

                  {/* Judul Pengumuman dengan Garis Bawah Biru Otomatis dari Kiri ke Kanan */}
                  <h3 className="text-base sm:text-[17px] font-bold text-slate-800 leading-snug mb-2">
                    <span className="announcement-title-underline">
                      {item.judul}
                    </span>
                  </h3>

                  {/* Metadata: Tanggal & Penulis */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium mb-2.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{displayDate}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>{authorName}</span>
                    </span>
                  </div>

                  {/* Isi Ringkasan Pengumuman */}
                  {item.isi_pengumuman && (
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed line-clamp-3">
                      {item.isi_pengumuman}
                    </p>
                  )}

                  {/* Tautan Eksternal bila ada */}
                  {item.url_tujuan && (
                    <a
                      href={item.url_tujuan}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 mt-2.5 text-xs font-bold text-[#00478f] hover:underline"
                    >
                      <span>Buka Tautan Terkait</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </aside>

      {/* Pop-up Detail Pengumuman Modal (Rendered via Portal at document.body with isolate and max z-index) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedItem && (
              <div
                onClick={() => setSelectedItem(null)}
                className="fixed inset-0 z-[99999] isolate flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 12 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
                >
                  {/* Modal Header */}
                  <div className="bg-[#002b5c] text-white px-6 py-4 flex items-center justify-between border-b-2 border-[#00478f]">
                    <div className="flex items-center gap-2">
                      <span className="inline-block bg-[#15803d] text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-xs uppercase tracking-wider">
                        Pengumuman Resmi
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedItem(null)}
                      className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      aria-label="Tutup"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                      {selectedItem.judul}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold pb-3 border-b border-slate-100">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#00478f]" />
                        <span>{formatShortDate(selectedItem.mulai_tayang || selectedItem.dibuat_pada)}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-[#00478f]" />
                        <span>{selectedItem.pembuat_nama || 'humas polinela'}</span>
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {selectedItem.isi_pengumuman}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedItem(null)}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Tutup
                      </button>
                      {selectedItem.url_tujuan && (
                        <a
                          href={selectedItem.url_tujuan}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00478f] hover:bg-[#003366] text-white text-xs font-bold shadow-xs transition-colors"
                        >
                          <span>Kunjungi Tautan Resmi</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
