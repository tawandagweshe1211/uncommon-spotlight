-- Create student_submissions table for pending applications
CREATE TABLE public.student_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  specialization TEXT NOT NULL,
  status student_status NOT NULL,
  description TEXT NOT NULL,
  portfolio_link TEXT,
  profile_photo_url TEXT,
  submission_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.student_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit their information
CREATE POLICY "Anyone can submit student information"
ON public.student_submissions
FOR INSERT
WITH CHECK (true);

-- Only admins can view submissions
CREATE POLICY "Admins can view all submissions"
ON public.student_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update submissions (for approval/rejection)
CREATE POLICY "Admins can update submissions"
ON public.student_submissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete submissions
CREATE POLICY "Admins can delete submissions"
ON public.student_submissions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));