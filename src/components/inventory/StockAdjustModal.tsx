'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Product, StockMovementType } from '@/types/database';
import { X, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface StockAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  initialType?: StockMovementType;
  onAdjust: (productId: string, type: StockMovementType, quantity: number, notes?: string) => Promise<void>;
}

export function StockAdjustModal({
  isOpen,
  onClose,
  products,
  initialType = 'stock_in',
  onAdjust,
}: StockAdjustModalProps) {
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [type, setType] = useState<StockMovementType>(initialType);
  const [quantity, setQuantity] = useState('5');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) {
      setError('Please enter a positive quantity.');
      return;
    }
    if (!selectedProductId && currentProduct) {
      setSelectedProductId(currentProduct.id);
    }

    const prodId = selectedProductId || currentProduct?.id;
    if (!prodId) {
      setError('No product selected.');
      return;
    }

    if (type === 'stock_out' && currentProduct && currentProduct.stock_quantity < qty) {
      setError(`Cannot remove ${qty} units. Only ${currentProduct.stock_quantity} in stock.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onAdjust(prodId, type, qty, notes.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stock adjustment failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <Card className="w-full max-w-md shadow-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {type === 'stock_in' ? (
              <>
                <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                Stock In (Add Inventory)
              </>
            ) : (
              <>
                <ArrowUpRight className="w-5 h-5 text-rose-600" />
                Stock Out (Remove Inventory)
              </>
            )}
          </CardTitle>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:white"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-2">
            {error && (
              <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-lg dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900">
                {error}
              </div>
            )}

            {/* Movement Type Toggle */}
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => setType('stock_in')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  type === 'stock_in'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white'
                }`}
              >
                Stock In (+Add)
              </button>
              <button
                type="button"
                onClick={() => setType('stock_out')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  type === 'stock_out'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white'
                }`}
              >
                Stock Out (-Deduct)
              </button>
            </div>

            {/* Select Product */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Product
              </label>
              <select
                value={selectedProductId || currentProduct?.id || ''}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku}) — {p.stock_quantity} in stock
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <Input
              label="Quantity to Adjust *"
              type="number"
              min="1"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              helperText={
                currentProduct
                  ? `Current stock: ${currentProduct.stock_quantity} units`
                  : undefined
              }
            />

            {/* Reason / Notes */}
            <Input
              label="Reason / Reference Note"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Supplier batch #408 or Warehouse damaged"
            />
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={type === 'stock_in' ? 'primary' : 'danger'}
              isLoading={isSubmitting}
            >
              Confirm {type === 'stock_in' ? 'Stock In' : 'Stock Out'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
