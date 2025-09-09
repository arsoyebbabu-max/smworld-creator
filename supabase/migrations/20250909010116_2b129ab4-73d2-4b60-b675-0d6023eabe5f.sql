-- Update admin_users table to include the currently logged in user
-- Remove the existing entry for a different user ID and keep the current one
DELETE FROM admin_users WHERE user_id = '29310fb9-0cc9-4c18-99d8-29d6572e4383';

-- Ensure the current user (who is logged in) is an admin
INSERT INTO admin_users (user_id, role) 
VALUES ('4517f753-260f-44e7-8cf9-58dd827baf88', 'super_admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';