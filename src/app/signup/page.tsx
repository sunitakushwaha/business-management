'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Building2, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { UserRole } from '@/types/database';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'owner' | 'manager' | 'employee' | 'admin'>('owner');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.session) {
        // Logged in immediately (auto-confirm enabled)
        router.push('/dashboard');
      } else {
        // Confirmation email sent
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create an Account</h1>
          <p className="text-sm text-slate-400 mt-1">
            Register your business profile and assign your staff role
          </p>
        </div>

        <Card className="bg-slate-900/90 border-slate-800 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white text-lg">Sign up for BizManage</CardTitle>
            <CardDescription className="text-slate-400">
              Role-based access will be configured according to your selection
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
                {error}
              </div>
            )}

            {success ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-semibold text-emerald-200">Registration Successful</h4>
                <p className="text-xs text-slate-300">
                  Your account has been created. If email confirmation is enabled in your Supabase project, please check your inbox, then proceed to sign in.
                </p>
                <Link href="/login">
                  <Button size="sm" className="w-full mt-2">
                    Go to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Vikram Joshi"
                  className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                />

                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vikram@business.com"
                  className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                />

                <Input
                  label="Password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500"
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-200">
                    System Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="block w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="owner">Owner (Full Business Operations & Finance)</option>
                    <option value="manager">Manager (Inventory, Sales & Staff)</option>
                    <option value="employee">Employee (Sales & Catalog Only)</option>
                    <option value="admin">Admin (System Configuration)</option>
                  </select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white mt-2"
                  isLoading={isLoading}
                >
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}

            <div className="mt-5 pt-4 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                Already registered?{' '}
                <Link
                  href="/login"
                  className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
