-- Update products with proper image URLs and better data
UPDATE products SET 
  image_urls = ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400'],
  description = 'অত্যাধুনিক স্মার্ট ওয়াচ যা আপনার স্বাস্থ্য পর্যবেক্ষণ করে। হার্ট রেট মনিটর, স্টেপ কাউন্টার, ওয়াটারপ্রুফ এবং ৭ দিন ব্যাটারি লাইফ সহ।'
WHERE name = 'স্মার্ট ওয়াচ প্রো';

UPDATE products SET 
  image_urls = ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400'],
  description = '১০০% কটনের তৈরি উন্নত মানের টি-শার্ট। আরামদায়ক, টেকসই এবং সব ধরনের অনুষ্ঠানের জন্য উপযুক্ত।'
WHERE name = 'প্রিমিয়াম টি-শার্ট';

UPDATE products SET 
  image_urls = ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400'],
  description = 'অত্যাধুনিক আল্ট্রাসনিক হিউমিডিফায়ার যা ঘরের বায়ু পরিষ্কার রাখে এবং আর্দ্রতা নিয়ন্ত্রণ করে। সাইলেন্ট অপারেশন এবং অটো শাট-অফ ফিচার।'
WHERE name = 'হিউমিডিফায়ার';

-- Add more diverse products
INSERT INTO products (name, description, price, discount_price, image_urls, category_id, stock_quantity, colors, sizes) VALUES
('গেমিং হেডফোন প্রো', 'প্রফেশনাল গেমিং হেডফোন উন্নত সাউন্ড কোয়ালিটি এবং নয়েজ ক্যান্সেলেশন সহ। LED লাইট এবং কমফোর্টেবল ডিজাইন।', 3500.00, 2800.00, ARRAY['https://images.unsplash.com/photo-1599669454699-248893623440?w=400', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400'], (SELECT id FROM categories WHERE name = 'ইলেকট্রনিক্স'), 20, ARRAY['কালো', 'লাল', 'নীল'], ARRAY['স্ট্যান্ডার্ড']),

('ওয়্যারলেস চার্জার প্যাড', 'দ্রুত ওয়্যারলেস চার্জিং প্যাড সব ধরনের স্মার্টফোনের জন্য। LED ইন্ডিকেটর এবং সেফটি প্রোটেকশন।', 1800.00, 1200.00, ARRAY['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400'], (SELECT id FROM categories WHERE name = 'ইলেকট্রনিক্স'), 30, ARRAY['সাদা', 'কালো'], ARRAY['স্ট্যান্ডার্ড']),

('ক্যাজুয়াল জিন্স প্যান্ট', 'আরামদায়ক এবং স্টাইলিশ জিন্স প্যান্ট সব বয়সের জন্য। উন্নত মানের ডেনিম কাপড় এবং পারফেক্ট ফিটিং।', 2200.00, 1800.00, ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400'], (SELECT id FROM categories WHERE name = 'ফ্যাশন'), 40, ARRAY['নীল', 'কালো', 'গ্রে'], ARRAY['28', '30', '32', '34', '36']),

('স্নিকার্স জুতা', 'কমফোর্টেবল স্পোর্টস স্নিকার্স দৈনন্দিন ব্যবহারের জন্য। ব্রিদেবল ম্যাটেরিয়াল এবং নন-স্লিপ সোল।', 4500.00, 3200.00, ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400'], (SELECT id FROM categories WHERE name = 'ফ্যাশন'), 25, ARRAY['সাদা', 'কালো', 'নেভি'], ARRAY['39', '40', '41', '42', '43', '44']),

('ইনডোর প্ল্যান্ট পট সেট', 'সুন্দর সিরামিক প্ল্যান্ট পট সেট ইনডোর গার্ডেনিংয়ের জন্য। ড্রেনেজ হোল এবং ওয়াটার ট্রে সহ।', 1500.00, 1100.00, ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'], (SELECT id FROM categories WHERE name = 'হোম অ্যান্ড গার্ডেন'), 35, ARRAY['সাদা', 'বেইজ', 'টেরাকোটা'], ARRAY['ছোট', 'মাঝারি', 'বড়']),

('ফিটনেস ইয়োগা ম্যাট', 'প্রিমিয়াম কোয়ালিটি ইয়োগা ম্যাট এক্সারসাইজ এবং ইয়োগার জন্য। নন-স্লিপ সারফেস এবং ইকো-ফ্রেন্ডলি ম্যাটেরিয়াল।', 2800.00, 2100.00, ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'], (SELECT id FROM categories WHERE name = 'স্পোর্টস'), 20, ARRAY['নীল', 'পার্পল', 'গ্রিন'], ARRAY['স্ট্যান্ডার্ড']),

('ব্লুটুথ স্পিকার মিনি', 'পোর্টেবল ব্লুটুথ স্পিকার ক্রিস্টাল ক্লিয়ার সাউন্ড। ওয়াটারপ্রুফ এবং ১২ ঘণ্টা ব্যাটারি লাইফ।', 2200.00, 1650.00, ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400'], (SELECT id FROM categories WHERE name = 'ইলেকট্রনিক্স'), 45, ARRAY['কালো', 'সাদা', 'লাল'], ARRAY['স্ট্যান্ডার্ড']);

-- Add category images
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400' WHERE name = 'ইলেকট্রনিক্স';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' WHERE name = 'ফ্যাশন';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400' WHERE name = 'হোম অ্যান্ড গার্ডেন';
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' WHERE name = 'স্পোর্টস';