
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lead } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { LeadModal } from './LeadModal';

interface Props {
  leads: Lead[];
  onRefetch: () => void;
}

export const LeadsTable: React.FC<Props> = ({ leads, onRefetch }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editLead, setEditLead] = useState<Lead | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      onRefetch();
    } catch {
      alert('Failed to delete lead');
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map(h => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {leads.map(lead => (
              <tr
                key={lead._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                  {lead.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                  {lead.email}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3">
                  <SourceBadge source={lead.source} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/leads/${lead._id}`)}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 text-xs font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setEditLead(lead)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs font-medium"
                    >
                      Edit
                    </button>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 text-xs font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editLead && (
        <LeadModal
          lead={editLead}
          onClose={() => setEditLead(null)}
          onSave={onRefetch}
        />
      )}
    </>
  );
};