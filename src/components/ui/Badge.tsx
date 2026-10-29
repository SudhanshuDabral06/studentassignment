import React from 'react';
import { PriorityType, StatusType } from '@/types';
import { getPriorityStyles, getStatusStyles, cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: PriorityType;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const styles = getPriorityStyles(priority);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', styles.dot)} />
      {priority} Priority
    </span>
  );
}

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = getStatusStyles(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        styles.bg,
        styles.text,
        styles.border,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', styles.dot)} />
      {status}
    </span>
  );
}

