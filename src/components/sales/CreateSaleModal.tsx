'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Product, Customer } from '@/types/database';
import { X, Plus, Trash2, ShoppingCart } from 'lucide-react';

interface CartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  availableStock: number;
}

interface CreateSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  customers: Customer[];
  onCompleteSale: (
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
  ) => Promise<void>;
}

export function CreateSaleModal({
  isOpen,
  onClose,
  products,
  customers,
  onCompleteSale,
}: CreateSaleModalProps) {
  const [customerId, setCustomerId] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<string>(products[0]?.id || '');
  const [discount, setDiscount] = useState<string>('0');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'bank_transfer'>('upi');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>('paid');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddItem = () => {
    const prod = products.find((p) => p.id === (selectedProductToAdd || products[0]?.id));
    if (!prod) return;

    if (prod.stock_quantity <= 0) {
      setError(`Cannot add "${prod.name}": item is out of stock.`);
      return;
    }

    const existingIndex = cart.findIndex((i) => i.productId === prod.id);
    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty + 1 > prod.stock_quantity) {
        setError(`Only ${prod.stock_quantity} units available for "${prod.name}".`);
        return;
      }
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          productId: prod.id,
          productName: prod.name,
          unitPrice: prod.selling_price,
          quantity: 1,
          availableStock: prod.stock_quantity,
        },
      ]);
    }
    setError(null);
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    const item = cart.find((i) => i.productId === productId);
    if (!item) return;

    if (qty > item.availableStock) {
      setError(`Max available stock for "${item.productName}" is ${item.availableStock}.`);
      return;
    }

    if (qty <= 0) {
      setCart(cart.filter((i) => i.productId !== productId));
    } else {
      setCart(cart.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i)));
    }
    setError(null);
  };

  const handleRemoveItem = (productId: string) => {
    setCart(cart.filter((i) => i.productId !== productId));
  };

  // Deterministic calculations
  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const discountAmount = Math.min(subtotal, Math.max(0, parseFloat(discount) || 0));
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Please add at least one product to the sale.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onCompleteSale(
        {
          customer_id: customerId || null,
          subtotal,
          discount: discountAmount,
          total_amount: finalTotal,
          payment_method: paymentMethod,
          payment_status: paymentStatus,
        },
        cart.map((item) => ({
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total: item.unitPrice * item.quantity,
        }))
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record sale.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <Card className="w-full max-w-2xl shadow-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            Create New Sale Transaction
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

            {/* Customer Selection */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Customer
              </label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="">Walk-in Customer (General Sale)</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.phone ? `(${c.phone})` : ''} — {c.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Selector to Add to Cart */}
            <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5">
              <div className="flex-1 space-y-1">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Select Product to Add
                </label>
                <select
                  value={selectedProductToAdd || products[0]?.id || ''}
                  onChange={(e) => setSelectedProductToAdd(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.stock_quantity <= 0}>
                      {p.name} — ₹{p.selling_price} ({p.stock_quantity} left)
                    </option>
                  ))}
                </select>
              </div>
              <Button type="button" size="sm" onClick={handleAddItem} className="gap-1">
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>

            {/* Cart Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-2.5">Item</th>
                    <th className="px-3 py-2.5">Price</th>
                    <th className="px-3 py-2.5 w-24">Qty</th>
                    <th className="px-3 py-2.5 text-right">Total</th>
                    <th className="px-2 py-2.5 w-10 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-xs text-slate-400">
                        No items added yet. Select a product above to add.
                      </td>
                    </tr>
                  ) : (
                    cart.map((item) => (
                      <tr key={item.productId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-2.5 font-medium text-slate-900 dark:text-slate-100">
                          {item.productName}
                        </td>
                        <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                          ₹{item.unitPrice}
                        </td>
                        <td className="px-3 py-2.5">
                          <input
                            type="number"
                            min="1"
                            max={item.availableStock}
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.productId,
                                parseInt(e.target.value, 10) || 0
                              )
                            }
                            className="w-16 px-2 py-1 text-xs border rounded bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-center"
                          />
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold text-slate-900 dark:text-white">
                          ₹{(item.unitPrice * item.quantity).toLocaleString()}
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-slate-400 hover:text-rose-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Payment & Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Input
                label="Discount Amount (₹)"
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="upi">UPI / QR Code</option>
                  <option value="cash">Cash</option>
                  <option value="card">Debit / Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="paid">Paid (Confirmed)</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Order Totals Summary */}
            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount</span>
                  <span>- ₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Final Amount</span>
                <span>₹{finalTotal.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={cart.length === 0}>
              Complete Sale & Deduct Stock
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
