-- Drop existing SELECT policy if it exists
DROP POLICY IF EXISTS "Users can view their own carrier profile" ON public.carriers;

-- Create a properly restrictive SELECT policy that only allows authenticated users to view their own carrier profile
CREATE POLICY "Users can view their own carrier profile" 
ON public.carriers 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Ensure RLS is enabled (should already be, but double-checking)
ALTER TABLE public.carriers ENABLE ROW LEVEL SECURITY;