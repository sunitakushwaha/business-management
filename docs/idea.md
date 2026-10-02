# AI Business Management Platform with Smart Report Generator

## 1. Project Overview

A college-level web application for small and medium-sized businesses to manage core business operations from one place.

The system combines sales, inventory, employees, customers, finances, reports, and a lightweight AI Business Assistant into a single web interface.

The goal is NOT to build a production-grade ERP. The goal is to build a clean, functional academic prototype that demonstrates database management, authentication, CRUD operations, dashboards, reporting, and practical AI integration.

## 2. Core Problem

Business information is often scattered across spreadsheets, chats, paper records, and separate tools. This makes it difficult to get a unified view of sales, inventory, expenses, employees, and customers.

This project centralizes those records and provides simple operational summaries.

## 3. Main Users

- Owner
- Manager
- Employee
- Admin

## 4. Core Modules

### Authentication & Roles
- Login/logout
- Role-based access
- Separate permissions for Owner, Manager, Employee, and Admin

### Dashboard
Show useful business metrics such as:
- Total sales
- Revenue
- Expenses
- Approximate profit
- Low-stock products
- Recent sales
- Simple sales/revenue charts

### Sales & Invoices
- Create sales
- Add products to a sale
- Apply discounts
- Track payment status
- Generate a simple printable/downloadable invoice

### Inventory
- Products
- Stock quantity
- Minimum stock threshold
- Supplier details
- Stock-in / stock-out records
- Low-stock warnings

### Employees
- Employee profiles
- Attendance
- Basic shift/activity records
- Basic salary information

### Customers / CRM
- Customer profiles
- Purchase history
- Customer category
- Feedback/notes

### Finance
- Income records
- Expense records
- Categories
- Simple cash-flow summary
- Basic tax field/calculation where applicable

### Reports
Generate reports from database data:
- Sales report
- Inventory report
- Expense report
- Employee report
- Customer report

Reports should primarily be generated from database data using deterministic code. Do NOT call the AI API just to format ordinary reports.

### AI Business Assistant
Allow users to ask questions such as:
- "What were my sales this month?"
- "Which products are low in stock?"
- "What were my biggest expenses?"
- "Which product sold the most?"

The AI should receive only the relevant summarized database data needed to answer the question.

## 5. AI Philosophy

AI is a supporting feature, not the foundation of the application.

The application must remain fully usable if the Groq API is unavailable.

Use Groq only for:
1. Natural-language business questions.
2. Optional short business summaries when explicitly requested.

Do NOT use AI for:
- Dashboard calculations
- Database CRUD
- Authentication
- Charts
- Normal PDF/Excel generation
- Basic profit calculations
- Stock calculations
- Tax arithmetic
- Filtering/searching

All numerical calculations must be performed by application/database logic.

## 6. Academic Scope

Prioritize a working prototype over feature quantity.

Must work:
- Authentication
- Roles
- Dashboard
- Sales
- Inventory
- Basic finance
- Basic customers
- Reports
- AI assistant

Can be simplified:
- Employee payroll
- CRM segmentation
- Forecasting
- Advanced accounting
- External integrations

## 7. Out of Scope

- POS hardware integration
- Barcode scanner/printer integration
- Government tax filing
- Shipping/carrier APIs
- Complex accounting
- Multi-company enterprise accounting
- Real-time external market data
- Paid AI services
- Background AI processing

## 8. Success Criteria

The project is successful when a demo user can:

1. Sign in.
2. View a business dashboard.
3. Add products and manage inventory.
4. Record a sale.
5. See stock and revenue update.
6. Add income/expenses.
7. View customers/employees.
8. Generate a report.
9. Ask the AI assistant a business question.
10. Receive an answer based on the application's own database.
