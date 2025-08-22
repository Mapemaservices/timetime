-- Create storage bucket for product media
INSERT INTO storage.buckets (id, name, public) VALUES ('product-media', 'product-media', true);

-- Create policies for product media uploads
CREATE POLICY "Allow public read access to product media" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-media');

CREATE POLICY "Allow admin upload to product media" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-media');

CREATE POLICY "Allow admin update to product media" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-media');

CREATE POLICY "Allow admin delete to product media" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-media');