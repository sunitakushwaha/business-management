'use client';

import React, { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  userRole?: string;
  userName?: string;
  onLogout?: () => void;
}

export function AppShell({
  children,
  title = 'Dashboard',
  userRole = 'Owner',
  userName = 'Demo User',
  onLogout,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
      />

      <div className="lg:pl-64 flex flex-col flex-1">
        <Header
          title={title}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
