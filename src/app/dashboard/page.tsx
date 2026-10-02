'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { fetchProducts } from '@/lib/services/inventory';
import { fetchSales, SaleWithDetails } from '@/lib/services/sales';
import { fetchFinanceRecords, FinanceRecord } from '@/lib/services/finance';
import { Product } from '@/types/database';
import {
  DollarSign,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Package,
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

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [finance, setFinance] = useState<FinanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      const [prodsData, salesData, finData] = await Promise.all([
        fetchProducts(),
        fetchSales(),
        fetchFinanceRecords(),
      ]);
      setProducts(prodsData);
      setSales(salesData);
      setFinance(finData);
      setIsLoading(false);
    }
    loadDashboardData();
  }, []);

  // Deterministic KPI aggregations based exclusively on database records
  const metrics = useMemo(() => {
    const totalSalesRev = sales.reduce((acc, s) => acc + (Number(s.total_amount) || 0), 0);
    const totalOrders = sales.length;
    const totalExpenses = finance
      .filter((f) => f.type === 'expense')
      .reduce((acc, f) => acc + (Number(f.amount) || 0), 0);

    const netProfit = totalSalesRev - totalExpenses;
    const lowStockItems = products.filter((p) => p.stock_quantity <= p.minimum_stock);

    return { totalSalesRev, totalOrders, totalExpenses, netProfit, lowStockItems };
  }, [products, sales, finance]);

  // Dynamic revenue trend (past 7 days vs previous 7 days)
  const revenueTrend = useMemo(() => {
    const now = Date.now();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;

    const currentPeriodRev = sales
      .filter((s) => now - new Date(s.created_at).getTime() <= sevenDaysMs)
      .reduce((acc, s) => acc + (Number(s.total_amount) || 0), 0);

    const prevPeriodRev = sales
      .filter((s) => {
        const age = now - new Date(s.created_at).getTime();
        return age > sevenDaysMs && age <= fourteenDaysMs;
      })
      .reduce((acc, s) => acc + (Number(s.total_amount) || 0), 0);

    if (prevPeriodRev === 0 && currentPeriodRev > 0) {
      return { value: '+100% this week', isPositive: true };
    }
    if (prevPeriodRev === 0 && currentPeriodRev === 0) {
      return { value: '0% change', isPositive: true };
    }
    const diff = ((currentPeriodRev - prevPeriodRev) / prevPeriodRev) * 100;
    return {
      value: `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}% vs last week`,
      isPositive: diff >= 0,
    };
  }, [sales]);

  // Today's orders count
  const ordersTrend = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayCount = sales.filter(
      (s) => new Date(s.created_at).toISOString().split('T')[0] === today
    ).length;
    return {
      value: `${todayCount} placed today`,
      isPositive: true,
    };
  }, [sales]);

  // Expenses entry count
  const expenseCount = useMemo(() => {
    return finance.filter((f) => f.type === 'expense').length;
  }, [finance]);

  // Chart data strictly from actual database sales for the last 7 calendar days
  const chartData = useMemo(() => {
    const result = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = d.toISOString().split('T')[0];

      const daySales = sales.filter((s) => {
        const sDate = new Date(s.created_at).toISOString().split('T')[0];
        return sDate === dateStr;
      });

      const rev = daySales.reduce((acc, s) => acc + (Number(s.total_amount) || 0), 0);
      result.push({
        day: dayLabel,
        date: dateStr,
        revenue: rev,
        sales: daySales.length,
      });
    }

    return result;
  }, [sales]);

  return (
    <AppShell title="Business Operations Dashboard">
      {/* Top Banner */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border border-indigo-700/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/30 border border-emerald-400/40 text-emerald-200">
              Live Operations
            </span>
            <span className="text-xs text-indigo-200">Database Connected</span>
          </div>
          <h2 className="text-lg font-bold mt-1 text-white">
            BizManage Central Operations
          </h2>
          <p className="text-xs text-indigo-200 max-w-xl mt-0.5">
            Real-time deterministic business telemetry connected to live PostgreSQL tables.
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Revenue"
          value={`₹${metrics.totalSalesRev.toLocaleString()}`}
          description={`${metrics.totalOrders} paid / recorded sales`}
          icon={<DollarSign className="w-5 h-5" />}
          trend={revenueTrend}
        />
        <StatCard
          title="Total Sales Orders"
          value={`${metrics.totalOrders} Orders`}
          description="Recorded client purchases"
          icon={<ShoppingCart className="w-5 h-5" />}
          trend={ordersTrend}
        />
        <StatCard
          title="Operating Expenses"
          value={`₹${metrics.totalExpenses.toLocaleString()}`}
          description="Supplies & operational overhead"
          icon={<TrendingDown className="w-5 h-5 text-rose-500" />}
          trend={{ value: `${expenseCount} ledger entries`, isPositive: false }}
        />
        <StatCard
          title="Net Profit (Calculated)"
          value={`₹${metrics.netProfit.toLocaleString()}`}
          description="Gross revenue minus recorded expenses"
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          trend={{
            value: metrics.netProfit >= 0 ? '+ In Profit' : '- Operating Loss',
            isPositive: metrics.netProfit >= 0,
          }}
        />
      </div>

      {/* Chart & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Weekly Revenue Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Weekly Revenue Performance</CardTitle>
                <CardDescription>Live revenue distribution across the last 7 calendar days</CardDescription>
              </div>
              <Badge variant="info">Last 7 Days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            {metrics.totalSalesRev === 0 && (
              <p className="text-center text-xs text-slate-400 mt-2">
                No sales recorded in the past 7 days. Completed POS sales will graph here in real-time.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Low Stock Alerts</CardTitle>
                <CardDescription>Items at or below reorder threshold</CardDescription>
              </div>
              <Badge variant={metrics.lowStockItems.length > 0 ? 'warning' : 'neutral'}>
                {metrics.lowStockItems.length} Items
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {metrics.lowStockItems.slice(0, 4).map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">SKU: {item.sku}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {item.stock_quantity} left
                    </span>
                    <p className="text-[11px] text-slate-400">Min: {item.minimum_stock}</p>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400">
                  <Package className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                  No inventory items found. Add products in Inventory to track stock thresholds.
                </div>
              )}
              {products.length > 0 && metrics.lowStockItems.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400">
                  All inventory items are currently above threshold levels.
                </div>
              )}
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
              <CardTitle>Recent Sales Transactions</CardTitle>
              <CardDescription>Live transactions recorded in Supabase database</CardDescription>
            </div>
            <Link href="/sales">
              <Button variant="outline" size="sm">
                View All Sales
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {sales.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="px-5 py-3">Order ID</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Payment Method</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                  {sales.slice(0, 5).map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100 font-mono text-xs">
                        {sale.id.slice(0, 8)}...
                      </td>
                      <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                        {sale.customer ? sale.customer.name : 'Walk-in Customer'}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                        ₹{(Number(sale.total_amount) || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 uppercase text-xs text-slate-600 dark:text-slate-400">
                        {sale.payment_method}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={sale.payment_status === 'paid' ? 'success' : 'warning'}>
                          {sale.payment_status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs text-slate-400">
                        {new Date(sale.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 px-4 text-center">
              <ShoppingCart className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No Sales Transactions Recorded Yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Completed sales from the POS terminal will appear here automatically from your live database.
              </p>
              <div className="mt-4">
                <Link href="/sales">
                  <Button size="sm">Record First Sale</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
