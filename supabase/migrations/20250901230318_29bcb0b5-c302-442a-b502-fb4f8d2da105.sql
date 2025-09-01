-- Create profiles table for user information
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create categories table
CREATE TABLE public.categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    image_urls TEXT[] DEFAULT '{}',
    category_id UUID REFERENCES public.categories(id),
    stock_quantity INTEGER DEFAULT 0,
    sizes TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned')),
    shipping_address TEXT,
    payment_method TEXT,
    coupon_code TEXT,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    size TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_users table
CREATE TABLE public.admin_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coupons table
CREATE TABLE public.coupons (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    minimum_amount DECIMAL(10,2) DEFAULT 0,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

-- Create RLS policies for products (public read)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (is_active = true);

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for order_items
CREATE POLICY "Users can view their own order items" 
ON public.order_items 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
));

-- Create RLS policies for coupons (public read)
CREATE POLICY "Coupons are viewable by everyone" 
ON public.coupons 
FOR SELECT 
USING (is_active = true);

-- Create function for admin access
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies for all tables
CREATE POLICY "Admins can manage categories" 
ON public.categories 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can manage products" 
ON public.products 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update orders" 
ON public.orders 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can view all order items" 
ON public.order_items 
FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can manage coupons" 
ON public.coupons 
FOR ALL 
USING (public.is_admin());

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin());

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'ORD-' || EXTRACT(YEAR FROM NOW())::TEXT || 
           LPAD(EXTRACT(MONTH FROM NOW())::TEXT, 2, '0') || 
           LPAD(EXTRACT(DAY FROM NOW())::TEXT, 2, '0') || '-' ||
           LPAD((RANDOM() * 9999)::INTEGER::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to auto-create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.categories (name, description) VALUES
('ইলেকট্রনিক্স', 'সকল ইলেকট্রনিক্স পণ্য'),
('ফ্যাশন', 'পোশাক এবং ফ্যাশন আইটেম'),
('হোম অ্যান্ড গার্ডেন', 'বাড়ি এবং বাগানের জিনিসপত্র'),
('স্পোর্টস', 'খেলাধুলার সামগ্রী');

-- Insert sample products
INSERT INTO public.products (name, description, price, discount_price, category_id, stock_quantity, sizes, colors) 
SELECT 
    'স্মার্ট ওয়াচ প্রো', 
    'উন্নত স্মার্ট ওয়াচ যা আপনার স্বাস্থ্য ট্র্যাক করে এবং অনেক ফিচার রয়েছে। ওয়াটারপ্রুফ এবং দীর্ঘস্থায়ী ব্যাটারি লাইফ।', 
    4500.00, 
    3800.00,
    id, 
    25, 
    ARRAY['ছোট', 'মাঝারি', 'বড়'], 
    ARRAY['কালো', 'সিলভার', 'গোল্ড']
FROM public.categories WHERE name = 'ইলেকট্রনিক্স' LIMIT 1;

INSERT INTO public.products (name, description, price, discount_price, category_id, stock_quantity, sizes, colors) 
SELECT 
    'প্রিমিয়াম টি-শার্ট', 
    '১০০% কটনের তৈরি আরামদায়ক টি-শার্ট। উচ্চ মানের কাপড় এবং দীর্ঘস্থায়ী।', 
    890.00, 
    650.00,
    id, 
    50, 
    ARRAY['S', 'M', 'L', 'XL', 'XXL'], 
    ARRAY['সাদা', 'কালো', 'নেভি', 'লাল']
FROM public.categories WHERE name = 'ফ্যাশন' LIMIT 1;

INSERT INTO public.products (name, description, price, discount_price, category_id, stock_quantity, sizes, colors) 
SELECT 
    'হিউমিডিফায়ার', 
    'অত্যাধুনিক হিউমিডিফায়ার যা ঘরের বাতাস পরিষ্কার রাখে এবং আর্দ্রতা নিয়ন্ত্রণ করে।', 
    2800.00, 
    2200.00,
    id, 
    15, 
    ARRAY['স্ট্যান্ডার্ড'], 
    ARRAY['সাদা', 'কালো']
FROM public.categories WHERE name = 'হোম অ্যান্ড গার্ডেন' LIMIT 1;

-- Insert sample coupons
INSERT INTO public.coupons (code, discount_type, discount_value, minimum_amount, max_uses) VALUES
('WELCOME10', 'percentage', 10.00, 500.00, 100),
('SAVE50', 'fixed', 50.00, 1000.00, 50),
('NEWYEAR25', 'percentage', 25.00, 2000.00, 25);

-- Create admin user (will be handled through a separate process)
-- The admin email: mdsoyeb0@gmail.com will be set up through authentication