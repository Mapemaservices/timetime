import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Package, Truck, CheckCircle } from "lucide-react";

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  const handleTrackOrder = () => {
    // Mock order tracking - in real app, this would query the database
    if (orderNumber.trim()) {
      setOrderStatus("shipped");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Package className="h-5 w-5" />;
      case "shipped":
        return <Truck className="h-5 w-5" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "shipped":
        return <Badge className="bg-blue-500">Shipped</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Track Your Order</h1>
            <p className="text-muted-foreground">
              Enter your order number to check the status of your delivery
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter your order number"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleTrackOrder}>
                  <Search className="h-4 w-4 mr-2" />
                  Track
                </Button>
              </div>
            </CardContent>
          </Card>

          {orderStatus && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(orderStatus)}
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Order Number:</span>
                    <span className="font-semibold">{orderNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    {getStatusBadge(orderStatus)}
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Tracking Timeline</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Order confirmed</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Payment received</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Truck className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Order shipped</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Out for delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Need help? Contact us on WhatsApp
            </p>
            <a href="https://wa.me/254768174878" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">Chat on WhatsApp</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;