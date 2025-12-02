-- Add DELETE policy to trucks table so users can remove their own trucks
CREATE POLICY "Users can delete their own trucks"
ON public.trucks FOR DELETE
USING (EXISTS (
  SELECT 1 FROM carriers
  WHERE carriers.id = trucks.carrier_id
  AND carriers.user_id = auth.uid()
));