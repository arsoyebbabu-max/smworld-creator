import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount_price?: number;
  image_urls?: string[];
  category_id?: string;
  stock_quantity: number;
  sizes?: string[];
  colors?: string[];
  is_active: boolean;
  created_at: string;
  categories?: {
    id: string;
    name: string;
  };
}

export interface User {
  id: string;
  full_name?: string;
  phone?: string;
  address?: string;
  user_number: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_method?: string;
  shipping_address?: string;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  review_text?: string;
  is_approved: boolean;
  created_at: string;
}

export interface WebsiteSettings {
  id: string;
  site_name: string;
  site_description?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  banner_images?: string[];
  maintenance_mode: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  lowStockProducts: number;
  totalReviews: number;
  unreadMessages: number;
}

export const useAdminData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    totalReviews: 0,
    unreadMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchUsers(),
        fetchOrders(),
        fetchReviews(),
        fetchCategories(),
        fetchWebsiteSettings()
      ]);
      calculateStats();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "ত্রুটি",
        description: "ডেটা লোড করতে সমস্যা হয়েছে",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setProducts(data || []);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setUsers(data || []);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setOrders(data || []);
  };

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setReviews(data || []);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setCategories(data || []);
  };

  const fetchWebsiteSettings = async () => {
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    setWebsiteSettings(data);
  };

  const calculateStats = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const lowStockProducts = products.filter(product => product.stock_quantity < 10).length;
    const totalReviews = reviews.length;
    
    setAdminStats({
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      pendingOrders,
      lowStockProducts,
      totalReviews,
      unreadMessages: 0 // Will be fetched separately
    });
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      await fetchOrders();
      calculateStats();
      
      toast({
        title: "সফল",
        description: "অর্ডার স্ট্যাটাস আপডেট হয়েছে"
      });
    } catch (err: any) {
      toast({
        title: "ত্রুটি",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const updateReviewStatus = async (reviewId: string, isApproved: boolean) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_approved: isApproved })
        .eq('id', reviewId);

      if (error) throw error;
      
      await fetchReviews();
      
      toast({
        title: "সফল",
        description: "রিভিউ স্ট্যাটাস আপডেট হয়েছে"
      });
    } catch (err: any) {
      toast({
        title: "ত্রুটি",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const updateWebsiteSettings = async (settings: Partial<WebsiteSettings>) => {
    try {
      const { error } = await supabase
        .from('website_settings')
        .upsert(settings);

      if (error) throw error;
      
      await fetchWebsiteSettings();
      
      toast({
        title: "সফল",
        description: "ওয়েবসাইট সেটিংস আপডেট হয়েছে"
      });
    } catch (err: any) {
      toast({
        title: "ত্রুটি",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  return {
    products,
    users,
    orders,
    reviews,
    categories,
    websiteSettings,
    adminStats,
    loading,
    error,
    fetchAllData,
    updateOrderStatus,
    updateReviewStatus,
    updateWebsiteSettings
  };
};