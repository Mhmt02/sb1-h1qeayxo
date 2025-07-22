/*
  # Hierarchical Categories Migration

  1. New Tables
    - Updates `categories` table to support parent-child relationships
    - Updates `products` table with additional fields

  2. Features
    - Parent-child category relationships
    - Hierarchical category structure (max 3 levels)
    - Additional product fields (slug, short_description, sku, stock_quantity)
*/

-- Add parent_id and level columns to categories table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE categories ADD COLUMN parent_id bigint REFERENCES categories(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'level'
  ) THEN
    ALTER TABLE categories ADD COLUMN level integer DEFAULT 0;
  END IF;
END $$;

-- Add additional product fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'slug'
  ) THEN
    ALTER TABLE products ADD COLUMN slug text UNIQUE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'short_description'
  ) THEN
    ALTER TABLE products ADD COLUMN short_description text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'sku'
  ) THEN
    ALTER TABLE products ADD COLUMN sku text UNIQUE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE products ADD COLUMN stock_quantity integer DEFAULT 0;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_level ON categories(level);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity);

-- Insert sample hierarchical categories
INSERT INTO categories (name, slug, description, parent_id, level) VALUES
  ('Elektronik', 'elektronik', 'Elektronik ürünler ve aksesuarlar', NULL, 0),
  ('Giyim', 'giyim', 'Kadın, erkek ve çocuk giyim', NULL, 0),
  ('Ev & Yaşam', 'ev-yasam', 'Ev dekorasyonu ve yaşam ürünleri', NULL, 0),
  ('Spor', 'spor', 'Spor malzemeleri ve fitness ürünleri', NULL, 0)
ON CONFLICT (slug) DO NOTHING;

-- Add subcategories
INSERT INTO categories (name, slug, description, parent_id, level) 
SELECT 'Telefon & Aksesuarlar', 'telefon-aksesuarlar', 'Cep telefonu ve aksesuarları', id, 1
FROM categories WHERE slug = 'elektronik' AND NOT EXISTS (
  SELECT 1 FROM categories WHERE slug = 'telefon-aksesuarlar'
);

INSERT INTO categories (name, slug, description, parent_id, level) 
SELECT 'Bilgisayar', 'bilgisayar', 'Laptop, masaüstü ve aksesuarlar', id, 1
FROM categories WHERE slug = 'elektronik' AND NOT EXISTS (
  SELECT 1 FROM categories WHERE slug = 'bilgisayar'
);

INSERT INTO categories (name, slug, description, parent_id, level) 
SELECT 'Erkek Giyim', 'erkek-giyim', 'Erkek giyim ürünleri', id, 1
FROM categories WHERE slug = 'giyim' AND NOT EXISTS (
  SELECT 1 FROM categories WHERE slug = 'erkek-giyim'
);

INSERT INTO categories (name, slug, description, parent_id, level) 
SELECT 'Kadın Giyim', 'kadin-giyim', 'Kadın giyim ürünleri', id, 1
FROM categories WHERE slug = 'giyim' AND NOT EXISTS (
  SELECT 1 FROM categories WHERE slug = 'kadin-giyim'
);

-- Add sub-subcategories
INSERT INTO categories (name, slug, description, parent_id, level) 
SELECT 'Gömlekler', 'gomlekler', 'Erkek gömlekleri', id, 2
FROM categories WHERE slug = 'erkek-giyim' AND NOT EXISTS (
  SELECT 1 FROM categories WHERE slug = 'gomlekler'
);

INSERT INTO categories (name, slug, description, parent_id, level) 
SELECT 'T-Shirt', 't-shirt', 'Erkek t-shirt', id, 2
FROM categories WHERE slug = 'erkek-giyim' AND NOT EXISTS (
  SELECT 1 FROM categories WHERE slug = 't-shirt'
);

-- Update existing products with slugs if they don't have them
UPDATE products 
SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- Add sample product with all new fields
INSERT INTO products (
  name, slug, description, short_description, price, discount_percentage, 
  category_id, image_url, featured, stock_quantity, sku, rating_avg, rating_count
) 
SELECT 
  'Etikmen Easy-Iron Dakron Plain Black Slimfit Erkek Gömlek',
  'etikmen-easy-iron-dakron-plain-black-slimfit-erkek-gomlek',
  'Yüksek kaliteli dakron kumaştan üretilen, kolay ütülenebilir özellikte slimfit erkek gömlek. Modern kesimi ve şık tasarımı ile günlük ve iş hayatında rahatlıkla kullanabilirsiniz.',
  'Easy-Iron Dakron Plain Black Slimfit Erkek Gömlek',
  1000.00,
  65,
  c.id,
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop',
  true,
  1,
  'ETK-GOMLEK-001',
  4.7,
  356
FROM categories c 
WHERE c.slug = 'gomlekler'
AND NOT EXISTS (
  SELECT 1 FROM products WHERE sku = 'ETK-GOMLEK-001'
);

COMMENT ON COLUMN categories.parent_id IS 'Parent category ID for hierarchical structure';
COMMENT ON COLUMN categories.level IS 'Category level (0=root, 1=sub, 2=sub-sub)';
COMMENT ON COLUMN products.slug IS 'SEO-friendly URL slug';
COMMENT ON COLUMN products.short_description IS 'Brief product description';
COMMENT ON COLUMN products.sku IS 'Stock Keeping Unit - unique product code';
COMMENT ON COLUMN products.stock_quantity IS 'Available stock quantity';