'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductModal } from '@/components/inventory/ProductModal';
import { StockAdjustModal } from '@/components/inventory/StockAdjustModal';
import { SupplierModal } from '@/components/inventory/SupplierModal';
import {
  fetchProducts,
  fetchSuppliers,
  saveProduct,
  removeProduct,
  adjustProductStock,
  saveSupplier,
} from '@/lib/services/inventory';
import { Product, Supplier, StockMovementType } from '@/types/database';
import {
  Plus,
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  AlertTriangle,
  Edit2,
  Trash2,
  Truck,
  Filter,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockModalType, setStockModalType] = useState<StockMovementType>('stock_in');
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [prods, sups] = await Promise.all([fetchProducts(), fetchSuppliers()]);
      setProducts(prods);
      setSuppliers(sups);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const triggerSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Calculations
  const stats = useMemo(() => {
    const totalCount = products.length;
    const lowStockCount = products.filter((p) => p.stock_quantity <= p.minimum_stock && p.stock_quantity > 0).length;
    const outOfStockCount = products.filter((p) => p.stock_quantity === 0).length;
    const totalValuation = products.reduce((acc, p) => acc + p.stock_quantity * p.selling_price, 0);

    return { totalCount, lowStockCount, outOfStockCount, totalValuation };
  }, [products]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['all', ...Array.from(set)];
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      const matchesLowStock =
        !showLowStockOnly || p.stock_quantity <= p.minimum_stock;

      return matchesSearch && matchesCategory && matchesLowStock;
    });
  }, [products, searchQuery, selectedCategory, showLowStockOnly]);

  // Handlers
  const handleSaveProduct = async (
    data: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
    id?: string
  ) => {
    const saved = await saveProduct(data, id);
    if (id) {
      setProducts((prev) => prev.map((p) => (p.id === id ? saved : p)));
      triggerSuccess(`Updated "${saved.name}" successfully.`);
    } else {
      setProducts((prev) => [saved, ...prev]);
      triggerSuccess(`Added "${saved.name}" to inventory.`);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from inventory?`)) return;
    await removeProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    triggerSuccess(`Removed "${name}" from inventory.`);
  };

  const handleAdjustStock = async (
    productId: string,
    type: StockMovementType,
    quantity: number,
    notes?: string
  ) => {
    const updated = await adjustProductStock(productId, type, quantity, notes);
    if (updated) {
      setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
      triggerSuccess(
        `${type === 'stock_in' ? 'Added' : 'Deducted'} ${quantity} units for ${updated.name}.`
      );
    }
  };

  const handleSaveSupplier = async (
    data: Omit<Supplier, 'id' | 'created_at'>
  ) => {
    const saved = await saveSupplier(data);
    setSuppliers((prev) => [...prev, saved]);
    triggerSuccess(`Registered supplier "${saved.name}".`);
  };

  return (
    <AppShell title="Inventory & Stock">
      <div className="space-y-6">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Inventory & Products
            </h2>
            <p className="text-sm text-slate-500">
              Manage product catalog, real-time stock levels, and supplier links.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setIsSupplierModalOpen(true)}
            >
              <Truck className="w-4 h-4 text-slate-500" />
              Add Supplier
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300"
              onClick={() => {
                setStockModalType('stock_in');
                setIsStockModalOpen(true);
              }}
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
              Stock In
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-rose-700 border-rose-300 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300"
              onClick={() => {
                setStockModalType('stock_out');
                setIsStockModalOpen(true);
              }}
            >
              <ArrowUpRight className="w-4 h-4 text-rose-600" />
              Stock Out
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setProductToEdit(null);
                setIsProductModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Success Alert */}
        {actionSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5 animate-in fade-in duration-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Inventory KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Catalog Items"
            value={`${stats.totalCount} Products`}
            description="Active SKUs in inventory"
            icon={<Layers className="w-5 h-5" />}
          />
          <StatCard
            title="Low Stock Alerts"
            value={`${stats.lowStockCount} Items`}
            description="At or below minimum threshold"
            icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
            trend={
              stats.lowStockCount > 0
                ? { value: 'Attention needed', isPositive: false }
                : { value: 'Stock healthy', isPositive: true }
            }
          />
          <StatCard
            title="Out of Stock"
            value={`${stats.outOfStockCount} Items`}
            description="Depleted products"
            icon={<Package className="w-5 h-5 text-rose-500" />}
          />
          <StatCard
            title="Stock Retail Valuation"
            value={`₹${stats.totalValuation.toLocaleString()}`}
            description="Selling value of on-hand inventory"
            icon={<ArrowDownLeft className="w-5 h-5 text-indigo-500" />}
          />
        </div>

        {/* Filter & Search Bar */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Categories' : c}
                  </option>
                ))}
              </select>

              {/* Low stock toggle */}
              <button
                type="button"
                onClick={() => setShowLowStockOnly((prev) => !prev)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors shrink-0 ${
                  showLowStockOnly
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                Low Stock Only
              </button>
            </div>
          </div>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Catalog & Inventory Records</CardTitle>
                <CardDescription>
                  Real-time stock balance backed by PostgreSQL schema
                </CardDescription>
              </div>
              <Badge variant="info">{filteredProducts.length} Showing</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center text-sm text-slate-400">
                Loading inventory records...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={<Package className="w-8 h-8" />}
                  title="No products found"
                  description="No inventory items match your current filter or search criteria."
                  actionLabel="Add New Product"
                  onAction={() => {
                    setProductToEdit(null);
                    setIsProductModalOpen(true);
                  }}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="px-5 py-3">Product Name & SKU</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Selling Price</th>
                      <th className="px-5 py-3">Cost Price</th>
                      <th className="px-5 py-3">In Stock</th>
                      <th className="px-5 py-3">Min. Stock</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredProducts.map((item) => {
                      const isOutOfStock = item.stock_quantity === 0;
                      const isLowStock = item.stock_quantity <= item.minimum_stock && !isOutOfStock;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                <Package className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="font-medium text-slate-900 dark:text-slate-100 block">
                                  {item.name}
                                </span>
                                <span className="text-xs text-slate-400 font-mono">
                                  {item.sku}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                            {item.category}
                          </td>
                          <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                            ₹{item.selling_price.toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 text-slate-500">
                            ₹{item.purchase_price.toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                            {item.stock_quantity}
                          </td>
                          <td className="px-5 py-3.5 text-slate-400">
                            {item.minimum_stock}
                          </td>
                          <td className="px-5 py-3.5">
                            {isOutOfStock ? (
                              <Badge variant="danger">Out of Stock</Badge>
                            ) : isLowStock ? (
                              <Badge variant="warning">Low Stock</Badge>
                            ) : (
                              <Badge variant="success">In Stock</Badge>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setProductToEdit(item);
                                  setIsProductModalOpen(true);
                                }}
                                title="Edit product"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(item.id, item.name)}
                                title="Delete product"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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

        {/* Modals */}
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSave={handleSaveProduct}
          productToEdit={productToEdit}
          suppliers={suppliers}
        />

        <StockAdjustModal
          isOpen={isStockModalOpen}
          onClose={() => setIsStockModalOpen(false)}
          products={products}
          initialType={stockModalType}
          onAdjust={handleAdjustStock}
        />

        <SupplierModal
          isOpen={isSupplierModalOpen}
          onClose={() => setIsSupplierModalOpen(false)}
          onSave={handleSaveSupplier}
        />
      </div>
    </AppShell>
  );
}
