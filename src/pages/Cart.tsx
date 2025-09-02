import { useState } from "react";
import { Heart, Star, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { toast } from "@/hooks/use-toast";
import smartwatchImg from "@/assets/smartwatch.jpg";

const Cart = () => {
  const { cartItems, loading, updateCartItemQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  
  const subtotal = getCartTotal();
  const discount = appliedCoupon ? subtotal * 0.1 : 0; // 10% discount if coupon applied
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const applyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode);
      setCouponCode("");
      toast({
        title: "কুপন প্রয়োগ সফল!",
        description: "১০% ছাড় প্রয়োগ করা হয়েছে।",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
            <p>লোড হচ্ছে...</p>
          </div>
        </div>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">আপনার কার্ট খালি</h1>
            <p className="text-muted-foreground mb-6">এখনো কোনো পণ্য যোগ করেননি</p>
            <Link to="/shop">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                কেনাকাটা করুন
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/shop">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                কেনাকাটা চালিয়ে যান
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">শপিং কার্ট ({cartItems.length})</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearCart}
            className="text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            সব সরান
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const itemPrice = item.products.discount_price || item.products.price;
              const itemImage = item.products.image_urls?.length ? item.products.image_urls[0] : smartwatchImg;
              
              return (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={itemImage}
                        alt={item.products.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{item.products.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          {item.size && <span>সাইজ: {item.size}</span>}
                          {item.color && <span>রং: {item.color}</span>}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="min-w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">৳ {(itemPrice * item.quantity).toLocaleString()}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-destructive hover:bg-destructive/10 p-1 h-6"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>অর্ডার সামারি</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="কুপন কোড"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={applyCoupon}>
                    প্রয়োগ
                  </Button>
                </div>
                
                {appliedCoupon && (
                  <div className="bg-success/10 text-success p-2 rounded-lg text-sm">
                    কুপন "{appliedCoupon}" প্রয়োগ হয়েছে!
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>সাবটোটাল:</span>
                    <span>৳ {subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>ছাড়:</span>
                      <span>-৳ {discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>ডেলিভারি:</span>
                    <span>{shipping === 0 ? 'ফ্রি' : `৳ ${shipping}`}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>মোট:</span>
                    <span>৳ {total.toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate("/checkout")}
                  className="w-full h-12"
                  disabled={cartItems.length === 0}
                >
                  চেকআউট (৳ {total.toLocaleString()})
                </Button>

                <div className="text-center space-y-2 pt-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    <span>১০০% নিরাপদ পেমেন্ট</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4" />
                    <span>দ্রুত ডেলিভারি</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Cart;