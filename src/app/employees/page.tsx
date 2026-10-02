'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { EmployeeModal } from '@/components/crm/EmployeeModal';
import { AttendanceModal } from '@/components/crm/AttendanceModal';
import {
  fetchEmployees,
  fetchAttendance,
  saveEmployee,
  deleteEmployee,
  recordAttendance,
} from '@/lib/services/crm';
import { Employee, Attendance, AttendanceStatus } from '@/types/database';
import {
  Plus,
  UserCheck,
  Calendar,
  Search,
  CheckCircle2,
  DollarSign,
  Edit2,
  Trash2,
  Clock,
  Phone,
  Mail,
} from 'lucide-react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [emps, att] = await Promise.all([fetchEmployees(), fetchAttendance()]);
      setEmployees(emps);
      setAttendance(att);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const triggerSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // KPIs
  const stats = useMemo(() => {
    const totalStaff = employees.length;
    const presentToday = attendance.filter((a) => a.status === 'present').length;
    const lateToday = attendance.filter((a) => a.status === 'late' || a.status === 'half_day').length;
    const totalPayroll = employees.reduce((acc, e) => acc + (e.salary || 0), 0);

    return { totalStaff, presentToday, lateToday, totalPayroll };
  }, [employees, attendance]);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      return (
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.email && e.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [employees, searchQuery]);

  const handleSaveEmployee = async (
    data: Omit<Employee, 'id' | 'created_at'>,
    id?: string
  ) => {
    const saved = await saveEmployee(data, id);
    if (id) {
      setEmployees((prev) => prev.map((e) => (e.id === id ? saved : e)));
      triggerSuccess(`Updated employee profile for "${saved.name}".`);
    } else {
      setEmployees((prev) => [...prev, saved]);
      triggerSuccess(`Registered new staff member "${saved.name}".`);
    }
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the staff roster?`)) return;
    await deleteEmployee(id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    triggerSuccess(`Removed staff member "${name}".`);
  };

  const handleMarkAttendance = async (employeeId: string, status: AttendanceStatus) => {
    const saved = await recordAttendance(employeeId, status);
    setAttendance((prev) => {
      const idx = prev.findIndex((a) => a.employee_id === employeeId);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [...prev, saved];
    });
    const emp = employees.find((e) => e.id === employeeId);
    triggerSuccess(`Attendance recorded for ${emp?.name || 'employee'}: ${status}.`);
  };

  return (
    <AppShell title="Employees & Attendance">
      <div className="space-y-6">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Staff & Daily Attendance
            </h2>
            <p className="text-sm text-slate-500">
              Employee profiles, shift attendance logging, and monthly salary allocations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setIsAttendanceModalOpen(true)}
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              Mark Attendance
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setEmployeeToEdit(null);
                setIsEmployeeModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              Add Employee
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

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Staff"
            value={`${stats.totalStaff} Members`}
            description="Active employees & managers"
            icon={<UserCheck className="w-5 h-5 text-indigo-600" />}
          />
          <StatCard
            title="Present Today"
            value={`${stats.presentToday} On Duty`}
            description="Logged on-time check in"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          />
          <StatCard
            title="Late / Half Day"
            value={`${stats.lateToday} Staff`}
            description="Shift irregularities"
            icon={<Clock className="w-5 h-5 text-amber-500" />}
          />
          <StatCard
            title="Monthly Payroll"
            value={`₹${stats.totalPayroll.toLocaleString()}`}
            description="Total monthly compensation"
            icon={<DollarSign className="w-5 h-5 text-indigo-500" />}
          />
        </div>

        {/* Search Bar */}
        <Card className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search staff by name, position, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </Card>

        {/* Staff Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Staff Directory & Status</CardTitle>
                <CardDescription>
                  Records backed by employees and attendance tables
                </CardDescription>
              </div>
              <Badge variant="info">{filteredEmployees.length} Showing</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center text-sm text-slate-400">
                Loading staff roster...
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={<UserCheck className="w-8 h-8" />}
                  title="No staff members found"
                  description="No employees match your search criteria."
                  actionLabel="Add Employee"
                  onAction={() => {
                    setEmployeeToEdit(null);
                    setIsEmployeeModalOpen(true);
                  }}
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="px-5 py-3">Employee Name</th>
                      <th className="px-5 py-3">Position</th>
                      <th className="px-5 py-3">Monthly Salary</th>
                      <th className="px-5 py-3">Joining Date</th>
                      <th className="px-5 py-3">Today&apos;s Attendance</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredEmployees.map((emp) => {
                      const todayRecord = attendance.find((a) => a.employee_id === emp.id);
                      const attStatus = todayRecord?.status || 'unmarked';

                      return (
                        <tr
                          key={emp.id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                            <div>
                              <span className="block font-medium">{emp.name}</span>
                              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                {emp.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" /> {emp.phone}
                                  </span>
                                )}
                                {emp.email && (
                                  <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3" /> {emp.email}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                            {emp.position}
                          </td>
                          <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">
                            ₹{emp.salary.toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5 text-slate-400 text-xs">
                            {emp.joining_date}
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge
                              variant={
                                attStatus === 'present'
                                  ? 'success'
                                  : attStatus === 'late'
                                  ? 'warning'
                                  : attStatus === 'absent'
                                  ? 'danger'
                                  : 'neutral'
                              }
                            >
                              {attStatus}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge variant={emp.status === 'active' ? 'neutral' : 'warning'}>
                              {emp.status}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setEmployeeToEdit(emp);
                                  setIsEmployeeModalOpen(true);
                                }}
                                title="Edit employee"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                                title="Delete employee"
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
        <EmployeeModal
          isOpen={isEmployeeModalOpen}
          onClose={() => setIsEmployeeModalOpen(false)}
          onSave={handleSaveEmployee}
          employeeToEdit={employeeToEdit}
        />

        <AttendanceModal
          isOpen={isAttendanceModalOpen}
          onClose={() => setIsAttendanceModalOpen(false)}
          employees={employees}
          onMarkAttendance={handleMarkAttendance}
        />
      </div>
    </AppShell>
  );
}
