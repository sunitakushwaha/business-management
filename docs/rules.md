# Development Rules

These rules are mandatory for the AI coding agent.

## 1. Project Goal

Build a clean, functional college project.

Do not turn this into a huge enterprise ERP.

Prefer simple working implementations over complicated architecture.

## 2. Stack Rules

Use only the approved stack:

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Vercel
- Groq API
- Recharts

Do not introduce:
- Express backend
- Python backend
- MongoDB
- Firebase
- another AI provider
- unnecessary microservices

## 3. TypeScript

- Use TypeScript everywhere.
- Avoid `any`.
- Define types for database records and important API responses.
- Keep shared types organized.

## 4. Database

- Supabase PostgreSQL is the source of truth.
- Use proper foreign keys.
- Add timestamps to important records.
- Use RLS for tenant/user data protection.
- Never rely only on frontend checks for authorization.

## 5. Authentication & Authorization

Every protected page must verify authentication.

Every sensitive database operation must enforce authorization server-side/RLS.

Do not trust a role sent by the client.

## 6. Business Logic

Calculations must be deterministic.

Examples:
- revenue
- total sales
- discounts
- expenses
- profit
- stock quantity
- low-stock status
- tax calculations

These must NOT depend on AI.

## 7. AI Rules

AI usage must be minimal.

### Allowed
- Answer business questions using relevant database summaries.
- Generate an optional short natural-language business summary.

### Not allowed
- Calling AI for every page load.
- Calling AI to calculate numbers.
- Calling AI for charts.
- Calling AI for every report.
- Calling AI during CRUD operations.
- Sending the entire database to the AI.
- Sending passwords, tokens, API keys, or unnecessary personal information.

### AI request flow

User question
→ determine relevant business data
→ query Supabase
→ calculate/prepare a small structured context
→ send only that context to Groq
→ display response

If Groq fails, show a useful error and keep the rest of the application working.

## 8. AI Cost Protection

- No automatic/background AI requests.
- No AI requests on dashboard load.
- No AI requests on navigation.
- No polling.
- No streaming unless genuinely useful.
- Keep prompts short.
- Keep context small.
- Limit response length.
- Add a simple per-user request cooldown/rate limit.
- Provide a fallback "AI unavailable" state.

For demo mode, include sample/mock AI responses if needed so the project can still be demonstrated without consuming API quota.

## 9. UI

- Responsive desktop + mobile.
- Consistent spacing.
- Clear navigation.
- Accessible forms.
- Loading states.
- Empty states.
- Error states.
- Success feedback.

Avoid:
- excessive animations
- unnecessary gradients
- huge dashboards
- decorative components that do not help functionality

## 10. Code Quality

- Keep components reasonably small.
- Reuse common UI components.
- Do not duplicate business logic.
- Validate form input.
- Handle errors explicitly.
- Use meaningful names.
- Remove dead code.

## 11. Security

Never expose:
- Groq API key
- Supabase service role key
- secrets
- private database credentials

Never put secret keys in client components.

Use RLS.

Validate all server inputs.

## 12. Implementation Discipline

Before creating a new feature:
1. Check whether the required database table exists.
2. Check whether a reusable component already exists.
3. Check whether the functionality already exists elsewhere.
4. Implement the smallest complete version.
5. Test it.
6. Only then move to the next feature.

Do not rewrite working features without a reason.

## 13. Documentation

Update documentation when:
- database schema changes
- major architecture changes
- environment variables change
- a major feature is added

Do not create documentation for every small code change.
