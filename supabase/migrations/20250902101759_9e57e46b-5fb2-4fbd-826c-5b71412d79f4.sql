-- Create admin user with specific credentials
-- First create a temporary entry that will be updated with the actual user_id after registration
INSERT INTO admin_users (user_id, role) 
VALUES ('00000000-0000-0000-0000-000000000000', 'super_admin')
ON CONFLICT (user_id) DO NOTHING;

-- Create a function to set admin status by email
CREATE OR REPLACE FUNCTION public.set_admin_by_email(user_email TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get user_id from auth.users table
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    IF target_user_id IS NOT NULL THEN
        -- Insert or update admin_users table
        INSERT INTO public.admin_users (user_id, role)
        VALUES (target_user_id, 'super_admin')
        ON CONFLICT (user_id) 
        DO UPDATE SET role = 'super_admin';
    END IF;
END;
$$;