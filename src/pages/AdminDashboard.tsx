import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  TrendingUp,
  DollarSign,
  Activity,
  BarChart3,
  Crown,
  Sparkles
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  category_id?: string;
  image_urls: string[];
  sizes: string[];
  colors: string[];
  is_active: boolean;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  created_at: string;
  profiles: {
    full_name: string;
    phone: string;
    address: string;
  } | null;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  user_id: string;
  profiles: {
    full_name: string;
    phone: string;
  } | null;
}

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    stock_quantity: '',
    category_id: '',
    image_urls: '',
    sizes: '',
    colors: '',
    is_active: true
  });

  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
      addSampleProducts();
    }
  }, [user, isAdmin]);

  const addSampleProducts = async () => {
    try {
      // Check if products already exist
      const { data: existingProducts } = await supabase
        .from('products')
        .select('id')
        .limit(1);

      if (existingProducts && existingProducts.length > 0) {
        return; // Products already exist
      }

      // Sample products data
      const sampleProducts = [
        {
          name: '🌟 স্মার্ট ওয়াচ প্রো ম্যাক্স',
          description: 'অত্যাধুনিক স্মার্ট ওয়াচ যা আপনার স্বাস্থ্য ট্র্যাক করে, ফিটনেস মনিটর করে এবং দীর্ঘস্থায়ী ব্যাটারি লাইফ প্রদান করে। ওয়াটারপ্রুফ ডিজাইন এবং GPS ট্র্যাকিং সহ।',
          price: 12500,
          discount_price: 9500,
          stock_quantity: 25,
          image_urls: ['/src/assets/smartwatch.jpg'],
          sizes: ['36mm', '40mm', '44mm'],
          colors: ['কালো', 'সিলভার', 'গোল্ড', 'রোজ গোল্ড'],
          is_active: true
        },
        {
          name: '💨 আল্ট্রাসনিক এয়ার হিউমিডিফায়ার',
          description: 'উন্নত আল্ট্রাসনিক প্রযুক্তি সহ এয়ার হিউমিডিফায়ার। বায়ুর আর্দ্রতা নিয়ন্ত্রণ করে এবং সুগন্ধি তেল ব্যবহার করা যায়। LED মুড লাইট এবং টাইমার সহ।',
          price: 6500,
          discount_price: 4800,
          stock_quantity: 18,
          image_urls: ['/src/assets/humidifier.jpg'],
          sizes: ['ছোট (300ml)', 'মাঝারি (500ml)', 'বড় (1L)'],
          colors: ['সাদা', 'কালো', 'উড ফিনিশ'],
          is_active: true
        },
        {
          name: '🎮 গেমিং হেডসেট প্রফেশনাল',
          description: '7.1 সারাউন্ড সাউন্ড সহ প্রো গেমিং হেডসেট। নয়েজ ক্যান্সেলিং মাইক, RGB লাইটিং এবং অতি আরামদায়ক কুশন। পিসি, PS5, Xbox এর সাথে সামঞ্জস্যপূর্ণ।',
          price: 8200,
          discount_price: 6400,
          stock_quantity: 35,
          image_urls: ['/src/assets/gaming-icon.png'],
          sizes: ['স্ট্যান্ডার্ড'],
          colors: ['কালো', 'লাল', 'নীল', 'RGB'],
          is_active: true
        },
        {
          name: '⚡ ওয়্যারলেস ফাস্ট চার্জার স্ট্যান্ড',
          description: '15W ফাস্ট ওয়্যারলেস চার্জিং স্ট্যান্ড। সব ধরনের Qi-enabled ডিভাইসের সাথে কাজ করে। অটো সেফটি প্রোটেকশন এবং LED ইন্ডিকেটর।',
          price: 3500,
          discount_price: 2200,
          stock_quantity: 45,
          image_urls: ['/placeholder.svg'],
          sizes: ['স্ট্যান্ডার্ড', 'ট্রাভেল সাইজ'],
          colors: ['সাদা', 'কালো', 'স্লেট গ্রে'],
          is_active: true
        },
        {
          name: '🔊 পোর্টেবল ব্লুটুথ স্পিকার মিনি',
          description: 'প্রিমিয়াম সাউন্ড কোয়ালিটি সহ পোর্টেবল স্পিকার। IPX7 ওয়াটারপ্রুফ, 24 ঘন্টা ব্যাটারি লাইফ এবং TWS কানেক্টিভিটি। বাস বুস্ট প্রযুক্তি সহ।',
          price: 4500,
          discount_price: 3200,
          stock_quantity: 28,
          image_urls: ['/placeholder.svg'],
          sizes: ['মিনি', 'স্ট্যান্ডার্ড', 'ম্যাক্স'],
          colors: ['নীল', 'লাল', 'সবুজ', 'কালো', 'সাদা'],
          is_active: true
        },
        {
          name: '💡 স্মার্ট LED লাইট বাল্ব',
          description: 'WiFi কন্ট্রোল স্মার্ট LED বাল্ব। 16 মিলিয়ন রঙ, ভয়েস কন্ট্রোল, এনার্জি সেভিং এবং মোবাইল অ্যাপ কন্ট্রোল। Alexa ও Google Assistant সাপোর্ট।',
          price: 1800,
          discount_price: 1200,
          stock_quantity: 60,
          image_urls: ['/placeholder.svg'],
          sizes: ['E27', 'B22'],
          colors: ['মাল্টি কালার'],
          is_active: true
        },
        {
          name: '📱 পাওয়ার বাংক 20000mAh ফাস্ট চার্জ',
          description: 'হাই ক্যাপাসিটি পাওয়ার বাংক 22.5W ফাস্ট চার্জিং সহ। LCD ডিসপ্লে, মাল্টিপল পোর্ট এবং সেফটি প্রোটেকশন। পিডি ও QC3.0 সাপোর্ট।',
          price: 3200,
          discount_price: 2400,
          stock_quantity: 40,
          image_urls: ['/placeholder.svg'],
          sizes: ['20000mAh', '30000mAh'],
          colors: ['কালো', 'সাদা', 'নেভি ব্লু'],
          is_active: true
        },
        {
          name: '🖱️ ওয়্যারলেস গেমিং মাউস RGB',
          description: 'প্রো গেমিং মাউস 16000 DPI সেন্সর সহ। প্রোগ্রামেবল বাটন, RGB ব্যাকলাইট এবং 70 ঘন্টা ব্যাটারি লাইফ। এরগনমিক ডিজাইন।',
          price: 4800,
          discount_price: 3600,
          stock_quantity: 22,
          image_urls: ['/placeholder.svg'],
          sizes: ['স্ট্যান্ডার্ড'],
          colors: ['কালো', 'সাদা', 'RGB'],
          is_active: true
        }
      ];

      const { error } = await supabase
        .from('products')
        .insert(sampleProducts);

      if (!error) {
        toast({
          title: "🎉 স্যাম্পল প্রোডাক্ট যোগ হয়েছে",
          description: "৮টি প্রিমিয়াম প্রোডাক্ট সফলভাবে যোগ করা হয়েছে।",
        });
        fetchData(); // Refresh data after adding products
      }
    } catch (error) {
      console.error('Error adding sample products:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch users with profiles
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select(`
          user_id,
          full_name,
          phone,
          address,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData?.map(profile => ({
        id: profile.user_id,
        email: '', // We can't get email from profiles
        created_at: profile.created_at,
        profiles: {
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address
        }
      })) || []);

      // Fetch orders without user profiles for now (no foreign key relationship exists)
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_amount,
          created_at,
          user_id
        `)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData?.map(order => ({
        ...order,
        profiles: null
      })) || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "❌ ডেটা লোড করতে সমস্যা",
        description: "দয়া করে পুনরায় চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        discount_price: productForm.discount_price ? parseFloat(productForm.discount_price) : null,
        stock_quantity: parseInt(productForm.stock_quantity),
        category_id: productForm.category_id || null,
        image_urls: productForm.image_urls.split(',').map(url => url.trim()).filter(Boolean),
        sizes: productForm.sizes.split(',').map(size => size.trim()).filter(Boolean),
        colors: productForm.colors.split(',').map(color => color.trim()).filter(Boolean),
        is_active: productForm.is_active
      };

      let error;
      
      if (editingProduct) {
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert([productData]);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: editingProduct ? "✅ প্রোডাক্ট আপডেট হয়েছে" : "🎉 প্রোডাক্ট যোগ হয়েছে",
        description: "সফলভাবে সম্পন্ন হয়েছে।",
      });

      // Reset form
      setProductForm({
        name: '',
        description: '',
        price: '',
        discount_price: '',
        stock_quantity: '',
        category_id: '',
        image_urls: '',
        sizes: '',
        colors: '',
        is_active: true
      });
      setEditingProduct(null);
      
      // Refresh data
      fetchData();

    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "❌ প্রোডাক্ট সেভ করতে সমস্যা",
        description: "দয়া করে পুনরায় চেষ্টা করুন।",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || '',
      stock_quantity: product.stock_quantity.toString(),
      category_id: product.category_id || '',
      image_urls: product.image_urls.join(', '),
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      is_active: product.is_active
    });
    setEditingProduct(product.id);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('⚠️ আপনি কি নিশ্চিত এই প্রোডাক্ট মুছে ফেলতে চান?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "🗑️ প্রোডাক্ট মুছে ফেলা হয়েছে",
        description: "সফলভাবে সম্পন্ন হয়েছে।",
      });

      fetchData();

    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "❌ প্রোডাক্ট মুছতে সমস্যা",
        description: "দয়া করে পুনরায় চেষ্টা করুন।",
        variant: "destructive",
      });
    }
  };

  // Advanced search function
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.colors.some(color => color.toLowerCase().includes(searchTerm.toLowerCase())) ||
    product.sizes.some(size => size.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredUsers = users.filter(user =>
    user.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profiles?.phone?.includes(searchTerm) ||
    user.profiles?.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.profiles?.phone?.includes(searchTerm) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
          <div className="text-2xl font-bold text-primary-foreground">⚡ লোড হচ্ছে...</div>
          <div className="text-primary-foreground/80">অ্যাডমিন ড্যাশবোর্ড প্রস্তুত করা হচ্ছে</div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const activeProducts = products.filter(p => p.is_active).length;
  const totalStock = products.reduce((sum, product) => sum + product.stock_quantity, 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Professional Header */}
      <div className="bg-gradient-primary text-primary-foreground shadow-elegant">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-foreground/10 p-3 rounded-lg">
                <Crown className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold flex items-center gap-2">
                  👑 সুপার অ্যাডমিন ড্যাশবোর্ড
                </h1>
                <p className="text-primary-foreground/80 text-lg mt-1">
                  আপনার ই-কমার্স সাম্রাজ্য পরিচালনা করুন
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-primary-foreground/80">স্বাগতম</div>
              <div className="font-semibold text-lg">{user?.email}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-elegant hover:shadow-xl transition-all duration-300 border-2 border-primary/10 hover:border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium">📦 মোট প্রোডাক্ট</CardTitle>
              <div className="bg-primary/10 p-2 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">{products.length}</div>
              <div className="flex items-center text-sm text-success">
                <TrendingUp className="h-4 w-4 mr-1" />
                {activeProducts} টি সক্রিয় • {totalStock} স্টক
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant hover:shadow-xl transition-all duration-300 border-2 border-info/10 hover:border-info/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium">👥 মোট ইউজার</CardTitle>
              <div className="bg-info/10 p-2 rounded-lg">
                <Users className="h-6 w-6 text-info" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-info mb-2">{users.length}</div>
              <div className="flex items-center text-sm text-success">
                <Activity className="h-4 w-4 mr-1" />
                রেজিস্টার্ড গ্রাহক
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant hover:shadow-xl transition-all duration-300 border-2 border-warning/10 hover:border-warning/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium">🛒 মোট অর্ডার</CardTitle>
              <div className="bg-warning/10 p-2 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning mb-2">{orders.length}</div>
              <div className="flex items-center text-sm text-success">
                <BarChart3 className="h-4 w-4 mr-1" />
                {completedOrders} টি সম্পন্ন
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant hover:shadow-xl transition-all duration-300 border-2 border-success/10 hover:border-success/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-base font-medium">💰 মোট বিক্রয়</CardTitle>
              <div className="bg-success/10 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success mb-2">
                ৳{totalRevenue.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-success">
                <Sparkles className="h-4 w-4 mr-1" />
                মোট আয়
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Universal Search Bar */}
        <Card className="shadow-elegant border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary h-6 w-6" />
              <Input
                placeholder="🔍 সুপার সার্চ - ইউজার ID, প্রোডাক্ট ID, অর্ডার নাম্বার, নাম, ফোন, ঠিকানা, রঙ, সাইজ - সব কিছু খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 h-14 text-lg border-2 border-primary/30 focus:border-primary transition-colors rounded-xl bg-gradient-secondary"
              />
              {searchTerm && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Badge variant="outline" className="bg-primary/10">
                    📊 {filteredProducts.length + filteredUsers.length + filteredOrders.length} ফলাফল
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card shadow-elegant h-14 rounded-xl">
            <TabsTrigger value="products" className="text-lg font-semibold h-12 rounded-lg">
              📦 প্রোডাক্ট ম্যানেজমেন্ট
            </TabsTrigger>
            <TabsTrigger value="users" className="text-lg font-semibold h-12 rounded-lg">
              👥 ইউজার ম্যানেজমেন্ট
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-lg font-semibold h-12 rounded-lg">
              🛒 অর্ডার ম্যানেজমেন্ট
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Enhanced Add/Edit Product Form */}
              <Card className="shadow-elegant border-2 border-primary/20">
                <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-xl">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="bg-primary-foreground/20 p-2 rounded-lg">
                      <Plus className="h-6 w-6" />
                    </div>
                    {editingProduct ? '✏️ প্রোডাক্ট এডিট করুন' : '➕ নতুন প্রোডাক্ট যোগ করুন'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-8">
                  <form onSubmit={handleProductSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-lg font-semibold flex items-center gap-2">
                        🏷️ প্রোডাক্টের নাম *
                      </Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        required
                        className="h-12 text-base rounded-lg border-2 border-primary/20 focus:border-primary"
                        placeholder="উদাহরণ: 🌟 স্মার্ট ফোন প্রো ম্যাক্স"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-lg font-semibold flex items-center gap-2">
                        📝 বিবরণ
                      </Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        className="min-h-28 text-base rounded-lg border-2 border-primary/20 focus:border-primary resize-none"
                        placeholder="প্রোডাক্টের বিস্তারিত বিবরণ, ফিচার এবং সুবিধা লিখুন..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-lg font-semibold flex items-center gap-2">
                          💰 মূল্য (৳) *
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                          required
                          className="h-12 text-base rounded-lg border-2 border-primary/20 focus:border-primary"
                          placeholder="5000"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="discount_price" className="text-lg font-semibold flex items-center gap-2">
                          🎉 ছাড়ের মূল্য (৳)
                        </Label>
                        <Input
                          id="discount_price"
                          type="number"
                          value={productForm.discount_price}
                          onChange={(e) => setProductForm({...productForm, discount_price: e.target.value})}
                          className="h-12 text-base rounded-lg border-2 border-primary/20 focus:border-primary"
                          placeholder="4200"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="stock_quantity" className="text-lg font-semibold flex items-center gap-2">
                        📦 স্টক পরিমাণ *
                      </Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        value={productForm.stock_quantity}
                        onChange={(e) => setProductForm({...productForm, stock_quantity: e.target.value})}
                        required
                        className="h-12 text-base rounded-lg border-2 border-primary/20 focus:border-primary"
                        placeholder="50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="image_urls" className="text-lg font-semibold flex items-center gap-2">
                        🖼️ ইমেজ URL
                      </Label>
                      <Input
                        id="image_urls"
                        value={productForm.image_urls}
                        onChange={(e) => setProductForm({...productForm, image_urls: e.target.value})}
                        placeholder="/assets/image1.jpg, /assets/image2.jpg"
                        className="h-12 text-base rounded-lg border-2 border-primary/20 focus:border-primary"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="sizes" className="text-lg font-semibold flex items-center gap-2">
                          📏 সাইজ
                        </Label>
                        <Input
                          id="sizes"
                          value={productForm.sizes}
                          onChange={(e) => setProductForm({...productForm, sizes: e.target.value})}
                          placeholder="S, M, L, XL"
                          className="h-12 text-base rounded-lg border-2 border-primary/20 focus:border-primary"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="colors" className="text-lg font-semibold flex items-center gap-2">
                          🎨 রঙ
                        </Label>
                        <Input
                          id="colors"
                          value={productForm.colors}
                          onChange={(e) => setProductForm({...productForm, colors: e.target.value})}
                          placeholder="লাল, নীল, সবুজ"
                          className="h-12 text-base rounded-lg border-2 border-primary/20 focus:border-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 bg-primary/5 p-4 rounded-lg">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={productForm.is_active}
                        onChange={(e) => setProductForm({...productForm, is_active: e.target.checked})}
                        className="w-6 h-6 rounded"
                      />
                      <Label htmlFor="is_active" className="text-lg font-semibold flex items-center gap-2">
                        ✅ প্রোডাক্ট সক্রিয় রাখুন
                      </Label>
                    </div>
                    
                    <div className="flex gap-4 pt-6">
                      <Button 
                        type="submit" 
                        className="flex-1 h-14 text-lg font-bold rounded-xl shadow-elegant hover:shadow-xl transition-all duration-300"
                      >
                        {editingProduct ? '🔄 আপডেট করুন' : '✨ যোগ করুন'}
                      </Button>
                      {editingProduct && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="h-14 px-8 text-lg rounded-xl"
                          onClick={() => {
                            setEditingProduct(null);
                            setProductForm({
                              name: '',
                              description: '',
                              price: '',
                              discount_price: '',
                              stock_quantity: '',
                              category_id: '',
                              image_urls: '',
                              sizes: '',
                              colors: '',
                              is_active: true
                            });
                          }}
                        >
                          ❌ বাতিল
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Enhanced Products List */}
              <Card className="shadow-elegant border-2 border-primary/20">
                <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-xl">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="bg-primary-foreground/20 p-2 rounded-lg">
                      <Package className="h-6 w-6" />
                    </div>
                    📦 প্রোডাক্ট তালিকা
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-lg">
                    মোট {filteredProducts.length} টি প্রোডাক্ট পাওয়া গেছে
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="border-2 border-primary/10 rounded-xl p-6 space-y-4 hover:border-primary/30 transition-all duration-300 hover:shadow-md bg-gradient-secondary">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-2">
                            <h3 className="font-bold text-xl text-primary line-clamp-2">{product.name}</h3>
                            <p className="text-sm text-muted-foreground font-mono bg-primary/5 px-2 py-1 rounded">
                              🆔 {product.id.slice(0, 12)}...
                            </p>
                            <div className="flex flex-wrap gap-4 text-base">
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-success">💰 ৳{product.price.toLocaleString()}</span>
                                {product.discount_price && (
                                  <span className="text-muted-foreground line-through">৳{product.discount_price.toLocaleString()}</span>
                                )}
                              </div>
                              <span className="font-semibold">📦 {product.stock_quantity} পিস</span>
                            </div>
                            {product.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                              className="h-12 w-12 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                            >
                              <Edit className="h-5 w-5" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="h-12 w-12 rounded-lg transition-all duration-300"
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge 
                            variant={product.is_active ? "default" : "secondary"} 
                            className="font-semibold text-sm px-3 py-1"
                          >
                            {product.is_active ? '✅ সক্রিয়' : '❌ নিষ্ক্রিয়'}
                          </Badge>
                          {product.discount_price && (
                            <Badge variant="outline" className="bg-success/10 text-success font-semibold border-success/30">
                              🎉 ছাড় আছে
                            </Badge>
                          )}
                          {product.sizes.length > 0 && (
                            <Badge variant="outline" className="bg-info/10 text-info border-info/30">
                              📏 {product.sizes.length} সাইজ
                            </Badge>
                          )}
                          {product.colors.length > 0 && (
                            <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                              🎨 {product.colors.length} রঙ
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {filteredProducts.length === 0 && (
                      <div className="text-center py-16 space-y-4">
                        <Package className="h-20 w-20 text-muted-foreground mx-auto opacity-50" />
                        <div className="space-y-2">
                          <p className="text-2xl font-bold text-muted-foreground">কোন প্রোডাক্ট পাওয়া যায়নি</p>
                          <p className="text-muted-foreground">নতুন প্রোডাক্ট যোগ করুন বা সার্চ টার্ম পরিবর্তন করুন</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="shadow-elegant border-2 border-info/20">
              <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-xl">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="bg-primary-foreground/20 p-2 rounded-lg">
                    <Users className="h-6 w-6" />
                  </div>
                  👥 ইউজার তালিকা
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg">
                  মোট {filteredUsers.length} জন ইউজার পাওয়া গেছে
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="border-2 border-info/10 rounded-xl p-6 hover:border-info/30 transition-all duration-300 hover:shadow-md bg-gradient-secondary">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h3 className="font-bold text-xl text-info flex items-center gap-2">
                            👤 {user.profiles?.full_name || '🤷‍♂️ নাম নেই'}
                          </h3>
                          <p className="text-sm text-muted-foreground font-mono bg-info/5 px-3 py-2 rounded-lg">
                            🆔 {user.id.slice(0, 12)}...
                          </p>
                          <div className="space-y-2">
                            <p className="text-base flex items-center gap-2">
                              📱 <span className="font-semibold">{user.profiles?.phone || 'ফোন নেই'}</span>
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <p className="text-base flex items-center gap-2">
                            🏠 <span className="font-semibold">{user.profiles?.address || 'ঠিকানা নেই'}</span>
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            📅 যোগদান: <span className="font-semibold">{new Date(user.created_at).toLocaleDateString('bn-BD')}</span>
                          </p>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                            ✅ নিবন্ধিত ইউজার
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-16 space-y-4">
                      <Users className="h-20 w-20 text-muted-foreground mx-auto opacity-50" />
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-muted-foreground">কোন ইউজার পাওয়া যায়নি</p>
                        <p className="text-muted-foreground">সার্চ টার্ম পরিবর্তন করুন</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="shadow-elegant border-2 border-warning/20">
              <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-xl">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="bg-primary-foreground/20 p-2 rounded-lg">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                  🛒 অর্ডার তালিকা
                </CardTitle>
                <CardDescription className="text-primary-foreground/80 text-lg">
                  মোট {filteredOrders.length} টি অর্ডার পাওয়া গেছে
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="border-2 border-warning/10 rounded-xl p-6 hover:border-warning/30 transition-all duration-300 hover:shadow-md bg-gradient-secondary">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <h3 className="font-bold text-xl text-warning flex items-center gap-2">
                            🧾 অর্ডার #{order.order_number}
                          </h3>
                          <p className="text-sm text-muted-foreground font-mono bg-warning/5 px-3 py-2 rounded-lg">
                            🆔 {order.id.slice(0, 12)}...
                          </p>
                          <p className="text-base flex items-center gap-2">
                            👤 <span className="font-semibold">{order.profiles?.full_name || 'অজানা গ্রাহক'}</span>
                          </p>
                        </div>
                        <div className="space-y-3">
                          <p className="text-2xl font-bold text-success flex items-center gap-2">
                            💰 ৳{order.total_amount.toLocaleString()}
                          </p>
                          <p className="text-base flex items-center gap-2">
                            📱 <span className="font-semibold">{order.profiles?.phone || 'ফোন নেই'}</span>
                          </p>
                        </div>
                        <div className="space-y-3">
                          <Badge 
                            variant={
                              order.status === 'completed' ? 'default' :
                              order.status === 'pending' ? 'secondary' :
                              order.status === 'processing' ? 'outline' : 'destructive'
                            }
                            className="text-base font-bold px-4 py-2"
                          >
                            {order.status === 'completed' ? '✅ সম্পন্ন' :
                             order.status === 'pending' ? '⏳ অপেক্ষমান' :
                             order.status === 'processing' ? '🔄 প্রক্রিয়াধীন' : 
                             order.status === 'cancelled' ? '❌ বাতিল' : order.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            📅 <span className="font-semibold">{new Date(order.created_at).toLocaleDateString('bn-BD')}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-16 space-y-4">
                      <ShoppingCart className="h-20 w-20 text-muted-foreground mx-auto opacity-50" />
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-muted-foreground">কোন অর্ডার পাওয়া যায়নি</p>
                        <p className="text-muted-foreground">সার্চ টার্ম পরিবর্তন করুন</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;