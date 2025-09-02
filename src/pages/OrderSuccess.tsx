import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Package, Clock, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

interface OrderDetails {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  payment_method: string;
  created_at: string;
}

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  const orderNumber = searchParams.get("order");

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails();
    }
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .single();

      if (error) throw error;
      setOrderDetails(data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: { [key: string]: string } = {
      cash_on_delivery: "ক্যাশ অন ডেলিভারি",
      bkash: "বিকাশ",
      nagad: "নগদ",
      rocket: "রকেট"
    };
    return methods[method] || method;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p>অর্ডারের তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-success mb-2">
              অর্ডার সফল!
            </h1>
            <p className="text-muted-foreground">
              আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে
            </p>
          </div>

          {orderDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>অর্ডার বিবরণ</span>
                  <Badge variant="secondary">
                    #{orderDetails.order_number}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Package className="h-4 w-4" />
                      অর্ডার নম্বর:
                    </div>
                    <div className="font-medium">{orderDetails.order_number}</div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Clock className="h-4 w-4" />
                      অর্ডারের তারিখ:
                    </div>
                    <div className="font-medium">
                      {new Date(orderDetails.created_at).toLocaleDateString('bn-BD')}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    ডেলিভারি ঠিকানা:
                  </div>
                  <div className="font-medium whitespace-pre-line">
                    {orderDetails.shipping_address}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">মোট পরিমাণ:</div>
                    <div className="text-lg font-bold">৳{Number(orderDetails.total_amount).toLocaleString()}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">পেমেন্ট পদ্ধতি:</div>
                    <div className="font-medium">{getPaymentMethodLabel(orderDetails.payment_method)}</div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2">গুরুত্বপূর্ণ তথ্য:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• আপনার অর্ডারটি প্রক্রিয়াজাতকরণের জন্য গ্রহণ করা হয়েছে</li>
                    <li>• ২-৪ কার্যদিবসের মধ্যে ডেলিভারি হবে</li>
                    <li>• অর্ডার ট্র্যাক করতে অর্ডার নম্বর সংরক্ষণ করুন</li>
                    <li>• যেকোনো সমস্যার জন্য আমাদের সাথে যোগাযোগ করুন</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Package className="h-4 w-4 mr-2" />
                      আমার অর্ডার দেখুন
                    </Button>
                  </Link>
                  
                  <Link to="/shop" className="flex-1">
                    <Button className="w-full">
                      আরো কেনাকাটা করুন
                    </Button>
                  </Link>
                </div>

                <div className="text-center pt-4 border-t">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                    <Phone className="h-4 w-4" />
                    সাহায্যের জন্য যোগাযোগ করুন
                  </div>
                  <div className="space-y-1 text-sm">
                    <div>হটলাইন: ০১৭০০০০০০০০</div>
                    <div>ইমেইল: support@example.com</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!orderDetails && !loading && (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">অর্ডার পাওয়া যায়নি</h2>
                <p className="text-muted-foreground mb-4">
                  এই অর্ডার নম্বরের কোন অর্ডার খুঁজে পাওয়া যায়নি
                </p>
                <Link to="/shop">
                  <Button>কেনাকাটা শুরু করুন</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default OrderSuccess;