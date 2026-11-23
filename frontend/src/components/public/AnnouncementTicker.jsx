import { useState, useEffect } from 'react';
import { Megaphone, ExternalLink, X } from 'lucide-react';
import { getPublicAnnouncements, getPublicSettings } from '@/services/api';

export default function AnnouncementTicker() {
  const [announcements, setAnnouncements] = useState([]);
  const [settings, setSettings] = useState({});
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [announcementsData, settingsData] = await Promise.all([
          getPublicAnnouncements(),
          getPublicSettings(),
        ]);
        if (isMounted) {
          setAnnouncements(announcementsData || []);
          setSettings(settingsData || {});
        }
      } catch (err) {
        console.error('Failed to load announcements ticker:', err);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Check if announcement ticker is enabled or dismissed
  const isEnabled = settings.pengumuman_bergerak_aktif !== false;
  if (!isEnabled || announcements.length === 0 || isDismissed) {
    return null;
  }

  // Render repetitive list items for infinite loop marquee
  const renderMarqueeList = () => (
    <div className="flex items-center space-x-12 px-6 shrink-0">
      {announcements.map((item, idx) => (
        <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-3 shrink-0">
          <span className="font-bold text-white tracking-wide">{item.judul}</span>
          {item.isi_pengumuman && (
            <>
              <span className="text-white/40 hidden sm:inline">—</span>
              <span className="text-white/90 font-normal hidden sm:inline max-w-md truncate">
                {item.isi_pengumuman}
              </span>
            </>
          )}
          {item.url_tujuan && (
            <a
              href={item.url_tujuan}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-amber-200 text-[11px] font-bold underline transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Info Lengkap</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          )}
          <span className="text-amber-300 font-bold ml-6">✦</span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="relative z-40 bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 text-white text-xs py-2 shadow-sm border-b border-white/10 overflow-hidden select-none"
      role="region"
      aria-label="Pengumuman Berjalan"
    >
      <div className="flex items-center w-full">
        {/* Left Fixed Badge */}
        <div className="flex items-center gap-2 pl-4 pr-3 py-0.5 bg-gradient-to-r from-violet-800 to-transparent z-20 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[11px] font-bold tracking-wider uppercase shadow-xs border border-white/20">
            <Megaphone className="h-3 w-3 text-amber-300 animate-pulse" />
            <span>Pengumuman</span>
          </span>
        </div>

        {/* Continuous Smooth Running Marquee */}
        <div className="flex-1 overflow-hidden relative group">
          <div
            className="flex w-max hover:[animation-play-state:paused]"
            style={{
              animation: 'footer-scroll-marquee 30s linear infinite',
            }}
          >
            {renderMarqueeList()}
            {renderMarqueeList()}
            {renderMarqueeList()}
          </div>
        </div>

        {/* Right Close Button */}
        <div className="pr-4 pl-3 py-0.5 bg-gradient-to-l from-indigo-900 to-transparent z-20 shrink-0">
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/15 transition-colors"
            title="Tutup pengumuman"
            aria-label="Tutup pengumuman"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
