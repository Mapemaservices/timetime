import { useState } from "react";
import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShoppingBag, Crown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  onCartClick?: () => void;
  cartCount?: number;
}

export function Navigation({ onCartClick, cartCount }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Collections", href: "/categories" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Track Order", href: "/track" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img src={logo} alt="Timeless Strands" className="h-10 w-10 rounded-full object-contain bg-gradient-to-br from-amber-50 to-white p-1 shadow-md ring-2 ring-amber-100 transition-all duration-300 group-hover:ring-amber-200 group-hover:scale-105" />
              <Sparkles className="h-3 w-3 absolute -top-0.5 -right-0.5 text-amber-500 fill-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-serif font-semibold text-gray-900 tracking-wide">Timeless Strands</span>
              <span className="text-xs text-amber-600 tracking-widest font-light">JEWELRY ARTISANS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  to={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors duration-300 flex flex-col items-center"
                >
                  {item.name}
                  <div className="h-0.5 w-0 bg-amber-500 mt-0.5 transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onCartClick} 
              className="rounded-full h-10 w-10 text-gray-600 hover:text-amber-700 hover:bg-amber-50 transition-colors duration-300 relative"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {typeof cartCount === 'number' && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            
            <Button 
              className="ml-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-5 h-10 flex items-center"
            >
              <Crown className="h-4 w-4 mr-2" />
              Exclusive
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onCartClick} 
              className="rounded-full h-10 w-10 text-gray-600 relative"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {typeof cartCount === 'number' && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-gray-600">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white p-0">
                <div className="h-full flex flex-col">
                  <div className="p-6 border-b border-gray-100 bg-gradient-to-b from-amber-50 to-white">
                    <Link 
                      to="/" 
                      className="flex items-center space-x-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <img src={logo} alt="Timeless Strands" className="h-9 w-9 rounded-full object-contain bg-white p-1 shadow-sm ring-1 ring-amber-100" />
                      <span className="text-lg font-serif font-semibold text-gray-900">Timeless Strands</span>
                    </Link>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto py-6 px-6">
                    <div className="flex flex-col space-y-6">
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="text-lg font-medium text-gray-800 hover:text-amber-700 transition-colors duration-300 py-2 border-b border-gray-100 last:border-b-0 flex items-center"
                          onClick={() => setIsOpen(false)}
                        >
                          <span className="bg-amber-100 h-1 w-1 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="mt-10 pt-6 border-t border-gray-100">
                      {/* User icon and sign in section removed */}
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-gray-100">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-full h-12">
                      <Crown className="h-4 w-4 mr-2" />
                      Exclusive Collection
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
