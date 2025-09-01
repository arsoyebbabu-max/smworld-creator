import { useState, useEffect } from "react";
import { Heart, Star, Share, Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "@/hooks/use-toast";
import humidifierImg from "@/assets/humidifier.jpg";
import smartwatchImg from "@/assets/smartwatch.jpg";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById } = useProducts();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    setLoading(true);
    try {
      const productData = await getProductById(productId);
      if (productData) {
        setProduct(productData);
        setSelectedColor(productData.colors?.[0] || '');
        setSelectedSize(productData.sizes?.[0] || '');
      }
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "পণ্যের তথ্য লোড করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
            <p>লোড হচ্ছে...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">পণ্য পাওয়া যায়নি</h1>
            <Link to="/shop">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                শপে ফিরে যান
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discountPercentage = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;

  const finalPrice = product.discount_price || product.price;
  const totalPrice = finalPrice * quantity;

  // Default images if none provided
  const productImages = product.image_urls && product.image_urls.length > 0 
    ? product.image_urls 
    : [smartwatchImg, humidifierImg];

  // Mock recommended products - in real app, fetch related products
  const recommendedProducts = [
    {
      id: "2",
      name: "5 Ter Smart Watch",
      price: 99,
      originalPrice: 120,
      rating: 4.5,
      reviews: 32,
      image: smartwatchImg,
      isNew: true,
    },
    {
      id: "3",
      name: "LED Airpods",
      price: 1690,
      originalPrice: 2000,
      rating: 4.8,
      reviews: 128,
      image: humidifierImg,
    },
    {
      id: "4", 
      name: "5G Smart Watch",
      price: 799,
      originalPrice: 999,
      rating: 4.2,
      reviews: 56,
      image: smartwatchImg,
    },
    {
      id: "5",
      name: "Gaming Mouse",
      price: 1850,
      originalPrice: 2200,
      rating: 4.6,
      reviews: 84,
      image: humidifierImg,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="relative mb-4">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            
            {/* Price */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-primary">৳ {finalPrice.toLocaleString()}</span>
              {product.discount_price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">৳ {product.price.toLocaleString()}</span>
                  <Badge className="bg-primary text-primary-foreground">-{discountPercentage}%</Badge>
                </>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                4.5 (32 reviews)
              </span>
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">রং নির্বাচন করুন:</h3>
                <div className="flex gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-2 border rounded-lg text-sm transition-colors ${
                        selectedColor === color
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:border-primary"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">সাইজ নির্বাচন করুন:</h3>
                <div className="flex gap-2">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 border rounded-lg text-sm transition-colors ${
                        selectedSize === size
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-4">
              <Badge variant="secondary" className="bg-success/10 text-success">
                স্টকে আছে ({product.stock_quantity} টি)
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                ডেলিভারি সময়: ৩-৫ দিন
              </p>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">পরিমাণ</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                মোট: ৳ {totalPrice.toLocaleString()}
              </p>
            </div>

            {/* Special Offer */}
            <Card className="p-4 mb-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <div className="text-center">
                <p className="font-medium text-green-800 mb-2">
                  ৳৯৯ ডেলিভারি চার্জ ৫০০ টাকার নিচে ।
                </p>
                <p className="font-medium text-green-800">
                  ৫০০ টাকার উপরে ডেলিভারি চার্জ একেবারে ফ্রি ।
                </p>
              </div>
            </Card>

            {/* Discount Coupon */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">ডিসকাউন্ট কুপন:</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="কুপন কোড লিখুন"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">প্রয়োগ করুন</Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <Button className="flex-1 h-12">
                এখনই কিনুন
              </Button>
              <Button variant="outline" className="flex-1 h-12">
                <ShoppingCart className="w-4 h-4 mr-2" />
                কার্টে যোগ করুন
              </Button>
            </div>

            {/* Wishlist */}
            <Button variant="ghost" className="w-full">
              <Heart className="w-4 h-4 mr-2" />
              প্রিয় তালিকায় যোগ করুন
            </Button>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Description */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">বিবরণ</h2>
          <div className="prose max-w-none">
            <p className="whitespace-pre-line text-muted-foreground">
              {product.description || 'এই পণ্যের কোন বিশদ বিবরণ নেই।'}
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Recommended Products */}
        <div>
          <h2 className="text-xl font-bold mb-6">আপনার জন্য প্রস্তাবিত</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;