import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  Shield, 
  ArrowLeft,
  Tag
} from 'lucide-react';
import smartwatchImg from '@/assets/smartwatch.jpg';
import humidifierImg from '@/assets/humidifier.jpg';

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'স্মার্ট ওয়াচ প্রো ম্যাক্স',
      price: 9500,
      originalPrice: 12500,
      quantity: 1,
      image: smartwatchImg,
      size: '44mm',
      color: 'কালো'
    },
    {
      id: '2',
      name: 'আল্ট্রাসনিক এয়ার হিউমিডিফায়ার',
      price: 4800,
      originalPrice: 6500,
      quantity: 2,
      image: humidifierImg,
      size: 'মাঝারি',
      color: 'সাদা'
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'welcome20') {
      setAppliedCoupon('WELCOME20 - ২০% ছাড়');
      setCouponCode('');
    } else {
      alert('অবৈধ কুপন কোড');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? subtotal * 0.2 : 0;
  const shipping = subtotal > 1000 ? 0 : 100;
  const total = subtotal - discount + shipping;

  const totalSavings = cartItems.reduce((sum, item) => 
    sum + ((item.originalPrice - item.price) * item.quantity), 0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">আপনার কার্ট খালি</h2>
            <p className="text-muted-foreground">কিছু পণ্য যোগ করুন এবং কেনাকাটা শুরু করুন</p>
            <Link to="/shop">
              <Button size="lg">কেনাকাটা শুরু করুন</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/shop">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              কেনাকাটা চালিয়ে যান
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  শপিং কার্ট ({cartItems.length} টি আইটেম)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-muted"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">{item.name}</h3>
                      
                      <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                        {item.size && <span>সাইজ: {item.size}</span>}
                        {item.color && <span>রঙ: {item.color}</span>}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-lg">৳ {(item.price * item.quantity).toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground line-through">
                        ৳ {(item.originalPrice * item.quantity).toLocaleString()}
                      </div>
                      <Badge variant="secondary" className="mt-1">
                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% ছাড়
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Coupon Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  কুপন কোড
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="কুপন কোড লিখুন"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button onClick={applyCoupon} disabled={!couponCode.trim()}>
                    প্রয়োগ করুন
                  </Button>
                </div>
                {appliedCoupon && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-green-800 font-medium">✅ {appliedCoupon}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>অর্ডার সামারি</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>সাবটোটাল</span>
                    <span>৳ {subtotal.toLocaleString()}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>ডিসকাউন্ট</span>
                      <span>-৳ {discount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>ডেলিভারি চার্জ</span>
                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                      {shipping === 0 ? 'ফ্রি' : `৳ ${shipping}`}
                    </span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>মোট</span>
                      <span>৳ {total.toLocaleString()}</span>
                    </div>
                  </div>

                  {totalSavings > 0 && (
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <div className="text-green-800 font-medium">
                        🎉 আপনি সাশ্রয় করছেন ৳ {totalSavings.toLocaleString()}!
                      </div>
                    </div>
                  )}
                </div>

                <Button className="w-full" size="lg">
                  <CreditCard className="w-5 h-5 mr-2" />
                  চেকআউট করুন
                </Button>

                {/* Features */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span>ফ্রি ডেলিভারি ১০০০+ টাকায়</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span>১০০% নিরাপদ পেমেন্ট</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Tag className="w-4 h-4 text-purple-600" />
                    <span>৭ দিন রিটার্ন গ্যারান্টি</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;