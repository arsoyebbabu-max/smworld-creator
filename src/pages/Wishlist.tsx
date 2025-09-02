import { Heart, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import smartwatchImg from "@/assets/smartwatch.jpg";

const Wishlist = () => {
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId, 1);
    await removeFromWishlist(productId);
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

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">আপনার প্রিয় তালিকা খালি</h1>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/shop">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              কেনাকাটা চালিয়ে যান
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">প্রিয় তালিকা ({wishlistItems.length})</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const itemImage = item.products.image_urls?.length 
              ? item.products.image_urls[0] 
              : smartwatchImg;
            
            const finalPrice = item.products.discount_price || item.products.price;
            const discountPercent = item.products.discount_price
              ? Math.round(((item.products.price - item.products.discount_price) / item.products.price) * 100)
              : 0;

            return (
              <Card key={item.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <Link to={`/product/${item.product_id}`}>
                    <div className="aspect-square mb-4 relative overflow-hidden rounded-lg">
                      <img
                        src={itemImage}
                        alt={item.products.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      {discountPercent > 0 && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                          -{discountPercent}%
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-medium mb-2 line-clamp-2">{item.products.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-primary">
                        ৳ {finalPrice.toLocaleString()}
                      </span>
                      {item.products.discount_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ৳ {item.products.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </Link>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleAddToCart(item.product_id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      কার্টে যোগ
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => removeFromWishlist(item.product_id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Heart className="w-4 h-4 fill-red-600 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;