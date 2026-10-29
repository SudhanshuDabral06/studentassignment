import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/layout/Navbar';
import { ConfigBanner } from '@/components/common/ConfigBanner';
import { AssignmentForm } from '@/components/assignments/AssignmentForm';
import { PlusCircle } from 'lucide-react';

export default async function NewAssignmentPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/assignments/new');
  }

  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ConfigBanner />
      <Navbar userEmail={user.email} userName={fullName} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <PlusCircle className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create Assignment
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Add a new coursework task, project milestone, or exam deadline to your semester schedule.
          </p>
        </div>

        <AssignmentForm isEdit={false} />
      </main>
    </div>
  );
}

