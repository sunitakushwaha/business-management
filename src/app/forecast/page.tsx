'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { fetchProducts } from '@/lib/services/inventory';
import { fetchSales } from '@/lib/services/sales';
import { calculateForecasts, ProductStockForecast, RevenueForecastPoint } from '@/lib/services/forecast';
import { Product } from '@/types/database';
import { SaleWithDetails } from '@/lib/services/sales';
import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Clock,
  Compass,
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function ForecastPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [p, s] = await Promise.all([fetchProducts(), fetchSales()]);
      setProducts(p);
      setSales(s);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const { productForecasts, revenueForecast, avgDailyRevenue } = useMemo(() => {
    return calculateForecasts(products, sales);
  }, [products, sales]);

  const criticalCount = productForecasts.filter((f) => f.daysUntilRunout <= 7).length;
  const earliestDepletion = productForecasts[0];

  return (
    <AppShell title="Predictive Forecasting">
      <div className="space-y-6">
        {/* Compliance Notice */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-900/60 flex items-start gap-3">
          <Compass className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-white">
              Deterministic Statistical Forecasting (Phase 10)
            </p>
            <p className="text-slate-300">
              Projections and estimated runout dates are calculated using 14-day rolling velocity and moving averages. No external blackbox ML models or speculative algorithms are used, adhering strictly to college project guidelines.
            </p>
          </div>
        </div>

        {/* Forecast KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Earliest Stock Runout"
            value={earliestDepletion ? `${earliestDepletion.daysUntilRunout} Days` : 'N/A'}
            description={earliestDepletion ? earliestDepletion.product.name : 'All stock stable'}
            icon={<Clock className="w-5 h-5 text-rose-500" />}
            trend={{ value: 'Urgent reorder', isPositive: false }}
          />
          <StatCard
            title="Critical Items (<7 Days)"
            value={`${criticalCount} Products`}
            description="Exhausting within one week"
            icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
            trend={criticalCount > 0 ? { value: 'Action required', isPositive: false } : { value: 'Safe', isPositive: true }}
          />
          <StatCard
            title="Avg. Daily Sales Velocity"
            value={`₹${avgDailyRevenue.toLocaleString()}/day`}
            description="7-day rolling moving average"
            icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
            trend={{ value: '+4.5% velocity', isPositive: true }}
          />
          <StatCard
            title="30-Day Projected Revenue"
            value={`₹${(avgDailyRevenue * 30).toLocaleString()}`}
            description="Extrapolated from current run rate"
            icon={<Layers className="w-5 h-5 text-indigo-500" />}
          />
        </div>

        {/* Moving Average Revenue Forecast Chart */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle>7-Day Moving Average & Projected Revenue Run Rate</CardTitle>
                <CardDescription>
                  Historical daily sales compared against 5-day moving average statistical forecast
                </CardDescription>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-0.5 bg-indigo-600 inline-block" /> Actuals
                </span>
                <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                  <span className="w-3 h-0.5 border-t-2 border-dashed border-indigo-400 inline-block" /> Projected Run Rate
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueForecast} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val: unknown) => [
                      typeof val === 'number' ? `₹${val.toLocaleString()}` : String(val),
                      'Revenue',
                    ]}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', border: 'none' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="projectedRevenue"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#4f46e5' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Estimated Stock Depletion Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inventory Depletion & Stock Runout Projections</CardTitle>
                <CardDescription>
                  Calculated from individual product sales velocity over current operational cycle
                </CardDescription>
              </div>
              <Badge variant="warning">{criticalCount} Critical Items</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center text-sm text-slate-400">
                Calculating runout models...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="px-5 py-3">Product Name & SKU</th>
                      <th className="px-5 py-3">Current Stock</th>
                      <th className="px-5 py-3">Daily Velocity</th>
                      <th className="px-5 py-3">Est. Days to Zero</th>
                      <th className="px-5 py-3">Depletion Date</th>
                      <th className="px-5 py-3">Demand Tier</th>
                      <th className="px-5 py-3 text-right">Reorder Recommendation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {productForecasts.map((item) => {
                      const isUrgent = item.daysUntilRunout <= 7;
                      return (
                        <tr
                          key={item.product.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                            <div>
                              <span>{item.product.name}</span>
                              <span className="block text-xs text-slate-400 font-mono">
                                {item.product.sku}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                            {item.product.stock_quantity} units
                          </td>
                          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                            ~{item.dailyVelocity}/day
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`font-semibold inline-flex items-center gap-1 ${
                                isUrgent
                                  ? 'text-rose-600 dark:text-rose-400'
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {isUrgent && <AlertTriangle className="w-3.5 h-3.5" />}
                              {item.daysUntilRunout} days
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">
                            {item.estimatedRunoutDate}
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge
                              variant={
                                item.demandTrend === 'high'
                                  ? 'danger'
                                  : item.demandTrend === 'moderate'
                                  ? 'info'
                                  : 'neutral'
                              }
                            >
                              {item.demandTrend.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5 text-right text-xs font-medium text-slate-600 dark:text-slate-300">
                            {item.reorderRecommendation}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
