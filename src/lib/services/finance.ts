import { createClient } from '@/lib/supabase/client';
import { Income, Expense } from '@/types/database';

export interface FinanceRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string | null;
  date: string;
  created_at: string;
}

export const fallbackFinanceRecords: FinanceRecord[] = [
  { id: 'f-1', type: 'income', category: 'Product Sales', amount: 14500, description: 'Acme Retailers batch POS devices', date: '2026-10-02', created_at: new Date().toISOString() },
  { id: 'f-2', type: 'income', category: 'Services', amount: 2500, description: 'On-site POS setup and network configuration', date: '2026-10-01', created_at: new Date().toISOString() },
  { id: 'f-3', type: 'income', category: 'Product Sales', amount: 8900, description: 'Thermal printer and paper bundle', date: '2026-09-30', created_at: new Date().toISOString() },
  { id: 'f-4', type: 'income', category: 'Product Sales', amount: 22100, description: 'Full POS counter hardware setup', date: '2026-09-29', created_at: new Date().toISOString() },
  { id: 'f-5', type: 'expense', category: 'Inventory Supply', amount: 4200, description: 'Wholesale thermal paper restock invoice', date: '2026-10-01', created_at: new Date().toISOString() },
  { id: 'f-6', type: 'expense', category: 'Utilities', amount: 3150, description: 'Store electricity and broadband bill', date: '2026-09-30', created_at: new Date().toISOString() },
  { id: 'f-7', type: 'expense', category: 'Salaries', amount: 28000, description: 'Monthly store staff advance payout', date: '2026-09-28', created_at: new Date().toISOString() },
  { id: 'f-8', type: 'expense', category: 'Marketing', amount: 1800, description: 'Local retail catalog printing', date: '2026-09-27', created_at: new Date().toISOString() },
];

export async function fetchFinanceRecords(): Promise<FinanceRecord[]> {
  try {
    const supabase = createClient();
    const [incRes, expRes] = await Promise.all([
      supabase.from('income').select('*').order('date', { ascending: false }),
      supabase.from('expenses').select('*').order('date', { ascending: false }),
    ]);

    const records: FinanceRecord[] = [];
    if (incRes.data) {
      incRes.data.forEach((i: Income) => {
        records.push({
          id: i.id,
          type: 'income',
          category: i.category,
          amount: i.amount,
          description: i.description,
          date: i.date,
          created_at: i.created_at,
        });
      });
    }
    if (expRes.data) {
      expRes.data.forEach((e: Expense) => {
        records.push({
          id: e.id,
          type: 'expense',
          category: e.category,
          amount: e.amount,
          description: e.description,
          date: e.date,
          created_at: e.created_at,
        });
      });
    }

    if (records.length > 0) {
      records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return records;
    }
  } catch (err) {
    console.error('Error fetching finance from Supabase:', err);
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('biz_finance');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
  }

  return fallbackFinanceRecords;
}

export async function addFinanceRecord(record: {
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
}): Promise<FinanceRecord> {
  const supabase = createClient();
  const table = record.type === 'income' ? 'income' : 'expenses';

  try {
    const { data, error } = await supabase
      .from(table)
      .insert({
        category: record.category,
        amount: record.amount,
        description: record.description,
        date: record.date,
      })
      .select()
      .single();

    if (!error && data) {
      return {
        id: data.id,
        type: record.type,
        category: data.category,
        amount: data.amount,
        description: data.description,
        date: data.date,
        created_at: data.created_at,
      };
    }
  } catch (err) {
    console.error('Error adding finance record:', err);
  }

  const newRecord: FinanceRecord = {
    id: `fin-${Date.now()}`,
    type: record.type,
    category: record.category,
    amount: record.amount,
    description: record.description,
    date: record.date,
    created_at: new Date().toISOString(),
  };

  const records = await fetchFinanceRecords();
  const updated = [newRecord, ...records];
  if (typeof window !== 'undefined') {
    localStorage.setItem('biz_finance', JSON.stringify(updated));
  }
  return newRecord;
}
