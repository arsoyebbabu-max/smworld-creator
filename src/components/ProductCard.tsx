import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    discount_price?: number;
    image_urls?: string[];
    stock_quantity: number;
    categories?: {
      id: string;
      name: string;
    };
    [key: string]: any;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const discountPercent = product.discount_price 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;
    
  const finalPrice = product.discount_price || product.price;
  const productImage = product.image_urls && product.image_urls.length > 0 
    ? product.image_urls[0] 
    : product.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 cursor-pointer">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-50">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.stock_quantity > 50 && (
              <Badge className="bg-success text-success-foreground text-xs">নতুন</Badge>
            )}
            {discountPercent > 0 && (
              <Badge className="bg-primary text-primary-foreground text-xs">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white w-8 h-8"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle wishlist action
            }}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        {/* Product Info */}
        <div className="p-3">
          <h3 className="font-medium text-sm line-clamp-2 mb-1">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              (4.5)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-primary">৳ {finalPrice}</span>
            {product.discount_price && (
              <span className="text-xs text-muted-foreground line-through">
                ৳ {product.price}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button 
            className="w-full h-8 text-xs" 
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle buy now action
            }}
          >
            এখনই কিনুন
          </Button>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;