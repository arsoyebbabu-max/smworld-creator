-- Add numeric user ID to profiles and other required tables
ALTER TABLE profiles ADD COLUMN user_number INTEGER;

-- Create sequence for user numbers
CREATE SEQUENCE user_number_seq START 1000;

-- Update existing profiles with user numbers
UPDATE profiles SET user_number = nextval('user_number_seq');

-- Make user_number NOT NULL and UNIQUE
ALTER TABLE profiles ALTER COLUMN user_number SET NOT NULL;
ALTER TABLE profiles ADD CONSTRAINT unique_user_number UNIQUE (user_number);

-- Create cart items table
CREATE TABLE cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  size TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for cart_items
CREATE POLICY "Users can view their own cart items" 
ON cart_items FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" 
ON cart_items FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" 
ON cart_items FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" 
ON cart_items FOR DELETE 
USING (auth.uid() = user_id);

-- Create wishlist table
CREATE TABLE wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on wishlist
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- Create policies for wishlist
CREATE POLICY "Users can view their own wishlist" 
ON wishlist FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist" 
ON wishlist FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist" 
ON wishlist FOR DELETE 
USING (auth.uid() = user_id);

-- Create messages table for user-admin communication
CREATE TABLE messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_admin BOOLEAN NOT NULL DEFAULT true,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
CREATE POLICY "Users can view their own messages" 
ON messages FOR SELECT 
USING (auth.uid() = from_user_id OR is_admin());

CREATE POLICY "Users can send messages" 
ON messages FOR INSERT 
WITH CHECK (auth.uid() = from_user_id);

CREATE POLICY "Admins can update message read status" 
ON messages FOR UPDATE 
USING (is_admin());

-- Add the specified admin user
INSERT INTO admin_users (user_id, role) 
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'mrsoyeb001@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

-- Add trigger for cart_items updated_at
CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for messages updated_at
CREATE TRIGGER update_messages_updated_at
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to auto-assign user numbers to new profiles
CREATE OR REPLACE FUNCTION assign_user_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.user_number = nextval('user_number_seq');
  RETURN NEW;
END;
$$;

CREATE TRIGGER assign_user_number_trigger
BEFORE INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION assign_user_number();