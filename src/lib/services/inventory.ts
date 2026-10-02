import { createClient } from '@/lib/supabase/client';
import { Product, Supplier, StockMovementType } from '@/types/database';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Error fetching products from Supabase:', err);
    return [];
  }
}

export async function fetchSuppliers(): Promise<Supplier[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching suppliers from Supabase:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Error fetching suppliers from Supabase:', err);
    return [];
  }
}

export async function saveProduct(
  productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>,
  id?: string
): Promise<Product> {
  const supabase = createClient();

  if (id) {
    // Update existing product
    const { data, error } = await supabase
      .from('products')
      .update({
        ...productData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Error updating product in Supabase:', error);
      throw new Error(error?.message || 'Failed to update product');
    }
    return data;
  } else {
    // Insert new product
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...productData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating product in Supabase:', error);
      throw new Error(error?.message || 'Failed to create product');
    }
    return data;
  }
}

export async function removeProduct(id: string): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting product from Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error deleting product:', err);
    return false;
  }
}

export async function adjustProductStock(
  productId: string,
  type: StockMovementType,
  quantity: number,
  notes?: string
): Promise<Product | null> {
  try {
    const supabase = createClient();
    
    // 1. Fetch current product
    const { data: prod, error: fetchErr } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (fetchErr || !prod) {
      console.error('Product not found for adjustment:', fetchErr);
      return null;
    }

    let newQty = prod.stock_quantity;
    if (type === 'stock_in') {
      newQty += quantity;
    } else if (type === 'stock_out') {
      newQty = Math.max(0, newQty - quantity);
    } else {
      newQty = quantity;
    }

    // 2. Update stock quantity
    const { data: updatedProduct, error: updateErr } = await supabase
      .from('products')
      .update({ stock_quantity: newQty, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select()
      .single();

    if (updateErr) {
      console.error('Error updating product stock:', updateErr);
      return null;
    }

    // 3. Record stock movement entry
    await supabase.from('stock_movements').insert({
      product_id: productId,
      type,
      quantity,
      notes: notes || `Stock ${type} adjustment`,
    });

    return updatedProduct;
  } catch (err) {
    console.error('Error adjusting product stock:', err);
    return null;
  }
}

export async function saveSupplier(
  supplierData: Omit<Supplier, 'id' | 'created_at'>
): Promise<Supplier> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('suppliers')
    .insert(supplierData)
    .select()
    .single();

  if (error || !data) {
    console.error('Error saving supplier to Supabase:', error);
    throw new Error(error?.message || 'Failed to save supplier');
  }
  return data;
}
