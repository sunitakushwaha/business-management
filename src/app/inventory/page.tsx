'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Package, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const mockInventory = [
  { id: '1', name: 'Wireless Barcode Scanner', sku: 'WBS-102', category: 'Hardware', price: '₹4,500', stock: 3, min: 10, status: 'low' },
  { id: '2', name: 'Thermal Receipt Rolls (80mm)', sku: 'TRR-080', category: 'Supplies', price: '₹120', stock: 4, min: 25, status: 'low' },
  { id: '3', name: 'USB POS Interface Cable', sku: 'CBL-USB-01', category: 'Hardware', price: '₹350', stock: 2, min: 8, status: 'low' },
  { id: '4', name: 'Electronic Cash Drawer 24V', sku: 'ECD-024', category: 'Hardware', price: '₹3,200', stock: 14, min: 5, status: 'ok' },
  { id: '5', name: 'Thermal Desktop Label Printer', sku: 'TDL-400', category: 'Hardware', price: '₹11,500', stock: 8, min: 4, status: 'ok' },
];

export default function InventoryPage() {
  return (
    <AppShell title="Inventory Management">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Products & Stock Levels</h2>
            <p className="text-sm text-slate-500">Track stock in/out, product catalogs, and low stock thresholds.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              Stock In
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowUpRight className="w-4 h-4 text-rose-600" />
              Stock Out
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Product Catalog</CardTitle>
                <CardDescription>Managed via Supabase PostgreSQL products table</CardDescription>
              </div>
              <Badge variant="info">{mockInventory.length} Items</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="px-5 py-3">Product Name</th>
                    <th className="px-5 py-3">SKU</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3">In Stock</th>
                    <th className="px-5 py-3">Min. Stock</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {mockInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Package className="w-4 h-4 text-slate-400" />
                        {item.name}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">{item.sku}</td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{item.category}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">{item.price}</td>
                      <td className="px-5 py-3.5 font-semibold">{item.stock}</td>
                      <td className="px-5 py-3.5 text-slate-400">{item.min}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={item.status === 'low' ? 'danger' : 'success'}>
                          {item.status === 'low' ? 'Low Stock' : 'In Stock'}
                        </Badge>
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
