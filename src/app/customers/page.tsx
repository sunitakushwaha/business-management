'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Users, Phone, Mail } from 'lucide-react';

const mockCustomers = [
  { id: '1', name: 'Acme Retailers', phone: '+91 98765 43210', email: 'orders@acmeretail.com', category: 'high_value', notes: 'Key bulk wholesale purchaser' },
  { id: '2', name: 'Rahul Sharma', phone: '+91 98111 22334', email: 'rahul.s@gmail.com', category: 'regular', notes: 'Local retail buyer' },
  { id: '3', name: 'Priya Traders', phone: '+91 97222 33445', email: 'contact@priyatraders.in', category: 'regular', notes: 'Monthly recurring buyer' },
  { id: '4', name: 'Metro Store 14', phone: '+91 99000 11223', email: 'mgr14@metro.in', category: 'at_risk', notes: 'No purchases in 45 days' },
];

export default function CustomersPage() {
  return (
    <AppShell title="Customer CRM">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customer Directory</h2>
            <p className="text-sm text-slate-500">Manage client contact details, purchase frequency, and categories.</p>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Customer Profiles</CardTitle>
                <CardDescription>Directory backed by customers table</CardDescription>
              </div>
              <Badge variant="info">{mockCustomers.length} Customers</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="px-5 py-3">Customer Name</th>
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {mockCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        {cust.name}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        <div className="flex flex-col text-xs gap-0.5">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {cust.phone}
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Mail className="w-3 h-3" /> {cust.email}
                          </span>
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
                      <td className="px-5 py-3.5 text-xs text-slate-500">{cust.notes}</td>
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
