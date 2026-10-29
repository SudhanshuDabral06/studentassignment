export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PriorityType = 'Low' | 'Medium' | 'High';
export type StatusType = 'Pending' | 'In Progress' | 'Completed';

export interface Database {
  public: {
    Tables: {
      assignments: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          subject: string;
          due_date: string;
          priority: PriorityType;
          status: StatusType;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          subject?: string;
          due_date: string;
          priority?: PriorityType;
          status?: StatusType;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          subject?: string;
          due_date?: string;
          priority?: PriorityType;
          status?: StatusType;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assignments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

