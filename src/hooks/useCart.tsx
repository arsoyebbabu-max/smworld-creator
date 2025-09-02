import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  size?: string;
  color?: string;
  products: {
    id: string;
    name: string;
    price: number;
    discount_price?: number;
    image_urls?: string[];
  };
}

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCartItems();
    } else {
      setCartItems([]);
      setLoading(false);
    }
  }, [user]);

  const loadCartItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            name,
            price,
            discount_price,
            image_urls
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number = 1, size?: string, color?: string) => {
    if (!user) {
      toast({
        title: "লগইন প্রয়োজন",
        description: "কার্টে যোগ করতে প্রথমে লগইন করুন।",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Check if item already exists
      const existingItem = cartItems.find(
        item => item.product_id === productId && item.size === size && item.color === color
      );

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
            size,
            color,
          });

        if (error) throw error;
      }

      await loadCartItems();
      toast({
        title: "সফল!",
        description: "পণ্যটি কার্টে যোগ করা হয়েছে।",
      });
      return true;
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "কার্টে যোগ করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateCartItemQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;
      await loadCartItems();
      return true;
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "পরিমাণ আপডেট করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      await loadCartItems();
      toast({
        title: "সফল!",
        description: "পণ্যটি কার্ট থেকে সরানো হয়েছে।",
      });
      return true;
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "কার্ট থেকে সরাতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
      return false;
    }
  };

  const clearCart = async () => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItems([]);
      return true;
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "কার্ট পরিষ্কার করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
      return false;
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.products.discount_price || item.products.price;
      return total + (price * item.quantity);
    }, 0);
  };

  return {
    cartItems,
    loading,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
    refetch: loadCartItems,
  };
};