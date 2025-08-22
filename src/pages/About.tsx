import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { Award, Users, Shield, Heart, Sparkles, Scissors } from "lucide-react";

const About = () => {
  const { data: settings } = useWebsiteSettings();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <Navigation />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 left-10 w-72 h-72 bg-amber-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header section with enhanced styling */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              About Timeless Strands
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 font-light max-w-2xl mx-auto">
              Kenya's premier destination for premium quality wigs
            </p>
          </div>

          {/* About text section */}
          <div className="mb-16 relative">
            <div className="absolute -left-6 top-3 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Scissors className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed pl-8 border-l-2 border-purple-200 dark:border-purple-800">
              {settings?.about_text || "Timeless Strands is Kenya's premier wig retailer, offering high-quality wigs for every style and occasion. We are committed to providing our customers with beautiful, authentic wigs that enhance their natural beauty and boost their confidence."}
            </p>
          </div>

          {/* Feature cards with enhanced styling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-white">Premium Quality</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We source only the finest quality wigs, ensuring durability and natural appearance.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-white">Expert Support</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Our knowledgeable team provides professional guidance to help you find the perfect wig.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-white">Trusted Service</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  With hundreds of satisfied customers, we've built a reputation for reliability and excellence.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-white">Customer Care</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We prioritize customer satisfaction and provide ongoing support for all our products.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Mission section */}
          <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-10 rounded-2xl border border-purple-100 dark:border-purple-800/30">
            <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-white">Our Mission</h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              To empower individuals by providing them with high-quality wigs that enhance their confidence 
              and allow them to express their unique style. We believe everyone deserves to look and feel their best.
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default About;