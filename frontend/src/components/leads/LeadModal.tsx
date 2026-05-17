import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, LeadSource } from '../../types';
import api from '../../api/axios';

interface Props {
  lead?: Lead | null;
  onClose: () => void;
  onSave: () => void;
}

export const LeadModal: React.FC<Props> = ({ lead, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: '', email: '', status: 'New' as LeadStatus, source: 'Website' as LeadSource,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (lead) setForm({ name: lead.name, email: lead.email, status: lead.status, source: lead.source });
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required'); return; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setError('Valid email is required'); return; }
    setIsLoading(true);
    try {
      if (lead) { await api.put(`/leads/${lead._id}`, form); }
      else { await api.post('/leads', form); }
      onSave();
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{lead ? 'Edit Lead' : 'New Lead'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg px-4 py-2">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input type="text" placeholder="John Doe" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input type="email" placeholder="john@example.com" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as LeadStatus }))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              {['New', 'Contacted', 'Qualified', 'Lost'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
            <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value as LeadSource }))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              {['Website', 'Instagram', 'Referral'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-60">
              {isLoading ? 'Saving...' : lead ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};