import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getAssignmentById } from '@/lib/assignments';
import { Navbar } from '@/components/layout/Navbar';
import { ConfigBanner } from '@/components/common/ConfigBanner';
import { AssignmentDetailView } from '@/components/assignments/AssignmentDetailView';

interface AssignmentPageProps {
  params: {
    id: string;
  };
}

export default async function AssignmentDetailPage({ params }: AssignmentPageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirectTo=/assignments/${params.id}`);
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

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AssignmentDetailView assignment={assignment} />
      </main>
    </div>
  );
}

