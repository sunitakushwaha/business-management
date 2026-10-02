'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { CreateSaleModal } from '@/components/sales/CreateSaleModal';
import { InvoiceModal } from '@/components/sales/InvoiceModal';
import { fetchSales, createSaleTransaction, SaleWithDetails } from '@/lib/services/sales';
import { fetchProducts } from '@/lib/services/inventory';
import { createClient } from '@/lib/supabase/client';
import { Product, Customer } from '@/types/database';
import {
  Plus,
  ShoppingBag,
  Receipt,
  Search,
  CheckCircle2,
  DollarSign,
  Clock,
  Filter,
} from 'lucide-react';

export default function SalesPage() {
  const [sales, setSales] = useState<SaleWithDetails[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInvoiceSale, setSelectedInvoiceSale] = useState<SaleWithDetails | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [salesData, prodsData] = await Promise.all([
        fetchSales(),
        fetchProducts(),
      ]);
      setSales(salesData);
      setProducts(prodsData);

      // Load customers
      try {
        const supabase = createClient();
        const { data: custData } = await supabase.from('customers').select('*');
        if (custData && custData.length > 0) {
          setCustomers(custData);
        } else {
          setCustomers([
            { id: '33333333-3333-3333-3333-333333333301', name: 'Acme Retailers Pvt Ltd', phone: '+91 98765 43210', email: 'orders@acmeretail.com', category: 'high_value', notes: null, created_at: '' },
            { id: '33333333-3333-3333-3333-333333333302', name: 'Rahul Sharma', phone: '+91 98111 22334', email: 'rahul.s@gmail.com', category: 'regular', notes: null, created_at: '' },
            { id: '33333333-3333-3333-3333-333333333303', name: 'Priya Traders', phone: '+91 97222 33445', email: 'contact@priyatraders.in', category: 'regular', notes: null, created_at: '' },
          ]);
        }
      } catch {
        // Fallback
      }

      setIsLoading(false);
    }
    loadData();
  }, []);

  const triggerSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // KPIs
  const metrics = useMemo(() => {
    const totalRev = sales.reduce((acc, s) => acc + s.total_amount, 0);
    const paidCount = sales.filter((s) => s.payment_status === 'paid').length;
    const pendingCount = sales.filter((s) => s.payment_status === 'pending').length;
    const avgOrder = sales.length > 0 ? totalRev / sales.length : 0;

    return { totalRev, paidCount, pendingCount, avgOrder };
  }, [sales]);

  // Filtered sales
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const custName = s.customer?.name || 'Walk-in Retail Customer';
      const matchesSearch =
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        custName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || s.payment_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sales, searchQuery, statusFilter]);

  const handleCompleteSale = async (
    saleData: {
      customer_id: string | null;
      subtotal: number;
      discount: number;
      total_amount: number;
      payment_method: 'cash' | 'card' | 'upi' | 'bank_transfer';
      payment_status: 'paid' | 'pending';
    },
    items: {
      product_id: string;
      product_name: string;
      quantity: number;
      unit_price: number;
      total: number;
    }[]
  ) => {
    const created = await createSaleTransaction(saleData, items);
    setSales((prev) => [created, ...prev]);
    // Refresh products stock in memory
    const updatedProds = await fetchProducts();
    setProducts(updatedProds);
    triggerSuccess(`Order ${created.id} completed. Inventory stock updated automatically.`);
  };

  return (
    <AppShell title="Sales & Orders">
      <div className="space-y-6">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Sales & Invoice Billing
            </h2>
            <p className="text-sm text-slate-500">
              Create sales, calculate discounts & subtotals, and automatically deduct stock.
            </p>
          </div>
          <Button size="sm" className="gap-1.5" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Create New Sale
          </Button>
        </div>

        {/* Success Alert */}
        {actionSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5 animate-in fade-in duration-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Sales Value"
            value={`₹${metrics.totalRev.toLocaleString()}`}
            description="Gross revenue recorded"
            icon={<DollarSign className="w-5 h-5 text-indigo-600" />}
          />
          <StatCard
            title="Confirmed Paid Orders"
            value={`${metrics.paidCount} Orders`}
            description="Payment received in full"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          />
          <StatCard
            title="Pending Invoices"
            value={`${metrics.pendingCount} Orders`}
            description="Awaiting payment settlement"
            icon={<Clock className="w-5 h-5 text-amber-500" />}
          />
          <StatCard
            title="Average Order Value"
            value={`₹${Math.round(metrics.avgOrder).toLocaleString()}`}
            description="Average transaction size"
            icon={<ShoppingBag className="w-5 h-5 text-indigo-500" />}
          />
        </div>

        {/* Search & Filter Bar */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders by Order ID or Customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({sales.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('paid')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    statusFilter === 'paid'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Paid
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    statusFilter === 'pending'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Pending
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sales Transactions & Invoices</CardTitle>
                <CardDescription>
                  Authoritative transactions backed by sales and sale_items tables
                </CardDescription>
              </div>
              <Badge variant="info">{filteredSales.length} Showing</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center text-sm text-slate-400">
                Loading sales records...
              </div>
            ) : filteredSales.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={<ShoppingBag className="w-8 h-8" />}
                  title="No sales transactions found"
                  description="No orders match your search or filter."
                  actionLabel="Create First Sale"
                  onAction={() => setIsCreateModalOpen(true)}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="px-5 py-3">Order ID</th>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Payment</th>
                      <th className="px-5 py-3">Total Amount</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredSales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-indigo-500" />
                          <span className="font-mono">{sale.id}</span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">
                          {sale.customer ? sale.customer.name : 'Walk-in Retail Customer'}
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs">
                          {new Date(sale.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3.5 uppercase text-xs font-medium text-slate-600 dark:text-slate-400">
                          {sale.payment_method}
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                          ₹{sale.total_amount.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge variant={sale.payment_status === 'paid' ? 'success' : 'warning'}>
                            {sale.payment_status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => setSelectedInvoiceSale(sale)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50 transition-colors"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            View Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <CreateSaleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          products={products}
          customers={customers}
          onCompleteSale={handleCompleteSale}
        />

        <InvoiceModal
          isOpen={!!selectedInvoiceSale}
          onClose={() => setSelectedInvoiceSale(null)}
          sale={selectedInvoiceSale}
        />
      </div>
    </AppShell>
  );
}
