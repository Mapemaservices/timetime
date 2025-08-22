-- Add RLS policies for admin_users table
CREATE POLICY "Admin users can only view their own profile" 
ON public.admin_users 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "No direct updates to admin users" 
ON public.admin_users 
FOR UPDATE 
USING (false);

CREATE POLICY "No direct inserts to admin users" 
ON public.admin_users 
FOR INSERT 
WITH CHECK (false);

CREATE POLICY "No direct deletes to admin users" 
ON public.admin_users 
FOR DELETE 
USING (false);