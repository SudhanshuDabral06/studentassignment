'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Assignment, StatusType } from '@/types';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badge';
import { formatDateTime, getRelativeDeadline } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';
import { updateAssignment } from '@/lib/assignments';

interface AssignmentCardProps {
  assignment: Assignment;
  onDeleteRequest: (assignment: Assignment) => void;
  onStatusUpdated?: () => void;
}

export function AssignmentCard({
  assignment,
  onDeleteRequest,
  onStatusUpdated,
}: AssignmentCardProps) {
  const [currentStatus, setCurrentStatus] = useState<StatusType>(assignment.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const relative = getRelativeDeadline(assignment.due_date, currentStatus);

  const handleStatusChange = async (newStatus: StatusType) => {
    if (newStatus === currentStatus) return;
    setIsUpdatingStatus(true);
    setCurrentStatus(newStatus);
    await updateAssignment(assignment.id, { status: newStatus });
    setIsUpdatingStatus(false);
    if (onStatusUpdated) onStatusUpdated();
  };

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-200 hover:shadow-md p-5 flex flex-col justify-between ${
        relative.isPast
          ? 'border-rose-200/80 bg-gradient-to-b from-rose-50/10 to-white'
          : 'border-slate-200'
      }`}
    >
      <div>
        {/* Header row: Subject & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100/80">
            {assignment.subject}
          </span>
          <div className="flex items-center gap-1.5">
            <PriorityBadge priority={assignment.priority} />
            <StatusBadge status={currentStatus} />
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/assignments/${assignment.id}`}
          className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2 inline-flex items-center gap-1.5"
        >
          {assignment.title}
          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
        </Link>

        {/* Description */}
        {assignment.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
            {assignment.description}
          </p>
        )}
      </div>

      {/* Footer Details & Actions */}
      <div className="pt-4 border-t border-slate-100 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Due Date & Relative Urgency */}
        <div className="flex flex-col">
          <span
            className={`text-xs font-semibold flex items-center gap-1 ${
              relative.isPast
                ? 'text-rose-600'
                : relative.isImminent
                ? 'text-amber-600'
                : 'text-slate-600'
            }`}
          >
            {relative.isPast ? (
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            ) : (
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            )}
            {relative.text}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3" />
            {formatDateTime(assignment.due_date)}
          </span>
        </div>

        {/* Action Buttons & Status Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Quick status dropdown */}
          <select
            value={currentStatus}
            disabled={isUpdatingStatus}
            onChange={(e) => handleStatusChange(e.target.value as StatusType)}
            className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2 py-1 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-colors"
            title="Change progress status"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Edit Button */}
          <Link
            href={`/assignments/${assignment.id}/edit`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Edit assignment"
          >
            <Edit2 className="w-4 h-4" />
          </Link>

          {/* Delete Button */}
          <button
            onClick={() => onDeleteRequest(assignment)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete assignment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

