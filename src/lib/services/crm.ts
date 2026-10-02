import { createClient } from '@/lib/supabase/client';
import { Customer, Employee, Attendance, CustomerCategory, EmployeeStatus, AttendanceStatus } from '@/types/database';

export const fallbackCustomers: Customer[] = [
  { id: '33333333-3333-3333-3333-333333333301', name: 'Acme Retailers Pvt Ltd', phone: '+91 98765 43210', email: 'orders@acmeretail.com', category: 'high_value', notes: 'Key wholesale buyer, purchases bi-weekly', created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333302', name: 'Rahul Sharma', phone: '+91 98111 22334', email: 'rahul.s@gmail.com', category: 'regular', notes: 'Walk-in retail client', created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333303', name: 'Priya Traders', phone: '+91 97222 33445', email: 'contact@priyatraders.in', category: 'regular', notes: 'Purchases thermal paper monthly in bulk', created_at: new Date().toISOString() },
  { id: '33333333-3333-3333-3333-333333333304', name: 'Metro Store 14', phone: '+91 99000 11223', email: 'mgr14@metro.in', category: 'at_risk', notes: 'No repeat purchases in 45 days', created_at: new Date().toISOString() },
];

export const fallbackEmployees: Employee[] = [
  { id: '44444444-4444-4444-4444-444444444401', name: 'Vikram Joshi', email: 'vikram@business.com', phone: '+91 91234 56789', position: 'Store Manager', salary: 38000, joining_date: '2025-03-15', status: 'active', created_at: new Date().toISOString() },
  { id: '44444444-4444-4444-4444-444444444402', name: 'Sunita Mehra', email: 'sunita@business.com', phone: '+91 92345 67890', position: 'Sales Associate', salary: 22000, joining_date: '2025-06-01', status: 'active', created_at: new Date().toISOString() },
  { id: '44444444-4444-4444-4444-444444444403', name: 'Amit Verma', email: 'amit@business.com', phone: '+91 93456 78901', position: 'Inventory Clerk', salary: 20000, joining_date: '2025-08-10', status: 'active', created_at: new Date().toISOString() },
  { id: '44444444-4444-4444-4444-444444444404', name: 'Ritu Sen', email: 'ritu@business.com', phone: '+91 94567 89012', position: 'Accounts Assistant', salary: 25000, joining_date: '2025-11-20', status: 'active', created_at: new Date().toISOString() },
];

export const fallbackAttendance: Attendance[] = [
  { id: 'att-1', employee_id: '44444444-4444-4444-4444-444444444401', date: new Date().toISOString().split('T')[0], status: 'present', check_in: '09:00', check_out: '18:00', created_at: new Date().toISOString() },
  { id: 'att-2', employee_id: '44444444-4444-4444-4444-444444444402', date: new Date().toISOString().split('T')[0], status: 'present', check_in: '09:15', check_out: '18:15', created_at: new Date().toISOString() },
  { id: 'att-3', employee_id: '44444444-4444-4444-4444-444444444403', date: new Date().toISOString().split('T')[0], status: 'late', check_in: '09:45', check_out: null, created_at: new Date().toISOString() },
  { id: 'att-4', employee_id: '44444444-4444-4444-4444-444444444404', date: new Date().toISOString().split('T')[0], status: 'half_day', check_in: '09:00', check_out: '13:30', created_at: new Date().toISOString() },
];

// Customers
export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) return data;
  } catch (err) {
    console.error('Error fetching customers:', err);
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('biz_customers');
    if (local) {
      try { return JSON.parse(local); } catch {}
    }
  }
  return fallbackCustomers;
}

