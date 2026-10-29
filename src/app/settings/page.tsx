import React from 'react';
import { redirect } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { ConfigBanner } from '@/components/common/ConfigBanner';
import { logout } from '@/app/auth/actions';
import {
  User,
  Shield,
  Database,
  CheckCircle2,
  AlertTriangle,
  Key,
  Globe,
  LogOut,
  FileCode,
} from 'lucide-react';

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isConfigured = isSupabaseConfigured();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured';
  const rawKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const hasAnonKey = Boolean(rawKey && !rawKey.includes('placeholder'));

  const fullName = user?.user_metadata?.full_name || 'Student';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ConfigBanner />
      <Navbar userEmail={user?.email} userName={fullName} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="pb-2 border-b border-slate-200">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Settings & Architecture
          </h1>
          <p className="text-sm text-slate-500">
            Manage your student profile, view database connection status, and review security rules.
          </p>
        </div>

        {/* User Account Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Student Profile</h2>
              <p className="text-xs text-slate-500">Authenticated user details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
                Full Name
              </span>
              <span className="font-semibold text-slate-800">{fullName}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-xs font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
                Email Address
              </span>
              <span className="font-semibold text-slate-800">
                {user?.email || 'Not logged in (Guest)'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 sm:col-span-2">
              <span className="text-xs font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
                Supabase User UUID (auth.uid())
              </span>
              <span className="font-mono text-xs text-slate-600 break-all">
                {user?.id || 'None'}
              </span>
            </div>
          </div>
        </div>

        {/* Supabase Connection Status Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Supabase Integration Status</h2>
              <p className="text-xs text-slate-500">Live configuration and environment parameters</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-xs font-bold text-slate-700 block">NEXT_PUBLIC_SUPABASE_URL</span>
                  <span className="font-mono text-xs text-slate-500">{supabaseUrl}</span>
                </div>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  isConfigured
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {isConfigured ? 'Active' : 'Missing / Placeholder'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-xs font-bold text-slate-700 block">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                  <span className="font-mono text-xs text-slate-500">
                    {hasAnonKey ? '••••••••••••••••••••••••' : 'Missing / Placeholder'}
                  </span>
                </div>
              </div>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  hasAnonKey
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {hasAnonKey ? 'Configured' : 'Missing'}
              </span>
            </div>
          </div>
        </div>

        {/* Database Migration Instructions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Database Schema & RLS Policies</h2>
              <p className="text-xs text-slate-500">
                SQL migration is located at{' '}
                <code className="text-indigo-600 font-mono">
                  supabase/migrations/20261029000000_create_assignments_table.sql
                </code>
              </p>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto space-y-1">
            <p className="text-slate-400">-- 1. Create table with PostgreSQL Row Level Security (RLS)</p>
            <p className="text-emerald-400">CREATE TABLE public.assignments (...);</p>
            <p className="text-slate-400">-- 2. Enforce authenticated ownership via auth.uid()</p>
            <p className="text-indigo-300">ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;</p>
            <p className="text-slate-400">-- 3. Dedicated SELECT, INSERT, UPDATE, DELETE policies applied</p>
          </div>
        </div>

        {/* Sign Out Card */}
        {user && (
          <div className="pt-2">
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out of AssignFlow
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

