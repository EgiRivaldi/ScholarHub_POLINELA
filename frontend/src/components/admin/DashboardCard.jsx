import { cn } from '@/lib/utils';

export default function DashboardCard({ title, value, icon: Icon, color = 'primary' }) {
  const colorClasses = {
    primary: {
      bg: 'bg-blue-50 text-[#00478f] border border-blue-100',
      accent: 'border-t-4 border-t-[#00478f]',
    },
    secondary: {
      bg: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      accent: 'border-t-4 border-t-emerald-600',
    },
    success: {
      bg: 'bg-sky-50 text-sky-700 border border-sky-100',
      accent: 'border-t-4 border-t-sky-600',
    },
    warning: {
      bg: 'bg-amber-50 text-amber-700 border border-amber-100',
      accent: 'border-t-4 border-t-amber-500',
    },
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <div
      className={cn(
        'relative bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs transition-all hover:shadow-md hover:-translate-y-0.5',
        colors.accent
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black text-slate-900 mt-1.5 tracking-tight">{value}</p>
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', colors.bg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
