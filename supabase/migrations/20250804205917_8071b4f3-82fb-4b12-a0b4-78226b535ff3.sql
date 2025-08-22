-- Create enum for product categories
CREATE TYPE product_category AS ENUM (
  'Straight', 'Curly', 'Body Wave', 'Bob', 'Braided', 'Bundles', 
  'Fringe', 'Pixie', 'Kinky Straight', 'Kinky Curly', 'HD Lace', 'Wavy', 'Afro'
);

-- Create enum for order status
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'processing', 'dispatched', 'delivered');

-- Create counties table for delivery settings
CREATE TABLE public.counties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  estimated_days_min INTEGER NOT NULL DEFAULT 5,
  estimated_days_max INTEGER NOT NULL DEFAULT 14,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category product_category NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product media table
CREATE TABLE public.product_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product variants table
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  lace_size TEXT,
  inch TEXT,
  density TEXT,
  colour TEXT,
  style TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT NOT NULL,
  county_id UUID REFERENCES public.counties(id),
  county_name TEXT NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  payment_confirmed BOOLEAN DEFAULT false,
  estimated_delivery_start DATE,
  estimated_delivery_end DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  variant_id UUID REFERENCES public.product_variants(id),
  product_name TEXT NOT NULL,
  variant_details JSONB,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create website settings table
CREATE TABLE public.website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default counties
INSERT INTO public.counties (name, delivery_fee, estimated_days_min, estimated_days_max) VALUES
('Nairobi', 0, 1, 3),
('Mombasa', 200, 3, 7),
('Kisumu', 250, 5, 10),
('Nakuru', 150, 3, 7),
('Eldoret', 200, 5, 10),
('Thika', 100, 2, 5),
('Malindi', 300, 7, 14),
('Kitale', 250, 7, 12),
('Garissa', 400, 10, 14),
('Kakamega', 200, 5, 10),
('Nyeri', 150, 3, 7),
('Machakos', 120, 2, 5),
('Meru', 180, 4, 8),
('Kericho', 200, 5, 10),
('Embu', 160, 3, 7),
('Lamu', 350, 10, 14),
('Isiolo', 300, 8, 12),
('Nanyuki', 180, 4, 8),
('Kilifi', 250, 5, 10),
('Bungoma', 220, 6, 10),
('Migori', 280, 7, 12),
('Homa Bay', 260, 6, 11),
('Siaya', 240, 6, 10),
('Busia', 230, 6, 10),
('Vihiga', 200, 5, 9),
('Nandi', 190, 5, 9),
('Uasin Gishu', 200, 5, 10),
('Trans Nzoia', 210, 6, 10),
('West Pokot', 300, 8, 14),
('Samburu', 350, 10, 14),
('Turkana', 400, 12, 14),
('Marsabit', 450, 12, 14),
('Mandera', 500, 14, 14),
('Wajir', 450, 12, 14),
('Tana River', 300, 8, 12),
('Kwale', 280, 6, 10),
('Taita Taveta', 320, 8, 12),
('Kajiado', 130, 2, 5),
('Makueni', 150, 3, 7),
('Kitui', 170, 4, 8),
('Muranga', 140, 3, 6),
('Kiambu', 80, 1, 3),
('Nyamira', 220, 6, 10),
('Kisii', 240, 6, 10),
('Bomet', 200, 5, 9),
('Narok', 180, 4, 8),
('Baringo', 250, 7, 11),
('Laikipia', 200, 5, 9),
('Tharaka Nithi', 180, 4, 8);

-- Insert default website settings
INSERT INTO public.website_settings (key, value, description) VALUES
('site_title', 'Timeless Strands', 'Website title'),
('hero_title', 'Beautiful Wigs for Every Occasion', 'Homepage hero title'),
('hero_subtitle', 'Premium quality wigs delivered across Kenya', 'Homepage hero subtitle'),
('about_text', 'Timeless Strands is Kenya''s premier wig retailer, offering high-quality wigs for every style and occasion.', 'About us text'),
('contact_email', 'timelessstrands@outlook.com', 'Contact email'),
('contact_phone', '0768174878', 'Contact phone number'),
('contact_address', 'Starmall C1', 'Physical address'),
('mpesa_paybill', '522522', 'MPESA Paybill number'),
('mpesa_account', '1342330668', 'MPESA account number'),
('instagram_url', '', 'Instagram URL'),
('twitter_url', '', 'Twitter URL'),
('facebook_url', '', 'Facebook URL'),
('tiktok_url', '', 'TikTok URL'),
('delivery_policy', 'Free delivery within Nairobi. Other counties charged based on location. Delivery time: 5-14 days depending on location.', 'Delivery policy text');

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'TS' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_website_settings_updated_at BEFORE UPDATE ON public.website_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number = generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- Enable RLS on all tables
ALTER TABLE public.counties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (customers can view products)
CREATE POLICY "Allow public read access to counties" ON public.counties FOR SELECT USING (true);
CREATE POLICY "Allow public read access to active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access to product media" ON public.product_media FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND is_active = true)
);
CREATE POLICY "Allow public read access to active product variants" ON public.product_variants FOR SELECT USING (
  is_active = true AND EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND is_active = true)
);
CREATE POLICY "Allow public read access to website settings" ON public.website_settings FOR SELECT USING (true);

-- Create RLS policies for orders (customers can create and view their own orders)
CREATE POLICY "Allow insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select orders by phone" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select order items" ON public.order_items FOR SELECT USING (true);

-- Create RLS policies for customers
CREATE POLICY "Allow insert customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select customers" ON public.customers FOR SELECT USING (true);