import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  Shield,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ConfigBanner } from '@/components/common/ConfigBanner';

export default async function HomePage() {
  const supabase = createClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (e) {
    user = null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ConfigBanner />

      {/* Navigation Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              Assign<span className="text-indigo-600">Flow</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Empowering College Students Everywhere
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
              Master Your Deadlines. <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 bg-clip-text text-transparent">
                Elevate Your Academic Flow.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              AssignFlow helps university students prioritize coursework, track submission
              deadlines, eliminate late penalties, and keep every semester organized.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-[1.02]"
              >
                Start Organizing Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Sign In to Account
              </Link>
            </div>

            {/* Feature Highlights Grid */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Deadline Tracking</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Relative countdowns and urgent alerts ensure you never miss a submission, midterm,
                  or project milestone.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Progress Analytics</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Real-time calculation of completed, pending, and overdue tasks giving you full
                  clarity on academic workload.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Supabase RLS Security</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Your academic records are completely isolated with PostgreSQL Row Level Security
                  and authenticated session controls.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">AssignFlow</span>
            <span>&copy; {new Date().getFullYear()} — Built for College Academic Success</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-indigo-600 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-indigo-600 transition-colors">
              Sign Up
            </Link>
            <Link href="/settings" className="hover:text-indigo-600 transition-colors">
              Setup Docs
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

