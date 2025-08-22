import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  product_media: ProductMedia[];
  product_variants: ProductVariant[];
}

export interface ProductMedia {
  id: string;
  media_url: string;
  media_type: 'image' | 'video';
  display_order: number;
}

export interface ProductVariant {
  id: string;
  lace_size: string;
  inch: string;
  density: string;
  colour: string;
  style: string;
  price: number;
  quantity: number;
  is_active: boolean;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_media(*),
          product_variants(*)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_media(*),
          product_variants(*)
        `)
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("category")
        .eq("is_active", true);
      
      if (error) throw error;
      
      const categories = [...new Set(data.map(item => item.category))];
      return categories;
    },
  });
}