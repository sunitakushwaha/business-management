'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  DollarSign,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockSalesData = [
  { day: 'Mon', revenue: 12400, sales: 18 },
  { day: 'Tue', revenue: 18200, sales: 26 },
  { day: 'Wed', revenue: 15800, sales: 22 },
  { day: 'Thu', revenue: 24500, sales: 34 },
  { day: 'Fri', revenue: 28900, sales: 41 },
  { day: 'Sat', revenue: 35400, sales: 52 },
  { day: 'Sun', revenue: 21600, sales: 30 },
];

const mockRecentSales = [
  { id: 'ORD-9821', customer: 'Acme Retailers', amount: '₹14,500', status: 'paid', time: '10m ago' },
  { id: 'ORD-9820', customer: 'Rahul Sharma', amount: '₹3,200', status: 'paid', time: '45m ago' },
  { id: 'ORD-9819', customer: 'Priya Traders', amount: '₹8,900', status: 'pending', time: '2h ago' },
  { id: 'ORD-9818', customer: 'Apex Logistics', amount: '₹22,100', status: 'paid', time: '4h ago' },
];

const mockLowStock = [
  { id: '1', name: 'Wireless Barcode Scanner', sku: 'WBS-102', inStock: 3, minStock: 10 },
  { id: '2', name: 'Thermal Receipt Rolls (80mm)', sku: 'TRR-080', inStock: 4, minStock: 25 },
  { id: '3', name: 'USB POS Interface Cable', sku: 'CBL-USB-01', inStock: 2, minStock: 8 },
];

export default function DashboardPage() {
  return (
    <AppShell title="Business Dashboard">
      {/* Top Welcome / AI Banner */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-indigo-700/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/30 border border-indigo-400/40 text-indigo-200">
              Phase 0 Complete
            </span>
            <span className="text-xs text-indigo-200">Ready for Supabase Auth & Schema</span>
          </div>
          <h2 className="text-lg font-bold mt-1 text-white">
            Welcome to BizManage Operations Hub
          </h2>
          <p className="text-xs text-indigo-200 max-w-xl mt-0.5">
            Real-time business telemetry with deterministic calculation and Groq AI natural-language assistant.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/assistant">
            <Button size="sm" variant="secondary" className="gap-1.5 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Ask AI Assistant
            </Button>
          </Link>
          <Link href="/sales">
            <Button size="sm" className="gap-1.5 text-xs font-semibold bg-white text-indigo-900 hover:bg-indigo-50 border-0">
              New Sale
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Revenue"
          value="₹1,56,800"
          description="Gross sales for current period"
          icon={<DollarSign className="w-5 h-5" />}
          trend={{ value: '+14.2%', isPositive: true }}
        />
        <StatCard
          title="Total Sales Count"
          value="223 Orders"
          description="Completed transactions"
          icon={<ShoppingCart className="w-5 h-5" />}
          trend={{ value: '+8.1%', isPositive: true }}
        />
        <StatCard
          title="Operating Expenses"
          value="₹48,250"
          description="Fixed & variable expenses"
          icon={<TrendingDown className="w-5 h-5 text-rose-500" />}
          trend={{ value: '-3.4%', isPositive: true }}
        />
        <StatCard
          title="Net Profit (Est.)"
          value="₹1,08,550"
          description="Authoritative deterministic margin"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          trend={{ value: '+18.5%', isPositive: true }}
        />
      </div>

      {/* Chart and Low Stock Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales & Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Weekly Revenue Trend</CardTitle>
                <CardDescription>Daily revenue performance calculated deterministically</CardDescription>
              </div>
              <Badge variant="info">7 Days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value: unknown) => [typeof value === 'number' ? `₹${value.toLocaleString()}` : String(value), 'Revenue']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Items below minimum threshold</CardDescription>
              </div>
              <Badge variant="warning">{mockLowStock.length} Items</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {mockLowStock.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {item.inStock} left
                    </span>
                    <p className="text-[11px] text-slate-400">Min: {item.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
              <Link href="/inventory" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 inline-flex items-center gap-1">
                Manage all inventory <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Orders & Invoices</CardTitle>
              <CardDescription>Latest transactions recorded in database</CardDescription>
            </div>
            <Link href="/sales">
              <Button variant="outline" size="sm">
                View All Sales
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {mockRecentSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                      {sale.id}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                      {sale.customer}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">
                      {sale.amount}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={sale.status === 'paid' ? 'success' : 'warning'}>
                        {sale.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right text-xs text-slate-400">
                      {sale.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
