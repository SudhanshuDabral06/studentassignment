import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAssignmentById } from '@/lib/assignments';
import { Navbar } from '@/components/layout/Navbar';
import { ConfigBanner } from '@/components/common/ConfigBanner';
import { AssignmentForm } from '@/components/assignments/AssignmentForm';
import { Edit2 } from 'lucide-react';

interface EditAssignmentPageProps {
  params: {
    id: string;
  };
}

export default async function EditAssignmentPage({ params }: EditAssignmentPageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirectTo=/assignments/${params.id}/edit`);
  }

  const { assignment, error } = await getAssignmentById(params.id);

  if (error || !assignment) {
    notFound();
  }

  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ConfigBanner />
      <Navbar userEmail={user.email} userName={fullName} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Edit2 className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Edit Assignment
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Update deadlines, progress status, priority, or details for &quot;{assignment.title}&quot;.
          </p>
        </div>

        <AssignmentForm initialData={assignment} isEdit={true} />
      </main>
    </div>
  );
}

