# Development Roadmap

Build in small working phases. Do not attempt every feature at once.

## Phase 0 — Project Setup

- Create Next.js TypeScript project
- Configure Tailwind
- Configure Supabase
- Configure environment variables
- Configure Git
- Create base layout
- Create navigation
- Create basic UI component system

### Deliverable
Application runs locally with Supabase connected.

---

## Phase 1 — Authentication & Roles

- Supabase email/password auth
- Login
- Logout
- Protected routes
- User profile
- Role system
- Basic RLS policies

Roles:
- Owner
- Manager
- Employee
- Admin

### Deliverable
Users can securely sign in and see pages according to their role.

---

## Phase 2 — Database Foundation

Create and test core tables:

- profiles
- products
- suppliers
- customers
- employees
- sales
- sale_items
- expenses
- income
- attendance

Add:
- primary keys
- foreign keys
- timestamps
- indexes where useful
- RLS policies

### Deliverable
Stable database foundation.

---

## Phase 3 — Inventory

Implement:

- Product CRUD
- Supplier CRUD
- Stock quantity
- Minimum stock level
- Stock-in
- Stock-out
- Low-stock indicator

### Deliverable
A complete basic inventory workflow.

---

## Phase 4 — Sales

Implement:

- Create sale
- Add sale items
- Calculate subtotal
- Discount
- Final amount
- Payment status
- Reduce inventory after confirmed sale
- Sales history
- Simple invoice view

### Deliverable
A user can complete a sale and inventory updates correctly.

---

## Phase 5 — Finance

Implement:

- Income records
- Expense records
- Categories
- Date filtering
- Total income
- Total expenses
- Approximate profit/cash-flow summary

Keep calculations simple and deterministic.

### Deliverable
Business financial summary works from actual database data.

---

## Phase 6 — Customers & Employees

### Customers
- Customer CRUD
- Purchase history
- Basic category
- Notes/feedback

### Employees
- Employee CRUD
- Attendance
- Basic shift/activity records
- Basic salary field

### Deliverable
Basic CRM and employee functionality.

---

## Phase 7 — Dashboard

Create dashboard cards:

- Revenue
- Sales
- Expenses
- Approximate profit
- Low-stock products
- Recent sales

Create Recharts visualizations:

- Sales over time
- Revenue over time
- Expense category breakdown

Important:
Dashboard numbers come from database queries/calculations, NOT AI.

### Deliverable
Clean business overview dashboard.

---

## Phase 8 — Reports

Implement deterministic report generation.

Reports:
- Sales
- Inventory
- Expenses
- Customers
- Employees

Support at least a clean printable/downloadable report.

If PDF/Excel libraries are required, add only the minimum necessary dependency.

### Deliverable
User can select a report and generate it from database data.

---

## Phase 9 — AI Business Assistant

Implement the smallest useful AI feature.

Flow:

1. User enters question.
2. Application identifies the required data category.
3. Supabase query retrieves relevant records/aggregates.
4. Application prepares a small structured context.
5. Groq receives the question + relevant context.
6. Groq returns a concise answer.

Example:
"What were my sales this month?"

Application calculates:
- total sales
- revenue
- number of transactions
- top products

Then Groq converts those values into a natural-language response.

### Deliverable
AI assistant answers useful business questions without having direct database access.

---

## Phase 10 — Optional Predictive Features

Only implement if enough time remains.

Possible simple features:
- Moving-average sales forecast
- Estimated stock runout date
- Basic demand trend

These should use deterministic formulas/statistics first.

Do not build a complex ML system.

### Deliverable
A simple "forecast" section demonstrating predictive analysis.

---

## Phase 11 — Security & Testing

Test:

- Authentication
- Role permissions
- RLS
- CRUD operations
- Inventory calculations
- Sales calculations
- Finance calculations
- AI failure handling
- Responsive UI
- Invalid form inputs

Remove test/debug data.

### Deliverable
Stable demo-ready application.

---

## Phase 12 — Deployment

- Deploy to Vercel
- Configure production environment variables
- Configure Supabase production settings
- Test authentication
- Test database access
- Test Groq integration
- Test complete demo workflow

### Final Demo Flow

Login
→ Dashboard
→ Inventory
→ Create Sale
→ Inventory updates
→ Finance
→ Reports
→ AI Assistant
→ Logout
