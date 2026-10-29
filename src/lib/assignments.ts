'use server';

import { revalidatePath } from 'next/cache';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import {
  Assignment,
  AssignmentFilters,
  AssignmentFormData,
  AssignmentInsert,
  AssignmentUpdate,
  DashboardStats,
} from '@/types';
import { calculateStats } from './utils';

/**
 * Fetch all assignments for the currently authenticated user with optional filtering and sorting.
 */
export async function getAssignments(filters?: AssignmentFilters): Promise<{
  assignments: Assignment[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      assignments: [],
      error: 'Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { assignments: [], error: 'Unauthorized. Please log in.' };
  }

  let query = supabase
    .from('assignments')
    .select('*')
    .eq('user_id', user.id);

  // Status Filter
  if (filters?.status && filters.status !== 'All') {
    query = query.eq('status', filters.status);
  }

  // Priority Filter
  if (filters?.priority && filters.priority !== 'All') {
    query = query.eq('priority', filters.priority);
  }

  // Subject Filter
  if (filters?.subject && filters.subject !== 'All') {
    query = query.eq('subject', filters.subject);
  }

  // Search filter (title or subject)
  if (filters?.search && filters.search.trim() !== '') {
    const term = `%${filters.search.trim()}%`;
    query = query.or(`title.ilike.${term},subject.ilike.${term}`);
  }

  // Sorting
  const sortBy = filters?.sortBy || 'due_date';
  const sortAsc = filters?.sortOrder ? filters.sortOrder === 'asc' : sortBy === 'due_date';

  query = query.order(sortBy, { ascending: sortAsc });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching assignments:', error);
    return { assignments: [], error: error.message };
  }

  return { assignments: (data as Assignment[]) || [], error: null };
}

/**
 * Fetch a single assignment by ID
 */
export async function getAssignmentById(id: string): Promise<{
  assignment: Assignment | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { assignment: null, error: 'Supabase is not configured.' };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { assignment: null, error: 'Unauthorized.' };
  }

  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    return { assignment: null, error: error.message };
  }

  return { assignment: data as Assignment, error: null };
}

/**
 * Create a new assignment
 */
export async function createAssignment(formData: AssignmentFormData): Promise<{
  assignment: Assignment | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { assignment: null, error: 'Supabase is not configured.' };
  }

  if (!formData.title?.trim()) {
    return { assignment: null, error: 'Title is required.' };
  }

  if (!formData.due_date) {
    return { assignment: null, error: 'Due date is required.' };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { assignment: null, error: 'Unauthorized. Please log in.' };
  }

  const newAssignment: AssignmentInsert = {
    user_id: user.id,
    title: formData.title.trim(),
    description: formData.description?.trim() || null,
    subject: formData.subject?.trim() || 'General',
    due_date: new Date(formData.due_date).toISOString(),
    priority: formData.priority || 'Medium',
    status: formData.status || 'Pending',
  };

  const { data, error } = await supabase
    .from('assignments')
    // @ts-ignore
    .insert(newAssignment)
    .select()
    .single();

  if (error) {
    console.error('Create assignment error:', error);
    return { assignment: null, error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/assignments');
  return { assignment: data as Assignment, error: null };
}

/**
 * Update an existing assignment
 */
export async function updateAssignment(
  id: string,
  formData: Partial<AssignmentFormData>
): Promise<{
  assignment: Assignment | null;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { assignment: null, error: 'Supabase is not configured.' };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { assignment: null, error: 'Unauthorized. Please log in.' };
  }

  const updatePayload: AssignmentUpdate = {};

  if (formData.title !== undefined) {
    if (!formData.title.trim()) {
      return { assignment: null, error: 'Title cannot be empty.' };
    }
    updatePayload.title = formData.title.trim();
  }

  if (formData.description !== undefined) {
    updatePayload.description = formData.description?.trim() || null;
  }

  if (formData.subject !== undefined) {
    updatePayload.subject = formData.subject?.trim() || 'General';
  }

  if (formData.due_date !== undefined) {
    if (!formData.due_date) {
      return { assignment: null, error: 'Due date is required.' };
    }
    updatePayload.due_date = new Date(formData.due_date).toISOString();
  }

  if (formData.priority !== undefined) {
    updatePayload.priority = formData.priority;
  }

  if (formData.status !== undefined) {
    updatePayload.status = formData.status;
  }

  const { data, error } = await supabase
    .from('assignments')
    // @ts-ignore
    .update(updatePayload)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Update assignment error:', error);
    return { assignment: null, error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/assignments');
  revalidatePath(`/assignments/${id}`);
  return { assignment: data as Assignment, error: null };
}

/**
 * Delete an assignment with ownership check
 */
export async function deleteAssignment(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Unauthorized.' };
  }

  const { error } = await supabase
    .from('assignments')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('Delete assignment error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/assignments');
  return { success: true, error: null };
}

/**
 * Fetch distinct subjects for the user to populate the subject filter
 */
export async function getUserSubjects(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('assignments')
    .select('subject')
    .eq('user_id', user.id);

  if (error || !data) return [];

  const rows = data as unknown as { subject: string }[];
  const unique = Array.from(new Set(rows.map((item) => item.subject).filter(Boolean)));
  return unique.sort();
}

/**
 * Fetch dashboard overview data: stats, upcoming deadlines, and recent items
 */
export async function getDashboardData(): Promise<{
  stats: DashboardStats;
  upcoming: Assignment[];
  recent: Assignment[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return {
      stats: {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        overdue: 0,
        completionRate: 0,
      },
      upcoming: [],
      recent: [],
      error: 'Supabase is not configured.',
    };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      stats: {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        overdue: 0,
        completionRate: 0,
      },
      upcoming: [],
      recent: [],
      error: 'Unauthorized.',
    };
  }

  // Fetch all user assignments to calculate true statistics
  const { data: allAssignments, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('user_id', user.id)
    .order('due_date', { ascending: true });

  if (error) {
    return {
      stats: {
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        overdue: 0,
        completionRate: 0,
      },
      upcoming: [],
      recent: [],
      error: error.message,
    };
  }

  const assignments = (allAssignments as Assignment[]) || [];
  const stats = calculateStats(assignments);

  // Upcoming deadlines: non-completed assignments due in future or soonest
  const upcoming = assignments
    .filter((a) => a.status !== 'Completed')
    .slice(0, 5);

  // Recent: sorted by created_at desc
  const recent = [...assignments]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return {
    stats,
    upcoming,
    recent,
    error: null,
  };
}
