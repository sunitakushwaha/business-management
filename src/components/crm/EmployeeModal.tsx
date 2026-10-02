'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Employee, EmployeeStatus } from '@/types/database';
import { X, UserCheck } from 'lucide-react';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Employee, 'id' | 'created_at'>, id?: string) => Promise<void>;
  employeeToEdit?: Employee | null;
}

export function EmployeeModal({ isOpen, onClose, onSave, employeeToEdit }: EmployeeModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('Staff');
  const [salary, setSalary] = useState('20000');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<EmployeeStatus>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (employeeToEdit) {
      setName(employeeToEdit.name);
      setEmail(employeeToEdit.email || '');
      setPhone(employeeToEdit.phone || '');
      setPosition(employeeToEdit.position);
      setSalary(employeeToEdit.salary.toString());
      setJoiningDate(employeeToEdit.joining_date);
      setStatus(employeeToEdit.status);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setPosition('Sales Associate');
      setSalary('22000');
      setJoiningDate(new Date().toISOString().split('T')[0]);
      setStatus('active');
    }
    setError(null);
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Employee name is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave(
        {
          name: name.trim(),
          email: email.trim() || null,
          phone: phone.trim() || null,
          position: position.trim() || 'Staff',
          salary: parseFloat(salary) || 0,
          joining_date: joiningDate,
          status,
        },
        employeeToEdit?.id
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save employee.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <Card className="w-full max-w-md shadow-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            {employeeToEdit ? 'Edit Employee Profile' : 'Add New Staff Member'}
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
              label="Full Name *"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sunita Mehra"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Position / Role *"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Sales Associate"
              />
              <Input
                label="Monthly Salary (₹) *"
                type="number"
                min="0"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sunita@business.com"
            />

            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 92345 67890"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Joining Date *"
                type="date"
                required
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Employment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="on_leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {employeeToEdit ? 'Save Changes' : 'Create Staff Member'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
