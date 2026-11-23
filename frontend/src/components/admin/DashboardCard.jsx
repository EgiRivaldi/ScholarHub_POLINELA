import { cn } from '@/lib/utils';

export default function DashboardCard({ title, value, icon: Icon, color = 'primary' }) {
  const colorClasses = {
    primary: {
      bg: 'bg-purple-50 text-primary',
      accent: 'border-l-4 border-l-primary',
    },
    secondary: {
      bg: 'bg-emerald-50 text-emerald-700',
      accent: 'border-l-4 border-l-emerald-600',
    },
    success: {
      bg: 'bg-emerald-50 text-emerald-700',
      accent: 'border-l-4 border-l-emerald-600',
    },
    warning: {
      bg: 'bg-amber-50 text-amber-700',
      accent: 'border-l-4 border-l-amber-500',
    },
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <div
      className={cn(
        'relative bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs transition-shadow hover:shadow-sm',
        colors.accent
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{value}</p>
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', colors.bg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
