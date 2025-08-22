import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { Phone, Mail, MapPin, Clock, Instagram, Twitter, Facebook, MessageCircle } from "lucide-react";

const Contact = () => {
  const { data: settings } = useWebsiteSettings();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              For any questions or support, chat with us directly on WhatsApp.
            </p>
            <a href="https://wa.me/254768174878" target="_blank" rel="noopener noreferrer">
              <Button variant="success" className="mt-4">Chat on WhatsApp</Button>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-secondary" />
                    <span>{settings?.contact_phone || '0768174878'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-secondary" />
                    <span>{settings?.contact_email || 'timelessstrands@outlook.com'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-secondary" />
                    <span>{settings?.contact_address || 'Starmall C1'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-secondary" />
                    <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="icon">
                      <Instagram className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>MPESA Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Paybill:</strong> {settings?.mpesa_paybill || '522522'}</div>
                  <div><strong>Account:</strong> {settings?.mpesa_account || '1342330668'}</div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="mb-4">For the fastest response, please use WhatsApp to contact our support team.</p>
                  <a href="https://wa.me/254768174878" target="_blank" rel="noopener noreferrer">
                    <Button variant="success" className="w-full">Chat on WhatsApp</Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;