export async function saveCustomer(data: Omit<Customer, 'id' | 'created_at'>, id?: string): Promise<Customer> {
  const supabase = createClient();
  if (id) {
    try {
      const { data: updated, error } = await supabase.from('customers').update(data).eq('id', id).select().single();
      if (!error && updated) return updated;
    } catch {}

    const customers = await fetchCustomers();
    const idx = customers.findIndex((c) => c.id === id);
    const updated = { ...customers[idx], ...data };
    if (idx !== -1) customers[idx] = updated;
    if (typeof window !== 'undefined') localStorage.setItem('biz_customers', JSON.stringify(customers));
    return updated;
  } else {
    try {
      const { data: created, error } = await supabase.from('customers').insert(data).select().single();
      if (!error && created) return created;
    } catch {}

    const newCust: Customer = {
      id: crypto.randomUUID ? crypto.randomUUID() : `cust-${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
    };
    const customers = await fetchCustomers();
    const updated = [newCust, ...customers];
    if (typeof window !== 'undefined') localStorage.setItem('biz_customers', JSON.stringify(updated));
    return newCust;
  }
}

export async function deleteCustomer(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    await supabase.from('customers').delete().eq('id', id);
  } catch {}

  if (typeof window !== 'undefined') {
    const customers = await fetchCustomers();
    const filtered = customers.filter((c) => c.id !== id);
    localStorage.setItem('biz_customers', JSON.stringify(filtered));
  }
  return true;
}

// Employees
export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('employees').select('*').order('name', { ascending: true });
    if (!error && data && data.length > 0) return data;
  } catch (err) {
    console.error('Error fetching employees:', err);
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('biz_employees');
    if (local) {
      try { return JSON.parse(local); } catch {}
    }
  }
  return fallbackEmployees;
}

export async function saveEmployee(data: Omit<Employee, 'id' | 'created_at'>, id?: string): Promise<Employee> {
  const supabase = createClient();
  if (id) {
    try {
      const { data: updated, error } = await supabase.from('employees').update(data).eq('id', id).select().single();
      if (!error && updated) return updated;
    } catch {}

    const emps = await fetchEmployees();
    const idx = emps.findIndex((e) => e.id === id);
    const updated = { ...emps[idx], ...data };
    if (idx !== -1) emps[idx] = updated;
    if (typeof window !== 'undefined') localStorage.setItem('biz_employees', JSON.stringify(emps));
    return updated;
  } else {
    try {
      const { data: created, error } = await supabase.from('employees').insert(data).select().single();
      if (!error && created) return created;
    } catch {}

    const newEmp: Employee = {
      id: crypto.randomUUID ? crypto.randomUUID() : `emp-${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
    };
    const emps = await fetchEmployees();
    const updated = [newEmp, ...emps];
    if (typeof window !== 'undefined') localStorage.setItem('biz_employees', JSON.stringify(updated));
    return newEmp;
  }
}

export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    await supabase.from('employees').delete().eq('id', id);
  } catch {}

  if (typeof window !== 'undefined') {
    const emps = await fetchEmployees();
    const filtered = emps.filter((e) => e.id !== id);
    localStorage.setItem('biz_employees', JSON.stringify(filtered));
  }
  return true;
}

// Attendance
export async function fetchAttendance(): Promise<Attendance[]> {
  try {
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.from('attendance').select('*').eq('date', today);
    if (!error && data && data.length > 0) return data;
  } catch (err) {
    console.error('Error fetching attendance:', err);
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('biz_attendance');
    if (local) {
      try { return JSON.parse(local); } catch {}
    }
  }
  return fallbackAttendance;
}

export async function recordAttendance(employeeId: string, status: AttendanceStatus): Promise<Attendance> {
  const today = new Date().toISOString().split('T')[0];
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('attendance')
      .upsert({
        employee_id: employeeId,
        date: today,
        status,
        check_in: status === 'present' || status === 'late' ? '09:00:00' : null,
      }, { onConflict: 'employee_id,date' })
      .select()
      .single();

    if (!error && data) return data;
  } catch {}

  const attList = await fetchAttendance();
  const existingIdx = attList.findIndex((a) => a.employee_id === employeeId && a.date === today);
  const updatedEntry: Attendance = {
    id: existingIdx > -1 ? attList[existingIdx].id : `att-${Date.now()}`,
    employee_id: employeeId,
    date: today,
    status,
    check_in: status === 'present' || status === 'late' ? '09:00:00' : null,
    check_out: null,
    created_at: new Date().toISOString(),
  };

  if (existingIdx > -1) {
    attList[existingIdx] = updatedEntry;
  } else {
    attList.push(updatedEntry);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('biz_attendance', JSON.stringify(attList));
  }
  return updatedEntry;
}
