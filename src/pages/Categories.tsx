import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useProductCategories } from "@/hooks/useProducts";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const { data: categories } = useProductCategories();
  const navigate = useNavigate();

  const categoryIcons = {
    'Straight': '🦱',
    'Curly': '🌊',
    'Body Wave': '〰️',
    'Bob': '💇‍♀️',
    'Braided': '🪢',
    'Bundles': '📦',
    'Fringe': '✂️',
    'Pixie': '🧚‍♀️',
    'Kinky Straight': '📏',
    'Kinky Curly': '🌀',
    'HD Lace': '✨',
    'Wavy': '🌊',
    'Afro': '🌺'
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Browse Categories</h1>
          <p className="text-muted-foreground">Discover our wide range of premium wigs for every style and occasion</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories?.map((category, index) => (
            <Card 
              key={category} 
              className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => navigate(`/shop?category=${encodeURIComponent(category)}`)}
            >
              <CardContent className="p-8 text-center">
                <div className="text-6xl mb-4">{categoryIcons[category as keyof typeof categoryIcons] || '💇‍♀️'}</div>
                <h3 className="font-semibold text-lg group-hover:text-secondary transition-colors">
                  {category}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;