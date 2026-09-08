-- ============================================================
-- The Snap Legacy ERP — Migration 007
-- Seed Data for The Snap Agency Workspace:
-- Services, Packages, Client Profiles, Retainers, Campaigns,
-- Content Calendar, Creative Tasks, Approvals, and Deliverables
-- ============================================================

DO $$
DECLARE
  v_brand_id UUID := 'b0000000-0000-0000-0000-000000000003'; -- The Snap Agency
  v_user_admin_id UUID := '00000000-0000-0000-0000-000000000001';
  
  -- Services
  v_smm_id UUID;
  v_meta_ads_id UUID;
  v_brand_id_svc UUID;
  v_reels_id UUID;
  v_web_id UUID;
  
  -- Packages
  v_pkg_starter_id UUID;
  v_pkg_growth_id UUID;
  v_pkg_trans_id UUID;
  
  -- Clients
  v_client_bp_id UUID;
  v_client_gch_id UUID;
  v_client_linker_id UUID;
  
  -- Projects & Retainers
  v_proj_bp_id UUID;
  v_proj_linker_id UUID;
  v_ret_bp_id UUID;
  
  -- Campaign & Content
  v_camp_bp_id UUID;
  v_content_1_id UUID;
BEGIN
  -- 1. SEED AGENCY SERVICES
  INSERT INTO agency_services (id, brand_id, name, slug, category, description, default_price, pricing_type, status)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Social Media Management', 'social-media-management', 'Social Media Management', 'Monthly content planning, scheduling, copywriting, and active community engagement', 55000, 'monthly', 'active')
    RETURNING id INTO v_smm_id;

  INSERT INTO agency_services (id, brand_id, name, slug, category, description, default_price, pricing_type, status)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Meta Ads & Media Buying', 'meta-ads-media-buying', 'Paid Advertising', 'Full-funnel Meta ad management (Facebook & Instagram), creative testing, and ROAS optimization', 45000, 'monthly', 'active')
    RETURNING id INTO v_meta_ads_id;

  INSERT INTO agency_services (id, brand_id, name, slug, category, description, default_price, pricing_type, status)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Complete Brand Identity System', 'complete-brand-identity', 'Branding', 'Logo system, brand guidelines book, visual architecture, color palettes, and typography hierarchy', 120000, 'fixed', 'active')
    RETURNING id INTO v_brand_id_svc;

  INSERT INTO agency_services (id, brand_id, name, slug, category, description, default_price, pricing_type, status)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Reels & TikTok Video Production', 'reels-tiktok-production', 'Video Production', 'Short-form viral vertical video scripting, filming, dynamic captions, and color grading', 65000, 'monthly', 'active')
    RETURNING id INTO v_reels_id;

  INSERT INTO agency_services (id, brand_id, name, slug, category, description, default_price, pricing_type, status)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Website Design & Web App Development', 'web-design-development', 'Website Development', 'Modern responsive website built with Next.js, interactive UI, and conversion-focused design', 150000, 'fixed', 'active')
    RETURNING id INTO v_web_id;

  INSERT INTO agency_services (brand_id, name, slug, category, description, default_price, pricing_type, status)
  VALUES
    (v_brand_id, 'Search Engine Optimization (SEO)', 'seo-services', 'SEO', 'Technical SEO audit, keyword strategy, backlink acquisition, and Google rank tracking', 40000, 'monthly', 'active'),
    (v_brand_id, 'Commercial Product Photography', 'product-photography', 'Content Creation', 'Studio and lifestyle photography for ecommerce, retail packaging, and print media', 60000, 'fixed', 'active'),
    (v_brand_id, 'Creative Copywriting & Content', 'copywriting-content', 'Content Creation', 'Sales copy, website content, ad scripts, email marketing newsletters, and taglines', 35000, 'monthly', 'active'),
    (v_brand_id, 'Google Ads & PPC Search Campaigns', 'google-ads-ppc', 'Paid Advertising', 'Google Search, Shopping, and YouTube Ads targeting high-intent commercial keywords', 50000, 'monthly', 'active'),
    (v_brand_id, 'Creative Strategy & Consulting', 'creative-strategy', 'Creative Strategy', 'Market repositioning, brand roadmap, audience discovery, and competitive benchmarking', 75000, 'fixed', 'active')
  ON CONFLICT DO NOTHING;

  -- 2. SEED AGENCY PACKAGES
  INSERT INTO agency_packages (id, brand_id, name, slug, description, price, badge, billing_interval, features_json, sort_order)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Social Media Starter', 'social-media-starter', 'Ideal for local businesses establishing a consistent, aesthetic social presence', 65000, 'Popular', 'monthly',
     '["12 Custom Designed Posts / Month", "4 Short-form Reels / TikToks", "Content Calendar & Monthly Strategy", "Captions & Strategic Hashtags", "Meta Ads Setup & Basic Retargeting", "Monthly Performance KPI Report"]'::jsonb, 1)
    RETURNING id INTO v_pkg_starter_id;

  INSERT INTO agency_packages (id, brand_id, name, slug, description, price, badge, billing_interval, features_json, sort_order)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Performance Growth Suite', 'performance-growth-suite', 'Aggressive media buying, creative production, and revenue scaling for ambitious brands', 140000, 'Best Value', 'monthly',
     '["20 Premium Visual Feed Posts / Carousels", "10 High-Energy Reels / Video Ads", "Full Meta Ads & Google PPC Management", "Advanced Audience Funnel & ROAS Tracking", "Dedicated Account Manager & Weekly Standup", "24/7 Client Review Portal Access"]'::jsonb, 2)
    RETURNING id INTO v_pkg_growth_id;

  INSERT INTO agency_packages (id, brand_id, name, slug, description, price, badge, billing_interval, features_json, sort_order)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Complete Brand Transformation', 'brand-transformation-package', 'End-to-end brand overhaul from identity to website and nationwide launch campaign', 250000, 'Enterprise', 'one_off',
     '["Comprehensive Logo & Typography System", "60-Page Master Brand Guidelines Book", "Full Next.js Custom Website", "Complete Collateral & Packaging Design", "Teaser & Launch Campaign Strategy", "Raw Vector Assets & Cloud Vault Delivery"]'::jsonb, 3)
    RETURNING id INTO v_pkg_trans_id;

  -- Seed Package Items
  IF v_smm_id IS NOT NULL AND v_meta_ads_id IS NOT NULL THEN
    INSERT INTO agency_package_items (package_id, service_id, quantity, unit_price, discount, sort_order)
    VALUES
      (v_pkg_starter_id, v_smm_id, 1, 55000, 5000, 1),
      (v_pkg_starter_id, v_meta_ads_id, 1, 45000, 30000, 2),
      (v_pkg_growth_id, v_smm_id, 1, 55000, 0, 1),
      (v_pkg_growth_id, v_meta_ads_id, 1, 45000, 0, 2),
      (v_pkg_growth_id, v_reels_id, 1, 65000, 25000, 3);
  END IF;

  -- 3. SEED CLIENTS & PROFILES (Using Central Clients Master)
  INSERT INTO clients (name, email, phone, company, city, country, type, source, status)
  VALUES ('Biryani Pizza Co.', 'management@biryanipizza.pk', '+92 321 8887766', 'Biryani Pizza', 'Faisalabad', 'Pakistan', 'company', 'instagram', 'active')
  RETURNING id INTO v_client_bp_id;

  INSERT INTO client_brand_associations (client_id, brand_id)
  VALUES (v_client_bp_id, v_brand_id)
  ON CONFLICT DO NOTHING;

  INSERT INTO agency_client_profiles (client_id, brand_id, company_name, industry, website, monthly_budget, status, notes)
  VALUES (v_client_bp_id, v_brand_id, 'Biryani Pizza Co.', 'Food & Beverage', 'https://biryanipizza.pk', 100000, 'active', 'Fast-casual food fusion concept scaling across Faisalabad & Lahore');

  INSERT INTO clients (name, email, phone, company, city, country, type, source, status)
  VALUES ('GCH Retail & Apparel', 'director@gchretail.com', '+92 300 9998877', 'GCH Retail', 'Lahore', 'Pakistan', 'company', 'referral', 'active')
  RETURNING id INTO v_client_gch_id;

  INSERT INTO client_brand_associations (client_id, brand_id)
  VALUES (v_client_gch_id, v_brand_id)
  ON CONFLICT DO NOTHING;

  INSERT INTO agency_client_profiles (client_id, brand_id, company_name, industry, website, monthly_budget, status, notes)
  VALUES (v_client_gch_id, v_brand_id, 'GCH Retail & Apparel', 'Fashion & Retail', 'https://gchretail.com', 250000, 'active', 'High-street fashion brand with 5 physical outlets and growing ecommerce');

  INSERT INTO clients (name, email, phone, company, city, country, type, source, status)
  VALUES ('Linker Builders & Developers', 'ceo@linkerbuilders.pk', '+92 333 4445566', 'Linker Builders', 'Islamabad', 'Pakistan', 'company', 'direct', 'active')
  RETURNING id INTO v_client_linker_id;

  INSERT INTO client_brand_associations (client_id, brand_id)
  VALUES (v_client_linker_id, v_brand_id)
  ON CONFLICT DO NOTHING;

  INSERT INTO agency_client_profiles (client_id, brand_id, company_name, industry, website, monthly_budget, status, notes)
  VALUES (v_client_linker_id, v_brand_id, 'Linker Builders & Developers', 'Real Estate', 'https://linkerbuilders.pk', 500000, 'active', 'Premium real estate developer launching a commercial plaza in Islamabad');

  -- 4. SEED PROJECTS & RETAINERS
  -- Biryani Pizza Retainer Project
  INSERT INTO projects (brand_id, client_id, name, description, status, start_date, budget, currency)
  VALUES (v_brand_id, v_client_bp_id, 'Biryani Pizza Monthly Social Retainer', 'Full social media management, weekly reels, and Meta ad scaling', 'in_progress', '2026-08-01', 75000, 'PKR')
  RETURNING id INTO v_proj_bp_id;

  INSERT INTO agency_projects (project_id, brand_id, client_id, name, project_type, description, start_date, status, contract_value)
  VALUES (v_proj_bp_id, v_brand_id, v_client_bp_id, 'Biryani Pizza Monthly Social Retainer', 'retainer', 'Full social media management, weekly reels, and Meta ad scaling', '2026-08-01', 'active', 75000);

  INSERT INTO agency_retainers (id, client_id, project_id, brand_id, retainer_name, monthly_value, currency, start_date, billing_day, renewal_type, status)
  VALUES (uuid_generate_v4(), v_client_bp_id, v_proj_bp_id, v_brand_id, 'Biryani Pizza Social & Media Retainer', 75000, 'PKR', '2026-08-01', 1, 'auto_renew', 'active')
  RETURNING id INTO v_ret_bp_id;

  -- Retainer Cycles (Aug 2026 closed, Sept 2026 active)
  INSERT INTO agency_retainer_cycles (retainer_id, brand_id, cycle_month, revenue_amount, cost_amount, status, notes, closed_at)
  VALUES
    (v_ret_bp_id, v_brand_id, '2026-08-01', 75000, 22000, 'closed', 'August billing completed and paid in full', '2026-08-31T23:59:59Z'),
    (v_ret_bp_id, v_brand_id, '2026-09-01', 75000, 18500, 'active', 'September campaign cycle currently running', NULL);

  -- Linker Builders Fixed Project
  INSERT INTO projects (brand_id, client_id, name, description, status, start_date, end_date, budget, currency)
  VALUES (v_brand_id, v_client_linker_id, 'Linker Heights Commercial Launch Campaign', 'Brand identity, 3D render animations, billboard creatives, and lead generation ads', 'in_progress', '2026-09-01', '2026-11-30', 280000, 'PKR')
  RETURNING id INTO v_proj_linker_id;

  INSERT INTO agency_projects (project_id, brand_id, client_id, name, project_type, description, start_date, end_date, status, contract_value)
  VALUES (v_proj_linker_id, v_brand_id, v_client_linker_id, 'Linker Heights Commercial Launch Campaign', 'project', 'Brand identity, 3D render animations, billboard creatives, and lead generation ads', '2026-09-01', '2026-11-30', 'active', 280000);

  -- 5. SEED CAMPAIGNS & CONTENT
  INSERT INTO agency_campaigns (id, project_id, client_id, brand_id, name, campaign_type, objective, platform, budget, spend, start_date, end_date, status)
  VALUES (uuid_generate_v4(), v_proj_bp_id, v_client_bp_id, v_brand_id, 'Biryani Pizza — Cheesy Biryani Craze 2026', 'Lead Generation', 'Generate 500+ online orders via WhatsApp and web ordering portal', 'Meta Ads', 60000, 24500, '2026-09-05', '2026-09-25', 'Live')
  RETURNING id INTO v_camp_bp_id;

  INSERT INTO agency_content_items (id, campaign_id, project_id, brand_id, title, caption, platform, content_type, scheduled_date, status, media_type)
  VALUES (uuid_generate_v4(), v_camp_bp_id, v_proj_bp_id, v_brand_id, 'Cheesy Biryani Pull — High Angle 4K Reel', 'Can you resist that molten cheese pull on fragrant spiced rice? Tag your food partner! 🔥 #BiryaniPizza #FoodieFaisalabad', 'Instagram', 'Reel', '2026-09-12', 'Approved', 'video')
  RETURNING id INTO v_content_1_id;

  INSERT INTO agency_content_items (campaign_id, project_id, brand_id, title, caption, platform, content_type, scheduled_date, status, media_type)
  VALUES
    (v_camp_bp_id, v_proj_bp_id, v_brand_id, 'Weekend Family Feast Discount Carousel', '3 Medium Pizzas + 2 Royal Biryanis + 1.5L Drink at only PKR 2,499! Swipe for meal breakdown 👉', 'Instagram', 'Carousel', '2026-09-14', 'In Design', 'image'),
    (v_camp_bp_id, v_proj_bp_id, v_brand_id, 'Customer Reactions at Kohinoor Branch', 'We took a camera to our Kohinoor City branch. Here is what first-time diners had to say! 🍕', 'TikTok', 'Video', '2026-09-16', 'Idea', 'video');

  -- 6. SEED CLIENT APPROVAL
  IF v_content_1_id IS NOT NULL THEN
    INSERT INTO agency_approvals (brand_id, project_id, content_item_id, item_type, item_title, status, reviewer_name, reviewer_email, revision_number, feedback_comments, client_action_at)
    VALUES (v_brand_id, v_proj_bp_id, v_content_1_id, 'content', 'Cheesy Biryani Pull — High Angle 4K Reel', 'approved', 'Mr. Bilal Aslam (Brand Lead)', 'management@biryanipizza.pk', 1, 'Looks delicious! Music choice is energetic. Approved for posting.', NOW());
  END IF;

  -- 7. SEED DELIVERABLES
  INSERT INTO agency_deliverables (project_id, brand_id, title, type, version, storage_reference, file_name, file_size, mime_type, status, client_approved)
  VALUES
    (v_proj_linker_id, v_brand_id, 'Linker Heights Master Logo & Vector Suite', 'Logo Package', 'v1.0', 'https://storage.thesnaplegacy.com/agency/linker/logo-suite-v1.zip', 'linker-heights-logo-suite.zip', 45200000, 'application/zip', 'delivered', TRUE),
    (v_proj_bp_id, v_brand_id, 'Biryani Pizza September Content Calendar 2026', 'Social Media Calendar', 'v2.1', 'https://storage.thesnaplegacy.com/agency/bp/sep-calendar.pdf', 'biryani-pizza-sep-2026-calendar.pdf', 8400000, 'application/pdf', 'approved', TRUE);

  -- 8. SEED EXPENSES (Direct Costs)
  INSERT INTO agency_expenses (brand_id, project_id, campaign_id, category, description, amount, currency, date, vendor, status)
  VALUES
    (v_brand_id, v_proj_bp_id, v_camp_bp_id, 'Meta Ads', 'Meta Ad Spend for Biryani Craze WhatsApp Campaign', 15000, 'PKR', '2026-09-06', 'Meta Platforms Ireland', 'paid'),
    (v_brand_id, v_proj_bp_id, NULL, 'Freelancer', 'Food videographer shoot at Kohinoor Branch (4 hours)', 7000, 'PKR', '2026-09-04', 'Ali Raza Cinematics', 'paid'),
    (v_brand_id, v_proj_linker_id, NULL, 'Stock Assets', 'Licensed 3D architectural textures and environmental HDRI maps', 12000, 'PKR', '2026-09-02', 'TurboSquid / Shutterstock', 'paid');

END $$;
