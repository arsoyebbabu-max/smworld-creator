-- Add the new admin user to admin_users table
INSERT INTO public.admin_users (user_id, role) 
SELECT id, 'super_admin' 
FROM auth.users 
WHERE email = 'arsoyebbabu@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- Create function to automatically add admin users based on email
CREATE OR REPLACE FUNCTION public.handle_admin_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the email should be an admin
    IF NEW.email = 'arsoyebbabu@gmail.com' THEN
        INSERT INTO public.admin_users (user_id, role)
        VALUES (NEW.id, 'super_admin');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic admin assignment
DROP TRIGGER IF EXISTS on_admin_user_created ON auth.users;
CREATE TRIGGER on_admin_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_admin_signup();

-- Create delivery configuration table for admin control
CREATE TABLE IF NOT EXISTS public.delivery_config (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    dhaka_charge numeric NOT NULL DEFAULT 60,
    outside_dhaka_charge numeric NOT NULL DEFAULT 120,
    free_delivery_threshold numeric NOT NULL DEFAULT 1000,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on delivery_config
ALTER TABLE public.delivery_config ENABLE ROW LEVEL SECURITY;

-- Policies for delivery_config
CREATE POLICY "Everyone can view delivery config" ON public.delivery_config
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage delivery config" ON public.delivery_config
    FOR ALL USING (is_admin());

-- Insert default delivery config
INSERT INTO public.delivery_config (dhaka_charge, outside_dhaka_charge, free_delivery_threshold)
VALUES (60, 120, 1000)
ON CONFLICT DO NOTHING;

-- Add trigger for delivery_config updated_at
CREATE TRIGGER update_delivery_config_updated_at
    BEFORE UPDATE ON public.delivery_config
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();