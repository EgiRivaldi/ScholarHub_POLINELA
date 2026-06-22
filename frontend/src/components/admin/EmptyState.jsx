import emptyStateImage from '@/assets/images/empty-state.png';

export default function EmptyState({
  title = 'No data available',
  description = 'There is nothing to display at the moment.',
  action,
  actionLabel = 'Add New',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <img
        src={emptyStateImage}
        alt="Empty state"
        className="w-40 h-40 object-contain mb-6 opacity-75"
      />
      <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>
      {action && (
        <button
          onClick={action}
          className="px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
