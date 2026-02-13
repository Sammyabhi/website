/*
  # Insert Sample Products

  ## Overview
  Populate the database with sample Chikankari products for Men, Women, and Kids categories
  to demonstrate the eCommerce functionality.

  ## Sample Data
  - 12 sample products across 3 categories (4 products per category)
  - Each product includes name, description, pricing, images, sizes, and stock
  - Uses free stock photos from Pexels
  - Realistic pricing and product details for Indian traditional wear

  ## Note
  This migration uses ON CONFLICT DO NOTHING to prevent duplicate entries
*/

-- Insert sample products for Men category
INSERT INTO products (
  name,
  description,
  category_id,
  price,
  discount_price,
  images,
  sizes,
  stock_quantity,
  is_available,
  sku,
  fabric_details
)
SELECT
  name,
  description,
  (SELECT id FROM categories WHERE slug = 'men'),
  price,
  discount_price,
  images,
  sizes,
  stock_quantity,
  is_available,
  sku,
  fabric_details
FROM (VALUES
  (
    'White Chikankari Kurta',
    'Elegant white cotton kurta with intricate Chikankari embroidery. Perfect for festive occasions and traditional events. Handcrafted by skilled artisans from Lucknow.',
    2499.00,
    1999.00,
    '["https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg", "https://images.pexels.com/photos/2287252/pexels-photo-2287252.jpeg"]'::jsonb,
    '[{"size": "M", "stock": 10}, {"size": "L", "stock": 15}, {"size": "XL", "stock": 12}, {"size": "XXL", "stock": 8}]'::jsonb,
    45,
    true,
    'CHK-MEN-001',
    '100% Cotton. Hand wash recommended. Authentic Lucknowi Chikankari work.'
  ),
  (
    'Cream Chikan Pathani Suit',
    'Traditional cream-colored Pathani suit with fine Chikankari embroidery. Comfortable and stylish for summer wear. Includes kurta and pajama set.',
    3499.00,
    2799.00,
    '["https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg", "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg"]'::jsonb,
    '[{"size": "M", "stock": 8}, {"size": "L", "stock": 10}, {"size": "XL", "stock": 10}, {"size": "XXL", "stock": 5}]'::jsonb,
    33,
    true,
    'CHK-MEN-002',
    'Premium Cotton Blend. Machine washable. Fade resistant colors.'
  ),
  (
    'Blue Cotton Chikan Kurta',
    'Sky blue cotton kurta with traditional white Chikankari work. Lightweight and breathable fabric ideal for Indian summers. Contemporary fit with ethnic charm.',
    2199.00,
    NULL,
    '["https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg", "https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg"]'::jsonb,
    '[{"size": "S", "stock": 12}, {"size": "M", "stock": 15}, {"size": "L", "stock": 15}, {"size": "XL", "stock": 10}]'::jsonb,
    52,
    true,
    'CHK-MEN-003',
    '100% Pure Cotton. Hand embroidered. Pre-shrunk fabric.'
  ),
  (
    'Black Chikankari Sherwani',
    'Premium black sherwani with golden Chikankari embroidery. Perfect for weddings and special occasions. Comes with matching pajama.',
    5999.00,
    4999.00,
    '["https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg", "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg"]'::jsonb,
    '[{"size": "M", "stock": 5}, {"size": "L", "stock": 8}, {"size": "XL", "stock": 6}, {"size": "XXL", "stock": 4}]'::jsonb,
    23,
    true,
    'CHK-MEN-004',
    'Silk Blend. Dry clean only. Intricate handwork with zari detailing.'
  )
) AS data(name, description, price, discount_price, images, sizes, stock_quantity, is_available, sku, fabric_details)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku LIKE 'CHK-MEN-%');

-- Insert sample products for Women category
INSERT INTO products (
  name,
  description,
  category_id,
  price,
  discount_price,
  images,
  sizes,
  stock_quantity,
  is_available,
  sku,
  fabric_details
)
SELECT
  name,
  description,
  (SELECT id FROM categories WHERE slug = 'women'),
  price,
  discount_price,
  images,
  sizes,
  stock_quantity,
  is_available,
  sku,
  fabric_details
