// Groq AI Integration Helper
// Strictly server-side only. Respects rules in docs/rules.md and docs/ai.md

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  answer: string;
  isMock: boolean;
  error?: string;
}

export async function askBusinessAssistant(
  question: string,
  structuredContext: string
): Promise<GroqResponse> {
  const isMockMode = process.env.AI_MOCK_MODE === 'true';
  const apiKey = process.env.GROQ_API_KEY;

  // If in mock mode or API key is not configured, provide realistic deterministic answers
  if (isMockMode || !apiKey) {
    const qLower = question.toLowerCase();
    let mockAnswer = "Here is a summary based on your business records:\n\n";

    if (qLower.includes('sale') || qLower.includes('revenue')) {
      mockAnswer += "• Total sales and revenue are currently on track according to recorded transactions.\n• Review the Sales and Reports tabs for itemized order breakdowns.";
    } else if (qLower.includes('stock') || qLower.includes('product') || qLower.includes('inventory')) {
      mockAnswer += "• Several products may be nearing minimum inventory thresholds.\n• Check the Inventory section to restock items marked with low-stock warnings.";
    } else if (qLower.includes('expense') || qLower.includes('profit') || qLower.includes('cost')) {
      mockAnswer += "• Operating expenses and cash flow are updated directly from logged income and expenses.\n• See the Finance tab for recent category expense breakdowns.";
    } else {
      mockAnswer += `Based on the provided business records:\n${structuredContext}\n\nAll operational calculations are deterministically computed from your database.`;
    }

    return {
      answer: mockAnswer,
      isMock: true,
    };
  }

  try {
    const systemPrompt = `You are a concise business management assistant for a small/medium business.
You are given verified summary metrics calculated from the database.
Answer the user's question clearly and briefly (2 to 4 sentences).
Do not guess or fabricate financial figures. Only use the provided metrics.`;

    const messages: GroqMessage[] = [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Business Metrics Context:\n${structuredContext}\n\nUser Question: ${question}`,
      },
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages,
        temperature: 0.2,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', errText);
      return {
        answer: 'AI Assistant is temporarily unavailable. You can still use all business management features.',
        isMock: false,
        error: `Groq error status: ${response.status}`,
      };
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'No response generated.';
    return {
      answer,
      isMock: false,
    };
  } catch (error) {
    console.error('Error contacting Groq API:', error);
    return {
      answer: 'AI Assistant is temporarily unavailable. You can still use all business management features.',
      isMock: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
