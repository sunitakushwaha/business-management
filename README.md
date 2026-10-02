# BizManage — AI-Powered Business Operations & Management Suite

A clean, functional college-level web application designed for small and medium-sized businesses to manage core operations from a unified interface.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Supabase (PostgreSQL + Auth + RLS)**, and the **Groq API** (`qwen/qwen3.8-27b`).

---

## 🌟 Core Modules Implemented (All 12 Phases)

1. **Authentication & Role-Based Access Control (Phase 1)**
   - Supabase Auth email/password login and registration.
   - 4 System roles: `Owner`, `Manager`, `Employee`, `Admin`.
   - Automated profile generation via PostgreSQL trigger (`on_auth_user_created`).
   - Route protection middleware (`src/middleware.ts`).

2. **Database Foundation (Phase 2)**
   - 11 authoritative PostgreSQL tables in Supabase:
     - `profiles`, `products`, `suppliers`, `customers`, `employees`, `attendance`, `sales`, `sale_items`, `income`, `expenses`, `stock_movements`.
   - Primary/foreign keys, indexes, and Row Level Security (RLS) policies.

3. **Inventory Management (Phase 3)**
   - Product catalog CRUD with search & category filtering.
   - Stock-in (+add) & Stock-out (-deduct) movements with reason tracking.
   - Low-stock and out-of-stock automated alert thresholds.
   - Supplier directory & product assignment.

4. **Sales & Billing Invoicing (Phase 4)**
   - Sale order creation with line items and real-time inventory stock checks.
   - Deterministic discount arithmetic, subtotal, and tax calculations.
   - **Automatic stock deduction** in inventory upon order completion.
   - Printable / PDF-ready customer invoices (`window.print()`).

5. **Finance & Cash Flow Ledger (Phase 5)**
   - Real-time income & expense entries with category tagging.
   - Deterministic net business balance (`Net Profit = Total Income - Total Expenses`).
   - Category breakdowns and date filters.

6. **Customers & Staff (CRM) (Phase 6)**
   - Customer CRM with value classification (`high_value`, `regular`, `at_risk`).
   - Staff directory with monthly salary compensation tracking.
   - Daily attendance logging (`present`, `late`, `half_day`, `absent`).

7. **Executive Dashboard (Phase 7)**
   - Top-level business telemetry cards (Revenue, Orders, Expenses, Net Margin).
   - Interactive 7-Day Revenue Trend graph powered by **Recharts**.
   - Low-stock quick restock alerts and recent transaction history.

8. **Deterministic Reports (Phase 8)**
   - Operational statements for Sales, Inventory Valuation, Finances, and Staff Attendance.
   - Print/Save PDF support.
   - Optional "Generate AI Summary" button providing executive briefings via Groq.

9. **AI Business Assistant (Phase 9)**
   - Server-side Groq integration using `qwen/qwen3.8-27b`.
   - **Strict guardrail**: The model never touches raw SQL or calculates arithmetic. The application computes numbers deterministically first, then supplies a concise context to the LLM for natural language explanations.
   - Fallback and mock mode support (`AI_MOCK_MODE=true`).

10. **Predictive Statistical Forecasting (Phase 10)**
    - 14-day rolling velocity calculation for catalog products.
    - Estimated days until depletion and projected stock runout dates.
    - 5-day moving average revenue run rate projection.

11. **System & Security Verification (Phase 11)**
    - Automated test suite (`scripts/verify-system.ts`) verifying deterministic math, inventory bounds, and AI fallbacks (11/11 passing).

12. **Deployment Readiness (Phase 12)**
    - Vercel configuration (`vercel.json`), security headers, and production bundle validation.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (Turbopack, App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database & Auth**: Supabase PostgreSQL + Auth (SSR via `@supabase/ssr`)
- **Visualizations**: Recharts
- **Icons**: Lucide React
- **Validation**: Zod
- **AI Provider**: Groq API (`qwen/qwen3.8-27b`)

---

## 🚀 Getting Started

### 1. Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
GROQ_API_KEY=gsk_your_groq_api_key_here
AI_MOCK_MODE=false
```

### 2. Database Setup

1. Open your Supabase Dashboard -> **SQL Editor**.
2. Run `supabase/schema.sql` to initialize all 11 tables, triggers, and RLS policies.
3. (Optional) Run `supabase/seed.sql` to populate realistic starter catalog, customer, and staff data.

### 3. Development Server

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### 4. Production Build & Test

```bash
# Run automated verification suite
npx tsx scripts/verify-system.ts

# Production build
npm run build
```

---

## 📋 Recommended Demonstration Flow

1. **Sign In**: Navigate to `/login` and enter your credentials or click "explore demo directly".
2. **Dashboard**: View KPI cards, revenue graph, and low-stock alerts.
3. **Inventory**: Browse products, click **Add Product** or **Stock In** to adjust units.
4. **Create Sale**: Go to `/sales` -> **Create New Sale**, choose products, confirm order.
5. **Observe Inventory Update**: Return to `/inventory` and verify that units decremented automatically.
6. **Finance**: View recorded income from the sale and log operating expenses.
7. **Forecast**: Go to `/forecast` to see moving-average projections and stock runout dates.
8. **Reports**: View itemized statements and click **Optional AI Summary**.
9. **AI Assistant**: Go to `/assistant`, ask *"What were my sales this month?"*, and view the grounded response.
10. **Sign Out**: Click the logout button in the sidebar footer.
