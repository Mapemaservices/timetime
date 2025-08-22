import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";

interface CartDrawerProps {
  onCheckout?: () => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export function CartDrawer({ onCheckout, isOpen, setIsOpen }: CartDrawerProps) {
  // If open state is controlled by parent, use it; otherwise, manage locally
  const [internalOpen, internalSetOpen] = useState(false);
  const open = typeof isOpen === 'boolean' ? isOpen : internalOpen;
  const setOpen = setIsOpen || internalSetOpen;
  const { cartItems, updateQuantity, removeFromCart, getTotalItems, getTotalPrice } = useCart();

  const handleCheckout = () => {
    setOpen(false);
    onCheckout?.();
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-4 w-4" />
          {getTotalItems() > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({getTotalItems()} items)</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 flex-1">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const firstImage = item.product.product_media?.find(media => media.media_type === 'image')?.media_url;
                
                return (
                  <Card key={`${item.product.id}-${item.variant.id}`}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          {firstImage ? (
                            <img 
                              src={firstImage} 
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <img src={"/logo.png"} alt="Logo" className="h-8 w-8 object-contain opacity-60" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-1">{item.product.name}</h4>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>Style: {item.variant.style}</div>
                            <div>Color: {item.variant.colour}</div>
                            <div>Length: {item.variant.inch}"</div>
                            <div>Density: {item.variant.density}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold text-sm mb-2">
                            KSh {(item.variant.price * item.quantity).toLocaleString()}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-6 text-center">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                              onClick={() => removeFromCart(item.product.id, item.variant.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="border-t pt-4 mt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-lg font-bold">KSh {getTotalPrice().toLocaleString()}</span>
            </div>
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}