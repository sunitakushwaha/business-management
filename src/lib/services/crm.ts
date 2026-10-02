import { createClient } from '@/lib/supabase/client';
import { Customer, Employee, Attendance, AttendanceStatus } from '@/types/database';

// Customers
export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customers from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Error fetching customers:', err);
    return [];
  }
}

export async function saveCustomer(
  data: Omit<Customer, 'id' | 'created_at'>,
  id?: string
): Promise<Customer> {
  const supabase = createClient();
  if (id) {
    const { data: updated, error } = await supabase
      .from('customers')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      console.error('Error updating customer:', error);
      throw new Error(error?.message || 'Failed to update customer');
    }
    return updated;
  } else {
    const { data: created, error } = await supabase
      .from('customers')
      .insert(data)
      .select()
      .single();

    if (error || !created) {
      console.error('Error creating customer:', error);
      throw new Error(error?.message || 'Failed to create customer');
    }
    return created;
  }
}

export async function deleteCustomer(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) {
      console.error('Error deleting customer:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error deleting customer:', err);
    return false;
  }
}

// Employees
export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching employees from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Error fetching employees:', err);
    return [];
  }
}

export async function saveEmployee(
  data: Omit<Employee, 'id' | 'created_at'>,
  id?: string
): Promise<Employee> {
  const supabase = createClient();
  if (id) {
    const { data: updated, error } = await supabase
      .from('employees')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      console.error('Error updating employee:', error);
      throw new Error(error?.message || 'Failed to update employee');
    }
    return updated;
  } else {
    const { data: created, error } = await supabase
      .from('employees')
      .insert(data)
      .select()
      .single();

    if (error || !created) {
      console.error('Error creating employee:', error);
      throw new Error(error?.message || 'Failed to create employee');
    }
    return created;
  }
}

export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) {
      console.error('Error deleting employee:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error deleting employee:', err);
    return false;
  }
}

// Attendance
export async function fetchAttendance(): Promise<Attendance[]> {
  try {
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('date', today);

    if (error) {
      console.error('Error fetching attendance from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Error fetching attendance:', err);
    return [];
  }
}

export async function recordAttendance(
  employeeId: string,
  status: AttendanceStatus
): Promise<Attendance> {
  const today = new Date().toISOString().split('T')[0];
  const supabase = createClient();

  const { data, error } = await supabase
    .from('attendance')
    .upsert(
      {
        employee_id: employeeId,
        date: today,
        status,
        check_in: status === 'present' || status === 'late' ? '09:00:00' : null,
      },
      { onConflict: 'employee_id,date' }
    )
    .select()
    .single();

  if (error || !data) {
    console.error('Error recording attendance:', error);
    throw new Error(error?.message || 'Failed to record attendance');
  }
  return data;
}
