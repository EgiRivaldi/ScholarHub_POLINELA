import { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Pencil,
  Trash2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import emptyStateImage from '@/assets/images/empty-state.png';

export default function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  searchPlaceholder = 'Cari...',
  pageSize = 5,
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  // Filter
  const filteredData = useMemo(() => {
    if (!debouncedSearch) return data;
    const query = debouncedSearch.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        return value && String(value).toLowerCase().includes(query);
      })
    );
  }, [data, debouncedSearch, columns]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey] ?? '';
      const bVal = b[sortKey] ?? '';
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [filteredData, sortKey, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-ios rounded-[24px] border-slate-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.03)] overflow-hidden bg-white"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-white/5 border border-slate-200 text-xs text-text placeholder:text-text-secondary focus:outline-none focus:bg-white/10 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200"
          />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0 ml-4">
          {sortedData.length} data
        </p>
      </div>

      {/* Table */}
      {paginatedData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest w-12">
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-700 transition-colors"
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable !== false && (
                        <ArrowUpDown className={cn(
                          'h-3 w-3 transition-colors',
                          sortKey === col.key ? 'text-primary' : 'text-slate-400'
                        )} />
                      )}
                    </div>
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-4 py-3 text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest w-28">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-4 py-3.5 text-slate-500 font-bold">
                    {(currentPage - 1) * pageSize + rowIndex + 1}
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3.5 text-slate-700 font-semibold">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-colors"
                            aria-label={`Edit`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-500/10 border border-transparent hover:border-rose-200/30 transition-colors"
                            aria-label={`Delete`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <img
            src={emptyStateImage}
            alt="No data"
            className="w-28 h-28 object-contain mb-4 opacity-50"
          />
          <h3 className="text-sm font-bold text-slate-800 mb-1">Data tidak ditemukan</h3>
          <p className="text-xs text-slate-400 font-medium">
            Silakan coba sesuaikan kata kunci pencarian Anda.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Halaman {currentPage} dari {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-slate-200"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-slate-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-slate-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-white/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-transparent hover:border-slate-200"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
