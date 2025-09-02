import { ChevronRight, Star, Heart, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useProducts } from "@/hooks/useProducts";
import heroBanner from "@/assets/hero-banner.jpg";

const Home = () => {
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

  // Get products for different sections
  const topSalesProducts = products.slice(0, 4);
  const exploreLatestProducts = products.slice(4, 8);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-purple-600">
        <div className="container mx-auto px-4 py-6 md:py-12">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div className="text-white space-y-4 md:space-y-6">
              <Badge className="bg-white text-primary text-xs">নতুন আগমন</Badge>
              <h1 className="text-2xl md:text-5xl font-bold leading-tight">
                সেরা গ্যাজেট এবং 
                <span className="block text-pink-300">অসাধারণ অফার</span>
              </h1>
              <p className="text-sm md:text-lg opacity-90">
                উন্নত প্রযুক্তির পণ্য এবং আকর্ষণীয় দামে। আজই কেনাকাটা শুরু করুন।
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link to="/shop">
                  <Button size="sm" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100">
                    এখনই কিনুন
                  </Button>
                </Link>
                <Button size="sm" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                  অফার দেখুন
                </Button>
              </div>
              
              {/* Stats - More compact on mobile */}
              <div className="grid grid-cols-3 gap-2 md:gap-4 pt-4 md:pt-8">
                <div className="text-center">
                  <div className="text-lg md:text-2xl font-bold">{products.length}+</div>
                  <div className="text-xs md:text-sm opacity-75">পণ্য</div>
                </div>
                <div className="text-center">
                  <div className="text-lg md:text-2xl font-bold">১০০+</div>
                  <div className="text-xs md:text-sm opacity-75">কাস্টমার</div>
                </div>
                <div className="text-center">
                  <div className="text-lg md:text-2xl font-bold">২৪/৭</div>
                  <div className="text-xs md:text-sm opacity-75">সাপোর্ট</div>
                </div>
              </div>
            </div>
            <div className="relative order-first md:order-last">
              <img
                src={heroBanner}
                alt="Hero Banner"
                className="w-full h-48 md:h-80 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">ক্যাটাগরি</h2>
            <Link to="/shop">
              <Button variant="ghost" size="sm">
                আরো দেখুন <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((category) => (
              <Link key={category.id} to="/shop">
                <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-center">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-12 h-12 mx-auto mb-2 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 mx-auto mb-2 bg-primary/10 rounded flex items-center justify-center">
                        <span className="text-xl">📦</span>
                      </div>
                    )}
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {products.filter(p => p.category_id === category.id).length} পণ্য
                    </p>
                  </div>
                </Card>
              </Link>
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
                <Badge className="bg-white text-success mb-2">ফ্রি ডেলিভারি</Badge>
                <h3 className="font-bold text-lg">সেরা ছাড়</h3>
                <p className="text-sm opacity-90">৫০০ টাকার উপরে সব অর্ডারে</p>
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
              <span className="text-primary">🔥</span> জনপ্রিয় পণ্য
            </h2>
            <Link to="/shop">
              <Button variant="ghost" size="sm">
                আরো দেখুন <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topSalesProducts.length > 0 ? (
              topSalesProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">পণ্য লোড হচ্ছে...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Explore Latest */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-6">নতুন কালেকশন</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {exploreLatestProducts.length > 0 ? (
              exploreLatestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">শীঘ্রই নতুন পণ্য আসছে</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">আজই শুরু করুন আপনার কেনাকাটা</h2>
          <p className="text-muted-foreground mb-6">সেরা পণ্য এবং দুর্দান্ত সেবা পেতে</p>
          <Link to="/shop">
            <Button size="lg" className="mr-4">
              সব পণ্য দেখুন
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline">
              একাউন্ট তৈরি করুন
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </div>
  );
};

export default Home;