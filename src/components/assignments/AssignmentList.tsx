'use client';

import React, { useState, useMemo } from 'react';
import { Assignment, PriorityType, StatusType } from '@/types';
import { AssignmentCard } from './AssignmentCard';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Alert } from '@/components/ui/Alert';
import { Search, Filter, RotateCcw, SlidersHorizontal, BookOpen } from 'lucide-react';
import { deleteAssignment } from '@/lib/assignments';
import { useRouter } from 'next/navigation';

interface AssignmentListProps {
  initialAssignments: Assignment[];
  subjects: string[];
}

export function AssignmentList({
  initialAssignments,
  subjects,
}: AssignmentListProps) {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('due_asc');

  // Delete modal state
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Sync if initialAssignments changes
  React.useEffect(() => {
    setAssignments(initialAssignments);
  }, [initialAssignments]);

  const hasActiveFilters =
    search.trim() !== '' ||
    selectedStatus !== 'All' ||
    selectedPriority !== 'All' ||
    selectedSubject !== 'All' ||
    sortOption !== 'due_asc';

  const clearFilters = () => {
    setSearch('');
    setSelectedStatus('All');
    setSelectedPriority('All');
    setSelectedSubject('All');
    setSortOption('due_asc');
  };

  // Filter & Sort Logic
  const filteredAssignments = useMemo(() => {
    return assignments
      .filter((assignment) => {
        // Search by title or subject
        if (search.trim()) {
          const query = search.toLowerCase();
          const matchTitle = assignment.title.toLowerCase().includes(query);
          const matchSubject = assignment.subject.toLowerCase().includes(query);
          if (!matchTitle && !matchSubject) return false;
        }

        // Status Filter
        if (selectedStatus !== 'All' && assignment.status !== selectedStatus) {
          return false;
        }

        // Priority Filter
        if (selectedPriority !== 'All' && assignment.priority !== selectedPriority) {
          return false;
        }

        // Subject Filter
        if (selectedSubject !== 'All' && assignment.subject !== selectedSubject) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'due_asc') {
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        } else if (sortOption === 'due_desc') {
          return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
        } else if (sortOption === 'created_desc') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sortOption === 'created_asc') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        return 0;
      });
  }, [assignments, search, selectedStatus, selectedPriority, selectedSubject, sortOption]);

  const handleDeleteConfirm = async () => {
    if (!assignmentToDelete) return;
    setIsDeleting(true);
    setFeedback(null);

    const result = await deleteAssignment(assignmentToDelete.id);
    setIsDeleting(false);

    if (result.error) {
      setFeedback({ type: 'error', message: `Failed to delete assignment: ${result.error}` });
    } else {
      setFeedback({
        type: 'success',
        message: `Assignment "${assignmentToDelete.title}" deleted successfully.`,
      });
      setAssignments((prev) => prev.filter((item) => item.id !== assignmentToDelete.id));
      setAssignmentToDelete(null);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert Feedback */}
      {feedback && (
        <Alert
          type={feedback.type}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      {/* Filter and Search Bar Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Search Input Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assignments by title or subject..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="due_asc">Due Date (Earliest First)</option>
              <option value="due_desc">Due Date (Latest First)</option>
              <option value="created_desc">Date Created (Newest First)</option>
              <option value="created_asc">Date Created (Oldest First)</option>
            </select>
          </div>
        </div>

        {/* Filters Dropdown Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Filter className="w-3.5 h-3.5 text-indigo-600" /> Filters:
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors ml-auto"
            >
              <RotateCcw className="w-3 h-3" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-1">
        <span>
          Showing <strong>{filteredAssignments.length}</strong> of{' '}
          <strong>{assignments.length}</strong> assignments
        </span>
      </div>

      {/* Assignment Grid */}
      {filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onDeleteRequest={(item) => setAssignmentToDelete(item)}
              onStatusUpdated={() => router.refresh()}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={hasActiveFilters ? 'No assignments match your filters' : 'No assignments yet'}
          description={
            hasActiveFilters
              ? 'Try adjusting your search keywords, status, priority, or subject filters.'
              : 'Add your first academic assignment or project deadline to get organized.'
          }
          actionHref={hasActiveFilters ? undefined : '/assignments/new'}
          actionText="Create Assignment"
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(assignmentToDelete)}
        title={assignmentToDelete?.title || ''}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setAssignmentToDelete(null)}
      />
    </div>
  );
}

