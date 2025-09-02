import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Edit,
  Trash2,
  Plus,
  Settings,
  Truck
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MobileBottomNav from "@/components/MobileBottomNav";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  is_active: boolean;
  image_urls?: string[];
  sizes?: string[];
  colors?: string[];
  created_at: string;
}

interface User {
  id: string;
  full_name?: string;
  phone?: string;
  user_number: number;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_id: string;
}

interface WeeklyStats {
  week: string;
  revenue: number;
  orders: number;
  products: number;
}

interface DeliveryConfig {
  id?: string;
  dhaka_charge: number;
  outside_dhaka_charge: number;
  free_delivery_threshold: number;
}

const EnhancedAdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [deliveryConfig, setDeliveryConfig] = useState<DeliveryConfig>({
    dhaka_charge: 60,
    outside_dhaka_charge: 120,
    free_delivery_threshold: 1000
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    sizes: "",
    colors: "",
    image_urls: ""
  });

  useEffect(() => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    
    if (!isAdmin) {
      toast.error("এডমিন অ্যাক্সেস প্রয়োজন");
      window.location.href = '/';
      return;
    }
    
    fetchData();
  }, [user, isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProducts(),
        fetchUsers(),
        fetchOrders(),
        fetchDeliveryConfig()
      ]);
      calculateWeeklyStats();
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("ডেটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
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

  const fetchDeliveryConfig = async () => {
    const { data, error } = await supabase
      .from('delivery_config')
      .select('*')
      .single();
    
    if (data && !error) {
      setDeliveryConfig(data);
    }
  };

  const calculateWeeklyStats = () => {
    const now = new Date();
    const stats: WeeklyStats[] = [];
    
    for (let i = 6; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const weekOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= weekStart && orderDate <= weekEnd;
      });
      
      stats.push({
        week: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`,
        revenue: weekOrders.reduce((sum, order) => sum + order.total_amount, 0),
        orders: weekOrders.length,
        products: products.filter(p => p.is_active).length
      });
    }
    
    setWeeklyStats(stats);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: productForm.name,
        description: productForm.description || null,
        price: parseFloat(productForm.price),
        discount_price: productForm.discount_price ? parseFloat(productForm.discount_price) : null,
        stock_quantity: parseInt(productForm.stock_quantity),
        sizes: productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()) : [],
        colors: productForm.colors ? productForm.colors.split(',').map(c => c.trim()) : [],
        image_urls: productForm.image_urls ? productForm.image_urls.split(',').map(url => url.trim()) : []
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        toast.success("পণ্য আপডেট হয়েছে!");
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);
        
        if (error) throw error;
        toast.success("নতুন পণ্য যোগ হয়েছে!");
      }
      
      // Reset form
      setProductForm({
        name: "",
        description: "",
        price: "",
        discount_price: "",
        stock_quantity: "",
        sizes: "",
        colors: "",
        image_urls: ""
      });
      setEditingProduct(null);
      fetchProducts();
      
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("পণ্য সেভ করতে সমস্যা হয়েছে");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || "",
      stock_quantity: product.stock_quantity.toString(),
      sizes: product.sizes?.join(', ') || "",
      colors: product.colors?.join(', ') || "",
      image_urls: product.image_urls?.join(', ') || ""
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("এই পণ্যটি মুছে ফেলতে চান?")) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      toast.success("পণ্য মুছে ফেলা হয়েছে!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("পণ্য মুছতে সমস্যা হয়েছে");
    }
  };

  const handleDeliveryConfigUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('delivery_config')
        .upsert(deliveryConfig);
      
      if (error) throw error;
      toast.success("ডেলিভারি সেটিংস আপডেট হয়েছে!");
    } catch (error) {
      console.error("Error updating delivery config:", error);
      toast.error("সেটিংস আপডেট করতে সমস্যা হয়েছে");
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredUsers = users.filter(user => 
    (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.phone?.includes(searchTerm) || false)
  );
  
  const filteredOrders = orders.filter(order => 
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalOrders = orders.length;
  const activeProducts = products.filter(p => p.is_active).length;
  const totalUsers = users.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p>লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">এডমিন ড্যাশবোর্ড</h1>
            <p className="text-muted-foreground">ওয়েবসাইট ব্যবস্থাপনা</p>
          </div>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            ওয়েবসাইট দেখুন
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">মোট আয়</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                সর্বমোট বিক্রয়
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">মোট অর্ডার</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">সর্বমোট অর্ডার</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">সক্রিয় পণ্য</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProducts}</div>
              <p className="text-xs text-muted-foreground">বিক্রয়ের জন্য</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ব্যবহারকারী</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">নিবন্ধিত ব্যবহারকারী</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Revenue Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              সাপ্তাহিক আয়ের পরিসংখ্যান
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip formatter={(value) => [`৳${value}`, 'আয়']} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="পণ্য, ব্যবহারকারী বা অর্ডার খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">পণ্য</TabsTrigger>
            <TabsTrigger value="users">ব্যবহারকারী</TabsTrigger>
            <TabsTrigger value="orders">অর্ডার</TabsTrigger>
            <TabsTrigger value="settings">সেটিংস</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="space-y-6">
              {/* Add Product Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {editingProduct ? 'পণ্য সম্পাদনা' : 'নতুন পণ্য যোগ করুন'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">পণ্যের নাম *</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="price">মূল্য *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="discount_price">ছাড়ের মূল্য</Label>
                      <Input
                        id="discount_price"
                        type="number"
                        value={productForm.discount_price}
                        onChange={(e) => setProductForm({...productForm, discount_price: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="stock_quantity">স্টক পরিমাণ *</Label>
                      <Input
                        id="stock_quantity"
                        type="number"
                        value={productForm.stock_quantity}
                        onChange={(e) => setProductForm({...productForm, stock_quantity: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="description">বিবরণ</Label>
                      <Textarea
                        id="description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="sizes">সাইজ (কমা দিয়ে আলাদা করুন)</Label>
                      <Input
                        id="sizes"
                        value={productForm.sizes}
                        onChange={(e) => setProductForm({...productForm, sizes: e.target.value})}
                        placeholder="S, M, L, XL"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="colors">রঙ (কমা দিয়ে আলাদা করুন)</Label>
                      <Input
                        id="colors"
                        value={productForm.colors}
                        onChange={(e) => setProductForm({...productForm, colors: e.target.value})}
                        placeholder="লাল, নীল, সবুজ"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="image_urls">ছবির URL (কমা দিয়ে আলাদা করুন)</Label>
                      <Input
                        id="image_urls"
                        value={productForm.image_urls}
                        onChange={(e) => setProductForm({...productForm, image_urls: e.target.value})}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      />
                    </div>
                    
                    <div className="md:col-span-2 flex gap-2">
                      <Button type="submit">
                        {editingProduct ? 'আপডেট করুন' : 'পণ্য যোগ করুন'}
                      </Button>
                      {editingProduct && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setEditingProduct(null);
                            setProductForm({
                              name: "",
                              description: "",
                              price: "",
                              discount_price: "",
                              stock_quantity: "",
                              sizes: "",
                              colors: "",
                              image_urls: ""
                            });
                          }}
                        >
                          বাতিল
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Products List */}
              <Card>
                <CardHeader>
                  <CardTitle>সকল পণ্য ({filteredProducts.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <div className="text-sm text-muted-foreground space-x-4">
                            <span>৳{product.price}</span>
                            {product.discount_price && (
                              <span className="text-success">ছাড়: ৳{product.discount_price}</span>
                            )}
                            <span>স্টক: {product.stock_quantity}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {product.is_active ? (
                              <Badge variant="secondary">সক্রিয়</Badge>
                            ) : (
                              <Badge variant="outline">নিষ্ক্রিয়</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>নিবন্ধিত ব্যবহারকারী ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">{user.full_name || 'নাম নেই'}</h3>
                        <div className="text-sm text-muted-foreground">
                          <span>ব্যবহারকারী #{user.user_number}</span>
                          {user.phone && <span className="ml-4">ফোন: {user.phone}</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          যোগদান: {new Date(user.created_at).toLocaleDateString('bn-BD')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>সকল অর্ডার ({filteredOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium">অর্ডার #{order.order_number}</h3>
                          <div className="text-sm text-muted-foreground">
                            ব্যবহারকারী ID: {order.user_id}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">৳{order.total_amount.toLocaleString()}</div>
                          <Badge 
                            variant={
                              order.status === 'completed' ? 'default' :
                              order.status === 'pending' ? 'secondary' : 'outline'
                            }
                          >
                            {order.status === 'completed' ? 'সম্পন্ন' :
                             order.status === 'pending' ? 'অপেক্ষমাণ' : order.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        তারিখ: {new Date(order.created_at).toLocaleDateString('bn-BD')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  ডেলিভারি সেটিংস
                </CardTitle>
                <CardDescription>
                  ডেলিভারি চার্জ এবং ফ্রি ডেলিভারির সীমা নির্ধারণ করুন
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDeliveryConfigUpdate} className="space-y-4 max-w-md">
                  <div>
                    <Label htmlFor="dhaka_charge">ঢাকার ভিতরে ডেলিভারি চার্জ (৳)</Label>
                    <Input
                      id="dhaka_charge"
                      type="number"
                      value={deliveryConfig.dhaka_charge}
                      onChange={(e) => setDeliveryConfig({
                        ...deliveryConfig,
                        dhaka_charge: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="outside_dhaka_charge">ঢাকার বাইরে ডেলিভারি চার্জ (৳)</Label>
                    <Input
                      id="outside_dhaka_charge"
                      type="number"
                      value={deliveryConfig.outside_dhaka_charge}
                      onChange={(e) => setDeliveryConfig({
                        ...deliveryConfig,
                        outside_dhaka_charge: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="free_delivery_threshold">ফ্রি ডেলিভারির সীমা (৳)</Label>
                    <Input
                      id="free_delivery_threshold"
                      type="number"
                      value={deliveryConfig.free_delivery_threshold}
                      onChange={(e) => setDeliveryConfig({
                        ...deliveryConfig,
                        free_delivery_threshold: parseFloat(e.target.value) || 0
                      })}
                    />
                  </div>
                  
                  <Button type="submit">
                    <Settings className="h-4 w-4 mr-2" />
                    সেটিংস আপডেট করুন
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default EnhancedAdminDashboard;