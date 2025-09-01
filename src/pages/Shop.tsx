import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import Footer from "@/components/Footer";
import heroBanner from "@/assets/hero-banner.jpg";
import humidifierImg from "@/assets/humidifier.jpg";
import smartwatchImg from "@/assets/smartwatch.jpg";
import gamingIcon from "@/assets/gaming-icon.png";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const categories = [
    { id: "all", name: "All Categories", icon: gamingIcon, color: "#FF6B6B" },
    { id: "gaming", name: "Gaming", icon: gamingIcon, color: "#FF6B6B" },
    { id: "dji", name: "DJI", icon: gamingIcon, color: "#4ECDC4" },
    { id: "airpods", name: "Airpods", icon: gamingIcon, color: "#45B7D1" },
    { id: "fan", name: "Fan", icon: gamingIcon, color: "#96CEB4" },
    { id: "clock", name: "Clock", icon: gamingIcon, color: "#FECA57" },
  ];

  const topSalesProducts = [
    {
      id: "1",
      name: "Mini USB Light",
      price: 99,
      originalPrice: 120,
      rating: 4.5,
      reviews: 32,
      image: smartwatchImg,
      tag: "Top",
      isNew: true,
    },
    {
      id: "2",
      name: "PLEXTONE EX2 ULTRA",
      price: 1690,
      originalPrice: 2000,
      rating: 4.8,
      reviews: 128,
      image: humidifierImg,
      tag: "Top",
    },
    {
      id: "3",
      name: "6 in 1 Multifunction",
      price: 799,
      originalPrice: 999,
      rating: 4.2,
      reviews: 56,
      image: smartwatchImg,
      tag: "Top",
    },
    {
      id: "4",
      name: "Rain Cloud Night Light Humidifier",
      price: 1850,
      originalPrice: 2200,
      rating: 4.6,
      reviews: 84,
      image: humidifierImg,
      tag: "Sale",
    },
    {
      id: "5",
      name: "5A Phone Cable",
      price: 180,
      originalPrice: 220,
      rating: 4.3,
      reviews: 45,
      image: smartwatchImg,
      isNew: true,
    },
    {
      id: "6",
      name: "AWLO YESH Symphony Light Feature",
      price: 299,
      originalPrice: 399,
      rating: 4.7,
      reviews: 67,
      image: humidifierImg,
    },
    {
      id: "7",
      name: "PGS Sesame-pod Cooling Multi",
      price: 1250,
      originalPrice: 1500,
      rating: 4.4,
      reviews: 23,
      image: smartwatchImg,
    },
    {
      id: "8",
      name: "Tripod HY 3204",
      price: 450,
      originalPrice: 550,
      rating: 4.1,
      reviews: 18,
      image: humidifierImg,
    },
  ];

  const exploreLatestProducts = [
    {
      id: "9",
      name: "5A Phone Cable",
      price: 180,
      originalPrice: 220,
      rating: 4.3,
      reviews: 45,
      image: smartwatchImg,
      isNew: true,
    },
    {
      id: "10",
      name: "AWLO YESH Symphony Light Feature",
      price: 299,
      originalPrice: 399,
      rating: 4.7,
      reviews: 67,
      image: humidifierImg,
    },
    {
      id: "11",
      name: "PGS Sesame-pod Cooling Multi",
      price: 1250,
      originalPrice: 1500,
      rating: 4.4,
      reviews: 23,
      image: smartwatchImg,
    },
    {
      id: "12",
      name: "Tripod HY 3204",
      price: 450,
      originalPrice: 550,
      rating: 4.1,
      reviews: 18,
      image: humidifierImg,
    },
    {
      id: "13",
      name: "LED Strip Light",
      price: 320,
      originalPrice: 400,
      rating: 4.5,
      reviews: 89,
      image: smartwatchImg,
    },
    {
      id: "14",
      name: "Wireless Charger",
      price: 850,
      originalPrice: 1000,
      rating: 4.6,
      reviews: 156,
      image: humidifierImg,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <section className="relative">
        <div className="w-full h-48 md:h-64 bg-gradient-to-r from-primary via-primary to-purple-600 relative overflow-hidden">
          <img
            src={heroBanner}
            alt="Shop Banner"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-2xl md:text-4xl font-bold mb-2">Shop All Products</h1>
              <p className="text-sm md:text-lg opacity-90">Discover amazing deals on latest gadgets</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Sidebar and Products */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="md:col-span-1">
            <Card className="p-4">
              <h3 className="font-bold text-lg mb-4 text-primary">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                      selectedCategory === category.name
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-6 h-6"
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Free Delivery Banner */}
            <Card className="mt-4 p-4 bg-gradient-to-r from-success to-success/90 text-success-foreground">
              <div className="text-center">
                <Badge className="bg-white text-success mb-2">Free Delivery</Badge>
                <h4 className="font-bold">Best Discount</h4>
                <p className="text-sm opacity-90">On all orders above ৳500</p>
              </div>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Top Sales Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">🔥</span> Top Sales
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {topSalesProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* Explore Latest Section */}
            <div>
              <h2 className="text-xl font-bold mb-4">Explore Latest</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {exploreLatestProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;