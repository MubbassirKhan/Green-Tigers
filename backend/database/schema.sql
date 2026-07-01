-- ============================================================
-- GREEN TIGER — E-COMMERCE DATABASE SCHEMA
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES (users) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name   TEXT NOT NULL,
  phone       TEXT,
  address     TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CATEGORIES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PRODUCTS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL,
  stock       INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url   TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CART ITEMS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ─── ORDERS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID REFERENCES profiles(id) ON DELETE SET NULL,
  total_amount     NUMERIC(10,2) NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  shipping_address TEXT NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ORDER ITEMS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity    INTEGER NOT NULL,
  unit_price  NUMERIC(10,2) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FEEDBACK ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS feedback (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ─── SEED DATA ───────────────────────────────────────────────

-- Categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Clothing', 'clothing', 'Trendy fashion for men, women & kids', 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80'),
  ('Sports', 'sports', 'Gear up for every sport & adventure', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80'),
  ('Home & Kitchen', 'home-kitchen', 'Everything you need for your home', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80'),
  ('Beauty', 'beauty', 'Skincare, makeup & personal care', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80'),
  ('Electronics', 'electronics', 'Latest gadgets & tech accessories', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80'),
  ('Books', 'books', 'Bestsellers, textbooks & more', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80')
ON CONFLICT (slug) DO NOTHING;

-- Admin user (password: admin123)
INSERT INTO profiles (email, password_hash, full_name, role) VALUES
  ('admin@greentiger.pk', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ─── SAMPLE PRODUCTS ─────────────────────────────────────────

-- Clothing
INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured)
SELECT 'Classic White T-Shirt', 'Premium 100% cotton unisex tee. Comfortable fit, machine washable. Available in all sizes.', 899, 150, id, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80', true
FROM categories WHERE slug = 'clothing';

INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured)
SELECT 'Slim Fit Denim Jeans', 'Stretchable slim fit jeans with 5-pocket design. Durable and stylish for everyday wear.', 2499, 80, id, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80', true
FROM categories WHERE slug = 'clothing';

INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured)
SELECT 'Floral Summer Dress', 'Light chiffon floral print dress, perfect for summer outings. Midi length, available S-XL.', 1799, 60, id, 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=500&q=80', false
FROM categories WHERE slug = 'clothing';

-- Sports
INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured)
SELECT 'Pro Running Shoes', 'Lightweight mesh running shoes with advanced cushioning. Anti-slip sole for outdoor tracks.', 3499, 45, id, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', true
FROM categories WHERE slug = 'sports';

INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured)
SELECT 'Yoga Mat Premium', 'Eco-friendly non-slip yoga mat (6mm thick). Ideal for yoga, pilates & stretching.', 1299, 100, id, 'https://images.unsplash.com/photo-1601925228008-6a40e95a8ff1?w=500&q=80', false
FROM categories WHERE slug = 'sports';

INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured)
SELECT 'Adjustable Dumbbell Set (20kg)', 'Space-saving adjustable dumbbells. Quick-change weight system, perfect for home gym.', 8999, 25, id, 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=500&q=80', true
FROM categories WHERE slug = 'sports';

-- Home & Kitchen
INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured)
SELECT 'Stainless Steel Cookware Set (7pc)', 'Professional grade 7-piece stainless steel cookware. Non-stick coating, dishwasher safe.', 6499, 30, id, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80', true
FROM categories WHERE slug = 'home-kitchen';

INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured)
SELECT 'Smart Air Purifier', 'HEPA filter air purifier with 360° air intake. Removes 99.97% of pollutants. Auto mode.', 12999, 20, id, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80', false
FROM categories WHERE slug = 'home-kitchen';

-- Beauty
INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured)
SELECT 'Vitamin C Brightening Serum', 'Dermatologist-tested 20% Vitamin C serum. Reduces dark spots, boosts collagen production.', 1999, 75, id, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80', true
FROM categories WHERE slug = 'beauty';

INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured)
SELECT 'Matte Lipstick Collection (6 shades)', 'Long-lasting matte lipstick set. 6 trending shades, moisturizing formula, no feathering.', 1299, 90, id, 'https://images.unsplash.com/photo-1586495777744-4e6232bf2f10?w=500&q=80', false
FROM categories WHERE slug = 'beauty';

-- Electronics
INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured)
SELECT 'Wireless Noise-Cancelling Earbuds', 'ANC earbuds with 30hr battery, IPX5 water resistance & crystal clear mic for calls.', 5499, 40, id, 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=500&q=80', true
FROM categories WHERE slug = 'electronics';

INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured)
SELECT '10000mAh Power Bank', 'Fast charge 22.5W power bank. 2 USB-A + 1 USB-C ports. Compact & travel-friendly.', 2299, 65, id, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&q=80', true
FROM categories WHERE slug = 'electronics';

-- Books
INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured)
SELECT 'Atomic Habits — James Clear', 'International bestseller on building good habits & breaking bad ones. Paperback edition.', 799, 200, id, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80', true
FROM categories WHERE slug = 'books';

INSERT INTO products (name, description, price, stock, category_id, image_url, is_featured)
SELECT 'The Psychology of Money', 'Timeless lessons on wealth, greed, and happiness by Morgan Housel. Must-read finance book.', 699, 180, id, 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&q=80', false
FROM categories WHERE slug = 'books';
