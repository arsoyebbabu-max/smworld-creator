-- Create an admin user entry
-- First, let's create a sample admin user (you'll need to register this email through the auth system)
INSERT INTO public.admin_users (user_id, role) 
VALUES ('00000000-0000-0000-0000-000000000000', 'super_admin')
ON CONFLICT (user_id) DO NOTHING;

-- Note: After registering with email "admin@smworld.com", you'll need to update this with the actual user ID