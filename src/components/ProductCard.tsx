import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/hooks/useProducts";
import { ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails, onAddToCart }: ProductCardProps) {
  const images = product.product_media?.filter(media => media.media_type === 'image') || [];
  const minPrice = Math.min(...product.product_variants.map(v => v.price));
  const maxPrice = Math.max(...product.product_variants.map(v => v.price));
  const priceDisplay = minPrice === maxPrice ? `KSh ${minPrice.toLocaleString()}` : `KSh ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 w-full">
      <div className="relative aspect-[3/4] overflow-hidden">
        {images.length > 0 ? (
          <Carousel className="w-full h-full">
            <CarouselContent className="w-full h-full">
              {images.map((media, idx) => (
                <CarouselItem key={idx} className="w-full h-full flex items-stretch">
                  <img
                    src={media.media_url}
                    alt={product.name}
                    className="w-full h-full object-cover object-center block"
                    style={{ aspectRatio: '3/4', minHeight: 0, minWidth: 0 }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-1 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-1 top-1/2 -translate-y-1/2 z-10" />
          </Carousel>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <img src={"/logo.png"} alt="Logo" className="h-8 w-8 object-contain opacity-60" />
          </div>
        )}
        {product.is_featured && (
          <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-xs">
            Featured
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onViewDetails?.(product)}
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onAddToCart?.(product)}
            >
              <ShoppingCart className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
  <CardContent className="p-1 pb-2">
        <div className="mb-1">
          <Badge variant="outline" className="text-[10px]">
            {product.category}
          </Badge>
        </div>
        <h3 className="font-semibold text-base mb-1 line-clamp-2 group-hover:text-secondary transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="text-base font-bold text-foreground">
            {priceDisplay}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {product.product_variants.length} variant{product.product_variants.length !== 1 ? 's' : ''}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}