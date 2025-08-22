-- Insert default admin user
INSERT INTO public.admin_users (email, password_hash, name, is_active) 
VALUES (
  'admin@timelessstrands.com',
  crypt('admin123', gen_salt('bf')),
  'Admin User',
  true
);