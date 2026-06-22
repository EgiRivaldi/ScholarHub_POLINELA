import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Landmark, Building, GraduationCap, Globe, BookOpen } from 'lucide-react';

const iconMap = {
  pemerintah: Landmark,
  swasta: Building,
  internal: GraduationCap,
  internasional: Globe,
};

const CategoryIcon = ({ name, className }) => {
  const Icon = iconMap[name?.toLowerCase()] || BookOpen;
  return <Icon className={className} />;
};

export default function CategoryCard({ category, isSelected, onClick }) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Normalized position from -0.5 to 0.5
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (x - xc) / xc; // -1 to 1
    const dy = (y - yc) / yc; // -1 to 1

    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    e.currentTarget.style.setProperty('--tilt-x', `${dy * -8}deg`);
    e.currentTarget.style.setProperty('--tilt-y', `${dx * 8}deg`);
    e.currentTarget.style.setProperty('--shift-x', `${dx * 8}px`);
    e.currentTarget.style.setProperty('--shift-y', `${dy * 8}px`);
    e.currentTarget.style.setProperty('--y-offset', '-6px');
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.setProperty('--tilt-x', '0deg');
    e.currentTarget.style.setProperty('--tilt-y', '0deg');
    e.currentTarget.style.setProperty('--shift-x', '0px');
    e.currentTarget.style.setProperty('--shift-y', '0px');
    e.currentTarget.style.setProperty('--y-offset', '0px');
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(category)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      className="group relative flex flex-col items-center text-center w-full cursor-pointer focus:outline-none"
    >
      {/* Outer dynamic blurry edge glow */}
      {!isSelected && (
        <div
          className="glass-ios-edge-glow opacity-0 group-hover:opacity-100"
          style={{
            transform: 'translate3d(var(--shift-x, 0px), var(--shift-y, 0px), 0)',
          }}
        />
      )}

      {/* Main glass content panel with tilt */}
      <div
        className={cn(
          'flex flex-col items-center gap-4.5 p-6 rounded-[24px] border transition-all duration-300 w-full',
          isSelected
            ? 'bg-gradient-to-tr from-[#6200EE] to-[#7C3AED] text-white border-indigo-500/50 shadow-lg shadow-indigo-600/30'
            : 'glass-ios glass-ios-shine border-white/60 group-hover:bg-white/55 group-hover:border-[#6200EE]/30 group-hover:shadow-[0_12px_28px_rgba(98,0,238,0.06)]'
        )}
        style={{
          transform: 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(var(--y-offset, 0px))',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s, border-color 0.3s, box-shadow 0.3s',
        }}
      >
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-[14px] transition-all duration-300',
            isSelected ? 'bg-white/20 shadow-inner' : 'bg-primary/10 border border-white/40 group-hover:scale-105 group-hover:bg-primary/20'
          )}
        >
          <CategoryIcon
            name={category.nama_kategori}
            className={cn(
              'h-5 w-5 transition-colors duration-300',
              isSelected ? 'text-white' : 'text-[#6200EE]'
            )}
          />
        </div>
        <div>
          <h3 className={cn(
            'text-xs sm:text-sm font-bold tracking-tight transition-colors duration-200',
            isSelected ? 'text-white' : 'text-slate-800 group-hover:text-primary'
          )}>
            {category.nama_kategori}
          </h3>
          <p className={cn(
            'text-[10px] mt-1.5 font-black uppercase tracking-wider',
            isSelected ? 'text-white/70' : 'text-slate-400'
          )}>
            {category.jumlah_beasiswa} beasiswa
          </p>
        </div>
      </div>
    </motion.button>
  );
}
