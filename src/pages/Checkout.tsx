import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { OrderForm } from "@/components/OrderForm";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleOrderComplete = (newOrderNumber: string) => {
    setOrderNumber(newOrderNumber);
  };

  const handleBackToShopping = () => {
    setOrderNumber(null);
    navigate('/');
  };

  if (cartItems.length === 0 && !orderNumber) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Add some products to your cart before checking out.
            </p>
            <Button onClick={() => navigate('/shop')}>
              Start Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold">
            {orderNumber ? 'Order Confirmation' : 'Checkout'}
          </h1>
          {!orderNumber && (
            <p className="text-muted-foreground">
              Complete your order and payment details below
            </p>
          )}
        </div>

        {orderNumber ? (
          <OrderConfirmation 
            orderNumber={orderNumber}
            onBackToShopping={handleBackToShopping}
          />
        ) : (
          <OrderForm onOrderComplete={handleOrderComplete} />
        )}
      </div>
    </div>
  );
};

export default Checkout;