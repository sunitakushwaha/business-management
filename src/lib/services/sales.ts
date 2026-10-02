import { createClient } from '@/lib/supabase/client';
import { Sale, SaleItem, Customer } from '@/types/database';
import { adjustProductStock } from './inventory';

export interface SaleWithDetails extends Sale {
  customer?: Customer | null;
  items_count?: number;
  items?: (SaleItem & { product_name?: string })[];
}

export async function fetchSales(): Promise<SaleWithDetails[]> {
  try {
    const supabase = createClient();
    const { data: sales, error } = await supabase
      .from('sales')
      .select('*, customers(*), sale_items(*, products(name))')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching sales from Supabase:', error);
      return [];
    }

    if (sales) {
      return sales.map((s: any) => ({
        ...s,
        customer: s.customers,
        items_count: s.sale_items?.length || 0,
        items: s.sale_items?.map((item: any) => ({
          ...item,
          product_name: item.products?.name || 'Product',
        })),
      }));
    }
    return [];
  } catch (err) {
    console.error('Error fetching sales from Supabase:', err);
    return [];
  }
}

export async function createSaleTransaction(
  saleData: {
    customer_id: string | null;
    subtotal: number;
    discount: number;
    total_amount: number;
    payment_method: 'cash' | 'card' | 'upi' | 'bank_transfer';
    payment_status: 'paid' | 'pending';
  },
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total: number;
  }[]
): Promise<SaleWithDetails> {
  const supabase = createClient();

  // 1. Insert into Supabase sales table
  const { data: createdSale, error: saleErr } = await supabase
    .from('sales')
    .insert({
      customer_id: saleData.customer_id,
      subtotal: saleData.subtotal,
      discount: saleData.discount,
      total_amount: saleData.total_amount,
      payment_method: saleData.payment_method,
      payment_status: saleData.payment_status,
    })
    .select('*, customers(*)')
    .single();

  if (saleErr || !createdSale) {
    console.error('Error recording sale in Supabase:', saleErr);
    throw new Error(saleErr?.message || 'Failed to create sale in database');
  }

  // 2. Insert items into sale_items table
  if (items.length > 0) {
    const itemsToInsert = items.map((it) => ({
      sale_id: createdSale.id,
      product_id: it.product_id,
      quantity: it.quantity,
      unit_price: it.unit_price,
      total: it.total,
    }));

    const { error: itemsErr } = await supabase
      .from('sale_items')
      .insert(itemsToInsert);

    if (itemsErr) {
      console.error('Error recording sale items in Supabase:', itemsErr);
    }
  }

  // 3. Deduct stock for each sold product
  for (const item of items) {
    await adjustProductStock(
      item.product_id,
      'stock_out',
      item.quantity,
      `Sale Invoice #${createdSale.id.slice(0, 8)}`
    );
  }

  // 4. Record income in finance ledger if paid
  if (saleData.payment_status === 'paid') {
    try {
      await supabase.from('income').insert({
        category: 'Sales',
        amount: saleData.total_amount,
        description: `POS Sale Receipt #${createdSale.id.slice(0, 8)}`,
        date: new Date().toISOString().split('T')[0],
      });
    } catch (fErr) {
      console.warn('Could not auto-log income entry for sale:', fErr);
    }
  }

  return {
    ...createdSale,
    customer: createdSale.customers,
    items_count: items.length,
    items: items.map((it, idx) => ({
      id: `si-${idx}`,
      sale_id: createdSale.id,
      product_id: it.product_id,
      quantity: it.quantity,
      unit_price: it.unit_price,
      total: it.total,
      created_at: new Date().toISOString(),
      product_name: it.product_name,
    })),
  };
}
