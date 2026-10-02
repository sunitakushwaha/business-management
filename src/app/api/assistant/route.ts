import { NextRequest, NextResponse } from 'next/server';
import { askBusinessAssistant } from '@/lib/groq';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'A valid question string is required.' },
        { status: 400 }
      );
    }

    // Deterministically query business metrics from Supabase
    let totalSalesCount = 0;
    let totalRevenue = 0;
    let totalExpenses = 0;
    let lowStockNames: string[] = ['None'];

    try {
      const supabase = await createClient();
      const [productsRes, salesRes, expensesRes] = await Promise.all([
        supabase.from('products').select('name, stock_quantity, minimum_stock'),
        supabase.from('sales').select('total_amount'),
        supabase.from('expenses').select('amount'),
      ]);

      if (salesRes.data && salesRes.data.length > 0) {
        totalSalesCount = salesRes.data.length;
        totalRevenue = salesRes.data.reduce((acc, s: { total_amount: number }) => acc + (s.total_amount || 0), 0);
      }

      if (expensesRes.data && expensesRes.data.length > 0) {
        totalExpenses = expensesRes.data.reduce((acc, e: { amount: number }) => acc + (e.amount || 0), 0);
      }

      if (productsRes.data && productsRes.data.length > 0) {
        const lows = productsRes.data.filter(
          (p: { stock_quantity: number; minimum_stock: number }) => p.stock_quantity <= p.minimum_stock
        );
        if (lows.length > 0) {
          lowStockNames = lows.map((p: { name: string; stock_quantity: number }) => `${p.name} (${p.stock_quantity} in stock)`);
        } else {
          lowStockNames = ['None. All items adequately stocked.'];
        }
      }
    } catch (err) {
      console.error('Server query error during assistant metrics aggregation:', err);
    }

    const netProfit = totalRevenue - totalExpenses;

    const structuredContext = `
Business Period: October 2026
Total Sales Orders: ${totalSalesCount}
Total Revenue: ₹${totalRevenue.toLocaleString()}
Operating Expenses: ₹${totalExpenses.toLocaleString()}
Deterministic Net Profit: ₹${netProfit.toLocaleString()}
Items Needing Restock: ${lowStockNames.join(', ')}
Top Product Categories: POS Hardware, Paper Supplies
`;

    const result = await askBusinessAssistant(question.trim(), structuredContext.trim());

    return NextResponse.json(result);
  } catch (error) {
    console.error('Assistant API error:', error);
    return NextResponse.json(
      {
        answer: 'AI Assistant is temporarily unavailable. You can still use all business management features.',
        isMock: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
