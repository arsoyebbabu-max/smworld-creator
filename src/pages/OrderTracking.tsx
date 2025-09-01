import { ChevronLeft, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const OrderTracking = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              My Orders
            </Button>
          </Link>
        </div>

        {/* User Profile Section */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">MD</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">MD SOYEB</h2>
              <p className="text-muted-foreground">01795051911</p>
            </div>
          </div>

          {/* Order Status Tabs */}
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="placed">Placed</TabsTrigger>
              <TabsTrigger value="shipped">To Ship</TabsTrigger>
              <TabsTrigger value="received">To Received</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">😕</div>
                <h3 className="text-lg font-medium mb-2">Your order list is empty</h3>
                <p className="text-muted-foreground mb-6">Start exploring our products with great discount</p>
                <Link to="/shop">
                  <Button>Continue Shopping</Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Rewards Section */}
        <div className="space-y-4 mb-6">
          <Card className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <div className="flex justify-between items-center">
              <h4 className="font-bold">30 টাকা ডিসকাউন্ট পাবেন 500 কয়েন ব্যবহার করে!</h4>
              <Button variant="secondary" size="sm">সংগ্রহ করুন</Button>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="flex justify-between items-center">
              <h4 className="font-bold">70 টাকা ডিসকাউন্ট পাবেন 1000 কয়েন ব্যবহার করে!</h4>
              <Button variant="secondary" size="sm">সংগ্রহ করুন</Button>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderTracking;