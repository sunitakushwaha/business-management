export type UserRole = 'owner' | 'manager' | 'employee' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  selling_price: number;
  purchase_price: number;
  stock_quantity: number;
  minimum_stock: number;
  supplier_id: string | null;
  created_at: string;
  updated_at: string;
}

export type CustomerCategory = 'regular' | 'high_value' | 'at_risk';

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  category: CustomerCategory;
  notes: string | null;
  created_at: string;
}

export type EmployeeStatus = 'active' | 'inactive' | 'on_leave';

export interface Employee {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  position: string;
  salary: number;
  joining_date: string;
  status: EmployeeStatus;
  created_at: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day';

export interface Attendance {
  id: string;
  employee_id: string;
  date: string;
  status: AttendanceStatus;
  check_in: string | null;
  check_out: string | null;
  created_at: string;
}

export type PaymentStatus = 'paid' | 'pending' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'bank_transfer';

export interface Sale {
  id: string;
  customer_id: string | null;
  created_by: string | null;
  subtotal: number;
  discount: number;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
}

export interface Income {
  id: string;
  category: string;
  amount: number;
  description: string | null;
  date: string;
  created_by: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string | null;
  date: string;
  created_by: string | null;
  created_at: string;
}

export type StockMovementType = 'stock_in' | 'stock_out' | 'adjustment';

export interface StockMovement {
  id: string;
  product_id: string;
  type: StockMovementType;
  quantity: number;
  reference_id: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

// Database schema helper type for Supabase JS client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
        Update: Partial<Omit<Profile, 'id'>>;
        Relationships: [];
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Omit<Product, 'id'>>;
        Relationships: [];
      };
      suppliers: {
        Row: Supplier;
        Insert: Omit<Supplier, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Supplier, 'id'>>;
        Relationships: [];
      };
      customers: {
        Row: Customer;
        Insert: Omit<Customer, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Customer, 'id'>>;
        Relationships: [];
      };
      employees: {
        Row: Employee;
        Insert: Omit<Employee, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Employee, 'id'>>;
        Relationships: [];
      };
      attendance: {
        Row: Attendance;
        Insert: Omit<Attendance, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Attendance, 'id'>>;
        Relationships: [];
      };
      sales: {
        Row: Sale;
        Insert: Omit<Sale, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Sale, 'id'>>;
        Relationships: [];
      };
      sale_items: {
        Row: SaleItem;
        Insert: Omit<SaleItem, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<SaleItem, 'id'>>;
        Relationships: [];
      };
      income: {
        Row: Income;
        Insert: Omit<Income, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Income, 'id'>>;
        Relationships: [];
      };
      expenses: {
        Row: Expense;
        Insert: Omit<Expense, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<Expense, 'id'>>;
        Relationships: [];
      };
      stock_movements: {
        Row: StockMovement;
        Insert: Omit<StockMovement, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Omit<StockMovement, 'id'>>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
