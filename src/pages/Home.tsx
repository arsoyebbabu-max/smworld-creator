import { ChevronRight, Star, Heart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const Home = () => {
  const categories = [
    { id: "1", name: "Gaming", icon: gamingIcon, color: "#FF6B6B" },
    { id: "2", name: "DJI", icon: gamingIcon, color: "#4ECDC4" },
    { id: "3", name: "Airpods", icon: gamingIcon, color: "#45B7D1" },
    { id: "4", name: "Fan", icon: gamingIcon, color: "#96CEB4" },
    { id: "5", name: "Clock", icon: gamingIcon, color: "#FECA57" },
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
  ];

  const exploreLatestProducts = [
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Latest Gadgets & Electronics
              </h1>
              <p className="text-lg mb-6 opacity-90">
                Discover amazing deals on the latest tech products
              </p>
              <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90">
                Shop Now <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="relative">
              <img
                src={heroBanner}
                alt="Latest Electronics"
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Categories</h2>
            <Button variant="ghost" size="sm">
              See More <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Offers Banner */}
      <section className="py-4">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-success to-success/90 rounded-lg p-4 text-success-foreground">
            <div className="flex items-center justify-between">
              <div>
                <Badge className="bg-white text-success mb-2">Free Delivery</Badge>
                <h3 className="font-bold text-lg">Best Discount</h3>
              </div>
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Top Sales */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-primary">🔥</span> Top Sales
            </h2>
            <Button variant="ghost" size="sm">
              See More <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topSalesProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Explore Latest */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-6">Explore latest</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exploreLatestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground p-4 md:hidden">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="w-6 h-6 mx-auto mb-1">🏠</div>
            <span className="text-xs">Home</span>
          </div>
          <div className="text-center">
            <div className="w-6 h-6 mx-auto mb-1">🛍️</div>
            <span className="text-xs">Shop</span>
          </div>
          <div className="text-center">
            <div className="w-6 h-6 mx-auto mb-1">❤️</div>
            <span className="text-xs">Favorite</span>
          </div>
          <div className="text-center">
            <div className="w-6 h-6 mx-auto mb-1">💬</div>
            <span className="text-xs">Message</span>
          </div>
          <div className="text-center">
            <div className="w-6 h-6 mx-auto mb-1">📦</div>
            <span className="text-xs">Items</span>
          </div>
          <div className="text-center">
            <div className="w-6 h-6 mx-auto mb-1">👤</div>
            <span className="text-xs">My account</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;