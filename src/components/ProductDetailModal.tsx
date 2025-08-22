import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Heart, Star, Plus, Minus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

// Helper function to get unique values for a variant type
const getUniqueValues = (variants: any[], key: string) => {
  return [...new Set(variants.map(v => v[key]))];
};

export function ProductDetailModal({ product, open, onClose }: ProductDetailModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({
    style: "",
    colour: "",
    inch: "",
    density: "",
    lace_size: ""
  });
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedImage, setSelectedImage] = useState(0);
  const images = product?.product_media?.filter(media => media.media_type === 'image') || [];

  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      setSelectedOptions({
        style: "",
        colour: "",
        inch: "",
        density: "",
        lace_size: ""
      });
      setSelectedVariant(null);
      setQuantity(1);
    }
  }, [product]);

  // Find matching variant when options change
  useEffect(() => {
    if (product && Object.values(selectedOptions).every(val => val !== "")) {
      const variant = product.product_variants.find(v => 
        v.style === selectedOptions.style &&
        v.colour === selectedOptions.colour &&
        v.inch === selectedOptions.inch &&
        v.density === selectedOptions.density &&
        v.lace_size === selectedOptions.lace_size
      );
      setSelectedVariant(variant || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedOptions, product]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => setSelectedImage(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  const scrollTo = (idx: number) => {
    if (emblaApi) emblaApi.scrollTo(idx);
  };

  if (!product) return null;

  const firstImage = product.product_media?.find(media => media.media_type === 'image')?.media_url;
  const minPrice = Math.min(...product.product_variants.map(v => v.price));
  const maxPrice = Math.max(...product.product_variants.map(v => v.price));
  const priceDisplay = minPrice === maxPrice ? `KSh ${minPrice.toLocaleString()}` : `KSh ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`;

  // Get unique variant options
  const styles = getUniqueValues(product.product_variants, 'style');
  const colors = getUniqueValues(product.product_variants, 'colour');
  const inches = getUniqueValues(product.product_variants, 'inch');
  const densities = getUniqueValues(product.product_variants, 'density');
  const laceSizes = getUniqueValues(product.product_variants, 'lace_size');

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast({
        title: "Please select a variant",
        description: "Choose style, color, and other options before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    addToCart(product, selectedVariant, quantity);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
    onClose();
  };

  const handleOrderNow = () => {
    if (!selectedVariant) {
      toast({
        title: "Please select a variant",
        description: "Choose style, color, and other options before ordering.",
        variant: "destructive",
      });
      return;
    }

    addToCart(product, selectedVariant, quantity);
    setTimeout(() => {
      onClose();
      navigate('/checkout');
    }, 100);
  };

  // Helper function to handle option selection
  const handleOptionSelect = (type: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Helper to check if all options are selected and quantity is valid
  const allOptionsSelected = Object.values(selectedOptions).every(val => val !== "");
  const canOrder = allOptionsSelected && selectedVariant && quantity > 0 && (!selectedVariant.quantity || quantity <= selectedVariant.quantity);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[95vh] overflow-y-auto p-0 sm:p-6">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-10 bg-background/80 backdrop-blur-sm rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <DialogHeader className="px-4 pt-4 sm:px-0 sm:pt-0">
            <DialogTitle className="text-xl sm:text-2xl">{product.name}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Product Images Carousel with Thumbnails */}
            <div className="flex flex-col items-center px-4 sm:px-0">
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
                {images.length > 0 ? (
                  <div ref={emblaRef} className="w-full h-full">
                    <div className="flex w-full h-full">
                      {images.map((media, idx) => (
                        <div key={idx} className="w-full h-full flex-shrink-0 flex-grow-0">
                          <img
                            src={media.media_url}
                            alt={product.name}
                            className="w-full h-full object-cover object-center block"
                            style={{ aspectRatio: '1/1', minHeight: 0, minWidth: 0 }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <img src={"/logo.png"} alt="Logo" className="h-16 w-16 object-contain opacity-60 mx-auto" />
                  </div>
                )}
              </div>
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-2 justify-start overflow-x-auto w-full py-2 px-1">
                  {images.map((media, idx) => (
                    <button
                      key={idx}
                      className={`flex-shrink-0 border rounded overflow-hidden w-12 h-12 sm:w-14 sm:h-14 p-0 focus:outline-none ${selectedImage === idx ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}
                      onClick={() => scrollTo(idx)}
                      type="button"
                    >
                      <img
                        src={media.media_url}
                        alt={product.name + ' thumbnail'}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Details */}
            <div className="space-y-4 sm:space-y-6 px-4 pb-4 sm:px-0 sm:pb-0">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    {product.category}
                  </Badge>
                  {product.is_featured && (
                    <Badge className="bg-secondary text-secondary-foreground text-xs sm:text-sm">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <div className="text-xl sm:text-2xl font-bold mt-2">
                  {selectedVariant ? `KSh ${selectedVariant.price.toLocaleString()}` : priceDisplay}
                </div>
                
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">(4.8/5)</span>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm sm:text-base">{product.description}</p>
              
              {/* Variant Selection */}
              <div className="space-y-4">
                {/* Lace Size Selection */}
                {laceSizes.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Lace Size:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {laceSizes.map((size) => (
                        <Button
                          key={size}
                          variant={selectedOptions.lace_size === size ? "default" : "outline"}
                          className="h-8 sm:h-10 text-xs px-2"
                          onClick={() => handleOptionSelect('lace_size', size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Style Selection */}
                {styles.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Style:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {styles.map((style) => (
                        <Button
                          key={style}
                          variant={selectedOptions.style === style ? "default" : "outline"}
                          className="h-8 sm:h-10 text-xs px-2"
                          onClick={() => handleOptionSelect('style', style)}
                        >
                          {style}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {colors.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Color:</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {colors.map((color) => (
                        <Button
                          key={color}
                          variant={selectedOptions.colour === color ? "default" : "outline"}
                          className="h-8 sm:h-10 text-xs px-2"
                          onClick={() => handleOptionSelect('colour', color)}
                        >
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Length Selection */}
                {inches.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Length (inches):</label>
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
                      {inches.map((inch) => (
                        <Button
                          key={inch}
                          variant={selectedOptions.inch === inch ? "default" : "outline"}
                          className="h-8 sm:h-10 text-xs px-1"
                          onClick={() => handleOptionSelect('inch', inch)}
                        >
                          {inch}"
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Density Selection */}
                {densities.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Density:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {densities.map((density) => (
                        <Button
                          key={density}
                          variant={selectedOptions.density === density ? "default" : "outline"}
                          className="h-8 sm:h-10 text-xs px-2"
                          onClick={() => handleOptionSelect('density', density)}
                        >
                          {density}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedVariant && (
                  <div className="bg-muted p-3 rounded-lg space-y-1 text-xs sm:text-sm">
                    <div><strong>Style:</strong> {selectedVariant.style}</div>
                    <div><strong>Color:</strong> {selectedVariant.colour}</div>
                    <div><strong>Length:</strong> {selectedVariant.inch}"</div>
                    <div><strong>Density:</strong> {selectedVariant.density}</div>
                    <div><strong>Lace Size:</strong> {selectedVariant.lace_size}</div>
                    <div><strong>In Stock:</strong> {selectedVariant.quantity} units</div>
                  </div>
                )}
                
                {/* Quantity Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Quantity:</label>
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 sm:h-10 sm:w-10"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <span className="w-8 sm:w-12 text-center font-medium text-sm sm:text-base">{quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 sm:h-10 sm:w-10"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={selectedVariant && quantity >= selectedVariant.quantity}
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1" 
                  onClick={handleOrderNow}
                  disabled={!canOrder}
                  size="lg"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Order Now
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!canOrder}
                  size="lg"
                >
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="h-11 w-11">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}