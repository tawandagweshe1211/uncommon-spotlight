-- Add email and phone_number columns to students table
ALTER TABLE public.students 
ADD COLUMN email text,
ADD COLUMN phone_number text;