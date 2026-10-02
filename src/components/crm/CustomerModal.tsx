'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Customer, CustomerCategory } from '@/types/database';
import { X, Users } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Customer, 'id' | 'created_at'>, id?: string) => Promise<void>;
  customerToEdit?: Customer | null;
}

export function CustomerModal({ isOpen, onClose, onSave, customerToEdit }: CustomerModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<CustomerCategory>('regular');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customerToEdit) {
      setName(customerToEdit.name);
      setPhone(customerToEdit.phone || '');
      setEmail(customerToEdit.email || '');
      setCategory(customerToEdit.category);
      setNotes(customerToEdit.notes || '');
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setCategory('regular');
      setNotes('');
    }
    setError(null);
  }, [customerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Customer name is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(
        {
          name: name.trim(),
          phone: phone.trim() || null,
          email: email.trim() || null,
          category,
          notes: notes.trim() || null,
        },
        customerToEdit?.id
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save customer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <Card className="w-full max-w-md shadow-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            {customerToEdit ? 'Edit Customer' : 'Add New Customer'}
          </CardTitle>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white">
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

            <Input
              label="Customer Name / Business *"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Retailers Pvt Ltd"
            />

            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="orders@acmeretail.com"
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                Customer Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CustomerCategory)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="regular">Regular Customer</option>
                <option value="high_value">High Value (VIP / Bulk)</option>
                <option value="at_risk">At Risk (Dormant)</option>
              </select>
            </div>

            <Input
              label="Relationship Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Prefers UPI payments, bi-weekly restocking"
            />
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {customerToEdit ? 'Save Changes' : 'Create Customer'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
