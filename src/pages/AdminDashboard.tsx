import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  LogOut,
  BarChart3,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
}

interface User {
  id: string;
  full_name?: string;
  phone?: string;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_id: string;
  profiles?: User;
}

export default function AdminDashboard() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/auth');
      return;
    }
    
    loadDashboardData();
  }, [user, isAdmin, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Load orders with user profiles
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Get user profiles for orders
      const userIds = ordersData?.map(order => order.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      // Merge orders with profiles
      const ordersWithProfiles = ordersData?.map(order => ({
        ...order,
        profiles: profilesData?.find(profile => profile.user_id === order.user_id)
      })) || [];

      setProducts(productsData || []);
      setUsers(usersData || []);
      setOrders(ordersWithProfiles);

      // Calculate stats
      const totalRevenue = ordersWithProfiles?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      setStats({
        totalProducts: productsData?.length || 0,
        totalUsers: usersData?.length || 0,
        totalOrders: ordersWithProfiles?.length || 0,
        totalRevenue
      });

    } catch (error: any) {
      toast({
        title: "ডেটা লোড করতে সমস্যা",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.includes(searchQuery)
  );

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.includes(searchQuery) ||
    user.phone?.includes(searchQuery)
  );

  const filteredOrders = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.includes(searchQuery) ||
    order.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">SM World Admin</h1>
            <Badge variant="secondary">অ্যাডমিন প্যানেল</Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">স্বাগতম, অ্যাডমিন</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              লগআউট
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/20 min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('dashboard')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              ড্যাশবোর্ড
            </Button>
            <Button
              variant={activeTab === 'products' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('products')}
            >
              <Package className="h-4 w-4 mr-2" />
              পণ্য ব্যবস্থাপনা
            </Button>
            <Button
              variant={activeTab === 'users' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('users')}
            >
              <Users className="h-4 w-4 mr-2" />
              ব্যবহারকারী
            </Button>
            <Button
              variant={activeTab === 'orders' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              অর্ডার ব্যবস্থাপনা
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              সেটিংস
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ইউজার আইডি, অর্ডার আইডি বা প্রোডাক্ট আইডি দিয়ে সার্চ করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">মোট পণ্য</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalProducts}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">মোট ব্যবহারকারী</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">মোট অর্ডার</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalOrders}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">মোট বিক্রয়</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">৳{stats.totalRevenue.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>সাম্প্রতিক অর্ডার</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.profiles?.full_name || 'অজানা ব্যবহারকারী'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">৳{Number(order.total_amount).toLocaleString()}</p>
                            <Badge variant="secondary" className="text-xs">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>জনপ্রিয় পণ্য</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {products.slice(0, 5).map((product) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              স্টক: {product.stock_quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">৳{Number(product.price).toLocaleString()}</p>
                            {product.discount_price && (
                              <p className="text-sm text-muted-foreground line-through">
                                ৳{Number(product.discount_price).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">পণ্য ব্যবস্থাপনা</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  নতুন পণ্য যোগ করুন
                </Button>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                          <div className="flex gap-4 mt-2">
                            <span>মূল্য: ৳{Number(product.price).toLocaleString()}</span>
                            {product.discount_price && (
                              <span className="text-green-600">
                                ছাড়: ৳{Number(product.discount_price).toLocaleString()}
                              </span>
                            )}
                            <span>স্টক: {product.stock_quantity}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">ব্যবহারকারী তালিকা</h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{user.full_name || 'নাম নেই'}</h3>
                          <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                          <p className="text-sm text-muted-foreground">ফোন: {user.phone || 'নেই'}</p>
                          <p className="text-sm text-muted-foreground">
                            যোগদান: {new Date(user.created_at).toLocaleDateString('bn-BD')}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">অর্ডার ব্যবস্থাপনা</h2>
              
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{order.order_number}</h3>
                          <p className="text-sm text-muted-foreground">ID: {order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            ক্রেতা: {order.profiles?.full_name || 'অজানা'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            তারিখ: {new Date(order.created_at).toLocaleDateString('bn-BD')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">৳{Number(order.total_amount).toLocaleString()}</p>
                          <Badge variant="secondary">{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">সেটিংস</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>ওয়েবসাইট সেটিংস</CardTitle>
                  <CardDescription>
                    আপনার ওয়েবসাইটের মূল সেটিংস পরিবর্তন করুন
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">সেটিংস পেজ শীঘ্রই আসছে...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}