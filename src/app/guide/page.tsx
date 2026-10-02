'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  Users,
  UserCheck,
  FileBarChart,
  Bot,
  Compass,
  FolderTree,
  HelpCircle,
  Sparkles,
  Printer,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import Link from 'next/link';

export default function GuidePage() {
  const [openSection, setOpenSection] = useState<string | null>('overview');

  const toggleSection = (id: string) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Welcome Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
              📖
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                BizManage Plain English Guide
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A simple, beginner-friendly tour of what this app does and how the code works
              </p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Intro Hero Banner */}
        <section className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white shadow-md border border-indigo-800/40 space-y-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 inline-block">
            Secret Direct URL Guide
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Everything you need to know, explained simply
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            You don&apos;t need to be a programmer or a business expert to understand this app. Think of BizManage like a <strong>digital store manager in your computer</strong> that replaces messy notebooks, paper receipts, and lost calculator slips with one clean system.
          </p>
        </section>

        {/* Quick Summary in 3 Bullets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-2xl">🏪</div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">1. What it does</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              It helps any shopkeeper or business owner track what they sell, what items are left on the shelf, and if they are making a profit.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-2xl">🤖</div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">2. How the AI works</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The AI never guesses your money. The computer does 100% of the math first, then the AI explains it to you like a friendly assistant.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-2xl">📁</div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">3. How the code works</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Organized into clear folders: one for the visible pages, one for buttons & popups, and one for the database filing cabinet.
            </p>
          </div>
        </div>

        {/* Part 1: Walkthrough of Every Single Screen in the App */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🖥️</span> Part 1: What Every Screen in the App Does
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Click any section below to see what it is used for and what happens when you use it
            </p>
          </div>

          {/* 1. Dashboard */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <button
              onClick={() => toggleSection('dashboard')}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    1. The Dashboard (The Bird&apos;s-Eye View)
                  </h3>
                  <span className="text-xs text-slate-500">Your morning overview screen</span>
                </div>
              </div>
              {openSection === 'dashboard' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openSection === 'dashboard' && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-sm space-y-3">
                <p>
                  <strong>Why it exists:</strong> When you open a shop in the morning, you want to know right away: <em>How much money did we make this week? Are we running out of anything? What were the latest orders?</em>
                </p>
                <div className="space-y-1.5 pl-4 border-l-2 border-indigo-500 text-xs text-slate-600 dark:text-slate-300">
                  <p>• <strong>Top Cards:</strong> Show Total Sales, Order Counts, Overhead Expenses, and Net Profit.</p>
                  <p>• <strong>The Graph:</strong> Shows whether your sales are going up or down over the last 7 days.</p>
                  <p>• <strong>Low Stock Box:</strong> Warns you in orange if an item is almost finished on your shelf.</p>
                  <p>• <strong>Recent Orders:</strong> A live list of the latest people who bought things from you.</p>
                </div>
              </div>
            )}
          </div>

          {/* 2. Inventory */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <button
              onClick={() => toggleSection('inventory')}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    2. Inventory (The Storage Room / Shelves)
                  </h3>
                  <span className="text-xs text-slate-500">Where you track all your physical products</span>
                </div>
              </div>
              {openSection === 'inventory' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openSection === 'inventory' && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-sm space-y-3">
                <p>
                  <strong>Why it exists:</strong> If you don&apos;t count your stock, you will promise an item to a customer only to realize your shelf is completely empty.
                </p>
                <div className="space-y-1.5 pl-4 border-l-2 border-emerald-500 text-xs text-slate-600 dark:text-slate-300">
                  <p>• <strong>Add Product:</strong> Enter what you sell, its price, what you bought it for, and how many you have.</p>
                  <p>• <strong>Stock In:</strong> When a new delivery box arrives from your supplier, click this to add units to your shelf count.</p>
                  <p>• <strong>Stock Out:</strong> If something broke, expired, or was returned, click this to safely remove it from the shelf count.</p>
                  <p>• <strong>Search & Filter:</strong> Instantly type a name like &quot;Printer&quot; or click &quot;Low Stock Only&quot; to see what needs reordering.</p>
                </div>
              </div>
            )}
          </div>

          {/* 3. Sales */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <button
              onClick={() => toggleSection('sales')}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    3. Sales & Billing (The Cash Register)
                  </h3>
                  <span className="text-xs text-slate-500">Creating customer bills & taking money</span>
                </div>
              </div>
              {openSection === 'sales' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openSection === 'sales' && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-sm space-y-3">
                <p>
                  <strong>Why it exists:</strong> When a customer buys something, you need to calculate their total, give them a receipt, and decrease your inventory so you know how many you have left.
                </p>
                <div className="space-y-1.5 pl-4 border-l-2 border-blue-500 text-xs text-slate-600 dark:text-slate-300">
                  <p>• <strong>Create New Sale:</strong> Pick a customer (or leave it as Walk-in), pick the items they want, and set any discounts.</p>
                  <p>• <strong>Automatic Stock Subtraction:</strong> The moment you hit Confirm, the system automatically subtracts those items from your storage room so you never have to do math by hand.</p>
                  <p>• <strong>View Invoice:</strong> Generates a clean, professional invoice with a print button ready to hand to the customer or save as PDF.</p>
                </div>
              </div>
            )}
          </div>

          {/* 4. Finance */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <button
              onClick={() => toggleSection('finance')}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    4. Finance (The Money Book)
                  </h3>
                  <span className="text-xs text-slate-500">Tracking every penny in and every penny out</span>
                </div>
              </div>
              {openSection === 'finance' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openSection === 'finance' && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-sm space-y-3">
                <p>
                  <strong>Why it exists:</strong> Just because you sold ₹50,000 worth of goods doesn&apos;t mean you made ₹50,000 profit. You still have to pay rent, electricity, supplier bills, and worker wages.
                </p>
                <div className="space-y-1.5 pl-4 border-l-2 border-amber-500 text-xs text-slate-600 dark:text-slate-300">
                  <p>• <strong>Income:</strong> Automatically records money that comes in from sales, plus any extra services you provide.</p>
                  <p>• <strong>Expenses:</strong> Click &quot;Add Expense&quot; whenever you pay for electricity, tea, broadband, or office supplies.</p>
                  <p>• <strong>Net Balance:</strong> Takes all Income minus all Expenses to show you your real cash profit.</p>
                </div>
              </div>
            )}
          </div>

          {/* 5. Customers & Employees */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <button
              onClick={() => toggleSection('crm')}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    5. Customers & Employees (Your People Book)
                  </h3>
                  <span className="text-xs text-slate-500">Keeping track of who buys and who works</span>
                </div>
              </div>
              {openSection === 'crm' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openSection === 'crm' && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-sm space-y-3">
                <p>
                  <strong>Why it exists:</strong> A business is built on people. You need to know your best customers to treat them well, and you need to know who showed up to work today.
                </p>
                <div className="space-y-1.5 pl-4 border-l-2 border-purple-500 text-xs text-slate-600 dark:text-slate-300">
                  <p>• <strong>Customers:</strong> Store client names, phone numbers, and categories (VIPs, regulars, or inactive customers you should call).</p>
                  <p>• <strong>Employees:</strong> Stores each worker&apos;s job title, monthly pay, and contact info.</p>
                  <p>• <strong>Mark Attendance:</strong> Click to mark workers as Present, Late, Half Day, or Absent with one click.</p>
                </div>
              </div>
            )}
          </div>

          {/* 6. Forecast & Reports */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <button
              onClick={() => toggleSection('forecast')}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    6. Forecast & Reports (The Planner & Printable Papers)
                  </h3>
                  <span className="text-xs text-slate-500">Looking into the future & official printouts</span>
                </div>
              </div>
              {openSection === 'forecast' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openSection === 'forecast' && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-sm space-y-3">
                <p>
                  <strong>Why it exists:</strong> Good business owners don&apos;t wait until they run out of goods to order more. They look at how fast things sell.
                </p>
                <div className="space-y-1.5 pl-4 border-l-2 border-teal-500 text-xs text-slate-600 dark:text-slate-300">
                  <p>• <strong>Forecast:</strong> Looks at how many items you sell per day and calculates: <em>&quot;You have 3 barcode scanners left, and you sell 1 every two days. You will run out in 6 days. Order more now!&quot;</em></p>
                  <p>• <strong>Reports:</strong> Generates clean, ready-to-print tables of Sales, Inventory, and Staff that you can hand to a manager or accountant.</p>
                </div>
              </div>
            )}
          </div>

          {/* 7. AI Assistant */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <button
              onClick={() => toggleSection('assistant')}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                    7. AI Assistant (Your 24/7 Smart Helper)
                  </h3>
                  <span className="text-xs text-slate-500">Ask simple English questions about your store</span>
                </div>
              </div>
              {openSection === 'assistant' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {openSection === 'assistant' && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-sm space-y-3">
                <p>
                  <strong>Why it exists:</strong> Instead of searching through 5 different pages of tables, you can just ask: <em>&quot;What were my biggest sales this month?&quot;</em> or <em>&quot;Which items are running low?&quot;</em>
                </p>
                <div className="space-y-1.5 pl-4 border-l-2 border-indigo-500 text-xs text-slate-600 dark:text-slate-300">
                  <p>• <strong>How it works:</strong> The computer calculates the real numbers from your database first. Then it hands those verified facts to the AI (powered by Groq).</p>
                  <p>• <strong>Safety Rule:</strong> The AI is NOT allowed to make up numbers or do math. It only explains what is actually recorded in your store.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Part 2: How the Code Works — Explained in Plain English */}
        <section className="space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>📂</span> Part 2: Where to Find Everything in the Code
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              If someone asks &quot;Where is the code for X?&quot;, here is where it lives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* The Web Pages */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                src/app/
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">The Visible Web Pages</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                This is where every screen lives. Each subfolder represents a page you visit in your web browser:
              </p>
              <ul className="text-xs text-slate-500 space-y-1 font-mono">
                <li>• <span className="text-slate-800 dark:text-slate-200">/dashboard</span> : Main overview page</li>
                <li>• <span className="text-slate-800 dark:text-slate-200">/inventory</span> : Product catalog & stock</li>
                <li>• <span className="text-slate-800 dark:text-slate-200">/sales</span> : Bill creation & invoices</li>
                <li>• <span className="text-slate-800 dark:text-slate-200">/finance</span> : Income & expense ledger</li>
                <li>• <span className="text-slate-800 dark:text-slate-200">/customers</span> : Customer contact profiles</li>
                <li>• <span className="text-slate-800 dark:text-slate-200">/employees</span> : Staff roster & attendance</li>
                <li>• <span className="text-slate-800 dark:text-slate-200">/forecast</span> : Depletion & runout dates</li>
                <li>• <span className="text-slate-800 dark:text-slate-200">/assistant</span> : Groq AI business chat</li>
              </ul>
            </div>

            {/* The Building Blocks */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                src/components/
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">The Lego Bricks (UI Pieces)</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Instead of rewriting a button or card 50 times, we made reusable Lego pieces:
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• <strong>components/ui/</strong> : Buttons, Input boxes, Badges, Stat Cards</li>
                <li>• <strong>components/layout/</strong> : The dark Sidebar on the left, the top Header</li>
                <li>• <strong>components/inventory/</strong> : The popup window to add a new product or adjust stock</li>
                <li>• <strong>components/sales/</strong> : The popup window to make a bill and view printable invoices</li>
              </ul>
            </div>

            {/* The Logic & Math */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                src/lib/services/
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">The Brains & Math Engine</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                This is where all the real calculations happen without AI:
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• <strong>inventory.ts</strong> : Adds/subtracts stock, checks low stock rules</li>
                <li>• <strong>sales.ts</strong> : Does the arithmetic (Price × Qty − Discount = Total) and updates storage</li>
                <li>• <strong>finance.ts</strong> : Calculates Total Income − Total Expenses = Net Profit</li>
                <li>• <strong>forecast.ts</strong> : Calculates daily sales speed and days to runout</li>
                <li>• <strong>groq.ts</strong> : Connects securely to the Groq AI model</li>
              </ul>
            </div>

            {/* The Database */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <span className="text-xs font-bold font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">
                supabase/ & .env.local
              </span>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">The Permanent Filing Cabinet</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Where everything is permanently saved in the cloud:
              </p>
              <ul className="text-xs text-slate-500 space-y-1">
                <li>• <strong>supabase/schema.sql</strong> : The blueprint for all 11 tables (products, sales, customers, etc.)</li>
                <li>• <strong>supabase/seed.sql</strong> : Sample data for instant demonstration</li>
                <li>• <strong>.env.local</strong> : The private key ring containing your Supabase URL and Groq API key (never shared publicly!)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Part 3: Why Each Tool Was Picked */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚙️</span> Part 3: Why We Used These Technologies (Plain English)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <p className="font-bold text-slate-900 dark:text-white">Next.js 16 (App Router)</p>
              <p className="text-slate-500 mt-1">
                The engine that makes web pages load instantly without annoying whole-page refreshes.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <p className="font-bold text-slate-900 dark:text-white">Tailwind CSS v4</p>
              <p className="text-slate-500 mt-1">
                The styling paintbrush that makes every card, button, and dark-mode color look sleek and professional.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <p className="font-bold text-slate-900 dark:text-white">Supabase (PostgreSQL)</p>
              <p className="text-slate-500 mt-1">
                A super-safe cloud database that keeps all your customer records, sales, and products permanently safe.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <p className="font-bold text-slate-900 dark:text-white">Groq AI (qwen/qwen3.8-27b)</p>
              <p className="text-slate-500 mt-1">
                The fastest AI processor in the world that answers store questions in under half a second.
              </p>
            </div>
          </div>
        </section>

        {/* Part 4: How to Give a 2-Minute Demo */}
        <section className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 space-y-3">
          <h2 className="text-base font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
            <span>🎤</span> How to Show This App in a College Presentation (Step-by-Step)
          </h2>
          <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2">
            <li><strong>Start at Dashboard:</strong> Show the revenue numbers, the weekly chart, and point out how clean the dark sidebar is.</li>
            <li><strong>Go to Inventory:</strong> Point out a product (like &quot;Wireless Barcode Scanner&quot; with 3 in stock).</li>
            <li><strong>Go to Sales & Make a Bill:</strong> Click &quot;Create New Sale&quot;, pick that scanner, pick quantity 1, and click Confirm.</li>
            <li><strong>Show the Magic:</strong> Go back to Inventory and show that the scanner stock dropped from 3 to 2 automatically!</li>
            <li><strong>Show Finance & Forecast:</strong> Show how the sale added money to Finance, and show the Forecast page predicting when items will run out.</li>
            <li><strong>Ask the AI:</strong> Go to AI Assistant, click &quot;What were my sales this month?&quot;, and show the answer generated live in simple English.</li>
          </ol>
        </section>
      </main>
    </div>
  );
}
