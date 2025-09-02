import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

interface WishlistItem {
  id: string;
  product_id: string;
  products: {
    id: string;
    name: string;
    price: number;
    discount_price?: number;
    image_urls?: string[];
  };
}

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadWishlistItems();
    } else {
      setWishlistItems([]);
      setLoading(false);
    }
  }, [user]);

  const loadWishlistItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wishlist')
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
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "লগইন প্রয়োজন",
        description: "প্রিয় তালিকায় যোগ করতে প্রথমে লগইন করুন।",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: productId,
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "ইতিমধ্যে যোগ করা হয়েছে",
            description: "এই পণ্যটি ইতিমধ্যে প্রিয় তালিকায় রয়েছে।",
            variant: "destructive",
          });
          return false;
        }
        throw error;
      }

      await loadWishlistItems();
      toast({
        title: "সফল!",
        description: "পণ্যটি প্রিয় তালিকায় যোগ করা হয়েছে।",
      });
      return true;
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "প্রিয় তালিকায় যোগ করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      await loadWishlistItems();
      toast({
        title: "সফল!",
        description: "পণ্যটি প্রিয় তালিকা থেকে সরানো হয়েছে।",
      });
      return true;
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "প্রিয় তালিকা থেকে সরাতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
      return false;
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  return {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    refetch: loadWishlistItems,
  };
};