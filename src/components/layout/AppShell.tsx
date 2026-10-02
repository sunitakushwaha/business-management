'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types/database';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  userRole?: string;
  userName?: string;
}

export function AppShell({
  children,
  title = 'Dashboard',
  userRole: initialRole = 'Owner',
  userName: initialName = 'Demo User',
}: AppShellProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState(initialName);
  const [displayRole, setDisplayRole] = useState(initialRole);

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          const profile = data as Profile | null;

          if (profile) {
            setUserProfile(profile);
            setDisplayName(profile.full_name || user.email?.split('@')[0] || 'User');
            setDisplayRole(profile.role);
          } else {
            setDisplayName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
            setDisplayRole(user.user_metadata?.role || 'owner');
          }
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
      }
    }

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
    } catch (err) {
      console.error('Error signing out:', err);
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={displayRole}
        userName={displayName}
        onLogout={handleLogout}
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
