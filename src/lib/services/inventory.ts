import { createClient } from '@/lib/supabase/client';
import { Product, Supplier, StockMovementType } from '@/types/database';

export const fallbackProducts: Product[] = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    name: 'Wireless Barcode Scanner',
    sku: 'WBS-102',
    category: 'POS Hardware',
    selling_price: 4500,
    purchase_price: 3100,
    stock_quantity: 3,
    minimum_stock: 10,
    supplier_id: '11111111-1111-1111-1111-111111111103',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    name: 'Thermal Receipt Paper (80mm x 50m)',
    sku: 'TRR-080',
    category: 'Supplies',
    selling_price: 120,
    purchase_price: 65,
    stock_quantity: 4,
    minimum_stock: 25,
    supplier_id: '11111111-1111-1111-1111-111111111102',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    name: 'USB POS Interface Cable',
    sku: 'CBL-USB-01',
    category: 'Accessories',
    selling_price: 350,
    purchase_price: 140,
    stock_quantity: 2,
    minimum_stock: 8,
    supplier_id: '11111111-1111-1111-1111-111111111101',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222204',
    name: 'Electronic Cash Drawer 24V',
    sku: 'ECD-024',
    category: 'POS Hardware',
    selling_price: 3200,
    purchase_price: 2100,
    stock_quantity: 14,
    minimum_stock: 5,
    supplier_id: '11111111-1111-1111-1111-111111111101',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222205',
    name: 'Thermal Desktop Label Printer',
    sku: 'TDL-400',
    category: 'POS Hardware',
    selling_price: 11500,
    purchase_price: 8200,
    stock_quantity: 8,
    minimum_stock: 4,
    supplier_id: '11111111-1111-1111-1111-111111111103',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222206',
    name: 'Bluetooth Mobile Card Swiper',
    sku: 'BCS-050',
    category: 'POS Hardware',
    selling_price: 2800,
    purchase_price: 1850,
    stock_quantity: 12,
    minimum_stock: 6,
    supplier_id: '11111111-1111-1111-1111-111111111103',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const fallbackSuppliers: Supplier[] = [
  {
    id: '11111111-1111-1111-1111-111111111101',
    name: 'Apex Hardware Ltd',
    contact_name: 'Vikram Malhotra',
    phone: '+91 98100 12345',
    email: 'sales@apexhardware.in',
    address: 'Plot 42, Okhla Ind Area, New Delhi',
    created_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-111111111102',
    name: 'PrintTek Paper Mills',
    contact_name: 'Sanjay Gupta',
    phone: '+91 98200 23456',
    email: 'orders@printtek.com',
    address: 'Sector 18, Gurugram, Haryana',
    created_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-111111111103',
    name: 'OmniPOS Devices Co',
    contact_name: 'Meera Nair',
    phone: '+91 98300 34567',
    email: 'meera@omnipos.co',
    address: 'Electronic City, Bengaluru, Karnataka',
    created_at: new Date().toISOString(),
  },
];

export async function fetchProducts(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.error('Error fetching products from Supabase:', err);
  }

  // Check localStorage for offline/demo edits if available in browser
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('biz_products');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
  }

  return fallbackProducts;
}

export async function fetchSuppliers(): Promise<Supplier[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.error('Error fetching suppliers from Supabase:', err);
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('biz_suppliers');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
  }

  return fallbackSuppliers;
}

export async function saveProduct(
  productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
  id?: string
): Promise<Product> {
  const supabase = createClient();

  if (id) {
    // Update existing
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          ...productData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data;
      }
    } catch {}

    // Local fallback update
    const products = await fetchProducts();
    const index = products.findIndex((p) => p.id === id);
    const updated: Product = {
      ...products[index],
      ...productData,
      updated_at: new Date().toISOString(),
    };
    if (index !== -1) {
      products[index] = updated;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('biz_products', JSON.stringify(products));
    }
    return updated;
  } else {
    // Create new
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          ...productData,
        })
        .select()
        .single();

      if (!error && data) {
        return data;
      }
    } catch {}

    // Local fallback create
    const newProduct: Product = {
      id: crypto.randomUUID ? crypto.randomUUID() : `prod-${Date.now()}`,
      ...productData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const products = await fetchProducts();
    const updatedList = [newProduct, ...products];
    if (typeof window !== 'undefined') {
      localStorage.setItem('biz_products', JSON.stringify(updatedList));
    }
    return newProduct;
  }
}

export async function removeProduct(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    await supabase.from('products').delete().eq('id', id);
  } catch {}

  if (typeof window !== 'undefined') {
    const products = await fetchProducts();
    const filtered = products.filter((p) => p.id !== id);
    localStorage.setItem('biz_products', JSON.stringify(filtered));
  }
  return true;
}

export async function adjustProductStock(
  productId: string,
  type: StockMovementType,
  quantity: number,
  notes?: string
): Promise<Product | null> {
  const products = await fetchProducts();
  const product = products.find((p) => p.id === productId);
  if (!product) return null;

  let newQty = product.stock_quantity;
  if (type === 'stock_in') {
    newQty += quantity;
  } else if (type === 'stock_out') {
    newQty = Math.max(0, newQty - quantity);
  } else {
    newQty = quantity;
  }

  // Update in Supabase
  try {
    const supabase = createClient();
    await supabase
      .from('products')
      .update({ stock_quantity: newQty, updated_at: new Date().toISOString() })
      .eq('id', productId);

    await supabase.from('stock_movements').insert({
      product_id: productId,
      type,
      quantity,
      notes: notes || `Stock ${type} adjustment`,
    });
  } catch {}

  // Update locally
  product.stock_quantity = newQty;
  product.updated_at = new Date().toISOString();
  if (typeof window !== 'undefined') {
    localStorage.setItem('biz_products', JSON.stringify(products));
  }

  return product;
}

export async function saveSupplier(
  supplierData: Omit<Supplier, 'id' | 'created_at'>
): Promise<Supplier> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('suppliers')
      .insert(supplierData)
      .select()
      .single();

    if (!error && data) return data;
  } catch {}

  const newSupplier: Supplier = {
    id: crypto.randomUUID ? crypto.randomUUID() : `sup-${Date.now()}`,
    ...supplierData,
    created_at: new Date().toISOString(),
  };

  const suppliers = await fetchSuppliers();
  const updated = [...suppliers, newSupplier];
  if (typeof window !== 'undefined') {
    localStorage.setItem('biz_suppliers', JSON.stringify(updated));
  }
  return newSupplier;
}
