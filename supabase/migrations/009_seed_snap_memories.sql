-- ============================================================
-- The Snap Legacy ERP — Migration 009
-- Seed Data for Snap Memories Dedicated Studio Workspace
-- Services, Packages, Client Profiles, Sessions, Quotes,
-- Proofing Galleries, Selections, Tasks, Reminders, and Expenses
-- STRICTLY EXCLUDED: Maternity, Wedding
-- ============================================================

DO $$
DECLARE
  v_brand_id UUID := 'b0000000-0000-0000-0000-000000000004'; -- Snap Memories
  v_user_admin_id UUID := '00000000-0000-0000-0000-000000000001';

  -- Services
  v_svc_newborn_id UUID;
  v_svc_milestone_id UUID;
  v_svc_cakesmash_id UUID;
  v_svc_birthday_id UUID;
  v_svc_family_id UUID;
  v_svc_lifestyle_id UUID;

  -- Packages
  v_pkg_beginnings_id UUID;
  v_pkg_smash_deluxe_id UUID;
  v_pkg_heritage_id UUID;

  -- Clients
  v_client_sara_id UUID;
  v_client_ayesha_id UUID;
  v_client_zainab_id UUID;

  -- Sessions & Projects
  v_proj_ayesha_id UUID;
  v_proj_zainab_id UUID;
  v_sess_ayesha_id UUID;
  v_sess_zainab_id UUID;

  -- Quotes
  v_quote_ayesha_id UUID;
  v_quote_zainab_id UUID;

  -- Gallery & Selection
  v_gallery_zainab_id UUID;
