import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartDrawer } from "@/components/CartDrawer";
import { Navigation } from "@/components/Navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProductCategories } from "@/hooks/useProducts";
import { useAllProducts, Product } from "@/hooks/useAllProducts";
import { Search, Filter } from "lucide-react";

const Shop = () => {
  const { data: products } = useAllProducts();
  const { data: categories } = useProductCategories();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const navigate = useNavigate();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(false);
  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return Math.min(...a.product_variants.map(v => v.price)) - Math.min(...b.product_variants.map(v => v.price));
      case "price-high":
        return Math.max(...b.product_variants.map(v => v.price)) - Math.max(...a.product_variants.map(v => v.price));
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });


    // Custom handler to control drawer open state and navigation
    const handleCartDrawerOpenChange = (open: boolean) => {
      setCartDrawerOpen(open);
    };

    return (
      <div className="min-h-screen bg-background">
        <Navigation onCartClick={() => setCartDrawerOpen(true)} />
        <div className="fixed top-4 right-4 z-50">
          <CartDrawer
            isOpen={cartDrawerOpen}
            setIsOpen={handleCartDrawerOpenChange}
            onCheckout={() => {
              setCartDrawerOpen(false);
              navigate('/orderform');
            }}
          />
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Shop All Products</h1>
            <p className="text-muted-foreground">Browse our complete collection of premium wigs</p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 lg:gap-2 xl:gap-2">
            {filteredProducts?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => setSelectedProduct(product)}
                onAddToCart={() => setSelectedProduct(product)}
              />
            ))}
          </div>

          {filteredProducts?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </div>

        <ProductDetailModal
          product={selectedProduct}
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>
    );
};

export default Shop;