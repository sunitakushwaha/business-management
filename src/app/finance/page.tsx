'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { FinanceEntryModal } from '@/components/finance/FinanceEntryModal';
import { fetchFinanceRecords, addFinanceRecord, FinanceRecord } from '@/lib/services/finance';
import {
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  Wallet,
} from 'lucide-react';

export default function FinancePage() {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense'>('income');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await fetchFinanceRecords();
      setRecords(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const triggerSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Deterministic financial summaries
  const totals = useMemo(() => {
    const totalIncome = records
      .filter((r) => r.type === 'income')
      .reduce((acc, r) => acc + r.amount, 0);

    const totalExpense = records
      .filter((r) => r.type === 'expense')
      .reduce((acc, r) => acc + r.amount, 0);

    const netBalance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, netBalance };
  }, [records]);

  // Categories list
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r) => set.add(r.category));
    return ['all', ...Array.from(set)];
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = typeFilter === 'all' || r.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [records, searchQuery, typeFilter, categoryFilter]);

  const handleAddRecord = async (newRec: {
    type: 'income' | 'expense';
    category: string;
    amount: number;
    description: string;
    date: string;
  }) => {
    const saved = await addFinanceRecord(newRec);
    setRecords((prev) => [saved, ...prev]);
    triggerSuccess(`Logged ${saved.type === 'income' ? 'income' : 'expense'} of ₹${saved.amount.toLocaleString()}.`);
  };

  return (
    <AppShell title="Finance & Ledger">
      <div className="space-y-6">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Financial Cash Flow
            </h2>
            <p className="text-sm text-slate-500">
              Deterministic operational ledger backed by PostgreSQL income & expenses tables.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300"
              onClick={() => {
                setModalType('income');
                setIsModalOpen(true);
              }}
            >
              <ArrowDownLeft className="w-4 h-4" />
              Add Income
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-rose-700 border-rose-300 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300"
              onClick={() => {
                setModalType('expense');
                setIsModalOpen(true);
              }}
            >
              <ArrowUpRight className="w-4 h-4" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Success Alert */}
        {actionSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5 animate-in fade-in duration-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Inflow (Income)"
            value={`₹${totals.totalIncome.toLocaleString()}`}
            description="Verified gross inflows & sales"
            icon={<ArrowDownLeft className="w-5 h-5 text-emerald-600" />}
            trend={{ value: 'Revenue healthy', isPositive: true }}
          />
          <StatCard
            title="Total Outflow (Expenses)"
            value={`₹${totals.totalExpense.toLocaleString()}`}
            description="Operational costs & supplies"
            icon={<ArrowUpRight className="w-5 h-5 text-rose-600" />}
            trend={{ value: 'Recorded overhead', isPositive: false }}
          />
          <StatCard
            title="Net Business Balance"
            value={`₹${totals.netBalance.toLocaleString()}`}
            description="Authoritative surplus (Income - Expenses)"
            icon={<DollarSign className="w-5 h-5 text-indigo-600" />}
            trend={{
              value: totals.netBalance >= 0 ? '+ In Profit' : '- Deficit',
              isPositive: totals.netBalance >= 0,
            }}
          />
        </div>

        {/* Search & Filter Bar */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ledger entries by description or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    typeFilter === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({records.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter('income')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    typeFilter === 'income'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Incomes
                </button>
                <button
                  type="button"
                  onClick={() => setTypeFilter('expense')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    typeFilter === 'expense'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Expenses
                </button>
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Financial Ledger Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Cash Flow Transactions</CardTitle>
                <CardDescription>
                  Chronological financial logs with category attribution
                </CardDescription>
              </div>
              <Badge variant="info">{filteredRecords.length} Entries</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center text-sm text-slate-400">
                Loading financial records...
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={<Wallet className="w-8 h-8" />}
                  title="No financial records found"
                  description="No entries match your search or filter."
                  actionLabel="Record Entry"
                  onAction={() => {
                    setModalType('income');
                    setIsModalOpen(true);
                  }}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="px-5 py-3">Type</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Description</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredRecords.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <Badge variant={item.type === 'income' ? 'success' : 'danger'}>
                            {item.type}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                          {item.category}
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                          {item.description || '—'}
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs">
                          {item.date}
                        </td>
                        <td
                          className={`px-5 py-3.5 text-right font-bold ${
                            item.type === 'income'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {item.type === 'income' ? '+' : '-'} ₹{item.amount.toLocaleString()}
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
        <FinanceEntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialType={modalType}
          onAdd={handleAddRecord}
        />
      </div>
    </AppShell>
  );
}
