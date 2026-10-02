import { createClient } from '@/lib/supabase/client';
import { Sale, SaleItem, Customer } from '@/types/database';
import { adjustProductStock, fetchProducts } from './inventory';

export interface SaleWithDetails extends Sale {
  customer?: Customer | null;
  items_count?: number;
  items?: (SaleItem & { product_name?: string })[];
}

export const fallbackSales: SaleWithDetails[] = [
  {
    id: 'ORD-9821',
    customer_id: '33333333-3333-3333-3333-333333333301',
    created_by: null,
    subtotal: 14500,
    discount: 0,
    total_amount: 14500,
    payment_status: 'paid',
    payment_method: 'upi',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    customer: {
      id: '33333333-3333-3333-3333-333333333301',
      name: 'Acme Retailers Pvt Ltd',
      phone: '+91 98765 43210',
      email: 'orders@acmeretail.com',
      category: 'high_value',
      notes: 'Key wholesale buyer',
      created_at: new Date().toISOString(),
    },
    items_count: 3,
    items: [
      {
        id: 'si-1',
        sale_id: 'ORD-9821',
        product_id: '22222222-2222-2222-2222-222222222201',
        product_name: 'Wireless Barcode Scanner',
        quantity: 2,
        unit_price: 4500,
        total: 9000,
        created_at: new Date().toISOString(),
      },
      {
        id: 'si-2',
        sale_id: 'ORD-9821',
        product_id: '22222222-2222-2222-2222-222222222204',
        product_name: 'Electronic Cash Drawer 24V',
        quantity: 1,
        unit_price: 3200,
        total: 3200,
        created_at: new Date().toISOString(),
      },
      {
        id: 'si-3',
        sale_id: 'ORD-9821',
        product_id: '22222222-2222-2222-2222-222222222205',
        product_name: 'Thermal Desktop Label Printer',
        quantity: 1,
        unit_price: 2300,
        total: 2300,
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'ORD-9820',
    customer_id: '33333333-3333-3333-3333-333333333302',
    created_by: null,
    subtotal: 3200,
    discount: 0,
    total_amount: 3200,
    payment_status: 'paid',
    payment_method: 'cash',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    customer: {
      id: '33333333-3333-3333-3333-333333333302',
      name: 'Rahul Sharma',
      phone: '+91 98111 22334',
      email: 'rahul.s@gmail.com',
      category: 'regular',
      notes: null,
      created_at: new Date().toISOString(),
    },
    items_count: 1,
    items: [
      {
        id: 'si-4',
        sale_id: 'ORD-9820',
        product_id: '22222222-2222-2222-2222-222222222204',
        product_name: 'Electronic Cash Drawer 24V',
        quantity: 1,
        unit_price: 3200,
        total: 3200,
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'ORD-9819',
    customer_id: '33333333-3333-3333-3333-333333333303',
    created_by: null,
    subtotal: 9400,
    discount: 500,
    total_amount: 8900,
    payment_status: 'pending',
    payment_method: 'card',
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    customer: {
      id: '33333333-3333-3333-3333-333333333303',
      name: 'Priya Traders',
      phone: '+91 97222 33445',
      email: 'contact@priyatraders.in',
      category: 'regular',
      notes: null,
      created_at: new Date().toISOString(),
    },
    items_count: 2,
    items: [
      {
        id: 'si-5',
        sale_id: 'ORD-9819',
        product_id: '22222222-2222-2222-2222-222222222201',
        product_name: 'Wireless Barcode Scanner',
        quantity: 2,
        unit_price: 4500,
        total: 9000,
        created_at: new Date().toISOString(),
      },
      {
        id: 'si-6',
        sale_id: 'ORD-9819',
        product_id: '22222222-2222-2222-2222-222222222203',
        product_name: 'USB POS Interface Cable',
        quantity: 1,
        unit_price: 400,
        total: 400,
        created_at: new Date().toISOString(),
      },
    ],
  },
];

export async function fetchSales(): Promise<SaleWithDetails[]> {
  try {
    const supabase = createClient();
    const { data: sales, error } = await supabase
      .from('sales')
      .select('*, customers(*), sale_items(*, products(name))')
      .order('created_at', { ascending: false });

    if (!error && sales && sales.length > 0) {
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
  } catch (err) {
    console.error('Error fetching sales from Supabase:', err);
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('biz_sales');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
  }

  return fallbackSales;
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
  const saleId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  // 1. Deduct Inventory stock for all items
  for (const item of items) {
    await adjustProductStock(
      item.product_id,
      'stock_out',
      item.quantity,
      `Sale Invoice #${saleId}`
    );
  }

  // 2. Save in Supabase
  try {
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
      .select()
      .single();

    if (!saleErr && createdSale) {
      // Insert sale items
      await supabase.from('sale_items').insert(
        items.map((it) => ({
          sale_id: createdSale.id,
          product_id: it.product_id,
          quantity: it.quantity,
          unit_price: it.unit_price,
          total: it.total,
        }))
      );

      // Record income if paid
      if (saleData.payment_status === 'paid') {
        await supabase.from('income').insert({
          category: 'Product Sales',
          amount: saleData.total_amount,
          description: `Sale Order #${saleId}`,
          date: new Date().toISOString().split('T')[0],
        });
      }
    }
  } catch (err) {
    console.error('Supabase sale insert error:', err);
  }

  // 3. Update local state
  const newSale: SaleWithDetails = {
    id: saleId,
    customer_id: saleData.customer_id,
    created_by: null,
    subtotal: saleData.subtotal,
    discount: saleData.discount,
    total_amount: saleData.total_amount,
    payment_status: saleData.payment_status,
    payment_method: saleData.payment_method,
    created_at: new Date().toISOString(),
    items_count: items.length,
    items: items.map((it, idx) => ({
      id: `si-${Date.now()}-${idx}`,
      sale_id: saleId,
      product_id: it.product_id,
      product_name: it.product_name,
      quantity: it.quantity,
      unit_price: it.unit_price,
      total: it.total,
      created_at: new Date().toISOString(),
    })),
  };

  const existingSales = await fetchSales();
  const updated = [newSale, ...existingSales];
  if (typeof window !== 'undefined') {
    localStorage.setItem('biz_sales', JSON.stringify(updated));
  }

  return newSale;
}
