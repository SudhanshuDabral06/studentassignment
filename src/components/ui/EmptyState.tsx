import React from 'react';
import Link from 'next/link';
import { BookOpen, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionHref?: string;
  actionText?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No assignments found',
  description = 'You have no assignments matching this criteria. Create one to get started!',
  actionHref = '/assignments/new',
  actionText = 'New Assignment',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
        {icon || <BookOpen className="w-7 h-7" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          {actionText}
        </Link>
      )}
    </div>
  );
}

