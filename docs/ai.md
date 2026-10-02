# AI Integration Plan

## Goal

Use AI as a small demonstration feature, not as the core backend.

The application must work normally even when the Groq API is unavailable.

## Provider

Groq API only.

No paid OpenAI/Azure/Anthropic API dependency.

## Where AI Is Used

### 1. Business Assistant

Example questions:

- What were my sales this month?
- Which products are low on stock?
- What were my largest expenses?
- Which product sold the most?
- Summarize this month's business performance.

## Architecture

User
 ↓
AI Assistant UI
 ↓
Next.js server route/action
 ↓
Identify required data
 ↓
Supabase query
 ↓
Application calculates metrics
 ↓
Small structured context
 ↓
Groq API
 ↓
Short natural-language answer
 ↓
User

## Important

Groq does NOT get direct database access.

Groq does NOT execute SQL.

Groq does NOT calculate authoritative business numbers.

The application calculates the numbers first.

Example context:

```text
Business period: September 2026

Total sales: 184
Revenue: ₹245000
Expenses: ₹96000
Approximate profit: ₹149000
Top product: Product A
Low-stock products: Product C, Product F
```

The AI receives only the information required for the question.

## AI Request Limits

For the college project:

- No automatic AI calls.
- No dashboard AI calls.
- No AI calls during CRUD.
- No AI calls during normal report generation.
- No background AI jobs.
- No polling.
- Short responses.
- Small prompts.
- Small context.
- Simple cooldown/rate limit.

## Fallback

If Groq is unavailable:

Display:

"AI Assistant is temporarily unavailable. You can still use all business management features."

The rest of the application must continue working.

## Mock Mode

Implement an optional development/demo mode.

If `AI_MOCK_MODE=true`:
- Do not call Groq.
- Return predefined responses based on common demo questions.

This allows the final college demonstration to work even if the API quota is unavailable.

## Optional AI Summary

A "Generate AI Summary" button may be provided on the Reports page.

This must be:
- manual
- optional
- one request
- based on already-calculated report metrics

Never automatically call AI when opening a report.

## What AI Must NOT Do

Do not ask the model to:
- calculate revenue
- calculate profit
- calculate tax
- determine stock quantity
- modify database records
- authenticate users
- make authorization decisions
- generate database queries that execute automatically

The AI is a natural-language explanation layer over trusted application data.
