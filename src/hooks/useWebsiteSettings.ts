import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WebsiteSetting {
  key: string;
  value: string;
  description: string;
}

export function useWebsiteSettings() {
  return useQuery({
    queryKey: ["website-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("website_settings")
        .select("*");
      
      if (error) throw error;
      
      // Convert array to object for easier access
      const settings: Record<string, string> = {};
      data.forEach((setting: WebsiteSetting) => {
        settings[setting.key] = setting.value;
      });
      
      return settings;
    },
  });
}