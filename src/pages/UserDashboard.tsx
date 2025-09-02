import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  User, 
  Settings, 
  Package, 
  MessageSquare, 
  Heart, 
  ShoppingCart, 
  CreditCard, 
  MapPin, 
  Phone,
  Mail,
  Calendar,
  Award,
  Gift,
  Bell
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'profile', icon: User, label: 'প্রোফাইল', color: 'text-blue-600' },
    { id: 'orders', icon: Package, label: 'অর্ডার হিস্ট্রি', color: 'text-green-600' },
    { id: 'wishlist', icon: Heart, label: 'উইশলিস্ট', color: 'text-red-600' },
    { id: 'cart', icon: ShoppingCart, label: 'কার্ট', color: 'text-purple-600' },
    { id: 'payment', icon: CreditCard, label: 'পেমেন্ট মেথড', color: 'text-yellow-600' },
    { id: 'address', icon: MapPin, label: 'ঠিকানা', color: 'text-indigo-600' },
    { id: 'messages', icon: MessageSquare, label: 'অ্যাডমিন মেসেজ', color: 'text-pink-600' },
    { id: 'settings', icon: Settings, label: 'সেটিংস', color: 'text-gray-600' }
  ];

  const recentOrders: any[] = [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">স্বাগতম!</h1>
                  <p className="text-primary-foreground/90">{user?.email}</p>
                  <Badge className="bg-white/20 text-white mt-2">
                    <Award className="w-3 h-3 mr-1" />
                    ভিআইপি কাস্টমার
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ড্যাশবোর্ড মেনু</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      className="w-full text-left p-4 hover:bg-muted transition-colors flex items-center gap-3 border-b last:border-b-0"
                    >
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="mt-6 space-y-4">
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-primary">০</div>
                <div className="text-sm text-muted-foreground">মোট অর্ডার</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-green-600">৳ ০</div>
                <div className="text-sm text-muted-foreground">মোট খরচ</div>
              </Card>
              <Card className="text-center p-4">
                <div className="text-2xl font-bold text-purple-600">০</div>
                <div className="text-sm text-muted-foreground">উইশলিস্ট</div>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">ওভারভিউ</TabsTrigger>
                <TabsTrigger value="orders">অর্ডার</TabsTrigger>
                <TabsTrigger value="profile">প্রোফাইল</TabsTrigger>
                <TabsTrigger value="messages">মেসেজ</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent Orders */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        সাম্প্রতিক অর্ডার
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                         {recentOrders.length === 0 ? (
                           <div className="text-center py-8">
                             <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                             <p className="text-muted-foreground">আপনার কোনো অর্ডার নেই</p>
                             <Link to="/shop">
                               <Button className="mt-4" variant="outline">কেনাকাটা শুরু করুন</Button>
                             </Link>
                           </div>
                         ) : (
                           recentOrders.map((order) => (
                             <div key={order.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                               <div>
                                 <div className="font-medium">{order.id}</div>
                                 <div className="text-sm text-muted-foreground">{order.date}</div>
                                 <Badge variant={order.status === 'ডেলিভারি হয়েছে' ? 'default' : 'secondary'}>
                                   {order.status}
                                 </Badge>
                               </div>
                               <div className="text-right">
                                 <div className="font-bold">৳ {order.total.toLocaleString()}</div>
                                 <div className="text-sm text-muted-foreground">{order.items} টি আইটেম</div>
                               </div>
                             </div>
                           ))
                         )}
                       </div>
                      <Link to="/orders">
                        <Button className="w-full mt-4" variant="outline">
                          সব অর্ডার দেখুন
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Rewards & Points */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Gift className="w-5 h-5" />
                        রিওয়ার্ড পয়েন্ট
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center space-y-4">
                        <div className="text-4xl font-bold text-primary">০</div>
                        <div className="text-muted-foreground">পয়েন্ট বাকি আছে</div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>পরবর্তী লেভেল</span>
                            <span>১০০ পয়েন্ট</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                          </div>
                        </div>

                        <Link to="/shop">
                          <Button className="w-full">
                            শপিং করে পয়েন্ট অর্জন করুন
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>দ্রুত অ্যাকশন</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Link to="/shop">
                        <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                          <ShoppingCart className="w-6 h-6" />
                          <span className="text-xs">শপ করুন</span>
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                        <Heart className="w-6 h-6" />
                        <span className="text-xs">উইশলিস্ট</span>
                      </Button>
                      <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                        <Bell className="w-6 h-6" />
                        <span className="text-xs">নোটিফিকেশন</span>
                      </Button>
                      <Button variant="outline" className="w-full h-16 flex flex-col gap-2">
                        <Settings className="w-6 h-6" />
                        <span className="text-xs">সেটিংস</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>অর্ডার হিস্ট্রি</CardTitle>
                    <CardDescription>আপনার সকল অর্ডারের তালিকা</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">কোন অর্ডার পাওয়া যায়নি</h3>
                      <p className="text-muted-foreground mb-6">আপনার প্রথম অর্ডার করুন এবং বিশেষ ছাড় পান</p>
                      <Link to="/shop">
                        <Button>এখনই শপিং করুন</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>প্রোফাইল তথ্য</CardTitle>
                    <CardDescription>আপনার একাউন্ট তথ্য আপডেট করুন</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">ইমেইল</div>
                            <div className="text-sm text-muted-foreground">{user?.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">ফোন</div>
                            <div className="text-sm text-muted-foreground">+৮৮০ ১৭৯৫ ০৫১৯১১</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">যোগদানের তারিখ</div>
                            <div className="text-sm text-muted-foreground">জানুয়ারি ২০২৪</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                          <div>
                            <div className="font-medium">ঠিকানা</div>
                            <div className="text-sm text-muted-foreground">
                              ঢাকা, বাংলাদেশ<br />
                              পোস্ট কোড: ১০০০
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button>প্রোফাইল আপডেট করুন</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      অ্যাডমিন মেসেজ
                    </CardTitle>
                    <CardDescription>গুরুত্বপূর্ণ বার্তা এবং আপডেট</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-blue-900">স্বাগতম বোনাস! 🎉</h4>
                          <span className="text-xs text-blue-600">২ দিন আগে</span>
                        </div>
                        <p className="text-sm text-blue-800">
                          আপনার একাউন্ট তৈরির জন্য ধন্যবাদ! প্রথম অর্ডারে ২০% ছাড় পান।
                        </p>
                      </div>
                      
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-green-900">নতুন প্রোডাক্ট আপডেট 📦</h4>
                          <span className="text-xs text-green-600">৫ দিন আগে</span>
                        </div>
                        <p className="text-sm text-green-800">
                          নতুন গ্যাজেট কালেকশন এসেছে! বিশেষ লঞ্চ অফার দেখুন।
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;