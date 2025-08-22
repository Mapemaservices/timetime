import { Navigation } from "@/components/Navigation";
import { OrderForm } from "@/components/OrderForm";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";


import { useState } from "react";

const OrderFormPage = () => {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const handleOrderComplete = (newOrderNumber: string) => {
    setOrderNumber(newOrderNumber);
  };

  const handleBackToShop = () => {
    setOrderNumber(null);
    navigate("/shop");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground mb-6">
          Complete your order and payment details below
        </p>
        {orderNumber ? (
          <OrderConfirmation orderNumber={orderNumber} onBackToShopping={handleBackToShop} />
        ) : (
          <OrderForm onOrderComplete={handleOrderComplete} />
        )}
      </div>
    </div>
  );
};

export default OrderFormPage;
