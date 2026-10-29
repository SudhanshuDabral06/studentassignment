import React from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  className?: string;
  onClose?: () => void;
}

export function Alert({
  type = 'info',
  title,
  message,
  className,
  onClose,
}: AlertProps) {
  const icons = {
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
  };

  const bgs = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    error: 'bg-rose-50 border-rose-200 text-rose-900',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border text-sm',
        bgs[type],
        className
      )}
      role="alert"
    >
      {icons[type]}
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <p className="leading-relaxed">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors -mr-1 -mt-1 p-1"
          aria-label="Close"
        >
          &times;
        </button>
      )}
    </div>
  );
}

