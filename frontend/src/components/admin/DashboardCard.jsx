import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function DashboardCard({ title, value, icon: Icon, color = 'primary', index = 0 }) {
  const colorClasses = {
    primary: {
      bg: 'bg-primary/10 border border-primary/20 text-primary',
      icon: 'text-primary',
      accent: 'bg-gradient-to-r from-primary to-primary-light',
    },
    secondary: {
      bg: 'bg-secondary/10 border border-secondary/20 text-secondary-dark',
      icon: 'text-secondary-dark',
      accent: 'bg-gradient-to-r from-secondary to-secondary-light',
    },
    success: {
      bg: 'bg-emerald-500/10 border border-emerald-200/40 text-emerald-600',
      icon: 'text-emerald-600',
      accent: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    },
    warning: {
      bg: 'bg-amber-500/10 border border-amber-200/40 text-amber-600',
      icon: 'text-amber-600',
      accent: 'bg-gradient-to-r from-amber-500 to-yellow-400',
    },
  };

  const colors = colorClasses[color] || colorClasses.primary;

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
    e.currentTarget.style.setProperty('--tilt-x', `${dy * -6}deg`); // Max tilt 6deg
    e.currentTarget.style.setProperty('--tilt-y', `${dx * 6}deg`);
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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      className="group relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Outer dynamic blurry edge glow */}
      <div
        className="glass-ios-edge-glow opacity-0 group-hover:opacity-100"
        style={{
          transform: 'translate3d(var(--shift-x, 0px), var(--shift-y, 0px), 0)',
        }}
      />

      {/* Main glass content panel with tilt */}
      <div
        className="relative z-10 overflow-hidden glass-ios glass-ios-shine rounded-[24px] border-slate-200/50 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white"
        style={{
          transform: 'perspective(1000px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(var(--y-offset, 0px))',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s, box-shadow 0.3s',
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-black text-slate-800 mt-2.5 tracking-tight text-glow">{value}</p>
          </div>
          <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl shadow-sm', colors.bg)}>
            <Icon className={cn('h-5.5 w-5.5', colors.icon)} />
          </div>
        </div>

        {/* Accent bar */}
        <div className={cn('absolute bottom-0 left-0 right-0 h-[3px] opacity-75', colors.accent)} />
      </div>
    </motion.div>
  );
}
