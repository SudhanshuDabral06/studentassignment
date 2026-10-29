-- ==============================================================================
-- AssignFlow - Assignment Management System Database Schema & Migration
-- ==============================================================================

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    subject TEXT NOT NULL DEFAULT 'General',
    due_date TIMESTAMPTZ NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    status TEXT NOT NULL CHECK (status IN ('Pending', 'In Progress', 'Completed')) DEFAULT 'Pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Comments for documentation
COMMENT ON TABLE public.assignments IS 'Stores academic assignments for college students, secured with RLS.';
COMMENT ON COLUMN public.assignments.id IS 'Unique identifier for the assignment';
COMMENT ON COLUMN public.assignments.user_id IS 'Foreign key referencing auth.users';
COMMENT ON COLUMN public.assignments.title IS 'Title of the assignment';
COMMENT ON COLUMN public.assignments.description IS 'Optional detailed notes or instructions for the assignment';
COMMENT ON COLUMN public.assignments.subject IS 'Course or academic subject name (e.g., CS101, Calculus, Physics)';
COMMENT ON COLUMN public.assignments.due_date IS 'Submission deadline with timezone';
COMMENT ON COLUMN public.assignments.priority IS 'Priority level: Low, Medium, or High';
COMMENT ON COLUMN public.assignments.status IS 'Progress state: Pending, In Progress, or Completed';

-- Create performance indexes for common queries
CREATE INDEX IF NOT EXISTS idx_assignments_user_id ON public.assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_assignments_user_status ON public.assignments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_assignments_user_priority ON public.assignments(user_id, priority);
CREATE INDEX IF NOT EXISTS idx_assignments_user_due_date ON public.assignments(user_id, due_date ASC);
CREATE INDEX IF NOT EXISTS idx_assignments_user_subject ON public.assignments(user_id, subject);

-- Automatically update updated_at timestamp on row change
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_assignments_updated_at ON public.assignments;
CREATE TRIGGER set_assignments_updated_at
    BEFORE UPDATE ON public.assignments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable Row Level Security
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- 1. SELECT Policy: Authenticated users can view ONLY their own assignments
DROP POLICY IF EXISTS "Users can read own assignments" ON public.assignments;
CREATE POLICY "Users can read own assignments"
    ON public.assignments
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- 2. INSERT Policy: Users can insert assignments only for their own account
DROP POLICY IF EXISTS "Users can insert own assignments" ON public.assignments;
CREATE POLICY "Users can insert own assignments"
    ON public.assignments
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 3. UPDATE Policy: Users can update only their own assignments, and CANNOT change user_id (transfer ownership)
DROP POLICY IF EXISTS "Users can update own assignments" ON public.assignments;
CREATE POLICY "Users can update own assignments"
    ON public.assignments
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. DELETE Policy: Users can delete only their own assignments
DROP POLICY IF EXISTS "Users can delete own assignments" ON public.assignments;
CREATE POLICY "Users can delete own assignments"
    ON public.assignments
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

