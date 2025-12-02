-- Drop existing SELECT policy if it exists and recreate it properly
DROP POLICY IF EXISTS "Users can view their own carrier profile" ON public.carriers;

-- Create a proper SELECT policy that requires authentication
-- Only allow users to view their own carrier profile data
CREATE POLICY "Users can view their own carrier profile"
ON public.carriers
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Verify RLS is enabled on the carriers table
ALTER TABLE public.carriers ENABLE ROW LEVEL SECURITY;