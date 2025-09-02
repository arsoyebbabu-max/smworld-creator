import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, User, Menu, Search, Globe, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  
  const handleLogout = async () => {
    await signOut();
  };
  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-lg">
      {/* Top Bar */}
      <div className="border-b border-white/20">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span>নিরাপদ কেনাকাটা</span>
              <span>•</span>
              <span>ফ্রি ডেলিভারি</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-xs hover:bg-white/10">
                <Globe className="w-3 h-3 mr-1" />
                বাংলা
              </Button>
              
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-xs">স্বাগতম, {user.email?.split('@')[0]}</span>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="ghost" size="sm" className="text-xs hover:bg-white/10">
                        অ্যাডমিন প্যানেল
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" className="text-xs hover:bg-white/10" onClick={handleLogout}>
                    লগআউট
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-xs hover:bg-white/10">
                    লগইন
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-lg">SM</span>
            </div>
            <div>
              <h1 className="font-bold text-xl">SM World</h1>
              <p className="text-xs opacity-90">Store</p>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                placeholder="Search product"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link to="/wishlist">
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="w-5 h-5" />
                {getWishlistCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-white text-primary min-w-5 h-5 rounded-full text-xs">
                    {getWishlistCount()}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-white text-primary min-w-5 h-5 rounded-full text-xs">
                    {getCartCount()}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Input
              placeholder="Search product"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;