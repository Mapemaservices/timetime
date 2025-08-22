import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product as ProductType } from "@/hooks/useProducts";

export type { ProductType as Product };

export interface ProductVariant {
  id: string;
  product_id: string;
  style: string;
  colour: string;
  inch: string;
  density: string;
  lace_size: string;
  price: number;
  quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductMedia {
  id: string;
  product_id: string;
  media_url: string;
  media_type: string;
  display_order: number | null;
}

export const useAllProducts = () => {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_variants (*),
          product_media (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProductType[];
    },
  });
};