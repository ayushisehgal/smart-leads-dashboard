import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { Lead, LeadFilters, PaginationMeta } from '../types';
import { useDebounce } from './useDebounce';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LeadFilters>({
    status: '', source: '', search: '', sort: 'latest', page: 1,
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {
        sort: filters.sort,
        page: filters.page,
        limit: 10,
      };
      if (filters.status) params.status = filters.status;
      if (filters.source) params.source = filters.source;
      if (debouncedSearch) params.search = debouncedSearch;

      const { data } = await api.get('/leads', { params });
      setLeads(data.data);
      setMeta(data.meta);
    } catch {
      setError('Failed to fetch leads');
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, filters.source, filters.sort, filters.page, debouncedSearch]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateFilter = (key: keyof LeadFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : Number(value),
    }));
  };

  return { leads, meta, isLoading, error, filters, updateFilter, refetch: fetchLeads };
};