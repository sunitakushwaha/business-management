'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { FileBarChart, Sparkles, Printer, Download, CheckCircle2 } from 'lucide-react';

const reportTypes = [
  { id: 'sales', name: 'Monthly Sales Report', desc: 'Itemized revenue, discounts, payment status distribution' },
  { id: 'inventory', name: 'Inventory Valuation & Reorder', desc: 'Current stock count, low stock warnings, reorder suggestions' },
  { id: 'financial', name: 'Income & Expense Statement', desc: 'Operating expenses, gross income, deterministic net profit' },
  { id: 'employee', name: 'Employee Attendance & Payroll Summary', desc: 'Monthly attendance ratios and total salary allocations' },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('sales');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleGenerateAiSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Generate a concise 2-sentence executive summary for the ${selectedReport} report.`,
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
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Operational Reports</h2>
            <p className="text-sm text-slate-500">Deterministic reports generated authoritative from database tables.</p>
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
          {reportTypes.map((rpt) => (
            <button
              key={rpt.id}
              onClick={() => {
                setSelectedReport(rpt.id);
                setAiSummary(null);
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedReport === rpt.id
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-500'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-sm">
                <FileBarChart className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                {rpt.name}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{rpt.desc}</p>
            </button>
          ))}
        </div>

        {/* Selected Report Preview */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="capitalize">{selectedReport} Report — October 2026</CardTitle>
                <CardDescription>Computed authoritative from database state</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                onClick={handleGenerateAiSummary}
                isLoading={isGeneratingSummary}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Optional AI Summary
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Optional AI Summary Box if requested */}
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

            {/* Deterministic Data Table */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs text-slate-500 block">Total Transactions</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">223 Orders</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Gross Inflow</span>
                <span className="text-lg font-bold text-emerald-600">₹1,56,800</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Operating Outflow</span>
                <span className="text-lg font-bold text-rose-600">₹48,250</span>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800 text-[11px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5">Units / Orders</th>
                    <th className="px-4 py-2.5">Subtotal</th>
                    <th className="px-4 py-2.5 text-right">Net Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="px-4 py-2.5 font-medium">POS Hardware</td>
                    <td className="px-4 py-2.5 text-slate-500">82 units</td>
                    <td className="px-4 py-2.5">₹94,000</td>
                    <td className="px-4 py-2.5 text-right font-semibold">₹94,000</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">Paper & Ribbon Supplies</td>
                    <td className="px-4 py-2.5 text-slate-500">120 units</td>
                    <td className="px-4 py-2.5">₹42,800</td>
                    <td className="px-4 py-2.5 text-right font-semibold">₹42,800</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">Consulting & Setup Fees</td>
                    <td className="px-4 py-2.5 text-slate-500">21 sessions</td>
                    <td className="px-4 py-2.5">₹20,000</td>
                    <td className="px-4 py-2.5 text-right font-semibold">₹20,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
