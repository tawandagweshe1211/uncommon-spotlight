-- Add user_id to students table to link each student to their account
ALTER TABLE public.students
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Make user_id unique so each user can only have one student profile
ALTER TABLE public.students
ADD CONSTRAINT students_user_id_unique UNIQUE (user_id);

-- Drop old admin-only policies
DROP POLICY IF EXISTS "Admins can delete students" ON public.students;
DROP POLICY IF EXISTS "Admins can insert students" ON public.students;
DROP POLICY IF EXISTS "Admins can update students" ON public.students;

-- Create new policies for student self-management
CREATE POLICY "Authenticated users can create their own student profile"
ON public.students
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own profile"
ON public.students
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Students can delete their own profile"
ON public.students
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Drop the student_submissions table as we no longer need approval workflow
DROP TABLE IF EXISTS public.student_submissions;

-- Drop the user_roles table and related function as we no longer need admin roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP TABLE IF EXISTS public.user_roles;
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);
DROP TYPE IF EXISTS public.app_role;