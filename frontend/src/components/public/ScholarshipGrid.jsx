import ScholarshipCard from './ScholarshipCard';
import { SearchX } from 'lucide-react';

export default function ScholarshipGrid({ scholarships, columns = 3 }) {
  if (!scholarships || scholarships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-4">
          <SearchX className="h-7 w-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          Tidak Ada Program Beasiswa Ditemukan
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
          Tidak ada data beasiswa yang cocok dengan kriteria pencarian atau filter yang dipilih. Silakan ubah kata kunci atau reset filter.
        </p>
      </div>
    );
  }

  const gridColsClass =
    columns === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${gridColsClass} gap-5 sm:gap-6`}>
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
