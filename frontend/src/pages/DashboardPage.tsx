import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLeads } from '../hooks/useLeads';
import { LeadFilters } from '../components/leads/LeadFilters';
import { LeadsTable } from '../components/leads/LeadsTable';
import { Pagination } from '../components/leads/Pagination';
import { LeadModal } from '../components/leads/LeadModal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { EmptyState } from '../components/ui/EmptyState';
import { LeadFilters as IFilters } from '../types';
import api from '../api/axios';

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { leads, meta, isLoading, error, filters, updateFilter, refetch } = useLeads();
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(prev => !prev);
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/leads/export', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch { alert('Export failed'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Smart Leads</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.name} · <span className="capitalize">{user?.role}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleDark} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={logout} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Leads</h2>
            {meta && <p className="text-sm text-gray-500 dark:text-gray-400">{meta.total} total leads</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={handleExport}
              className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Export CSV
            </button>
            <button onClick={() => setShowModal(true)}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
              + New Lead
            </button>
          </div>
        </div>

        <LeadFilters filters={filters} onFilterChange={(key: keyof IFilters, value: string) => updateFilter(key, value)} />

        {isLoading ? (
          <div className="py-20"><LoadingSpinner size="lg" /></div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : leads.length === 0 ? (
          <EmptyState message="No leads match your filters" />
        ) : (
          <>
            <LeadsTable leads={leads} onRefetch={refetch} />
            {meta && <Pagination meta={meta} onPageChange={page => updateFilter('page', page)} />}
          </>
        )}
      </main>

      {showModal && <LeadModal onClose={() => setShowModal(false)} onSave={refetch} />}
    </div>
  );
};