FROM (VALUES
  (
    'White Chikankari Kurti',
    'Beautiful white cotton kurti with delicate Chikankari embroidery. Perfect for daily wear and casual occasions. Comfortable fit with elegant design.',
    1999.00,
    1499.00,
    '["https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg", "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg"]'::jsonb,
    '[{"size": "S", "stock": 15}, {"size": "M", "stock": 20}, {"size": "L", "stock": 18}, {"size": "XL", "stock": 12}]'::jsonb,
    65,
    true,
    'CHK-WOM-001',
    '100% Cotton. Machine washable. Soft and breathable fabric.'
  ),
  (
    'Pink Georgette Chikan Suit',
    'Elegant pink georgette suit with intricate Chikankari work. Includes kurti, dupatta, and palazzo. Perfect for festive celebrations.',
    3999.00,
    3299.00,
    '["https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg", "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg"]'::jsonb,
    '[{"size": "S", "stock": 10}, {"size": "M", "stock": 15}, {"size": "L", "stock": 12}, {"size": "XL", "stock": 8}]'::jsonb,
    45,
    true,
    'CHK-WOM-002',
    'Georgette with cotton lining. Hand wash recommended. Vibrant colors.'
  ),
  (
    'Cream Chikankari Anarkali',
    'Stunning cream-colored Anarkali dress with all-over Chikankari embroidery. Floor-length design perfect for special occasions and parties.',
    4499.00,
    3799.00,
    '["https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg", "https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg"]'::jsonb,
    '[{"size": "S", "stock": 8}, {"size": "M", "stock": 12}, {"size": "L", "stock": 10}, {"size": "XL", "stock": 6}]'::jsonb,
    36,
    true,
    'CHK-WOM-003',
    'Premium Cotton. Flared silhouette. Includes matching dupatta.'
  ),
  (
    'Blue Cotton Chikan Dress',
    'Contemporary blue cotton dress with modern Chikankari patterns. Casual yet elegant, perfect for summer outings and brunches.',
    2499.00,
    NULL,
    '["https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg", "https://images.pexels.com/photos/3738088/pexels-photo-3738088.jpeg"]'::jsonb,
    '[{"size": "S", "stock": 12}, {"size": "M", "stock": 18}, {"size": "L", "stock": 15}, {"size": "XL", "stock": 10}]'::jsonb,
    55,
    true,
    'CHK-WOM-004',
    '100% Cotton. Easy care. Contemporary fit with traditional embroidery.'
  )
) AS data(name, description, price, discount_price, images, sizes, stock_quantity, is_available, sku, fabric_details)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku LIKE 'CHK-WOM-%');

-- Insert sample products for Kids category
INSERT INTO products (
  name,
  description,
  category_id,
  price,
  discount_price,
  images,
  sizes,
  stock_quantity,
  is_available,
  sku,
  fabric_details
)
SELECT
  name,
  description,
  (SELECT id FROM categories WHERE slug = 'kids'),
  price,
  discount_price,
  images,
  sizes,
  stock_quantity,
  is_available,
  sku,
  fabric_details
FROM (VALUES
  (
    'White Kids Chikan Kurta',
    'Adorable white kurta with Chikankari embroidery for kids. Comfortable and perfect for festive occasions. Available in multiple sizes.',
    1299.00,
    999.00,
    '["https://images.pexels.com/photos/1620653/pexels-photo-1620653.jpeg", "https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg"]'::jsonb,
    '[{"size": "2-3Y", "stock": 10}, {"size": "4-5Y", "stock": 15}, {"size": "6-7Y", "stock": 12}, {"size": "8-9Y", "stock": 10}]'::jsonb,
    47,
    true,
    'CHK-KID-001',
    '100% Soft Cotton. Gentle on kids skin. Easy to maintain.'
  ),
  (
    'Pink Kids Chikan Frock',
    'Beautiful pink frock with delicate Chikankari work. Perfect for little girls special occasions and birthday parties.',
    1599.00,
    1299.00,
    '["https://images.pexels.com/photos/1620653/pexels-photo-1620653.jpeg", "https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg"]'::jsonb,
    '[{"size": "2-3Y", "stock": 8}, {"size": "4-5Y", "stock": 12}, {"size": "6-7Y", "stock": 10}, {"size": "8-9Y", "stock": 8}]'::jsonb,
    38,
    true,
    'CHK-KID-002',
    'Premium Cotton. Comfortable fit. Machine washable.'
  ),
  (
    'Blue Boys Chikan Pathani',
    'Cute blue Pathani suit with Chikankari embroidery for boys. Traditional wear for festivals and family gatherings.',
    1799.00,
    NULL,
    '["https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg", "https://images.pexels.com/photos/1620653/pexels-photo-1620653.jpeg"]'::jsonb,
    '[{"size": "2-3Y", "stock": 10}, {"size": "4-5Y", "stock": 15}, {"size": "6-7Y", "stock": 12}, {"size": "8-9Y", "stock": 10}]'::jsonb,
    47,
    true,
    'CHK-KID-003',
    'Cotton Blend. Includes kurta and pajama. Durable stitching.'
  ),
  (
    'Yellow Kids Ethnic Set',
    'Bright yellow ethnic wear set with minimal Chikankari design. Perfect for summer festivals and cultural events.',
    1499.00,
    1199.00,
    '["https://images.pexels.com/photos/1620653/pexels-photo-1620653.jpeg", "https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg"]'::jsonb,
    '[{"size": "2-3Y", "stock": 12}, {"size": "4-5Y", "stock": 15}, {"size": "6-7Y", "stock": 15}, {"size": "8-9Y", "stock": 12}]'::jsonb,
    54,
    true,
    'CHK-KID-004',
    'Light Cotton. Bright colors. Comfortable all-day wear.'
  )
) AS data(name, description, price, discount_price, images, sizes, stock_quantity, is_available, sku, fabric_details)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku LIKE 'CHK-KID-%');