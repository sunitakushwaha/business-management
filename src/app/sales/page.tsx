'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, ShoppingBag, Receipt } from 'lucide-react';

const mockSales = [
  { id: 'ORD-9821', customer: 'Acme Retailers', items: 3, total: '₹14,500', method: 'UPI', status: 'paid', date: '2026-10-02' },
  { id: 'ORD-9820', customer: 'Rahul Sharma', items: 1, total: '₹3,200', method: 'Cash', status: 'paid', date: '2026-10-02' },
  { id: 'ORD-9819', customer: 'Priya Traders', items: 4, total: '₹8,900', method: 'Card', status: 'pending', date: '2026-10-01' },
  { id: 'ORD-9818', customer: 'Apex Logistics', items: 6, total: '₹22,100', method: 'Bank Transfer', status: 'paid', date: '2026-10-01' },
];

export default function SalesPage() {
  return (
    <AppShell title="Sales & Invoicing">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sales & Orders</h2>
            <p className="text-sm text-slate-500">Record customer purchases, calculate subtotals & taxes, and generate invoices.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              Create New Sale
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sales Transactions</CardTitle>
                <CardDescription>Authoritative records that automatically trigger inventory deduction</CardDescription>
              </div>
              <Badge variant="info">{mockSales.length} Orders</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="px-5 py-3">Invoice / Order</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Items</th>
                    <th className="px-5 py-3">Payment Method</th>
                    <th className="px-5 py-3">Total Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {mockSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-indigo-500" />
                        {sale.id}
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">{sale.customer}</td>
                      <td className="px-5 py-3.5 text-slate-500">{sale.items} items</td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">{sale.method}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">{sale.total}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={sale.status === 'paid' ? 'success' : 'warning'}>
                          {sale.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                          <Receipt className="w-3.5 h-3.5" />
                          Invoice
                        </button>
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
