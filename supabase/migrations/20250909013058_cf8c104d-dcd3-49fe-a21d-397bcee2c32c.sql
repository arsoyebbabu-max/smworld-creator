-- Create reviews table for product reviews
CREATE TABLE public.reviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL,
    user_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Users can create reviews for products" 
ON public.reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view approved reviews" 
ON public.reviews 
FOR SELECT 
USING (is_approved = true OR auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews" 
ON public.reviews 
FOR ALL 
USING (is_admin());

-- Create website settings table
CREATE TABLE public.website_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    site_name TEXT DEFAULT 'My E-commerce Store',
    site_description TEXT,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#3B82F6',
    secondary_color TEXT DEFAULT '#1F2937',
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    facebook_url TEXT,
    instagram_url TEXT,
    twitter_url TEXT,
    banner_images TEXT[] DEFAULT '{}',
    maintenance_mode BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on website settings
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for website settings
CREATE POLICY "Everyone can view website settings" 
ON public.website_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage website settings" 
ON public.website_settings 
FOR ALL 
USING (is_admin());

-- Insert default website settings
INSERT INTO public.website_settings (site_name, site_description) 
VALUES ('আপনার ই-কমার্স স্টোর', 'বাংলাদেশের সেরা অনলাইন শপিং প্ল্যাটফর্ম');

-- Create order tracking table
CREATE TABLE public.order_tracking (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL,
    status TEXT NOT NULL,
    message TEXT,
    tracking_number TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on order tracking
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for order tracking
CREATE POLICY "Users can view their order tracking" 
ON public.order_tracking 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_tracking.order_id 
    AND orders.user_id = auth.uid()
));

CREATE POLICY "Admins can manage all order tracking" 
ON public.order_tracking 
FOR ALL 
USING (is_admin());

-- Add trigger for updated_at on reviews
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger for updated_at on website_settings
CREATE TRIGGER update_website_settings_updated_at
    BEFORE UPDATE ON public.website_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();