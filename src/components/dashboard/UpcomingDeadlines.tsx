import React from 'react';
import Link from 'next/link';
import { Assignment } from '@/types';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { formatDateTime, getRelativeDeadline } from '@/lib/utils';
import { Calendar, ArrowRight, Clock, AlertCircle } from 'lucide-react';

interface UpcomingDeadlinesProps {
  assignments: Assignment[];
}

export function UpcomingDeadlines({ assignments }: UpcomingDeadlinesProps) {
  if (assignments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800">Upcoming Deadlines</h3>
          </div>
        </div>
        <p className="text-sm text-slate-500 text-center py-6">
          No pending deadlines! You are all caught up.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800">Upcoming Deadlines</h3>
        </div>
        <Link
          href="/assignments"
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          View all <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {assignments.map((assignment) => {
          const relative = getRelativeDeadline(assignment.due_date, assignment.status);

          return (
            <div
              key={assignment.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {assignment.subject}
                  </span>
                  <PriorityBadge priority={assignment.priority} />
                </div>
                <Link
                  href={`/assignments/${assignment.id}`}
                  className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-sm"
                >
                  {assignment.title}
                </Link>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-right">
                <div className="flex flex-col sm:items-end">
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      relative.isPast
                        ? 'text-rose-600'
                        : relative.isImminent
                        ? 'text-amber-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {relative.isPast && <AlertCircle className="w-3.5 h-3.5" />}
                    {relative.text}
                  </span>
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDateTime(assignment.due_date)}
                  </span>
                </div>
                <StatusBadge status={assignment.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

