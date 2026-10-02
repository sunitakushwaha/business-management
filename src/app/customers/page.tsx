'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { CustomerModal } from '@/components/crm/CustomerModal';
import { fetchCustomers, saveCustomer, deleteCustomer } from '@/lib/services/crm';
import { Customer, CustomerCategory } from '@/types/database';
import {
  Plus,
  Users,
  Phone,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  Edit2,
  Trash2,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | CustomerCategory>('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await fetchCustomers();
      setCustomers(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const triggerSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // KPIs
  const stats = useMemo(() => {
    const total = customers.length;
    const highValue = customers.filter((c) => c.category === 'high_value').length;
    const regular = customers.filter((c) => c.category === 'regular').length;
    const atRisk = customers.filter((c) => c.category === 'at_risk').length;
    return { total, highValue, regular, atRisk };
  }, [customers]);

  // Filtered
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone && c.phone.includes(searchQuery)) ||
        (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = categoryFilter === 'all' || c.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [customers, searchQuery, categoryFilter]);

  const handleSaveCustomer = async (
    data: Omit<Customer, 'id' | 'created_at'>,
    id?: string
  ) => {
    const saved = await saveCustomer(data, id);
    if (id) {
      setCustomers((prev) => prev.map((c) => (c.id === id ? saved : c)));
      triggerSuccess(`Updated customer "${saved.name}".`);
    } else {
      setCustomers((prev) => [saved, ...prev]);
      triggerSuccess(`Added customer "${saved.name}".`);
    }
  };

  const handleDeleteCustomer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove customer "${name}"?`)) return;
    await deleteCustomer(id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    triggerSuccess(`Removed customer "${name}".`);
  };

  return (
    <AppShell title="Customer CRM">
      <div className="space-y-6">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Customer Directory & CRM
            </h2>
            <p className="text-sm text-slate-500">
              Manage client relationships, contact profiles, and value tiers.
            </p>
          </div>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => {
              setCustomerToEdit(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>

        {/* Success Alert */}
        {actionSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5 animate-in fade-in duration-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Clients"
            value={`${stats.total} Profiles`}
            description="Registered client base"
            icon={<Users className="w-5 h-5" />}
          />
          <StatCard
            title="High Value (VIP)"
            value={`${stats.highValue} Clients`}
            description="Frequent wholesale buyers"
            icon={<UserCheck className="w-5 h-5 text-emerald-600" />}
            trend={{ value: 'Top revenue segment', isPositive: true }}
          />
          <StatCard
            title="Regular Buyers"
            value={`${stats.regular} Clients`}
            description="Standard retail customers"
            icon={<Users className="w-5 h-5 text-indigo-500" />}
          />
          <StatCard
            title="At Risk / Inactive"
            value={`${stats.atRisk} Clients`}
            description="Require follow-up outreach"
            icon={<AlertTriangle className="w-5 h-5 text-rose-500" />}
          />
        </div>

        {/* Search & Filter Bar */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search customers by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    categoryFilter === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({customers.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('high_value')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    categoryFilter === 'high_value'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  High Value
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('regular')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    categoryFilter === 'regular'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Regular
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryFilter('at_risk')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    categoryFilter === 'at_risk'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  At Risk
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Client Profiles</CardTitle>
                <CardDescription>
                  Customer records synchronized with Supabase customers table
                </CardDescription>
              </div>
              <Badge variant="info">{filteredCustomers.length} Showing</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center text-sm text-slate-400">
                Loading customer profiles...
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={<Users className="w-8 h-8" />}
                  title="No customers found"
                  description="No client records match your search or filter."
                  actionLabel="Add Customer"
                  onAction={() => {
                    setCustomerToEdit(null);
                    setIsModalOpen(true);
                  }}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="px-5 py-3">Customer Name</th>
                      <th className="px-5 py-3">Contact</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Relationship Notes</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredCustomers.map((cust) => (
                      <tr
                        key={cust.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <span>{cust.name}</span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500">
                          <div className="flex flex-col text-xs gap-0.5">
                            {cust.phone && (
                              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                                <Phone className="w-3 h-3 text-slate-400" /> {cust.phone}
                              </span>
                            )}
                            {cust.email && (
                              <span className="flex items-center gap-1 text-slate-400">
                                <Mail className="w-3 h-3 text-slate-400" /> {cust.email}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge
                            variant={
                              cust.category === 'high_value'
                                ? 'success'
                                : cust.category === 'at_risk'
                                ? 'danger'
                                : 'neutral'
                            }
                          >
                            {cust.category.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-slate-500 max-w-xs truncate">
                          {cust.notes || '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setCustomerToEdit(cust);
                                setIsModalOpen(true);
                              }}
                              title="Edit customer"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                              title="Delete customer"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal */}
        <CustomerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCustomer}
          customerToEdit={customerToEdit}
        />
      </div>
    </AppShell>
  );
}
