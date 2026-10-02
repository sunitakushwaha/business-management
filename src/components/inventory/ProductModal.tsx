'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Product, Supplier } from '@/types/database';
import { X } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>, id?: string) => Promise<void>;
  productToEdit?: Product | null;
  suppliers: Supplier[];
}

export function ProductModal({
  isOpen,
  onClose,
  onSave,
  productToEdit,
  suppliers,
}: ProductModalProps) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('General');
  const [sellingPrice, setSellingPrice] = useState('0');
  const [purchasePrice, setPurchasePrice] = useState('0');
  const [stockQuantity, setStockQuantity] = useState('0');
  const [minimumStock, setMinimumStock] = useState('5');
  const [supplierId, setSupplierId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSku(productToEdit.sku);
      setCategory(productToEdit.category);
      setSellingPrice(productToEdit.selling_price.toString());
      setPurchasePrice(productToEdit.purchase_price.toString());
      setStockQuantity(productToEdit.stock_quantity.toString());
      setMinimumStock(productToEdit.minimum_stock.toString());
      setSupplierId(productToEdit.supplier_id || '');
    } else {
      setName('');
      setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      setCategory('POS Hardware');
      setSellingPrice('1000');
      setPurchasePrice('700');
      setStockQuantity('10');
      setMinimumStock('5');
      setSupplierId(suppliers[0]?.id || '');
    }
    setError(null);
  }, [productToEdit, isOpen, suppliers]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!sku.trim()) {
      setError('SKU is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(
        {
          name: name.trim(),
          sku: sku.trim().toUpperCase(),
          category: category.trim() || 'General',
          selling_price: parseFloat(sellingPrice) || 0,
          purchase_price: parseFloat(purchasePrice) || 0,
          stock_quantity: parseInt(stockQuantity, 10) || 0,
          minimum_stock: parseInt(minimumStock, 10) || 5,
          supplier_id: supplierId || null,
        },
        productToEdit?.id
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <Card className="w-full max-w-lg shadow-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">
            {productToEdit ? 'Edit Product' : 'Add New Product'}
          </CardTitle>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 max-h-[70vh] overflow-y-auto pt-2">
            {error && (
              <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Product Name *"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wireless Thermal Receipt Printer"
                />
              </div>

              <Input
                label="SKU Code *"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="WTR-100"
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="POS Hardware">POS Hardware</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="General">General</option>
                </select>
              </div>

              <Input
                label="Selling Price (₹) *"
                type="number"
                step="0.01"
                min="0"
                required
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
              />

              <Input
                label="Purchase Price (₹) *"
                type="number"
                step="0.01"
                min="0"
                required
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
              />

              <Input
                label="Initial Stock Quantity *"
                type="number"
                min="0"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
              />

              <Input
                label="Minimum Stock Threshold *"
                type="number"
                min="0"
                required
                value={minimumStock}
                onChange={(e) => setMinimumStock(e.target.value)}
                helperText="Alert triggers when stock falls below this"
              />

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Assigned Supplier
                </label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="">No Supplier Assigned</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.contact_name ? `(${s.contact_name})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {productToEdit ? 'Save Changes' : 'Create Product'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
