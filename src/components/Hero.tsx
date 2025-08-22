import { Button } from "@/components/ui/button";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { ArrowRight, Sparkles, Heart, Shield, Truck, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";
import { useEffect, useState } from "react";

export function Hero() {
  const { data: settings } = useWebsiteSettings();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background with hero image - Enhanced with parallax effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="w-full h-full object-cover transform scale-105 transition-transform duration-700 ease-out hover:scale-100"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary/60"></div>
      </div>
      
      {/* Enhanced decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-secondary animate-float"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 rounded-full bg-accent animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 rounded-full bg-secondary animate-float delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-10 h-10 rounded-full bg-accent animate-float delay-1500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`max-w-4xl mx-auto text-center text-primary-foreground transition-all duration-700 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="flex items-center justify-center mb-6 animate-pulse">
            <Sparkles className="h-8 w-8 text-secondary mr-2" />
            <span className="text-secondary font-semibold text-lg tracking-wide bg-primary-foreground/10 px-4 py-1 rounded-full">
              Premium Quality Wigs
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
            {settings?.hero_title || "Beautiful Wigs for Every Occasion"}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            {settings?.hero_subtitle || "Premium quality wigs delivered across Kenya"}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              size="xl" 
              className="min-w-[200px] bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg hover:shadow-amber-300 transition-all duration-300 transform hover:-translate-y-1" 
              onClick={() => navigate('/shop')}
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="min-w-[200px] border-amber-500 text-amber-600 hover:bg-amber-100 hover:text-amber-700 backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1" 
              onClick={() => navigate('/categories')}
            >
              View Categories
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-primary-foreground/10 backdrop-blur-md rounded-lg p-4 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all duration-300 cursor-default group">
              <div className="flex justify-center mb-2">
                <Heart className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-secondary">500+</div>
              <div className="text-sm text-primary-foreground/80">Happy Customers</div>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-md rounded-lg p-4 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all duration-300 cursor-default group">
              <div className="flex justify-center mb-2">
                <Shield className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-secondary">Premium</div>
              <div className="text-sm text-primary-foreground/80">Quality Wigs</div>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-md rounded-lg p-4 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all duration-300 cursor-default group">
              <div className="flex justify-center mb-2">
                <Truck className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-secondary">Fast</div>
              <div className="text-sm text-primary-foreground/80">Delivery</div>
            </div>
            <div className="bg-primary-foreground/10 backdrop-blur-md rounded-lg p-4 border border-primary-foreground/20 hover:bg-primary-foreground/15 transition-all duration-300 cursor-default group">
              <div className="flex justify-center mb-2">
                <MapPin className="h-6 w-6 text-secondary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-secondary">Kenya</div>
              <div className="text-sm text-primary-foreground/80">Wide Coverage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}