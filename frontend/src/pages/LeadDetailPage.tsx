import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Lead } from '../types';
import { StatusBadge, SourceBadge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const { data } = await api.get(`/leads/${id}`);
        setLead(data.data);
      } catch {
        setError('Lead not found');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (error || !lead) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 mb-4">{error || 'Lead not found'}</p>
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline">Back to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/dashboard')}
          className="mb-6 text-sm text-blue-600 hover:underline flex items-center gap-1">
          ← Back to Dashboard
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Lead Details</h1>
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{lead.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
              <StatusBadge status={lead.status} />
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Source</span>
              <SourceBadge source={lead.source} />
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Created By</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{lead.createdBy?.name}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">Created At</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};