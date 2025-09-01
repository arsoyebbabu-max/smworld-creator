import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SM</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">SM World</h3>
                <p className="text-sm text-gray-300">Store</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Your ultimate destination for the latest gadgets and cutting-edge lighting solutions in Bangladesh.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-slate-800">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-slate-800">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-slate-800">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-slate-800">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="/shop" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Shop
              </a>
              <a href="/offers" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Offers
              </a>
              <a href="/top-sales" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Top Sales
              </a>
              <a href="/become-seller" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Become a Seller
              </a>
            </div>
          </div>

          {/* About Business */}
          <div>
            <h4 className="font-bold text-lg mb-4">About Business</h4>
            <div className="space-y-2">
              <a href="/about" className="block text-sm text-gray-300 hover:text-white transition-colors">
                About us
              </a>
              <a href="/contact" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Contact us
              </a>
              <a href="/privacy" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/refund" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Refund Policy
              </a>
              <a href="/terms" className="block text-sm text-gray-300 hover:text-white transition-colors">
                Terms & Conditions
              </a>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-gray-300">Sylhet Sadar, Sylhet-3100</p>
                  <p className="text-sm text-gray-300">Bangladesh.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <p className="text-sm text-gray-300">+88077201275500</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <p className="text-sm text-gray-300">help@smworldstore.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              ©2024 SM WORLD STORE. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Customer review</span>
              <span className="text-sm text-gray-400">One link to buy all</span>
              <span className="text-sm text-gray-400">Safe Delivery</span>
              <span className="text-sm text-gray-400">FAQ</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;