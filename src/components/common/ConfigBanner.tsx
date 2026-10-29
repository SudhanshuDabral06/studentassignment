import React from 'react';
import Link from 'next/link';
import { Database, AlertTriangle } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export function ConfigBanner() {
  const isConfigured = isSupabaseConfigured();

  if (isConfigured) return null;

  return (
    <div className="bg-amber-500 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-100" />
          <span>
            <strong>Supabase Setup Required:</strong> Connect your Supabase project in{' '}
            <code className="bg-amber-600/60 px-1.5 py-0.5 rounded font-mono text-xs">.env.local</code>{' '}
            and run the SQL migration to enable full real-time database persistence and authentication.
          </span>
        </div>
        <Link
          href="/settings"
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-amber-800 rounded-lg text-xs font-semibold hover:bg-amber-50 transition-colors shadow-sm whitespace-nowrap"
        >
          <Database className="w-3.5 h-3.5" />
          Setup Guide
        </Link>
      </div>
    </div>
  );
}

