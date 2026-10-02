# Technology Stack

## Frontend

### Next.js
- App Router
- TypeScript
- Server Components where useful
- Client Components only where interactivity is required

### Tailwind CSS
Used for all application styling.

Keep the UI clean and professional. Avoid unnecessary animations and visual complexity.

## Backend

### Next.js
Use:
- Server Actions for suitable mutations
- Route Handlers for API-style endpoints
- Server-side Supabase access for protected operations

Do NOT create a separate Express/Node backend.

## Database

### Supabase PostgreSQL

Supabase is responsible for:
- PostgreSQL database
- Authentication
- Row Level Security
- Storage if required

## Authentication

### Supabase Auth

Use email/password authentication initially.

User profile/role information should be stored in the application database and protected with RLS.

Roles:
- owner
- manager
- employee
- admin

## AI

### Groq API

Groq is the only external AI provider.

Keep AI usage extremely small because this is a college project with no budget.

AI should be called only from secure server-side code. Never expose the Groq API key to the browser.

Use environment variables.

## Charts

### Recharts

Use Recharts for:
- Sales trend
- Revenue trend
- Expense breakdown
- Inventory/status visualizations

Charts should consume already-calculated database/application data.

## Deployment

### Vercel

Deploy the Next.js application to Vercel.

Supabase remains the database/auth backend.

## Development Tools

- Git
- GitHub
- VS Code
- Supabase Dashboard
- Vercel Dashboard

## Packages

Prefer a small dependency set.

Do not install libraries unless they solve an actual project requirement.

Possible packages:
- @supabase/ssr
- @supabase/supabase-js
- recharts
- lucide-react
- zod

Add other packages only when necessary.

## Environment Variables

Expected variables:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GROQ_API_KEY=

Never commit `.env.local`.

## Architecture

Browser
  ↓
Next.js
  ├── UI / Server Components
  ├── Server Actions / Route Handlers
  ├── Business Logic
  └── Groq integration
          ↓
     Supabase
       ├── Auth
       ├── PostgreSQL
       └── Storage

The application should not require a separate backend server.
