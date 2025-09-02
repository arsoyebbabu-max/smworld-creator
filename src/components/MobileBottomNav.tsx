import { Home, ShoppingBag, Heart, MessageSquare, ShoppingCart, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

const MobileBottomNav = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: "হোম", path: "/" },
    { icon: ShoppingBag, label: "শপ", path: "/shop" },
    { icon: Heart, label: "পছন্দ", path: "/wishlist", badge: getWishlistCount() },
    { icon: ShoppingCart, label: "কার্ট", path: "/cart", badge: getCartCount() },
    { icon: MessageSquare, label: "মেসেজ", path: "/dashboard" },
    { icon: User, label: "একাউন্ট", path: user ? "/dashboard" : "/auth" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50">
      <div className="grid grid-cols-6 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-1 text-xs relative ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {item.badge && item.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </Badge>
                )}
              </div>
              <span className="mt-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;