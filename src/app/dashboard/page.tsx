import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getDashboardData } from '@/lib/assignments';
import { Navbar } from '@/components/layout/Navbar';
import { ConfigBanner } from '@/components/common/ConfigBanner';
import { StatCards } from '@/components/dashboard/StatCards';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { AssignmentCard } from '@/components/assignments/AssignmentCard';
import {
  PlusCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  Calendar,
} from 'lucide-react';

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/dashboard');
  }

  const { stats, upcoming, recent, error } = await getDashboardData();
  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ConfigBanner />
      <Navbar userEmail={user.email} userName={fullName} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome & Action Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {fullName}!
              </h1>
              <span className="hidden sm:inline-block">
                <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Here is your semester overview and upcoming assignment milestones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/assignments/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all hover:scale-[1.01]"
            >
              <PlusCircle className="w-4 h-4" />
              New Assignment
            </Link>
          </div>
        </div>

        {/* Dashboard Stat Cards & Progress */}
        <StatCards stats={stats} />

        {/* Main 2-Column Section: Upcoming Deadlines & Recent Assignments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Deadlines (1 column on desktop) */}
          <div className="lg:col-span-1">
            <UpcomingDeadlines assignments={upcoming} />
          </div>

          {/* Recent Assignments Overview (2 columns on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-800">Recent Assignments</h3>
                </div>
                <Link
                  href="/assignments"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  View All ({stats.total}) <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recent.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">
                    No assignments added yet
                  </h4>
                  <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
                    Create your first assignment or exam deadline to start tracking your academic
                    progress.
                  </p>
                  <Link
                    href="/assignments/new"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Create First Assignment
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recent.slice(0, 4).map((assignment) => (
                    <div
                      key={assignment.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {assignment.subject}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          {assignment.status}
                        </span>
                      </div>
                      <Link
                        href={`/assignments/${assignment.id}`}
                        className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 mb-1 block"
                      >
                        {assignment.title}
                      </Link>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(assignment.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

