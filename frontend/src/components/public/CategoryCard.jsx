import { cn } from '@/lib/utils';

const CategoryOfficialLogo = ({ name, compact = false }) => {
  const key = (name || '').toLowerCase();
  const sizeClass = compact
    ? 'w-11 h-11 sm:w-12 sm:h-12 object-contain drop-shadow-xs'
    : 'w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-xs';
  const svgSizeClass = compact
    ? 'w-11 h-11 sm:w-12 sm:h-12 drop-shadow-xs'
    : 'w-14 h-14 sm:w-16 sm:h-16 drop-shadow-xs';

  // 1. Internal POLINELA — Official POLINELA Logo Image
  if (key.includes('internal') || key.includes('polinela')) {
    return (
      <img
        src="/images/polinela-logo.png"
        alt="Logo Resmi POLINELA"
        className={sizeClass}
      />
    );
  }

  // 2. Pemerintah — Lambang Tut Wuri Handayani (Kemdiktisaintek / Kemendikbudristek)
  if (key.includes('pemerintah')) {
    return (
      <svg viewBox="0 0 100 100" className={svgSizeClass}>
        {/* Segi Lima Biru Resmi */}
        <polygon
          points="50,5 94,36 77,90 23,90 6,36"
          fill="#005bac"
          stroke="#facc15"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <polygon
          points="50,11 88,38 73,84 27,84 12,38"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.35"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Sayap Garuda Emas & Obor Pendidikan (Tut Wuri Handayani Emblem) */}
        <path
          d="M50 20 L54 32 L68 28 L58 40 L72 44 L56 48 L64 58 L50 51 L36 58 L44 48 L28 44 L42 40 L32 28 L46 32 Z"
          fill="#facc15"
        />
        {/* Buku Terbuka Putih */}
        <path
          d="M31 58 C31 54, 43 54, 50 59 C57 54, 69 54, 69 58 L69 68 C69 64, 57 64, 50 69 C43 64, 31 64, 31 68 Z"
          fill="#ffffff"
        />
        {/* Pita Tut Wuri Handayani */}
        <path
          d="M24 75 Q50 82 76 75 L74 82 Q50 88 26 82 Z"
          fill="#facc15"
        />
      </svg>
    );
  }

  // 3. BUMN — Official BUMN Logo Image
  if (key.includes('bumn')) {
    return (
      <img
        src="/images/bumn-logo.png"
        alt="Logo Resmi BUMN"
        className={sizeClass}
      />
    );
  }

  // 4. Swasta & Yayasan — Djarum Beasiswa Plus / Corporate Foundation Crest
  if (key.includes('swasta') || key.includes('yayasan')) {
    return (
      <svg viewBox="0 0 100 100" className={svgSizeClass}>
        <defs>
          <linearGradient id="corpShield" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#002b5c" />
            <stop offset="100%" stopColor="#00478f" />
          </linearGradient>
        </defs>
        {/* Shield Crest */}
        <path
          d="M50 8 L86 22 L86 50 C86 72, 68 86, 50 93 C32 86, 14 72, 14 50 L14 22 Z"
          fill="url(#corpShield)"
          stroke="#38bdf8"
          strokeWidth="3"
        />
        {/* Djarum Beasiswa Plus / Foundation Ribbon & Star Mark */}
        <polygon points="50,22 66,38 50,54 34,38" fill="#38bdf8" />
        <polygon points="50,28 60,38 50,48 40,38" fill="#ffffff" />
        <path d="M28 56 L50 72 L72 56 L72 65 L50 81 L28 65 Z" fill="#facc15" />
      </svg>
    );
  }

  // 5. Internasional — IISMA / Global Scholarship Crest
  return (
    <svg viewBox="0 0 100 100" className={svgSizeClass}>
      <circle cx="50" cy="50" r="43" fill="#00478f" stroke="#facc15" strokeWidth="3.5" />
      <circle cx="50" cy="48" r="24" fill="none" stroke="#ffffff" strokeWidth="2.2" />
      <ellipse cx="50" cy="48" rx="12" ry="24" fill="none" stroke="#ffffff" strokeWidth="2" />
      <line x1="26" y1="48" x2="74" y2="48" stroke="#ffffff" strokeWidth="2" />
      <line x1="30" y1="36" x2="70" y2="36" stroke="#ffffff" strokeWidth="1.6" />
      <line x1="30" y1="60" x2="70" y2="60" stroke="#ffffff" strokeWidth="1.6" />
      <path
        d="M22 68 C32 84, 68 84, 78 68"
        fill="none"
        stroke="#facc15"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <text
        x="50"
        y="86"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="7"
        fontWeight="900"
        fontFamily="Arial, sans-serif"
        letterSpacing="1"
      >
        GLOBAL
      </text>
    </svg>
  );
};

