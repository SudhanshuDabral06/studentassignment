import React from 'react';
import { DashboardStats } from '@/types';
import {
  BookOpen,
  Clock,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

interface StatCardsProps {
  stats: DashboardStats;
}

export function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      title: 'Total Assignments',
      value: stats.total,
      description: 'All recorded academic tasks',
      icon: BookOpen,
      iconBg: 'bg-indigo-50 text-indigo-600',
      border: 'border-slate-200',
    },
    {
      title: 'Pending',
      value: stats.pending,
      description: 'Not yet started',
      icon: Clock,
      iconBg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      description: 'Currently working on',
      icon: PlayCircle,
      iconBg: 'bg-blue-50 text-blue-600',
      border: 'border-blue-100',
    },
    {
      title: 'Completed',
      value: stats.completed,
      description: 'Finished assignments',
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      description: 'Past due deadline',
      icon: AlertTriangle,
      iconBg: 'bg-rose-50 text-rose-600',
      border: stats.overdue > 0 ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200',
      highlight: stats.overdue > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 5 Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`p-5 rounded-2xl bg-white border ${card.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-3xl font-extrabold tracking-tight ${
                    card.highlight ? 'text-rose-600' : 'text-slate-900'
                  }`}
                >
                  {card.value}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Completion Progress Bar Widget */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Completion Progress</h3>
              <p className="text-xs text-slate-500">
                {stats.completed} of {stats.total} assignments completed
              </p>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-600">{stats.completionRate}%</span>
            <span className="text-xs text-slate-400 font-medium">completed</span>
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, stats.completionRate))}%` }}
          />
        </div>
      </div>
    </div>
  );
}

