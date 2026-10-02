'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { fetchProducts } from '@/lib/services/inventory';
import { fetchSales, SaleWithDetails } from '@/lib/services/sales';
import { fetchFinanceRecords, FinanceRecord } from '@/lib/services/finance';
import { fetchEmployees, fetchAttendance } from '@/lib/services/crm';
import { Product, Employee, Attendance } from '@/types/database';
import {
  FileBarChart,
  Sparkles,
  Printer,
  Download,
  CheckCircle2,
  DollarSign,
  Package,
  Users,
  Wallet,
} from 'lucide-react';

const reportTypes = [
  { id: 'sales', name: 'Monthly Sales Report', desc: 'Itemized revenue, discounts, payment status distribution', icon: DollarSign },
  { id: 'inventory', name: 'Inventory Valuation & Reorder', desc: 'Current stock count, low stock warnings, reorder suggestions', icon: Package },
  { id: 'financial', name: 'Income & Expense Statement', desc: 'Operating expenses, gross income, deterministic net profit', icon: Wallet },
  { id: 'employee', name: 'Staff Attendance & Payroll', desc: 'Monthly attendance ratios and total salary allocations', icon: Users },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [finance, setFinance] = useState<FinanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  useEffect(() => {
    async function loadAllData() {
      const [p, s, f, e, a] = await Promise.all([
        fetchProducts(),
        fetchSales(),
        fetchFinanceRecords(),
        fetchEmployees(),
        fetchAttendance(),
      ]);
      setProducts(p);
      setSales(s);
      setFinance(f);
      setEmployees(e);
      setAttendance(a);
    }
    loadAllData();
  }, []);

  // Aggregates
  const salesAgg = useMemo(() => {
    const totalRev = sales.reduce((acc, s) => acc + s.total_amount, 0);
    const paidCount = sales.filter((s) => s.payment_status === 'paid').length;
    const pendingCount = sales.filter((s) => s.payment_status === 'pending').length;
    return { totalRev, paidCount, pendingCount, ordersCount: sales.length };
  }, [sales]);

  const inventoryAgg = useMemo(() => {
    const totalUnits = products.reduce((acc, p) => acc + p.stock_quantity, 0);
    const totalValuation = products.reduce((acc, p) => acc + p.stock_quantity * p.selling_price, 0);
    const lowStockCount = products.filter((p) => p.stock_quantity <= p.minimum_stock).length;
    return { totalUnits, totalValuation, lowStockCount, count: products.length };
  }, [products]);

  const financeAgg = useMemo(() => {
    const totalInc = finance.filter((f) => f.type === 'income').reduce((acc, f) => acc + f.amount, 0);
    const totalExp = finance.filter((f) => f.type === 'expense').reduce((acc, f) => acc + f.amount, 0);
    return { totalInc, totalExp, net: totalInc - totalExp };
  }, [finance]);

  const employeeAgg = useMemo(() => {
    const totalPayroll = employees.reduce((acc, e) => acc + (e.salary || 0), 0);
    const presentCount = attendance.filter((a) => a.status === 'present').length;
    return { totalPayroll, presentCount, staffCount: employees.length };
  }, [employees, attendance]);

  const handleGenerateAiSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Generate an executive business summary for the current ${selectedReport} statement based on recorded figures.`,
        }),
      });
      const data = await res.json();
      setAiSummary(data.answer || 'Summary generated.');
    } catch {
      setAiSummary('AI Assistant is temporarily unavailable. All report figures are calculated accurately.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <AppShell title="Business Reports">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Operational Reporting
            </h2>
            <p className="text-sm text-slate-500">
              Deterministic reports generated authoritative from PostgreSQL database records.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => window.print()}
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </Button>
          </div>
        </div>

        {/* Report Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {reportTypes.map((rpt) => {
            const Icon = rpt.icon;
            const isSelected = selectedReport === rpt.id;
            return (
              <button
                key={rpt.id}
                onClick={() => {
                  setSelectedReport(rpt.id);
                  setAiSummary(null);
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  {rpt.name}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{rpt.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Report Content */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="capitalize">
                  {reportTypes.find((r) => r.id === selectedReport)?.name} — October 2026
                </CardTitle>
                <CardDescription>
                  Deterministic summary calculated authoritative from database
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300"
                onClick={handleGenerateAiSummary}
                isLoading={isGeneratingSummary}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Optional AI Summary
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* AI Summary Box */}
            {aiSummary && (
              <div className="p-4 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  AI Executive Summary
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                  {aiSummary}
                </p>
              </div>
            )}

            {/* Render Selected Report View */}
            {selectedReport === 'sales' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 block">Total Sales Count</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {salesAgg.ordersCount} Orders
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Total Gross Revenue</span>
                    <span className="text-lg font-bold text-emerald-600">
                      ₹{salesAgg.totalRev.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Paid vs Pending</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {salesAgg.paidCount} Paid / {salesAgg.pendingCount} Pending
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-2.5">Order ID</th>
                        <th className="px-4 py-2.5">Customer</th>
                        <th className="px-4 py-2.5">Payment Method</th>
                        <th className="px-4 py-2.5">Status</th>
                        <th className="px-4 py-2.5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {sales.map((s) => (
                        <tr key={s.id}>
                          <td className="px-4 py-2.5 font-mono">{s.id}</td>
                          <td className="px-4 py-2.5">{s.customer?.name || 'Walk-in'}</td>
                          <td className="px-4 py-2.5 uppercase text-xs">{s.payment_method}</td>
                          <td className="px-4 py-2.5">
                            <Badge variant={s.payment_status === 'paid' ? 'success' : 'warning'}>
                              {s.payment_status}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5 text-right font-bold">
                            ₹{s.total_amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedReport === 'inventory' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 block">Active SKUs</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {inventoryAgg.count} Products
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Total Units In Stock</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {inventoryAgg.totalUnits} Units
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Catalog Valuation</span>
                    <span className="text-lg font-bold text-emerald-600">
                      ₹{inventoryAgg.totalValuation.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-2.5">Product Name</th>
                        <th className="px-4 py-2.5">SKU</th>
                        <th className="px-4 py-2.5">Category</th>
                        <th className="px-4 py-2.5">Stock</th>
                        <th className="px-4 py-2.5 text-right">Valuation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td className="px-4 py-2.5 font-medium">{p.name}</td>
                          <td className="px-4 py-2.5 font-mono text-xs">{p.sku}</td>
                          <td className="px-4 py-2.5">{p.category}</td>
                          <td className="px-4 py-2.5 font-semibold">{p.stock_quantity}</td>
                          <td className="px-4 py-2.5 text-right font-bold">
                            ₹{(p.stock_quantity * p.selling_price).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedReport === 'financial' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 block">Gross Inflows</span>
                    <span className="text-lg font-bold text-emerald-600">
                      ₹{financeAgg.totalInc.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Operating Outflows</span>
                    <span className="text-lg font-bold text-rose-600">
                      ₹{financeAgg.totalExp.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Net Surplus / Margin</span>
                    <span className="text-lg font-bold text-indigo-600">
                      ₹{financeAgg.net.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-2.5">Type</th>
                        <th className="px-4 py-2.5">Category</th>
                        <th className="px-4 py-2.5">Description</th>
                        <th className="px-4 py-2.5">Date</th>
                        <th className="px-4 py-2.5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {finance.map((f) => (
                        <tr key={f.id}>
                          <td className="px-4 py-2.5">
                            <Badge variant={f.type === 'income' ? 'success' : 'danger'}>
                              {f.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5 font-medium">{f.category}</td>
                          <td className="px-4 py-2.5 text-slate-500">{f.description || '—'}</td>
                          <td className="px-4 py-2.5 text-xs text-slate-400">{f.date}</td>
                          <td
                            className={`px-4 py-2.5 text-right font-bold ${
                              f.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            ₹{f.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedReport === 'employee' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-xs text-slate-500 block">Total Staff</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {employeeAgg.staffCount} Employees
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Present On Duty</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {employeeAgg.presentCount} Present
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Monthly Payroll Commitment</span>
                    <span className="text-lg font-bold text-indigo-600">
                      ₹{employeeAgg.totalPayroll.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-2.5">Name</th>
                        <th className="px-4 py-2.5">Position</th>
                        <th className="px-4 py-2.5">Joining Date</th>
                        <th className="px-4 py-2.5">Status</th>
                        <th className="px-4 py-2.5 text-right">Salary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {employees.map((e) => (
                        <tr key={e.id}>
                          <td className="px-4 py-2.5 font-medium">{e.name}</td>
                          <td className="px-4 py-2.5 text-slate-500">{e.position}</td>
                          <td className="px-4 py-2.5 text-xs text-slate-400">{e.joining_date}</td>
                          <td className="px-4 py-2.5">
                            <Badge variant={e.status === 'active' ? 'neutral' : 'warning'}>
                              {e.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-2.5 text-right font-bold">
                            ₹{e.salary.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
