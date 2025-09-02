-- Add admin user mrsoyeb001@gmail.com
INSERT INTO public.admin_users (user_id, role)
SELECT id, 'super_admin'
FROM auth.users 
WHERE email = 'mrsoyeb001@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';