'use client';

import React from 'react';
import { Menu, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
}

export function Header({ title = 'Overview', onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Link to AI Assistant */}
        <Link
          href="/assistant"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Assistant</span>
        </Link>
      </div>
    </header>
  );
}
