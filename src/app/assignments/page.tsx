import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAssignments, getUserSubjects } from '@/lib/assignments';
import { Navbar } from '@/components/layout/Navbar';
import { ConfigBanner } from '@/components/common/ConfigBanner';
import { AssignmentList } from '@/components/assignments/AssignmentList';
import { PlusCircle, Layers } from 'lucide-react';

export default async function AssignmentsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/assignments');
  }

  const [{ assignments, error }, subjects] = await Promise.all([
    getAssignments(),
    getUserSubjects(),
  ]);

  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ConfigBanner />
      <Navbar userEmail={user.email} userName={fullName} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                All Assignments
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              Filter, search, organize, and manage your academic tasks and project deadlines.
            </p>
          </div>

          <Link
            href="/assignments/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all hover:scale-[1.01] self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            New Assignment
          </Link>
        </div>

        {/* Client-side Assignment List with Search, Filter & Sort */}
        <AssignmentList
          initialAssignments={assignments}
          subjects={subjects}
        />
      </main>
    </div>
  );
}

