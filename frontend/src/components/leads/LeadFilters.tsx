import React from 'react';
import { LeadFilters as IFilters } from '../../types';

interface Props {
  filters: IFilters;
  onFilterChange: (key: keyof IFilters, value: string) => void;
}

export const LeadFilters: React.FC<Props> = ({ filters, onFilterChange }) => (
  <div className="flex flex-col sm:flex-row gap-3 mb-6">
    <input
      type="text"
      placeholder="Search by name or email..."
      value={filters.search}
      onChange={e => onFilterChange('search', e.target.value)}
      className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
    />
    <select value={filters.status} onChange={e => onFilterChange('status', e.target.value)}
      className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm outline-none">
      <option value="">All Statuses</option>
      {['New', 'Contacted', 'Qualified', 'Lost'].map(s => <option key={s}>{s}</option>)}
    </select>
    <select value={filters.source} onChange={e => onFilterChange('source', e.target.value)}
      className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm outline-none">
      <option value="">All Sources</option>
      {['Website', 'Instagram', 'Referral'].map(s => <option key={s}>{s}</option>)}
    </select>
    <select value={filters.sort} onChange={e => onFilterChange('sort', e.target.value)}
      className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm outline-none">
      <option value="latest">Latest</option>
      <option value="oldest">Oldest</option>
    </select>
  </div>
);