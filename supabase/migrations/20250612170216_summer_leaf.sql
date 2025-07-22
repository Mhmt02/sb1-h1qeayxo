/*
  # Complete E-commerce Database Schema

  1. New Tables
    - `users` - User profiles and authentication data
    - `categories` - Product categories with slugs
    - `products` - Products with images, videos, and PDF support
    - `banners` - Homepage banners with category linking
    - `carts` - Shopping carts for users
    - `cart_items` - Individual items in shopping carts
    - `favorites` - User favorite products

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for admin users

  3. Features
    - Support for multiple product images
    - Video URLs for product demonstrations
    - PDF URLs for catalogs and manuals
    - Category-based product organization
    - Shopping cart functionality
    - Favorites system
*/

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table with multimedia support
CREATE TABLE IF NOT EXISTS products (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  short_description text,
  price decimal(10,2) NOT NULL,
  discount_percentage integer DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  category_id bigint REFERENCES categories(id) ON DELETE SET NULL,
  image_url text,
  additional_images jsonb DEFAULT '[]'::jsonb,
  video_urls jsonb DEFAULT '[]'::jsonb,
  pdf_urls jsonb DEFAULT '[]'::jsonb,
  featured boolean DEFAULT false,
  stock_quantity integer DEFAULT 0,
  sku text UNIQUE,
  rating_avg decimal(3,2) DEFAULT 0 CHECK (rating_avg >= 0 AND rating_avg <= 5),
  rating_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id bigserial PRIMARY KEY,
  image_url text NOT NULL,
  title text,
  subtitle text,
  link_url text,
  is_active boolean DEFAULT true,
  order_num integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create carts table
CREATE TABLE IF NOT EXISTS carts (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id bigserial PRIMARY KEY,
  cart_id bigint REFERENCES carts(id) ON DELETE CASCADE,
  product_id bigint REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(cart_id, product_id)
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  product_id bigint REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can read products" ON products
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Banners policies (public read, admin write)
CREATE POLICY "Anyone can read banners" ON banners
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage banners" ON banners
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Carts policies (users can only access their own carts)
CREATE POLICY "Users can read own carts" ON carts
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own carts" ON carts
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own carts" ON carts
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own carts" ON carts
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Cart items policies (users can only access their own cart items)
CREATE POLICY "Users can read own cart items" ON cart_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own cart items" ON cart_items
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND carts.user_id = auth.uid()
    )
  );

-- Favorites policies (users can only access their own favorites)
CREATE POLICY "Users can read own favorites" ON favorites
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_additional_images ON products USING GIN (additional_images);
CREATE INDEX IF NOT EXISTS idx_products_video_urls ON products USING GIN (video_urls);
CREATE INDEX IF NOT EXISTS idx_products_pdf_urls ON products USING GIN (pdf_urls);
CREATE INDEX IF NOT EXISTS idx_banners_active ON banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_order ON banners(order_num);
CREATE INDEX IF NOT EXISTS idx_carts_user ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product ON favorites(product_id);

-- Add comments for documentation
COMMENT ON TABLE users IS 'User profiles extending Supabase auth';
COMMENT ON TABLE categories IS 'Product categories with SEO-friendly slugs';
COMMENT ON TABLE products IS 'Products with multimedia support (images, videos, PDFs)';
COMMENT ON TABLE banners IS 'Homepage banners for promotions';
COMMENT ON TABLE carts IS 'Shopping carts for users';
COMMENT ON TABLE cart_items IS 'Individual items in shopping carts';
COMMENT ON TABLE favorites IS 'User favorite products';

COMMENT ON COLUMN products.additional_images IS 'Array of additional product image URLs';
COMMENT ON COLUMN products.video_urls IS 'Array of video URLs (YouTube, Vimeo, etc.)';
COMMENT ON COLUMN products.pdf_urls IS 'Array of PDF document URLs (catalogs, manuals, etc.)';

-- Insert sample data for development
INSERT INTO categories (name, slug, description) VALUES
  ('Elektronik', 'elektronik', 'Elektronik ürünler ve aksesuarlar'),
  ('Giyim', 'giyim', 'Kadın, erkek ve çocuk giyim'),
  ('Ev & Yaşam', 'ev-yasam', 'Ev dekorasyonu ve yaşam ürünleri'),
  ('Spor', 'spor', 'Spor malzemeleri ve fitness ürünleri')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample banners
INSERT INTO banners (image_url, title, subtitle, is_active, order_num) VALUES
  ('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop', 'Yeni Sezon İndirimleri', 'Tüm kategorilerde %50''ye varan indirimler', true, 1),
  ('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop', 'Ücretsiz Kargo', '200 TL ve üzeri alışverişlerde', true, 2)
ON CONFLICT DO NOTHING;