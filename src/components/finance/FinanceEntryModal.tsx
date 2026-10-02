'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface FinanceEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'income' | 'expense';
  onAdd: (record: {
    type: 'income' | 'expense';
    category: string;
    amount: number;
    description: string;
    date: string;
  }) => Promise<void>;
}

const incomeCategories = ['Product Sales', 'Services', 'Consulting', 'Wholesale', 'Other Income'];
const expenseCategories = ['Inventory Supply', 'Salaries', 'Utilities', 'Rent', 'Marketing', 'Maintenance', 'Other Expense'];

export function FinanceEntryModal({
  isOpen,
  onClose,
  initialType = 'income',
  onAdd,
}: FinanceEntryModalProps) {
  const [type, setType] = useState<'income' | 'expense'>(initialType);
  const [category, setCategory] = useState(
    initialType === 'income' ? incomeCategories[0] : expenseCategories[0]
  );
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentCategories = type === 'income' ? incomeCategories : expenseCategories;

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    setCategory(newType === 'income' ? incomeCategories[0] : expenseCategories[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onAdd({
        type,
        category,
        amount: val,
        description: description.trim(),
        date,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save financial entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <Card className="w-full max-w-md shadow-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            {type === 'income' ? (
              <>
                <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                Record Income
              </>
            ) : (
              <>
                <ArrowUpRight className="w-5 h-5 text-rose-600" />
                Record Expense
              </>
            )}
          </CardTitle>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white"
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

            {/* Toggle */}
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                + Income
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  type === 'expense'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                - Expense
              </button>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                {currentCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <Input
              label="Amount (₹) *"
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 4500"
            />

            {/* Date */}
            <Input
              label="Transaction Date *"
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            {/* Description */}
            <Input
              label="Description / Purpose"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Electricity bill for October"
            />
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={type === 'income' ? 'primary' : 'danger'}
              isLoading={isSubmitting}
            >
              Save {type === 'income' ? 'Income' : 'Expense'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