BEGIN
  -- 1. SEED STUDIO SERVICES (STRICTLY NO MATERNITY / NO WEDDINGS)
  INSERT INTO memories_services (id, brand_id, name, slug, category, description, session_duration_minutes, included_photos, default_price, pricing_type)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Pure Newborn Studio Session', 'pure-newborn-session', 'Newborn', 'Tender posing within first 14 days, temperature-regulated soft light studio, sanitized organic wraps & props', 120, 20, 45000, 'package')
    RETURNING id INTO v_svc_newborn_id;

  INSERT INTO memories_services (id, brand_id, name, slug, category, description, session_duration_minutes, included_photos, default_price, pricing_type)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Baby Milestone Portrait Session (3–9 Months)', 'baby-milestone-portrait', 'Baby Milestone', 'Capturing tummy time, rolling, first giggles, and sitting milestones with soft textured backdrops', 60, 15, 30000, 'fixed')
    RETURNING id INTO v_svc_milestone_id;

  INSERT INTO memories_services (id, brand_id, name, slug, category, description, session_duration_minutes, included_photos, default_price, pricing_type)
  VALUES
    (uuid_generate_v4(), v_brand_id, '1st Birthday Cake Smash & Splash', 'cake-smash-splash', 'Cake Smash', 'Custom theme backdrop, artisanal eggless smash cake, candid messy play, followed by a warm bubble bath splash', 90, 25, 50000, 'package')
    RETURNING id INTO v_svc_cakesmash_id;

  INSERT INTO memories_services (id, brand_id, name, slug, category, description, session_duration_minutes, included_photos, default_price, pricing_type)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Grand Birthday Celebration Studio Session', 'birthday-celebration-session', 'Birthday', 'High-energy studio portraits with balloon garlands, custom numbering props, and celebration reels', 75, 20, 35000, 'fixed')
    RETURNING id INTO v_svc_birthday_id;

  INSERT INTO memories_services (id, brand_id, name, slug, category, description, session_duration_minutes, included_photos, default_price, pricing_type)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Generations Family Heritage Portrait', 'generations-family-heritage', 'Family', 'Timeless multigenerational family portraits with master lighting, archival retouching, and heirloom prints', 90, 20, 55000, 'fixed')
    RETURNING id INTO v_svc_family_id;

  INSERT INTO memories_services (id, brand_id, name, slug, category, description, session_duration_minutes, included_photos, default_price, pricing_type)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Special Moments & Lifestyle Story', 'special-moments-lifestyle', 'Lifestyle', 'Intimate in-home or outdoor natural light documentary storytelling for couples and families', 90, 25, 40000, 'fixed')
    RETURNING id INTO v_svc_lifestyle_id;

  INSERT INTO memories_services (brand_id, name, slug, category, description, session_duration_minutes, included_photos, default_price, pricing_type)
  VALUES
    (v_brand_id, 'Golden Anniversary Memory Session', 'golden-anniversary-session', 'Anniversary', 'Celebratory couple milestone session highlighting decades of partnership and love', 60, 15, 38000, 'fixed'),
    (v_brand_id, 'Artisanal Handcrafted Velvet Photo Album (10x10)', 'handcrafted-velvet-album', 'Special Moments', 'Italian velvet flush-mount heirloom album with 30 thick lay-flat panoramic pages', 0, 0, 28000, 'custom')
  ON CONFLICT DO NOTHING;

  -- 2. SEED STUDIO PACKAGES
  INSERT INTO memories_packages (id, brand_id, name, slug, session_type, description, base_price, duration_minutes, included_photos, included_reels, prints_included, frames_included, album_included, badge, sort_order)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Little Beginnings Newborn Collection', 'little-beginnings-newborn', 'Newborn', 'Our signature tender newborn journey with sanitized wraps, parent portraits, and keepsake prints', 55000, 120, 25, 1, '5 Archival Matte Prints (8x10)', '1 Classic Wood Frame', NULL, 'Most Loved', 1)
    RETURNING id INTO v_pkg_beginnings_id;

  INSERT INTO memories_packages (id, brand_id, name, slug, session_type, description, base_price, duration_minutes, included_photos, included_reels, prints_included, frames_included, album_included, badge, sort_order)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Milestone & Cake Smash Deluxe', 'milestone-cake-smash-deluxe', 'Cake Smash', 'Complete 1st birthday extravaganza: formal studio portrait, messy cake smash fun, and luxury warm tub splash', 70000, 90, 35, 2, '10 Fine Art Prints (5x7)', '2 Floating Acrylic Frames', 'Keepsake Mini Accordion Book', 'Best Value', 2)
    RETURNING id INTO v_pkg_smash_deluxe_id;

  INSERT INTO memories_packages (id, brand_id, name, slug, session_type, description, base_price, duration_minutes, included_photos, included_reels, prints_included, frames_included, album_included, badge, sort_order)
  VALUES
    (uuid_generate_v4(), v_brand_id, 'Generations Family Heritage Suite', 'generations-family-suite', 'Family', 'Heirloom family session welcoming parents, children, and grandparents with a master flush-mount album', 95000, 120, 40, 1, '12 Velvet Prints (8x12)', '1 Statement Canvas (24x36)', '10x10 Lay-flat Velvet Album', 'Luxury Heirloom', 3)
    RETURNING id INTO v_pkg_heritage_id;

  -- Seed Package Included Items
  IF v_svc_newborn_id IS NOT NULL THEN
    INSERT INTO memories_package_items (package_id, service_id, item_type, name, quantity, unit_price, sort_order)
    VALUES
      (v_pkg_beginnings_id, v_svc_newborn_id, 'session_time', '120-min Temperature Regulated Newborn Studio Coverage', 1, 45000, 1),
      (v_pkg_beginnings_id, NULL, 'reel', 'Emotional 4K Behind-the-Scenes Memory Reel', 1, 10000, 2),
      (v_pkg_beginnings_id, NULL, 'print', '8x10 Archival Fine Art Cotton Prints', 5, 2000, 3);
  END IF;

  -- 3. SEED CLIENTS & PROFILES (Central Clients Master Integration)
  INSERT INTO clients (name, email, phone, company, city, country, type, source, status)
  VALUES ('Dr. Ayesha & Tariq', 'ayesha.tariq@gmail.com', '+92 301 7766554', 'Tariq Household', 'Faisalabad', 'Pakistan', 'individual', 'referral', 'active')
  RETURNING id INTO v_client_ayesha_id;

  INSERT INTO client_brand_associations (client_id, brand_id)
  VALUES (v_client_ayesha_id, v_brand_id)
  ON CONFLICT DO NOTHING;

  INSERT INTO memories_client_profiles (client_id, brand_id, family_name, children_info, special_instructions, allergies_or_sensitivities, status, notes)
  VALUES (v_client_ayesha_id, v_brand_id, 'The Tariq Family', '[{"name": "Baby Rayan", "birth_date": "2026-08-28", "gender": "male", "notes": "Born 3.2 kg, sleeps soundly to white noise"}]'::jsonb, 'Prefers soft neutral tones, cream and sage green wraps', 'None reported', 'vip', 'Referred by Dr. Bilal at Allied Hospital');

  INSERT INTO clients (name, email, phone, company, city, country, type, source, status)
  VALUES ('Zainab Bilal', 'zainab.bilal@outlook.com', '+92 322 4433221', 'Bilal Family', 'Lahore', 'Pakistan', 'individual', 'instagram', 'active')
  RETURNING id INTO v_client_zainab_id;

  INSERT INTO client_brand_associations (client_id, brand_id)
  VALUES (v_client_zainab_id, v_brand_id)
  ON CONFLICT DO NOTHING;

  INSERT INTO memories_client_profiles (client_id, brand_id, family_name, children_info, special_instructions, allergies_or_sensitivities, status, notes)
  VALUES (v_client_zainab_id, v_brand_id, 'The Bilal Family', '[{"name": "Aiza Bilal", "birth_date": "2025-09-18", "gender": "female", "notes": "Turning 1 year old! Loves music and clapping"}]'::jsonb, 'Theme is Pastel Floral & Teddy Bears', 'Dairy sensitivity — requested eggless & dairy-free strawberry cake', 'active', 'Booked Cake Smash Deluxe package');

  INSERT INTO clients (name, email, phone, company, city, country, type, source, status)
  VALUES ('Sara Khan', 'sara.khan@gmail.com', '+92 333 1122334', 'Khan Household', 'Faisalabad', 'Pakistan', 'individual', 'whatsapp', 'active')
  RETURNING id INTO v_client_sara_id;

  INSERT INTO client_brand_associations (client_id, brand_id)
  VALUES (v_client_sara_id, v_brand_id)
  ON CONFLICT DO NOTHING;

  INSERT INTO memories_client_profiles (client_id, brand_id, family_name, children_info, status, notes)
  VALUES (v_client_sara_id, v_brand_id, 'The Khan Family', '[{"name": "Zayd Khan", "birth_date": "2026-03-10", "gender": "male", "notes": "6-month sitter milestone"}]'::jsonb, 'active', 'Inquiry for 6-month baby milestone sitter session');

  -- 4. SEED LEADS
  INSERT INTO memories_leads (brand_id, name, phone, email, source, service_interest, preferred_session_date, preferred_time, child_name, child_age_or_milestone, budget, status)
  VALUES
    (v_brand_id, 'Fatima Noor', '+92 321 9988776', 'fatima.noor@yahoo.com', 'Instagram', 'Baby Milestone', '2026-09-22', 'Morning (11:00 AM)', 'Baby Daniyal', '6 months sitter', 35000, 'NEW'),
    (v_brand_id, 'Usman Ghani', '+92 300 5544332', 'usman.ghani@gmail.com', 'Website', 'Family', '2026-09-28', 'Afternoon (3:00 PM)', 'Family of 8', 'Grandfather 75th Birthday', 60000, 'CONTACTED');

  -- 5. SEED PROJECTS & SESSIONS
  -- Session 1: Baby Rayan Newborn (Confirmed & Completed)
  INSERT INTO projects (brand_id, client_id, name, description, status, start_date, budget, currency)
  VALUES (v_brand_id, v_client_ayesha_id, 'Baby Rayan Newborn Collection', 'Little Beginnings Newborn Collection shoot', 'completed', '2026-09-02', 55000, 'PKR')
  RETURNING id INTO v_proj_ayesha_id;

  INSERT INTO memories_quotes (id, brand_id, client_id, quote_number, access_key, session_type, package_id, subtotal, discount, total_amount, deposit_required, balance_due, valid_until, status, sent_at, viewed_at, accepted_at)
  VALUES
    (uuid_generate_v4(), v_brand_id, v_client_ayesha_id, 'SM-Q-260901', 'acc_key_ayesha_rayan_9283f', 'Newborn', v_pkg_beginnings_id, 55000, 0, 55000, 20000, 0, '2026-09-15', 'accepted', '2026-09-01T10:00:00Z', '2026-09-01T11:15:00Z', '2026-09-01T14:30:00Z')
  RETURNING id INTO v_quote_ayesha_id;

  INSERT INTO memories_quote_items (quote_id, service_name, description, quantity, unit_price, discount_amount, total_price, included_photos, included_prints)
  VALUES
    (v_quote_ayesha_id, 'Little Beginnings Newborn Collection', 'Signature newborn session with 25 master retouched images and 5 fine art prints', 1, 55000, 0, 55000, 25, 5);

  INSERT INTO memories_sessions (id, project_id, client_id, brand_id, package_id, quote_id, title, session_type, session_date, start_time, end_time, location, studio_room, booking_status, shoot_day_status, status, child_info, completed_at)
  VALUES
    (uuid_generate_v4(), v_proj_ayesha_id, v_client_ayesha_id, v_brand_id, v_pkg_beginnings_id, v_quote_ayesha_id, 'Baby Rayan Newborn Session', 'Newborn', '2026-09-02', '10:30:00', '12:30:00', 'Studio Room A', 'Room A — Soft Light Newborn Studio', 'confirmed', 'Shoot Completed', 'in_editing', 'Baby Rayan (8 days old)', '2026-09-02T13:00:00Z')
  RETURNING id INTO v_sess_ayesha_id;

  -- Session 2: Aiza Bilal 1st Birthday Cake Smash (Upcoming Confirmed)
  INSERT INTO projects (brand_id, client_id, name, description, status, start_date, budget, currency)
  VALUES (v_brand_id, v_client_zainab_id, 'Aiza Bilal 1st Birthday Cake Smash Deluxe', 'Custom cake smash and splash setup', 'in_progress', '2026-09-14', 70000, 'PKR')
  RETURNING id INTO v_proj_zainab_id;

  INSERT INTO memories_quotes (id, brand_id, client_id, quote_number, access_key, session_type, package_id, subtotal, discount, total_amount, deposit_required, balance_due, valid_until, status, sent_at, viewed_at, accepted_at)
  VALUES
    (uuid_generate_v4(), v_brand_id, v_client_zainab_id, 'SM-Q-260902', 'acc_key_zainab_aiza_7712b', 'Cake Smash', v_pkg_smash_deluxe_id, 70000, 0, 70000, 25000, 45000, '2026-09-20', 'accepted', '2026-09-04T12:00:00Z', '2026-09-04T13:00:00Z', '2026-09-04T16:20:00Z')
  RETURNING id INTO v_quote_zainab_id;

  INSERT INTO memories_quote_items (quote_id, service_name, description, quantity, unit_price, discount_amount, total_price, included_photos, included_prints)
  VALUES
    (v_quote_zainab_id, 'Milestone & Cake Smash Deluxe', 'Formal studio portrait, pastel floral cake smash, and warm bubble splash', 1, 70000, 0, 70000, 35, 10);

  INSERT INTO memories_sessions (id, project_id, client_id, brand_id, package_id, quote_id, title, session_type, session_date, start_time, end_time, location, studio_room, booking_status, shoot_day_status, status, child_info)
  VALUES
    (uuid_generate_v4(), v_proj_zainab_id, v_client_zainab_id, v_brand_id, v_pkg_smash_deluxe_id, v_quote_zainab_id, 'Aiza Bilal 1st Birthday & Cake Smash', 'Cake Smash', '2026-09-14', '15:00:00', '16:30:00', 'Studio Room B', 'Room B — Celebration & Cake Smash Studio', 'confirmed', 'Scheduled', 'scheduled', 'Aiza Bilal (Turning 1 on Sep 18)')
  RETURNING id INTO v_sess_zainab_id;

  -- 6. SEED BOOKING HOLD
  INSERT INTO memories_booking_holds (session_id, brand_id, client_id, hold_date, start_time, end_time, deposit_required, expires_at, status)
  VALUES
    (v_sess_zainab_id, v_brand_id, v_client_zainab_id, '2026-09-14', '15:00:00', '16:30:00', 25000, '2026-09-10T18:00:00Z', 'confirmed');

  -- 7. SEED PROOFING GALLERY & SELECTION
  INSERT INTO memories_galleries (id, session_id, client_id, brand_id, title, access_code, total_photos, max_selections, selection_deadline, status, storage_folder_path)
  VALUES
    (uuid_generate_v4(), v_sess_ayesha_id, v_client_ayesha_id, v_brand_id, 'Baby Rayan Proofing Gallery (Select 25)', 'rayan-proof-2026', 84, 25, '2026-09-16', 'delivered_for_selection', 'rayan_newborn_2026')
  RETURNING id INTO v_gallery_zainab_id;

  -- 8. SEED STUDIO OPERATIONAL TASKS
  INSERT INTO memories_tasks (brand_id, title, description, priority, status, due_date, entity_type, entity_id, automation_key)
  VALUES
    (v_brand_id, 'Order Eggless Strawberry Smash Cake for Aiza Bilal', 'Theme: Pastel Floral with soft pink piping. Confirm eggless dairy-free recipe with Sweet Bakes Kohinoor', 'high', 'todo', '2026-09-13', 'session', v_sess_zainab_id, 'cake_smash_order_sess_zainab'),
    (v_brand_id, 'Sanitize Newborn Soft Wraps & Heating Lamps', 'Prepare Room A for upcoming sessions with washed organic cotton wraps', 'normal', 'completed', '2026-09-02', 'session', v_sess_ayesha_id, 'prep_room_a_sess_ayesha'),
    (v_brand_id, 'Follow up with Fatima Noor on WhatsApp', 'Inquired for 6-month milestone session, share pricing portfolio', 'high', 'todo', '2026-09-09', 'lead', NULL, 'lead_fatima_noor_followup');

  -- 9. SEED REMINDERS
  INSERT INTO memories_reminders (session_id, client_id, brand_id, reminder_type, scheduled_for, status, message)
  VALUES
    (v_sess_zainab_id, v_client_zainab_id, v_brand_id, '7_days_before', '2026-09-07', 'sent', 'Assalamualaikum Zainab! Your Snap Memories cake smash session is in 7 days. Here is our shoot preparation guide ❤️'),
    (v_sess_zainab_id, v_client_zainab_id, v_brand_id, '3_days_before', '2026-09-11', 'upcoming', 'Dear Zainab, 3 days to go! Quick reminder to bring an extra outfit for after the cake smash splash.'),
    (v_sess_zainab_id, v_client_zainab_id, v_brand_id, '1_day_before', '2026-09-13', 'upcoming', 'See you tomorrow at 3:00 PM in Room B! Please ensure baby Aiza has had a good nap.');

  -- 10. SEED DIRECT EXPENSES
  INSERT INTO memories_expenses (brand_id, session_id, category, description, amount, currency, date, vendor, status)
  VALUES
    (v_brand_id, v_sess_ayesha_id, 'Studio Props & Sets', 'Organic mohair bonnet and miniature vintage wooden posing bed', 6500, 'PKR', '2026-09-01', 'Artisan Newborn Props UK / Local Import', 'paid'),
    (v_brand_id, v_sess_zainab_id, 'Cake & Edibles', 'Artisanal eggless pastel drip smash cake with edible flowers', 4500, 'PKR', '2026-09-06', 'Sweet Treats Kohinoor', 'paid');

END $$;
