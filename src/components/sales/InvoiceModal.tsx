'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SaleWithDetails } from '@/lib/services/sales';
import { X, Printer, Building2, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: SaleWithDetails | null;
}

export function InvoiceModal({ isOpen, onClose, sale }: InvoiceModalProps) {
  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <Card className="w-full max-w-xl shadow-2xl bg-white text-slate-900 overflow-hidden">
        {/* Modal Controls (Not Printed) */}
        <div className="p-3 bg-slate-100 border-b flex items-center justify-between print:hidden">
          <span className="text-xs font-semibold text-slate-600">
            Invoice Preview: {sale.id}
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.print()}
              className="gap-1.5 text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Invoice
            </Button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">BizManage Store</h2>
                <p className="text-xs text-slate-500">Retail & POS Hardware Solutions</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold text-slate-800">INVOICE</h3>
              <p className="text-xs font-mono font-semibold text-slate-600">#{sale.id}</p>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(sale.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Customer / Bill To */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-semibold block mb-1">Billed To</span>
              <p className="font-semibold text-sm text-slate-800">
                {sale.customer ? sale.customer.name : 'Walk-in Retail Customer'}
              </p>
              {sale.customer?.phone && <p className="text-slate-500">{sale.customer.phone}</p>}
              {sale.customer?.email && <p className="text-slate-500">{sale.customer.email}</p>}
            </div>
            <div className="text-right">
              <span className="text-slate-400 uppercase font-semibold block mb-1">Payment Info</span>
              <p className="text-slate-700 uppercase font-medium">Method: {sale.payment_method}</p>
              <div className="mt-1">
                <Badge variant={sale.payment_status === 'paid' ? 'success' : 'warning'}>
                  {sale.payment_status === 'paid' ? 'PAID' : 'PENDING'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Price</th>
                <th className="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sale.items && sale.items.length > 0 ? (
                sale.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {it.product_name || `Product #${it.product_id}`}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{it.quantity}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">
                      ₹{it.unit_price.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                      ₹{(it.unit_price * it.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-2.5 px-3 font-medium text-slate-800">Standard Order Items</td>
                  <td className="py-2.5 px-3 text-center text-slate-600">1</td>
                  <td className="py-2.5 px-3 text-right text-slate-600">₹{sale.total_amount.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                    ₹{sale.total_amount.toLocaleString()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="border-t pt-4 space-y-1.5 text-xs text-right">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>₹{sale.subtotal.toLocaleString()}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount Applied</span>
                <span>- ₹{sale.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t">
              <span>Total Paid</span>
              <span>₹{sale.total_amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-6 border-t text-center text-[11px] text-slate-400">
            <p>Thank you for your business! For queries, contact support@bizmanage.com</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
