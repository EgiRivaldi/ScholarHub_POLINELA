import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Landmark, Building, GraduationCap, Globe, BookOpen } from 'lucide-react';
import { gsap } from 'gsap';

const iconMap = {
  pemerintah: Landmark,
  swasta: Building,
  internal: GraduationCap,
  internasional: Globe,
  bumn: Building,
};

const CategoryIcon = ({ name, className }) => {
  const Icon = iconMap[name?.toLowerCase()] || BookOpen;
  return <Icon className={className} />;
};

export default function CategoryCard({ category, isSelected, onClick }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const element = cardRef.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const handleMouseMove = (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(element, {
          rotationY: (x / rect.width) * 12,
          rotationX: -(y / rect.height) * 12,
          y: -4,
          transformPerspective: 800,
          transformOrigin: 'center center',
          ease: 'power2.out',
          duration: 0.35,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          rotationY: 0,
          rotationX: 0,
          y: 0,
          ease: 'elastic.out(1, 0.4)',
          duration: 0.8,
        });
      };

      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, element);

    return () => ctx.revert();
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => onClick?.(category)}
      className={cn(
        'group flex flex-col items-center text-center p-5 rounded-2xl border transition-colors w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 will-change-transform shadow-xs',
        isSelected
          ? 'bg-primary text-white border-primary shadow-md'
          : 'bg-white text-slate-800 border-slate-200/90 hover:border-primary/50'
      )}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-2xl mb-3 transition-colors shadow-2xs',
          isSelected ? 'bg-white/20 text-white' : 'bg-purple-50 text-primary group-hover:bg-purple-100/80 border border-purple-100'
        )}
      >
        <CategoryIcon name={category.nama_kategori} className="h-6 w-6" />
      </div>

      <h3 className="text-xs sm:text-sm font-bold tracking-tight line-clamp-1">
        {category.nama_kategori}
      </h3>
      <p
        className={cn(
          'text-[10px] mt-1 font-bold uppercase tracking-wider',
          isSelected ? 'text-white/80' : 'text-slate-400'
        )}
      >
        {category.total_beasiswa !== undefined ? category.total_beasiswa : (category.jumlah_beasiswa || 0)} Beasiswa
      </p>
    </button>
  );
}
