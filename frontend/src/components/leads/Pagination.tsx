import React from 'react';
import { PaginationMeta } from '../../types';

interface Props { meta: PaginationMeta; onPageChange: (page: number) => void; }

export const Pagination: React.FC<Props> = ({ meta, onPageChange }) => {
  const { page, totalPages, total, limit } = meta;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-600 dark:text-gray-400">Showing {start}–{end} of {total} leads</p>
      <div className="flex gap-2">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
          Previous
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = Math.max(1, page - 2) + i;
          if (p > totalPages) return null;
          return (
            <button key={p} onClick={() => onPageChange(p)}
              className={`px-3 py-1.5 text-sm rounded-lg border ${p === page ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
              {p}
            </button>
          );
        })}
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
          Next
        </button>
      </div>
    </div>
  );
};