import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Star, 
  MessageSquare, 
  Settings,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  FileText
} from "lucide-react";
import { AdminStats } from "@/components/admin/AdminStats";
import { OrderManagement } from "@/components/admin/OrderManagement";
import { ReviewManagement } from "@/components/admin/ReviewManagement";
import { WebsiteSettings } from "@/components/admin/WebsiteSettings";
import MobileBottomNavWrapper from "@/components/MobileBottomNavWrapper";
import { format, subDays, eachDayOfInterval } from "date-fns";

export default function SuperAdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const {
    products,
    users,
    orders,
    reviews,
    categories,
    websiteSettings,
    adminStats,
    loading,
    error,
    updateOrderStatus,
    updateReviewStatus,
    updateWebsiteSettings
  } = useAdminData();

  const [searchTerm, setSearchTerm] = useState("");

  // Generate chart data for the last 7 days
  const chartData = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  }).map(date => {
    const dayOrders = orders.filter(order => 
      format(new Date(order.created_at), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    const dayRevenue = dayOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
    
    return {
      date: format(date, 'dd/MM'),
      orders: dayOrders.length,
      revenue: dayRevenue
    };
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p>অ্যাডমিন ড্যাশবোর্ড লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">ত্রুটি হয়েছে</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">সুপার অ্যাডমিন ড্যাশবোর্ড</h1>
          <p className="text-muted-foreground">
            সম্পূর্ণ ওয়েবসাইট নিয়ন্ত্রণ ও পরিচালনা করুন
          </p>
        </div>

        <AdminStats stats={adminStats} />

        <div className="mt-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-7 lg:w-auto lg:inline-flex">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">ওভারভিউ</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                <span className="hidden sm:inline">অর্ডার</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">প্রোডাক্ট</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">ইউজার</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">রিভিউ</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">মেসেজ</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">সেটিংস</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      সাম্প্রতিক বিক্রয় (৭ দিন)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      দৈনিক অর্ডার (৭ দিন)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="orders" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>সাম্প্রতিক অর্ডার</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{order.order_number}</p>
                            <p className="text-sm text-muted-foreground">
                              ৳{order.total_amount}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {order.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>কম স্টক প্রোডাক্ট</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {products
                        .filter(product => product.stock_quantity < 10)
                        .slice(0, 5)
                        .map((product) => (
                        <div key={product.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              স্টক: {product.stock_quantity}
                            </p>
                          </div>
                          <Badge variant="destructive">
                            কম স্টক
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>সাম্প্রতিক রিভিউ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reviews.slice(0, 5).map((review) => (
                        <div key={review.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">রেটিং: {review.rating}/5</p>
                            <p className="text-sm text-muted-foreground truncate">
                              {review.review_text || 'কোন টেক্সট নেই'}
                            </p>
                          </div>
                          <Badge variant={review.is_approved ? "default" : "secondary"}>
                            {review.is_approved ? "অনুমোদিত" : "অপেক্ষমান"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <OrderManagement 
                orders={orders}
                onUpdateOrderStatus={updateOrderStatus}
              />
            </TabsContent>

            <TabsContent value="products" className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>প্রোডাক্ট ম্যানেজমেন্ট</CardTitle>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      নতুন প্রোডাক্ট
                    </Button>
                  </div>
                  <Input
                    placeholder="প্রোডাক্ট সার্চ করুন..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-4"
                  />
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>নাম</TableHead>
                          <TableHead>দাম</TableHead>
                          <TableHead>স্টক</TableHead>
                          <TableHead>স্ট্যাটাস</TableHead>
                          <TableHead>অ্যাকশন</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>৳{product.price}</TableCell>
                            <TableCell>{product.stock_quantity}</TableCell>
                            <TableCell>
                              <Badge variant={product.is_active ? "default" : "secondary"}>
                                {product.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>ইউজার ম্যানেজমেন্ট</CardTitle>
                  <Input
                    placeholder="ইউজার সার্চ করুন..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>নাম</TableHead>
                          <TableHead>ফোন</TableHead>
                          <TableHead>ইউজার নম্বর</TableHead>
                          <TableHead>যোগদানের তারিখ</TableHead>
                          <TableHead>অ্যাকশন</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.full_name || 'N/A'}
                            </TableCell>
                            <TableCell>{user.phone || 'N/A'}</TableCell>
                            <TableCell>#{user.user_number}</TableCell>
                            <TableCell>
                              {format(new Date(user.created_at), 'dd/MM/yyyy')}
                            </TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ReviewManagement 
                reviews={reviews}
                onUpdateReviewStatus={updateReviewStatus}
              />
            </TabsContent>

            <TabsContent value="messages" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    কাস্টমার মেসেজ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p>মেসেজ ফিচার শীঘ্রই আসছে</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <WebsiteSettings 
                settings={websiteSettings}
                onUpdateSettings={updateWebsiteSettings}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <MobileBottomNavWrapper />
    </div>
  );
}