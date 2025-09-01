-- Add missing RLS policies for admin_users table
CREATE POLICY "Admin users can view admin records" 
ON public.admin_users 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Only super admins can manage admin users" 
ON public.admin_users 
FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = auth.uid() AND role = 'super_admin'
));