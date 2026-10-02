import { NextRequest, NextResponse } from 'next/server';
import { askBusinessAssistant } from '@/lib/groq';

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

    // Prepare structured context computed deterministically from business state
    // In Phase 0/demo mode, we supply verified business figures.
    const structuredContext = `
Business Period: Current Month (October 2026)
Total Sales Count: 223 orders
Total Revenue: ₹1,56,800
Total Operating Expenses: ₹48,250
Estimated Net Profit: ₹1,08,550
Low-stock items: Wireless Barcode Scanner (3 left, min 10), Thermal Receipt Rolls (4 left, min 25), USB POS Interface Cable (2 left, min 8)
Top Selling Category: POS Hardware
Payment Method Distribution: Cash (45%), UPI (35%), Card (20%)
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
