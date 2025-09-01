import { useState } from "react";
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const OrderTracking = () => {
  const [selectedTab, setSelectedTab] = useState("all");

  // Mock user data
  const userData = {
    name: "MD SOYEB",
    phone: "0179505191",
    avatar: "MS",
    coinsEarned: 0,
  };

  // Mock order data
  const orders = [
    {
      id: "ORD001",
      status: "delivered",
      items: [
        { name: "Rain Cloud Night Light", price: 1850, image: "/api/placeholder/80/80" }
      ],
      total: 1850,
      orderDate: "2024-01-15",
      deliveryDate: "2024-01-20",
    },
    {
      id: "ORD002", 
      status: "shipped",
      items: [
        { name: "Smart Watch Pro", price: 2500, image: "/api/placeholder/80/80" }
      ],
      total: 2500,
      orderDate: "2024-01-18",
      estimatedDelivery: "2024-01-22",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "placed":
        return <Clock className="w-5 h-5 text-warning" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-info" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-primary" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "returned":
        return <Package className="w-5 h-5 text-muted-foreground" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "placed":
        return "warning";
      case "confirmed":
        return "info";
      case "shipped":
        return "default";
      case "delivered":
        return "success";
      case "cancelled":
        return "destructive";
      case "returned":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const orderTabs = [
    { id: "all", label: "All Orders", icon: Package },
    { id: "placed", label: "Placed", icon: Clock },
    { id: "shipped", label: "To Ship", icon: Truck },
    { id: "delivered", label: "To Received", icon: CheckCircle },
    { id: "cancelled", label: "Cancelled", icon: XCircle },
    { id: "returned", label: "Returned", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* User Profile Section */}
      <div className="bg-primary text-primary-foreground p-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-primary-foreground">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">My Orders</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-white text-primary text-lg font-bold">
                {userData.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold">{userData.name}</h2>
              <p className="opacity-90">{userData.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Navigation */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4 overflow-x-auto">
            {orderTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex flex-col items-center p-2 min-w-16 ${
                  selectedTab === tab.id
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                }`}
              >
                <tab.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Claim Coins */}
          <Card className="bg-gradient-to-r from-warning/10 to-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🪙</span>
                </div>
                <div>
                  <h3 className="font-semibold">Claim Coins</h3>
                  <p className="text-sm text-muted-foreground">
                    You've earned {userData.coinsEarned} coins by shopping
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Get Coins & Discounts */}
          <Card className="bg-gradient-to-r from-success/10 to-success/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎁</span>
                </div>
                <div>
                  <h3 className="font-semibold">Get Coins & Discounts</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep shopping to earn more rewards.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Special Offers */}
        <div className="space-y-3 mb-6">
          <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-4 rounded-lg">
            <p className="font-medium">৩০ টাকা ডিসকাউন্ট পান ৫০০ টাকার ব্যাগের করে!</p>
            <Button variant="secondary" size="sm" className="mt-2">
              সংগ্রহ করুন
            </Button>
          </div>
          <div className="bg-gradient-to-r from-info to-info/90 text-info-foreground p-4 rounded-lg">
            <p className="font-medium">৭০ টাকা ডিসকাউন্ট পান ১০০০ টাকার ব্যাগের করে!</p>
            <Button variant="secondary" size="sm" className="mt-2">
              সংগ্রহ করুন
            </Button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="font-medium">Order #{order.id}</span>
                    </div>
                    <Badge variant={getStatusColor(order.status) as any}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 mb-3">
                      <div className="w-16 h-16 bg-muted rounded-md"></div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-primary font-semibold">৳ {item.price}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Order Date: {order.orderDate}</span>
                      <span>Total: ৳ {order.total}</span>
                    </div>
                    {order.deliveryDate && (
                      <p className="text-sm text-success">
                        Delivered on: {order.deliveryDate}
                      </p>
                    )}
                    {order.estimatedDelivery && (
                      <p className="text-sm text-muted-foreground">
                        Estimated Delivery: {order.estimatedDelivery}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-6xl mb-4">😞</div>
                <h3 className="text-lg font-semibold mb-2">Your order list is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring our products with great discount
                </p>
                <Link to="/">
                  <Button>Continue Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;