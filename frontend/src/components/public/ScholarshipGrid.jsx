import ScholarshipCard from './ScholarshipCard';
import emptyStateImage from '@/assets/images/empty-state.png';

export default function ScholarshipGrid({ scholarships }) {
  if (!scholarships || scholarships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <img
          src={emptyStateImage}
          alt="No scholarships found"
          className="w-48 h-48 object-contain mb-6 opacity-80"
        />
        <h3 className="text-lg font-semibold text-text mb-2">
          No scholarships available
        </h3>
        <p className="text-sm text-text-secondary max-w-md">
          We couldn't find any scholarships matching your criteria. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scholarships.map((scholarship, index) => (
        <ScholarshipCard
          key={scholarship.id}
          scholarship={scholarship}
          index={index}
        />
      ))}
    </div>
  );
}
