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
          amount: Number(i.amount) || 0,
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
          amount: Number(e.amount) || 0,
          description: e.description,
          date: e.date,
          created_at: e.created_at,
        });
      });
    }

    records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return records;
  } catch (err) {
    console.error('Error fetching finance from Supabase:', err);
    return [];
  }
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

  if (error || !data) {
    console.error('Error adding finance record to Supabase:', error);
    throw new Error(error?.message || 'Failed to save financial entry');
  }

  return {
    id: data.id,
    type: record.type,
    category: data.category,
    amount: Number(data.amount) || 0,
    description: data.description,
    date: data.date,
    created_at: data.created_at,
  };
}
