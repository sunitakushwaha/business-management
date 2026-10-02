'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { Plus, ArrowUpRight, ArrowDownLeft, DollarSign } from 'lucide-react';

const mockFinanceRecords = [
  { id: '1', type: 'income', category: 'Product Sales', desc: 'Batch POS cash revenue', amount: '+₹14,500', date: '2026-10-02' },
  { id: '2', type: 'expense', category: 'Inventory Supply', desc: 'Thermal paper wholesale restock', amount: '-₹4,200', date: '2026-10-01' },
  { id: '3', type: 'expense', category: 'Utilities', desc: 'Shop high-speed internet & electric', amount: '-₹3,150', date: '2026-09-30' },
  { id: '4', type: 'income', category: 'Services', desc: 'Onsite POS setup fee', amount: '+₹2,500', date: '2026-09-29' },
];

export default function FinancePage() {
  return (
    <AppShell title="Finance & Cash Flow">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Financial Ledger</h2>
            <p className="text-sm text-slate-500">Record income and operational expenses with deterministic balance calculations.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 text-emerald-600 border-emerald-300 hover:bg-emerald-50">
              <ArrowDownLeft className="w-4 h-4" />
              Add Income
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-rose-600 border-rose-300 hover:bg-rose-50">
              <ArrowUpRight className="w-4 h-4" />
              Add Expense
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Income"
            value="₹1,56,800"
            description="From verified sales and services"
            icon={<ArrowDownLeft className="w-5 h-5 text-emerald-600" />}
          />
          <StatCard
            title="Total Expenses"
            value="₹48,250"
            description="Operational costs and restocks"
            icon={<ArrowUpRight className="w-5 h-5 text-rose-600" />}
          />
          <StatCard
            title="Net Balance"
            value="₹1,08,550"
            description="Calculated cash surplus"
            icon={<DollarSign className="w-5 h-5 text-indigo-600" />}
          />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Financial Entries</CardTitle>
                <CardDescription>Synchronized with Supabase income and expenses tables</CardDescription>
              </div>
              <Badge variant="neutral">Ledger</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
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
                  {mockFinanceRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <Badge variant={item.type === 'income' ? 'success' : 'danger'}>
                          {item.type}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">{item.category}</td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{item.desc}</td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs">{item.date}</td>
                      <td className={`px-5 py-3.5 text-right font-bold ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
