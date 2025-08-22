import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Phone, Mail } from "lucide-react";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";

export function FloatingCustomerCare() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: settings } = useWebsiteSettings();

  const handleWhatsAppRedirect = () => {
    const phoneNumber = settings?.contact_phone?.replace(/\D/g, '') || '254768174878';
    const message = encodeURIComponent("Hi! I'm interested in your wigs. Can you help me?");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80">
          <Card className="shadow-xl border-2">
            <CardHeader className="bg-green-500 text-white rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Customer Care
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Hi! 👋 How can we help you today? Our team is ready to assist you with any questions about our wigs.
                </p>
                
                <div className="space-y-2">
                  <Button 
                    onClick={handleWhatsAppRedirect}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat on WhatsApp
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = `tel:${settings?.contact_phone || '0768174878'}`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Us
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = `mailto:${settings?.contact_email || 'timelessstrands@outlook.com'}`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email Us
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Available: Mon - Sat, 9:00 AM - 6:00 PM
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}