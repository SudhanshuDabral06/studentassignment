'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Assignment, StatusType } from '@/types';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Alert } from '@/components/ui/Alert';
import { formatDateTime, getRelativeDeadline } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  ArrowLeft,
  CheckCircle,
  FileText,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { deleteAssignment, updateAssignment } from '@/lib/assignments';

interface AssignmentDetailViewProps {
  assignment: Assignment;
}

export function AssignmentDetailView({ assignment: initialAssignment }: AssignmentDetailViewProps) {
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment>(initialAssignment);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const relative = getRelativeDeadline(assignment.due_date, assignment.status);

  const handleStatusChange = async (newStatus: StatusType) => {
    if (newStatus === assignment.status) return;
    setIsUpdatingStatus(true);
    setFeedback(null);

    const res = await updateAssignment(assignment.id, { status: newStatus });
    setIsUpdatingStatus(false);

    if (res.error) {
      setFeedback({ type: 'error', message: res.error });
    } else if (res.assignment) {
      setAssignment(res.assignment);
      setFeedback({ type: 'success', message: `Status updated to ${newStatus}.` });
      router.refresh();
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setFeedback(null);

    const res = await deleteAssignment(assignment.id);
    setIsDeleting(false);

    if (res.error) {
      setFeedback({ type: 'error', message: res.error });
      setIsDeleteModalOpen(false);
    } else {
      router.push('/assignments');
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button and quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/assignments"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all assignments
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/assignments/${assignment.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Edit2 className="w-4 h-4 text-indigo-600" />
            Edit
          </Link>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {feedback && (
        <Alert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      {/* Main Detail Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8">
        {/* Header: Subject, Status, Priority */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              <Layers className="w-3.5 h-3.5" />
              {assignment.subject}
            </span>
            <PriorityBadge priority={assignment.priority} />
          </div>

          {/* Quick status selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={assignment.status}
              disabled={isUpdatingStatus}
              onChange={(e) => handleStatusChange(e.target.value as StatusType)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
            {assignment.title}
          </h1>
        </div>

        {/* Deadline & Overdue Highlight Bar */}
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            relative.isPast
              ? 'bg-rose-50/60 border-rose-200 text-rose-900'
              : 'bg-slate-50 border-slate-200/80 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                relative.isPast ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
              }`}
            >
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Deadline
              </p>
              <p className="text-sm font-semibold">{formatDateTime(assignment.due_date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span
              className={`text-sm font-bold ${
                relative.isPast
                  ? 'text-rose-600'
                  : relative.isImminent
                  ? 'text-amber-600'
                  : 'text-slate-600'
              }`}
            >
              {relative.text}
            </span>
          </div>
        </div>

        {/* Description & Notes */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-400" />
            Description & Instructions
          </h3>
          <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/60 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
            {assignment.description ? (
              assignment.description
            ) : (
              <span className="italic text-slate-400">
                No extra description or notes added for this assignment.
              </span>
            )}
          </div>
        </div>

        {/* Metadata Timestamps */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <span>Created on {new Date(assignment.created_at).toLocaleDateString()}</span>
          <span>Last updated {new Date(assignment.updated_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        title={assignment.title}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}

