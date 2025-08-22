import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { FloatingCustomerCare } from "@/components/FloatingCustomerCare";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFeaturedProducts, useProductCategories, Product } from "@/hooks/useProducts";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin,
  Instagram,
  Twitter,
  Facebook,
  MessageCircle,
  Star,
  Users,
  Award,
  Shield,
  Heart,
  Sparkles,
  Zap,
  CheckCircle
} from "lucide-react";

const Index = () => {
  const { data: featuredProducts } = useFeaturedProducts();
  const { data: categories } = useProductCategories();
  const { data: settings } = useWebsiteSettings();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  const categoryIcons = {
    'Straight': '🦱',
    'Curly': '🌊',
    'Body Wave': '〰️',
    'Bob': '💇‍♀️',
    'Braided': '🪢',
    'Bundles': '📦',
    'Fringe': '✂️',
    'Pixie': '🧚‍♀️',
    'Kinky Straight': '📏',
    'Kinky Curly': '🌀',
    'HD Lace': '✨',
    'Wavy': '🌊',
    'Afro': '🌺'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Categories Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 -z-10"></div>
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-secondary/10 rounded-full filter blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary mr-2" />
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Browse Categories
              </h2>
              <Sparkles className="h-6 w-6 text-secondary ml-2" />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our wide range of premium wigs for every style and occasion
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories?.slice(0, 12).map((category, index) => (
              <Card 
                key={category} 
                className="group hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer border-2 border-transparent hover:border-primary/20 bg-background/80 backdrop-blur-sm overflow-hidden"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-secondary/0 to-accent/0 group-hover:from-primary/5 group-hover:via-secondary/5 group-hover:to-accent/5 transition-all duration-500"></div>
                <CardContent className="p-6 text-center relative z-10">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {categoryIcons[category as keyof typeof categoryIcons] || '💇‍♀️'}
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
                    {category}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              variant="cta" 
              size="xl" 
              onClick={() => navigate('/categories')}
              className="rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              View All Categories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent"></div>
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 py-2 px-4 text-base bg-primary/10 border-primary/20">
              <Zap className="h-4 w-4 mr-2" />
              Popular Picks
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Featured Products</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hand-picked premium wigs that our customers love most
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
            {featuredProducts?.map((product, index) => (
              <div 
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  product={product}
                  onViewDetails={() => setSelectedProduct(product)}
                  onAddToCart={() => setSelectedProduct(product)}
                />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              variant="cta" 
              size="xl" 
              onClick={() => navigate('/shop')}
              className="rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Shop All Products
            </Button>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 -z-20"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full filter blur-3xl -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full filter blur-xl -z-10"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-secondary/20 rounded-full filter blur-xl -z-10"></div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                About Timeless Strands
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {settings?.about_text || "Timeless Strands is Kenya's premier wig retailer, offering high-quality wigs for every style and occasion."}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg mb-1">Premium Quality</div>
                    <div className="text-muted-foreground">100% authentic wigs</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg mb-1">Expert Support</div>
                    <div className="text-muted-foreground">Professional guidance</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg mb-1">Customer Love</div>
                    <div className="text-muted-foreground">1000+ happy clients</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg mb-1">Satisfaction</div>
                    <div className="text-muted-foreground">Money-back guarantee</div>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="cta" 
                size="lg" 
                className="rounded-full px-8 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Learn More About Us
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 relative">
              <div className="space-y-6">
                <div className="aspect-square bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl shadow-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-secondary/30 to-accent/30 opacity-70"></div>
                </div>
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl shadow-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 opacity-70"></div>
                </div>
              </div>
              <div className="space-y-6 pt-12">
                <div className="aspect-[4/3] bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl shadow-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-accent/30 to-primary/30 opacity-70"></div>
                </div>
                <div className="aspect-square bg-gradient-to-br from-secondary/20 to-accent/20 rounded-2xl shadow-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-secondary/30 to-accent/30 opacity-70"></div>
                </div>
              </div>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full filter blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Delivery & Payment Info */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCwyOCAwIDEsMSA1NiwwYTI4LDI4IDAgMSwxIC01NiwwIiBzdHJva2U9IiM3ODg0OWQxMCIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] -z-10"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 py-2 px-4 text-base bg-primary/10 border-primary/20">
              <Truck className="h-4 w-4 mr-2" />
              Fast & Secure
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Delivery & Payment</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fast, reliable delivery across Kenya with secure payment options
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-primary/20 bg-background/80 backdrop-blur-sm overflow-hidden group">
              <CardContent className="p-8 relative">
                <div className="absolute top-4 right-4 w-16 h-16 bg-primary/10 rounded-full filter blur-lg group-hover:bg-primary/20 transition-colors duration-500"></div>
                <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Truck className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Fast Delivery</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Free delivery within Nairobi. Other counties: 5-14 days depending on location.
                </p>
                <Badge variant="secondary" className="text-sm py-1 px-3">
                  Nationwide Coverage
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-primary/20 bg-background/80 backdrop-blur-sm overflow-hidden group">
              <CardContent className="p-8 relative">
                <div className="absolute top-4 right-4 w-16 h-16 bg-primary/10 rounded-full filter blur-lg group-hover:bg-primary/20 transition-colors duration-500"></div>
                <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <CreditCard className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">MPESA Payment</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Secure and convenient payments via MPESA
                </p>
                <div className="space-y-2 text-sm bg-muted/30 p-4 rounded-lg">
                  <div className="flex justify-between"><strong>Paybill:</strong> {settings?.mpesa_paybill || '522522'}</div>
                  <div className="flex justify-between"><strong>Account:</strong> {settings?.mpesa_account || '1342330668'}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-primary/20 bg-background/80 backdrop-blur-sm overflow-hidden group">
              <CardContent className="p-8 relative">
                <div className="absolute top-4 right-4 w-16 h-16 bg-primary/10 rounded-full filter blur-lg group-hover:bg-primary/20 transition-colors duration-500"></div>
                <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Shield className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Secure & Reliable</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Your orders are safe and tracked from purchase to delivery.
                </p>
                <Badge variant="secondary" className="text-sm py-1 px-3">
                  Trusted Service
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Contact & Social Media */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary-foreground/5 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-foreground/5 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-lg">{settings?.contact_phone || '0768174878'}</span>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-lg">{settings?.contact_email || 'timelessstrands@outlook.com'}</span>
                </div>
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
                  <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-lg">{settings?.contact_address || 'Starmall C1'}</span>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-2xl font-semibold mb-6">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="https://instagram.com/_timeless.strands" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-primary-foreground/10 backdrop-blur-sm">
                      <Instagram className="h-5 w-5" />
                    </Button>
                  </a>
                  <a href="https://facebook.com/timelessstrands" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-primary-foreground/10 backdrop-blur-sm">
                      <Facebook className="h-5 w-5" />
                    </Button>
                  </a>
                  <a href="https://wa.me/254768174878" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full w-12 h-12 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-primary-foreground/10 backdrop-blur-sm">
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-8">Quick Links</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Button variant="ghost" className="justify-start p-4 h-auto text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10 rounded-lg w-full text-left" onClick={() => navigate('/shop')}>Shop All Wigs</Button>
                  <Button variant="ghost" className="justify-start p-4 h-auto text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10 rounded-lg w-full text-left" onClick={() => navigate('/categories')}>Categories</Button>
                  <Button variant="ghost" className="justify-start p-4 h-auto text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10 rounded-lg w-full text-left" onClick={() => navigate('/track')}>Track Order</Button>
                </div>
                <div className="space-y-4">
                  <Button variant="ghost" className="justify-start p-4 h-auto text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10 rounded-lg w-full text-left" onClick={() => navigate('/about')}>About Us</Button>
                  <Button variant="ghost" className="justify-start p-4 h-auto text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10 rounded-lg w-full text-left" onClick={() => navigate('/contact')}>Contact</Button>
                  <Button variant="ghost" className="justify-start p-4 h-auto text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10 rounded-lg w-full text-left" onClick={() => window.open('/admin', '_blank')}>Admin</Button>
                </div>
              </div>
              
              <div className="mt-12 p-6 rounded-lg bg-primary-foreground/10 backdrop-blur-sm">
                <h4 className="text-lg font-semibold mb-4">Business Hours</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mon - Fri:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-16 pt-8 text-center">
            <p className="text-primary-foreground/80">
              © 2024 Timeless Strands. Developed by Mapema Softwares. All rights reserved.
            </p>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      
      <FloatingCustomerCare />
    </div>
  );
};

export default Index;