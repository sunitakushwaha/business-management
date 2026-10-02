'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, UserCheck, Calendar } from 'lucide-react';

const mockEmployees = [
  { id: '1', name: 'Vikram Joshi', position: 'Store Manager', salary: '₹38,000', joined: '2025-03-15', status: 'active', todayAttendance: 'present' },
  { id: '2', name: 'Sunita Mehra', position: 'Sales Associate', salary: '₹22,000', joined: '2025-06-01', status: 'active', todayAttendance: 'present' },
  { id: '3', name: 'Amit Verma', position: 'Inventory Clerk', salary: '₹20,000', joined: '2025-08-10', status: 'active', todayAttendance: 'late' },
  { id: '4', name: 'Ritu Sen', position: 'Accounts Assistant', salary: '₹25,000', joined: '2025-11-20', status: 'on_leave', todayAttendance: 'absent' },
];

export default function EmployeesPage() {
  return (
    <AppShell title="Employees & Attendance">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Staff Roster</h2>
            <p className="text-sm text-slate-500">Employee records, attendance logging, and salary compensation overview.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Calendar className="w-4 h-4" />
              Mark Attendance
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              Add Employee
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Employee Directory</CardTitle>
                <CardDescription>Managed via Supabase employees and attendance tables</CardDescription>
              </div>
              <Badge variant="info">{mockEmployees.length} Staff</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    <th className="px-5 py-3">Employee Name</th>
                    <th className="px-5 py-3">Role / Position</th>
                    <th className="px-5 py-3">Monthly Salary</th>
                    <th className="px-5 py-3">Joining Date</th>
                    <th className="px-5 py-3">Today&apos;s Attendance</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {mockEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-slate-400" />
                        {emp.name}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{emp.position}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white">{emp.salary}</td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs">{emp.joined}</td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={
                            emp.todayAttendance === 'present'
                              ? 'success'
                              : emp.todayAttendance === 'late'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {emp.todayAttendance}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={emp.status === 'active' ? 'neutral' : 'warning'}>
                          {emp.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
