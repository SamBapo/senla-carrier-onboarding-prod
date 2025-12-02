-- Create a DELETE policy that only allows users to delete their own carrier profile
CREATE POLICY "Users can delete their own carrier profile" 
ON public.carriers 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);