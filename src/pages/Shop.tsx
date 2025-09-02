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
import { useProducts } from "@/hooks/useProducts";
import heroBanner from "@/assets/hero-banner.jpg";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { products, categories, loading } = useProducts();

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

  // Filter products by category
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category_id === selectedCategory);

  // Split products for display sections
  const topSalesProducts = filteredProducts.slice(0, 8);
  const exploreLatestProducts = filteredProducts.slice(8, 16);

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
              <h1 className="text-2xl md:text-4xl font-bold mb-2">সব পণ্য দেখুন</h1>
              <p className="text-sm md:text-lg opacity-90">সেরা গ্যাজেট এবং পণ্যের অসাধারণ অফার</p>
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
              <h3 className="font-bold text-lg mb-4 text-primary">ক্যাটাগরি</h3>
              <div className="space-y-2">
                {/* All Category */}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                    selectedCategory === "all"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="text-xl">🛍️</span>
                  <div>
                    <div className="text-sm font-medium">সব ক্যাটাগরি</div>
                    <div className="text-xs opacity-70">({products.length})</div>
                  </div>
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-8 h-8 rounded object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs">📦</span>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium">{category.name}</div>
                      <div className="text-xs opacity-70">({products.filter(p => p.category_id === category.id).length})</div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Free Delivery Banner */}
            <Card className="mt-4 p-4 bg-gradient-to-r from-success to-success/90 text-success-foreground">
              <div className="text-center">
                <Badge className="bg-white text-success mb-2">ফ্রি ডেলিভারি</Badge>
                <h4 className="font-bold">সেরা ছাড়</h4>
                <p className="text-sm opacity-90">৫০০ টাকার উপরে সব অর্ডারে</p>
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
                  placeholder="পণ্য খুঁজুন..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                ফিল্টার
              </Button>
            </div>

            {/* Top Sales Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-primary">🔥</span> জনপ্রিয় পণ্য
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {topSalesProducts.length > 0 ? (
                  topSalesProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">কোনো পণ্য পাওয়া যায়নি</p>
                  </div>
                )}
              </div>
            </div>

            {/* Explore Latest Section */}
            <div>
              <h2 className="text-xl font-bold mb-4">নতুন কালেকশন</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {exploreLatestProducts.length > 0 ? (
                  exploreLatestProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">আরও পণ্য শীঘ্রই আসছে</p>
                  </div>
                )}
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