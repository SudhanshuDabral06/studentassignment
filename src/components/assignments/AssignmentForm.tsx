'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Assignment, AssignmentFormData, PriorityType, StatusType } from '@/types';
import { createAssignment, updateAssignment } from '@/lib/assignments';
import { Alert } from '@/components/ui/Alert';
import {
  BookOpen,
  Calendar,
  FileText,
  Flag,
  Layers,
  Save,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

interface AssignmentFormProps {
  initialData?: Assignment;
  isEdit?: boolean;
}

export function AssignmentForm({ initialData, isEdit = false }: AssignmentFormProps) {
  const router = useRouter();

  // Helper to format date for datetime-local input
  const getInitialDueDate = () => {
    if (initialData?.due_date) {
      const d = new Date(initialData.due_date);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    }
    // Default: Tomorrow at 23:59
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 0, 0);
    return new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const [formData, setFormData] = useState<AssignmentFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    subject: initialData?.subject || '',
    due_date: getInitialDueDate(),
    priority: (initialData?.priority as PriorityType) || 'Medium',
    status: (initialData?.status as StatusType) || 'Pending',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError('Assignment title is required.');
      return;
    }
    if (!formData.subject.trim()) {
      setError('Subject / Course name is required.');
      return;
    }
    if (!formData.due_date) {
      setError('Please select a valid deadline date and time.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEdit && initialData) {
        const res = await updateAssignment(initialData.id, formData);
        if (res.error) {
          setError(res.error);
          setIsSubmitting(false);
          return;
        }
        router.push(`/assignments/${initialData.id}`);
      } else {
        const res = await createAssignment(formData);
        if (res.error) {
          setError(res.error);
          setIsSubmitting(false);
          return;
        }
        router.push('/assignments');
      }
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred while saving the assignment.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Assignment Title <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Operating Systems Term Project, Calculus Problem Set 4"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Subject & Due Date Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Subject / Course <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Computer Science, Mathematics, Physics"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Due Date & Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Due Date & Time <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="datetime-local"
                required
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Priority & Status Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Priority Level
            </label>
            <div className="relative">
              <Flag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as PriorityType })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Progress Status
            </label>
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as StatusType })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white"
              >
                <option value="Pending">Pending (Not Started)</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Description & Notes <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add key rubric requirements, reference links, chapter sections, or team notes..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-y"
            />
          </div>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Link
          href={isEdit && initialData ? `/assignments/${initialData.id}` : '/assignments'}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-100 transition-all hover:scale-[1.01]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEdit ? 'Update Assignment' : 'Create Assignment'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

