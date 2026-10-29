import { Database, PriorityType, StatusType } from './database.types';

export type Assignment = Database['public']['Tables']['assignments']['Row'];
export type AssignmentInsert = Database['public']['Tables']['assignments']['Insert'];
export type AssignmentUpdate = Database['public']['Tables']['assignments']['Update'];

export type { PriorityType, StatusType };

export interface AssignmentFormData {
  title: string;
  description: string;
  subject: string;
  due_date: string;
  priority: PriorityType;
  status: StatusType;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  completionRate: number;
}

export interface AssignmentFilters {
  search?: string;
  status?: string;
  priority?: string;
  subject?: string;
  sortBy?: 'due_date' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  created_at?: string;
}

