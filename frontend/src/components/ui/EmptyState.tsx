import React from 'react';

export const EmptyState: React.FC<{ message?: string }> = ({ message = 'No leads found' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
    <svg className="h-12 w-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <p className="text-sm">{message}</p>
  </div>
);