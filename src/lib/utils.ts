import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Assignment, DashboardStats, PriorityType, StatusType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Checks if an assignment is overdue.
 * Rule: Not completed AND due_date is in the past.
 */
export function isOverdue(dueDate: string | Date, status: StatusType): boolean {
  if (status === 'Completed') return false;
  const due = new Date(dueDate);
  return due.getTime() < Date.now();
}

/**
 * Formats date into readable string: e.g. "Oct 29, 2026 at 5:00 PM"
 */
export function formatDateTime(dateString: string | Date): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Formats date without time: e.g. "Oct 29, 2026"
 */
export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Returns human-friendly relative time remaining or overdue text
 */
export function getRelativeDeadline(dueDate: string | Date, status: StatusType): { text: string; isPast: boolean; isImminent: boolean } {
  if (status === 'Completed') {
    return { text: 'Completed', isPast: false, isImminent: false };
  }

  const due = new Date(dueDate).getTime();
  const now = Date.now();
  const diffMs = due - now;
  const isPast = diffMs < 0;
  const absDiffHours = Math.abs(diffMs) / (1000 * 60 * 60);
  const absDiffDays = Math.floor(absDiffHours / 24);

  if (isPast) {
    if (absDiffDays === 0) {
      const hours = Math.max(1, Math.floor(absDiffHours));
      return { text: `${hours}h overdue`, isPast: true, isImminent: false };
    } else if (absDiffDays === 1) {
      return { text: '1 day overdue', isPast: true, isImminent: false };
    } else {
      return { text: `${absDiffDays} days overdue`, isPast: true, isImminent: false };
    }
  }

  // Future
  if (absDiffDays === 0) {
    const hours = Math.max(1, Math.floor(absDiffHours));
    return { text: `Due in ${hours}h`, isPast: false, isImminent: true };
  } else if (absDiffDays === 1) {
    return { text: 'Due tomorrow', isPast: false, isImminent: true };
  } else if (absDiffDays <= 3) {
    return { text: `Due in ${absDiffDays} days`, isPast: false, isImminent: true };
  } else {
    return { text: `Due in ${absDiffDays} days`, isPast: false, isImminent: false };
  }
}

/**
 * Calculates dashboard statistics from a list of assignments
 */
export function calculateStats(assignments: Assignment[]): DashboardStats {
  const total = assignments.length;
  let pending = 0;
  let inProgress = 0;
  let completed = 0;
  let overdue = 0;

  for (const item of assignments) {
    if (item.status === 'Completed') {
      completed++;
    } else {
      if (item.status === 'Pending') {
        pending++;
      } else if (item.status === 'In Progress') {
        inProgress++;
      }
      if (isOverdue(item.due_date, item.status)) {
        overdue++;
      }
    }
  }

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    pending,
    inProgress,
    completed,
    overdue,
    completionRate,
  };
}

export function getPriorityStyles(priority: PriorityType): { bg: string; text: string; border: string; dot: string } {
  switch (priority) {
    case 'High':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800',
        dot: 'bg-rose-500',
      };
    case 'Medium':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
        dot: 'bg-amber-500',
      };
    case 'Low':
    default:
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/40',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
        dot: 'bg-emerald-500',
      };
  }
}

export function getStatusStyles(status: StatusType): { bg: string; text: string; border: string; dot: string } {
  switch (status) {
    case 'Completed':
      return {
        bg: 'bg-teal-50 dark:bg-teal-950/40',
        text: 'text-teal-700 dark:text-teal-400',
        border: 'border-teal-200 dark:border-teal-800',
        dot: 'bg-teal-500',
      };
    case 'In Progress':
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/40',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
        dot: 'bg-blue-500',
      };
    case 'Pending':
    default:
      return {
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-700 dark:text-slate-300',
        border: 'border-slate-200 dark:border-slate-700',
        dot: 'bg-slate-400',
      };
  }
}

