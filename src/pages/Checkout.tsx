import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Truck, CreditCard, Phone, MapPin, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

interface UserProfile {
  full_name?: string;
  phone?: string;
  address?: string;
}

interface DeliveryConfig {
  dhaka_charge: number;
  outside_dhaka_charge: number;
  free_delivery_threshold: number;
}

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [deliveryConfig, setDeliveryConfig] = useState<DeliveryConfig>({
    dhaka_charge: 60,
    outside_dhaka_charge: 120,
    free_delivery_threshold: 1000
  });
  
  // Form states
  const [orderForm, setOrderForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: "dhaka",
    payment_method: "cash_on_delivery",
    notes: ""
  });

  const subtotal = getCartTotal();
  const isOutsideDhaka = orderForm.city !== "dhaka";
  const deliveryCharge = subtotal >= deliveryConfig.free_delivery_threshold ? 0 : 
                        isOutsideDhaka ? deliveryConfig.outside_dhaka_charge : deliveryConfig.dhaka_charge;
  const total = subtotal + deliveryCharge;

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("আপনার কার্ট খালি");
      navigate("/cart");
      return;
    }
    
    fetchUserProfile();
    fetchDeliveryConfig();
  }, [cartItems, navigate]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, address")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setUserProfile(data);
        setOrderForm(prev => ({
          ...prev,
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || ""
        }));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchDeliveryConfig = async () => {
    try {
      const { data, error } = await supabase
        .from("delivery_config")
        .select("*")
        .single();

      if (data && !error) {
        setDeliveryConfig({
          dhaka_charge: data.dhaka_charge,
          outside_dhaka_charge: data.outside_dhaka_charge,
          free_delivery_threshold: data.free_delivery_threshold
        });
      }
    } catch (error) {
      console.error("Error fetching delivery config:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("অর্ডার করতে লগইন করুন");
      navigate("/auth");
      return;
    }

    if (!orderForm.full_name || !orderForm.phone || !orderForm.address) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }

    setLoading(true);
    
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          total_amount: total,
          discount_amount: 0,
          status: "pending",
          shipping_address: `${orderForm.full_name}\n${orderForm.phone}\n${orderForm.address}\n${orderForm.city === "dhaka" ? "ঢাকা" : "ঢাকার বাইরে"}`,
          payment_method: orderForm.payment_method
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.products?.price || 0,
        size: item.size,
        color: item.color
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();
      
      toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে!");
      navigate(`/order-success?order=${orderNumber}`);
      
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("অর্ডার করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { id: "cash_on_delivery", label: "ক্যাশ অন ডেলিভারি", icon: "💵" },
    { id: "bkash", label: "বিকাশ", icon: "📱" },
    { id: "nagad", label: "নগদ", icon: "💳" },
    { id: "rocket", label: "রকেট", icon: "🚀" }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">চেকআউট</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    ডেলিভারি তথ্য
                  </CardTitle>
                  <CardDescription>
                    {userProfile.full_name && "সংরক্ষিত তথ্য থেকে পূরণ করা হয়েছে"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">পূর্ণ নাম *</Label>
                      <Input
                        id="full_name"
                        value={orderForm.full_name}
                        onChange={(e) => setOrderForm({...orderForm, full_name: e.target.value})}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">মোবাইল নম্বর *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={orderForm.phone}
                        onChange={(e) => setOrderForm({...orderForm, phone: e.target.value})}
                        placeholder="01XXXXXXXXX"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">সম্পূর্ণ ঠিকানা *</Label>
                      <Textarea
                        id="address"
                        value={orderForm.address}
                        onChange={(e) => setOrderForm({...orderForm, address: e.target.value})}
                        placeholder="বাড়ি/ফ্ল্যাট নং, রোড নং, এলাকা, থানা"
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label>এলাকা</Label>
                      <RadioGroup
                        value={orderForm.city}
                        onValueChange={(value) => setOrderForm({...orderForm, city: value})}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dhaka" id="dhaka" />
                          <Label htmlFor="dhaka">ঢাকার ভিতরে</Label>
                          <Badge variant="secondary">৳{deliveryConfig.dhaka_charge}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="outside" id="outside" />
                          <Label htmlFor="outside">ঢাকার বাইরে</Label>
                          <Badge variant="secondary">৳{deliveryConfig.outside_dhaka_charge}</Badge>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="notes">অতিরিক্ত নোট (ঐচ্ছিক)</Label>
                      <Textarea
                        id="notes"
                        value={orderForm.notes}
                        onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
                        placeholder="বিশেষ নির্দেশনা"
                        rows={2}
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    পেমেন্ট পদ্ধতি
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={orderForm.payment_method}
                    onValueChange={(value) => setOrderForm({...orderForm, payment_method: value})}
                    className="space-y-3"
                  >
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer flex-1">
                          <span className="text-lg">{method.icon}</span>
                          {method.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>অর্ডার সামারি</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={`${item.product_id}-${item.size}-${item.color}`} className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.products?.name || 'পণ্য'}</h4>
                        <div className="text-sm text-muted-foreground">
                          {item.size && <span>সাইজ: {item.size}</span>}
                          {item.color && <span className="ml-2">রং: {item.color}</span>}
                          <span className="ml-2">পরিমাণ: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">৳{((item.products?.discount_price || item.products?.price || 0) * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}

                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>সাবটোটাল:</span>
                      <span>৳{subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        ডেলিভারি চার্জ:
                      </span>
                      <span>
                        {deliveryCharge === 0 ? (
                          <Badge variant="secondary">ফ্রি</Badge>
                        ) : (
                          `৳${deliveryCharge}`
                        )}
                      </span>
                    </div>
                    
                    {subtotal >= deliveryConfig.free_delivery_threshold && (
                      <div className="text-sm text-success">
                        ৳{deliveryConfig.free_delivery_threshold} এর উপরে ফ্রি ডেলিভারি!
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>মোট:</span>
                      <span>৳{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? "অর্ডার করা হচ্ছে..." : `৳${total.toLocaleString()} - অর্ডার কনফার্ম করুন`}
                  </Button>
                  
                  <div className="text-center text-sm text-muted-foreground">
                    অর্ডার কনফার্ম করার মাধ্যমে আপনি আমাদের 
                    <br />
                    নিয়মাবলী মেনে নিচ্ছেন
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Checkout;