export default function CategoryCard({ category, isSelected, onClick, compact = false }) {
  const count =
    category.total_beasiswa !== undefined
      ? category.total_beasiswa
      : category.jumlah_beasiswa || 0;

  const orbSizeClass = compact
    ? 'w-20 h-20 sm:w-22 sm:h-22 p-2'
    : 'w-28 h-28 sm:w-32 sm:h-32 p-2.5';

  return (
    <button
      type="button"
      onClick={() => onClick?.(category)}
      className={cn(
        'glass-orb-button group relative flex flex-col items-center text-center w-full cursor-pointer focus:outline-none',
        compact ? 'p-1' : 'p-2'
      )}
    >
      {/* Outer Circular Glass Shell + Floating Count Pill */}
      <div className={cn('relative', compact ? 'mb-2' : 'mb-3.5')}>
        {/* Outer Frosted Glass Ring with High-Contrast Blue-Slate Rim */}
        <div
          className={cn(
            'glass-shine-sweep relative overflow-hidden rounded-full flex items-center justify-center transition-all duration-300',
            orbSizeClass,
            isSelected
              ? 'bg-gradient-to-br from-blue-100/95 via-white/90 to-blue-200/80 backdrop-blur-xl border-2 border-[#00478f] shadow-[0_14px_30px_-4px_rgba(0,71,143,0.32),inset_0_2px_4px_rgba(255,255,255,1)] ring-4 ring-blue-200/70'
              : 'bg-gradient-to-br from-blue-100/75 via-slate-100/70 to-blue-200/55 group-hover:from-blue-100/95 group-hover:to-blue-200/80 backdrop-blur-lg border-[1.5px] border-blue-300/85 group-hover:border-[#00478f] shadow-[0_8px_20px_-4px_rgba(0,51,102,0.16),inset_0_2px_3px_rgba(255,255,255,0.95)] group-hover:shadow-[0_16px_32px_-4px_rgba(0,71,143,0.26)]'
          )}
        >
          {/* Inner Frosted Glass Pod (Clear separation from outer ring) */}
          <div
            className={cn(
              'w-full h-full rounded-full flex items-center justify-center transition-all duration-300',
              isSelected
                ? 'bg-white border-[1.5px] border-[#00478f]/30 shadow-[inset_0_2px_6px_rgba(0,71,143,0.12)]'
                : 'bg-gradient-to-b from-white via-white/95 to-blue-50/70 border-[1.5px] border-white shadow-[0_4px_10px_rgba(0,51,102,0.12),inset_0_2px_4px_rgba(255,255,255,1)] group-hover:border-blue-200'
            )}
          >
            <div className="glass-orb-logo flex items-center justify-center">
              <CategoryOfficialLogo name={category.nama_kategori} compact={compact} />
            </div>
          </div>
        </div>

        {/* Count Badge on Top-Right of the Circle */}
        <span
          className={cn(
            'absolute top-0 right-0 z-10 min-w-5 h-5 px-1.5 rounded-full text-[10px] font-extrabold flex items-center justify-center transition-all duration-300 pointer-events-none',
            isSelected
              ? 'bg-[#00478f] text-white border-2 border-white shadow-md scale-105'
              : 'bg-[#00478f] text-white border-2 border-white shadow-xs group-hover:scale-110'
          )}
        >
          {count}
        </span>
      </div>

      {/* Category Name & Program Count */}
      <h3
        className={cn(
          'text-xs font-black tracking-tight line-clamp-1 transition-colors',
          isSelected ? 'text-[#00478f]' : 'text-slate-800 group-hover:text-[#00478f]'
        )}
      >
        {category.nama_kategori}
      </h3>
      <p
        className={cn(
          'text-[10px] mt-0.5 font-bold uppercase tracking-wider transition-colors',
          isSelected ? 'text-[#00478f]/80' : 'text-slate-400 group-hover:text-slate-500'
        )}
      >
        {count} Program
      </p>
    </button>
  );
}
