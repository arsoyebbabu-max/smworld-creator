import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Eye
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import MobileBottomNav from "@/components/MobileBottomNav";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  image_urls: string[];
  sizes: string[];
  colors: string[];
  is_active: boolean;
  category_id?: string;
  created_at: string;
}

interface User {
  id: string;
  user_id: string;
  full_name?: string;
  phone?: string;
  address?: string;
  user_number: number;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  discount_amount?: number;
  status: string;
  created_at: string;
  shipping_address?: string;
  payment_method?: string;
  profiles?: { full_name?: string };
}

interface WeeklyStats {
  week: string;
  revenue: number;
  orders: number;
  products_sold: number;
}

const EnhancedAdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    image_urls: "",
    sizes: "",
    colors: "",
    is_active: true,
    category_id: ""
  });
  const [editingProduct, setEditingProduct] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (!isAdmin) {
      toast.error("অ্যাডমিন অ্যাক্সেস প্রয়োজন");
      navigate("/");
      return;
    }

    fetchData();
  }, [user, isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;

      // Fetch orders with profile names
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch profile names separately for orders
      const ordersWithProfiles = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", order.user_id)
            .single();
          
          return {
            ...order,
            profiles: profile || { full_name: null }
          };
        })
      );

      setProducts(productsData || []);
      setUsers(usersData || []);
      setOrders(ordersWithProfiles || []);

      // Calculate weekly stats
      calculateWeeklyStats(ordersWithProfiles || []);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("ডেটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeklyStats = (ordersData: Order[]) => {
    const stats: { [key: string]: WeeklyStats } = {};
    const now = new Date();
    
    // Get last 8 weeks of data
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      const weekKey = `${weekStart.getDate()}/${weekStart.getMonth() + 1}`;
      
      stats[weekKey] = {
        week: weekKey,
        revenue: 0,
        orders: 0,
        products_sold: 0
      };
      
      // Calculate stats for this week
      ordersData.forEach(order => {
        const orderDate = new Date(order.created_at);
        if (orderDate >= weekStart && orderDate <= weekEnd) {
          stats[weekKey].revenue += Number(order.total_amount) || 0;
          stats[weekKey].orders += 1;
          // This is a simplified calculation - you might want to fetch actual product quantities
          stats[weekKey].products_sold += 1;
        }
      });
    }
    
    setWeeklyStats(Object.values(stats));
  };

  // Calculate totals
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
  const thisWeekRevenue = weeklyStats[weeklyStats.length - 1]?.revenue || 0;
  const activeProducts = products.filter(p => p.is_active).length;
  const totalStock = products.reduce((sum, product) => sum + (product.stock_quantity || 0), 0);
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: productForm.name,
        description: productForm.description || null,
        price: parseFloat(productForm.price) || 0,
        discount_price: productForm.discount_price ? parseFloat(productForm.discount_price) : null,
        stock_quantity: parseInt(productForm.stock_quantity) || 0,
        image_urls: productForm.image_urls ? productForm.image_urls.split(',').map(url => url.trim()) : [],
        sizes: productForm.sizes ? productForm.sizes.split(',').map(size => size.trim()) : [],
        colors: productForm.colors ? productForm.colors.split(',').map(color => color.trim()) : [],
        is_active: productForm.is_active,
        category_id: productForm.category_id || null
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct);
        
        if (error) throw error;
        toast.success("পণ্য সফলভাবে আপডেট হয়েছে");
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData]);
        
        if (error) throw error;
        toast.success("নতুন পণ্য যোগ করা হয়েছে");
      }

      // Reset form
      setProductForm({
        name: "",
        description: "",
        price: "",
        discount_price: "",
        stock_quantity: "",
        image_urls: "",
        sizes: "",
        colors: "",
        is_active: true,
        category_id: ""
      });
      setEditingProduct(null);
      fetchData();

    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("পণ্য সেভ করতে সমস্যা হয়েছে");
    }
  };

  const handleEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || "",
      stock_quantity: product.stock_quantity.toString(),
      image_urls: product.image_urls.join(', '),
      sizes: product.sizes.join(', '),  
      colors: product.colors.join(', '),
      is_active: product.is_active,
      category_id: product.category_id || ""
    });
    setEditingProduct(product.id);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই পণ্যটি মুছে ফেলতে চান?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;
      toast.success("পণ্য মুছে ফেলা হয়েছে");
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("পণ্য মুছতে সমস্যা হয়েছে");
    }
  };

  // Filter data based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm) ||
    user.user_number.toString().includes(searchTerm)
  );

  const filteredOrders = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p>ডেটা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">অ্যাডমিন ড্যাশবোর্ড</h1>
              <p className="text-muted-foreground">সম্পূর্ণ ওয়েবসাইট পরিচালনা করুন</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Key Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">মোট আয়</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">৳{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                এই সপ্তাহে ৳{thisWeekRevenue.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">মোট অর্ডার</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{orders.length}</div>
              <p className="text-xs text-muted-foreground">
                {completedOrders} সম্পন্ন, {pendingOrders} অপেক্ষমান
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">সক্রিয় পণ্য</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{activeProducts}</div>
              <p className="text-xs text-muted-foreground">
                মোট স্টক: {totalStock}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ব্যবহারকারী</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                নিবন্ধিত সদস্য
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Revenue Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              সাপ্তাহিক আয়ের তথ্য
            </CardTitle>
            <CardDescription>গত ৮ সপ্তাহের আয় এবং অর্ডারের পরিসংখ্যান</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {weeklyStats.map((stat, index) => (
                <div key={index} className="text-center p-2 bg-muted rounded">
                  <div className="text-xs text-muted-foreground">{stat.week}</div>
                  <div className="font-semibold">৳{stat.revenue.toLocaleString()}</div>
                  <div className="text-xs">{stat.orders} অর্ডার</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="পণ্য, ব্যবহারকারী বা অর্ডার খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">পণ্য পরিচালনা</TabsTrigger>
            <TabsTrigger value="users">ব্যবহারকারী</TabsTrigger>
            <TabsTrigger value="orders">অর্ডার</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-4">
            {/* Product Form */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingProduct ? "পণ্য সম্পাদনা" : "নতুন পণ্য যোগ করুন"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="price">দাম *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount_price">ছাড়ের দাম</Label>
                      <Input
                        id="discount_price"
                        type="number"
                        value={productForm.discount_price}
                        onChange={(e) => setProductForm({...productForm, discount_price: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">স্টক পরিমাণ</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={productForm.stock_quantity}
                        onChange={(e) => setProductForm({...productForm, stock_quantity: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">বিবরণ</Label>
                    <Textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="images">ছবি URL (কমা দিয়ে আলাদা করুন)</Label>
                      <Textarea
                        id="images"
                        value={productForm.image_urls}
                        onChange={(e) => setProductForm({...productForm, image_urls: e.target.value})}
                        rows={2}
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
                      <Label htmlFor="colors">রং (কমা দিয়ে আলাদা করুন)</Label>
                      <Input
                        id="colors"
                        value={productForm.colors}
                        onChange={(e) => setProductForm({...productForm, colors: e.target.value})}
                        placeholder="লাল, নীল, সবুজ"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit">
                      {editingProduct ? "আপডেট করুন" : "পণ্য যোগ করুন"}
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
                            image_urls: "",
                            sizes: "",
                            colors: "",
                            is_active: true,
                            category_id: ""
                          });
                        }}
                      >
                        বাতিল করুন
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Products List */}
            <Card>
              <CardHeader>
                <CardTitle>পণ্যের তালিকা ({filteredProducts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">কোন পণ্য পাওয়া যায়নি</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {product.description}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
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
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">দাম:</span>
                            <div className="font-medium">
                              ৳{product.price}
                              {product.discount_price && (
                                <span className="text-destructive ml-2">
                                  ৳{product.discount_price}
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">স্টক:</span>
                            <div className="font-medium">{product.stock_quantity}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">অবস্থা:</span>
                            <Badge variant={product.is_active ? "default" : "secondary"}>
                              {product.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">তারিখ:</span>
                            <div>{new Date(product.created_at).toLocaleDateString('bn-BD')}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>ব্যবহারকারী তালিকা ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">কোন ব্যবহারকারী পাওয়া যায়নি</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <span className="text-muted-foreground">নাম:</span>
                            <div className="font-medium">{user.full_name || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ব্যবহারকারী নং:</span>
                            <div className="font-medium">#{user.user_number}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ফোন:</span>
                            <div className="font-medium">{user.phone || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">যোগদান:</span>
                            <div>{new Date(user.created_at).toLocaleDateString('bn-BD')}</div>
                          </div>
                        </div>
                        {user.address && (
                          <div className="mt-2">
                            <span className="text-muted-foreground">ঠিকানা:</span>
                            <p className="text-sm">{user.address}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>অর্ডার তালিকা ({filteredOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">কোন অর্ডার পাওয়া যায়নি</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium">অর্ডার #{order.order_number}</h3>
                            <p className="text-sm text-muted-foreground">
                              গ্রাহক: {order.profiles?.full_name || 'Unknown'}
                            </p>
                          </div>
                          <Badge 
                            variant={
                              order.status === 'completed' ? 'default' :
                              order.status === 'pending' ? 'secondary' : 'destructive'
                            }
                          >
                            {order.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {order.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                            {order.status === 'cancelled' && <XCircle className="w-3 h-3 mr-1" />}
                            {order.status === 'completed' ? 'সম্পন্ন' : 
                             order.status === 'pending' ? 'অপেক্ষমান' : 'বাতিল'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">মোট:</span>
                            <div className="font-medium">৳{Number(order.total_amount).toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ছাড়:</span>
                            <div className="font-medium">৳{Number(order.discount_amount || 0).toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">পেমেন্ট:</span>
                            <div>{order.payment_method || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">তারিখ:</span>
                            <div>{new Date(order.created_at).toLocaleDateString('bn-BD')}</div>
                          </div>
                        </div>
                        
                        {order.shipping_address && (
                          <div className="mt-2">
                            <span className="text-muted-foreground">ঠিকানা:</span>
                            <p className="text-sm">{order.shipping_address}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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