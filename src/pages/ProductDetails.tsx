import { useState } from "react";
import { Heart, Star, Share, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { useParams } from "react-router-dom";
import humidifierImg from "@/assets/humidifier.jpg";
import smartwatchImg from "@/assets/smartwatch.jpg";

const ProductDetails = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("wooden");
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState("");

  // Mock product data - in real app, fetch based on id
  const product = {
    id: "1",
    name: "Rain Cloud Night Light Humidifier with Raining Water Drop Sound Oil Diffuser for Bedroom",
    price: 1850,
    originalPrice: 2000,
    rating: 4.5,
    reviews: 32,
    images: [humidifierImg, smartwatchImg, humidifierImg, smartwatchImg],
    description: `Rain Cloud Night Light Humidifier with Raining Water Drop Sound Oil Diffuser for Bedroom
Cloud Rain Humidifier আপনার রুমকে দেয় নিখুঁত আর্দ্রতা।
এটি রাতে একটি অপূর্ব সুন্দর আলো দেয়, যা পরিবেশটাকে সাজায় চান্দনী
রাতের মতো সুন্দর পরিবেশ সৃষ্টি করে।

এটি এক অনন্য এবং আকর্ষণীয় ডিজাইনের সাথে আসে যা আপনার
পরিবেশকে আরো সুন্দর ও ইউনিক করে তুলবে।

এটি ব্যবহারে খুবই সহজ। আপনাকে শুধু পানি ঢালতে হবে।`,
    colors: [
      { name: "Wooden", value: "wooden", color: "#D4A574" },
      { name: "White", value: "white", color: "#FFFFFF" },
      { name: "Black", value: "black", color: "#000000" },
    ],
    stock: 4,
    deliveryTime: "3-5",
  };

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

  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="relative mb-4">
              <img
                src={product.images[selectedImage]}
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
              {product.images.map((image, index) => (
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
              <span className="text-3xl font-bold text-primary">৳ {product.price}</span>
              <span className="text-lg text-muted-foreground line-through">৳ {product.originalPrice}</span>
              <Badge className="bg-primary text-primary-foreground">-{discountPercent}%</Badge>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Available Variant */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">Available variant:</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-sm transition-colors ${
                      selectedColor === color.value
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-primary"
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: color.color }}
                    />
                    {color.name}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Stock: {product.stock}</p>
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              <Badge variant="secondary" className="bg-success/10 text-success">
                In Stock
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                Delivery time: {product.deliveryTime} days
              </p>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Quantity</h3>
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
              <h3 className="font-medium mb-2">Discount coupon:</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">Copy</Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <Button className="flex-1 h-12">
                Buy Now
              </Button>
              <Button variant="outline" className="flex-1 h-12">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Wishlist */}
            <Button variant="ghost" className="w-full">
              <Heart className="w-4 h-4 mr-2" />
              Add to Wishlist
            </Button>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Description */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <div className="prose max-w-none">
            <p className="whitespace-pre-line text-muted-foreground">
              {product.description}
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Recommended Products */}
        <div>
          <h2 className="text-xl font-bold mb-6">Recommended for you</h2>
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