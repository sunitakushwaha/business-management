'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Bot, Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  isMock?: boolean;
}

const suggestedQuestions = [
  'What were my sales this month?',
  'Which products are low in stock?',
  'What were my biggest expenses?',
  'Summarize this month\'s business performance.',
];

export default function AssistantPage() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am your lightweight Groq-powered business assistant. You can ask me natural-language questions about your current sales, inventory alerts, or operating finances.',
    },
  ]);

  const handleAsk = async (textToAsk: string) => {
    if (!textToAsk.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToAsk,
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: textToAsk }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.answer || 'No answer generated.',
        isMock: data.isMock,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'AI Assistant is temporarily unavailable. You can still use all business management features.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell title="AI Business Assistant">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Compliance / Info Banner */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-white">
              Deterministic Guardrail Enabled
            </p>
            <p className="text-slate-400">
              In accordance with project rules, all business calculations (revenue, profit, tax, inventory counts) are computed authoritative by database logic. Groq AI provides natural-language summaries over verified metrics without direct SQL execution.
            </p>
          </div>
        </div>

        {/* Chat / Interaction Card */}
        <Card className="min-h-[480px] flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>Business Operations Assistant</CardTitle>
                  <CardDescription>Powered by Groq LLaMA 3.1 & Supabase aggregates</CardDescription>
                </div>
              </div>
              <Badge variant="info">Groq LLaMA 3.1</Badge>
            </div>
          </CardHeader>

          {/* Conversation history */}
          <CardContent className="flex-1 space-y-4 overflow-y-auto max-h-[420px] p-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-300 shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-xl rounded-xl p-3.5 text-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  {msg.isMock && (
                    <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-amber-500 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      Mock Demo Mode (AI_MOCK_MODE)
                    </span>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-10">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                Synthesizing metrics...
              </div>
            )}
          </CardContent>

          {/* Suggested quick chips */}
          <div className="px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
              Suggested Questions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  disabled={isLoading}
                  className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md text-slate-600 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition-colors disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Form input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(question);
            }}
            className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2"
          >
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about sales, inventory, or expenses..."
              disabled={isLoading}
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
            <Button type="submit" disabled={!question.trim() || isLoading} isLoading={isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
