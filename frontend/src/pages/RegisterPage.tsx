import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'sales' as UserRole });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setIsLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Registration failed');
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create account</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Get started with Smart Leads</p>
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg px-4 py-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Name', key: 'name', type: 'text' },
            { label: 'Email', key: 'email', type: 'email' },
            { label: 'Password', key: 'password', type: 'password' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input type={type} value={form[key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as UserRole }))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="sales">Sales User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-medium disabled:opacity-60">
            {isLoading ? 'Creating...' : 'Create account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};