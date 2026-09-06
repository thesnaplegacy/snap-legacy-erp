-- ============================================================
-- The Snap Legacy ERP — Migration 005
-- Seed Data for The Snap Service Workspace:
-- Audited Packages, Team Members, Categories, and Multi-Day Weddings
-- ============================================================

DO $$
DECLARE
  v_brand_id UUID := 'b0000000-0000-0000-0000-000000000002'; -- The Snap Service
  v_client_noor_id UUID;
  v_client_ahmed_id UUID;
  v_wedding_proj_id UUID;
  v_mehndi_func_id UUID;
  v_barat_func_id UUID;
  v_walima_func_id UUID;
  v_quotation_id UUID;
  v_user_admin_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- 1. SEED AUDITED PACKAGES FROM THE SNAP SERVICE
  INSERT INTO packages (brand_id, name, slug, price, badge, featured, image_url, features_json, sort_order)
  VALUES
    (v_brand_id, 'Silver Package', 'silver-package', 180000, 'Popular', FALSE, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500&fit=crop', '["4 Hours Coverage per event", "1 Senior Photographer", "1 Traditional Videographer", "250+ Color Graded Photos", "Highlight Reel (3-4 mins)", "Digital High-Res Online Gallery"]'::jsonb, 1),
    (v_brand_id, 'Gold Package', 'gold-package', 350000, 'Best Value', TRUE, 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500&fit=crop', '["8 Hours Coverage per event", "2 Senior Photographers (Candid + Traditional)", "1 Master Cinematographer + Gimbal", "500+ Retouched & Color Graded Photos", "Cinematic Highlight Film (4-5 mins)", "Full Ceremony Documentary Video", "1 Luxury Leather Album (12x36, 30 pages)", "Online Cloud Delivery + USB Gift Box"]'::jsonb, 2),
    (v_brand_id, 'Platinum Luxury Package', 'platinum-luxury-package', 650000, 'Elite Heritage', FALSE, 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500&fit=crop', '["Full Day Unlimited Coverage (Multi-Day)", "3 Master Photographers (Director + 2 Shooters)", "2 Elite Cinematographers + Gimbal & Slider", "Licensed 4K Aerial Drone Coverage", "All Raw + 1000+ Master Edited Photos", "Cinematic Wedding Teaser (60s) + Highlight (7-10 mins)", "Full Length 4K Master Documentary Film", "2 Royal Acrylic Glass Albums (12x36)", "2 Parent Albums (12x18)", "Complimentary Pre-Wedding Studio Portrait Session"]'::jsonb, 3)
  ON CONFLICT DO NOTHING;

  -- 2. SEED THE SNAP SERVICE SPECIFIC SERVICES IN SERVICE LIBRARY
  INSERT INTO services (brand_id, name, description, base_price, currency, unit, status)
  VALUES
    (v_brand_id, 'Master Wedding Photography', 'Lead candid and traditional photography coverage', 35000, 'PKR', 'per_day', 'active'),
    (v_brand_id, 'Cinematic Videography & Gimbal', 'Full 4K cinematography with motorized stabilization', 45000, 'PKR', 'per_day', 'active'),
    (v_brand_id, 'Aerial Drone Coverage (4K)', 'Licensed drone pilot aerial cinematics', 25000, 'PKR', 'per_event', 'active'),
    (v_brand_id, 'Wedding Highlight Film (5 mins)', 'Artistic narrative video edited with licensed music', 30000, 'PKR', 'per_project', 'active'),
    (v_brand_id, 'Full-Length Ceremony Documentary', 'Complete chronological wedding coverage', 25000, 'PKR', 'per_project', 'active'),
    (v_brand_id, 'Luxury Wedding Album (12x36 Leather)', 'Handcrafted 30-page panoramic flush mount album', 35000, 'PKR', 'per_album', 'active'),
    (v_brand_id, 'Acrylic Glass Premium Album (12x36)', 'Diamond polished crystal front with Italian velvet spine', 55000, 'PKR', 'per_album', 'active'),
    (v_brand_id, 'Same-Day Edit (SDE Teaser)', 'Quick turnaround teaser played at dinner/reception', 25000, 'PKR', 'per_event', 'active'),
    (v_brand_id, 'Additional Coverage Hours', 'Overtime coverage per photographer/videographer', 5000, 'PKR', 'per_hour', 'active'),
    (v_brand_id, 'Studio Pre-Wedding Portraiture', 'Professional studio portrait session with makeup lighting', 30000, 'PKR', 'per_session', 'active')
  ON CONFLICT DO NOTHING;

  -- 3. CLIENT: Miss Noor Fatima
  INSERT INTO clients (name, email, phone, city, country, type, source, status)
  VALUES ('Miss Noor Fatima', 'noor.fatima@example.com', '+92 300 1234567', 'Faisalabad', 'Pakistan', 'individual', 'instagram', 'active')
  RETURNING id INTO v_client_noor_id;

  INSERT INTO client_brand_associations (client_id, brand_id)
  VALUES (v_client_noor_id, v_brand_id)
  ON CONFLICT DO NOTHING;

  -- 4. MASTER WEDDING PROJECT: Wedding Project #1024 — Noor & Hamza Grand Wedding
  INSERT INTO projects (brand_id, client_id, name, description, status, start_date, end_date, budget, currency)
  VALUES (
    v_brand_id,
    v_client_noor_id,
    'Wedding Project #1024 — Noor & Hamza Grand Wedding',
    '3-Day Destination Wedding in Faisalabad & Lahore: Mehndi, Barat & Walima',
    'in_progress',
    '2026-09-18',
    '2026-09-20',
    550000,
    'PKR'
  )
  RETURNING id INTO v_wedding_proj_id;

  -- 5. MULTI-DAY WEDDING FUNCTIONS
  -- Function 1: Mehndi
  INSERT INTO event_functions (
    project_id, brand_id, function_name, function_type, function_date,
    start_time, end_time, venue, city, coverage_hours, status, notes
  ) VALUES (
    v_wedding_proj_id, v_brand_id, 'Mehndi Night', 'mehndi', '2026-09-18',
    '19:00', '01:00', 'Serena Hotel Marquee', 'Faisalabad', 6.0, 'upcoming',
    'Colorful vibrance, candid dance performances, bride entrance with smoke flares'
  ) RETURNING id INTO v_mehndi_func_id;

  -- Function 2: Barat
  INSERT INTO event_functions (
    project_id, brand_id, function_name, function_type, function_date,
    start_time, end_time, venue, city, coverage_hours, status, notes
  ) VALUES (
    v_wedding_proj_id, v_brand_id, 'Barat Ceremony', 'barat', '2026-09-19',
    '18:30', '00:30', 'Chenab Club Lawn 1', 'Faisalabad', 6.0, 'upcoming',
    'Traditional royal theme, groom procession, emotional rukhsati cinematics'
  ) RETURNING id INTO v_barat_func_id;

  -- Function 3: Walima
  INSERT INTO event_functions (
    project_id, brand_id, function_name, function_type, function_date,
    start_time, end_time, venue, city, coverage_hours, status, notes
  ) VALUES (
    v_wedding_proj_id, v_brand_id, 'Walima Reception', 'walima', '2026-09-20',
    '19:30', '01:00', 'PC Hotel Grand Ballroom', 'Lahore', 5.5, 'upcoming',
    'Elegant modern pastel decor, family formal portraits, couple photoshoot in gardens'
  ) RETURNING id INTO v_walima_func_id;

  -- 6. TEAM ASSIGNMENTS & COSTS (With Team Member & Freelancers)
  -- Mehndi Team
  INSERT INTO event_team_assignments (project_id, function_id, brand_id, role, person_name, call_time, end_time, location, agreed_cost, is_freelancer, payment_status)
  VALUES
    (v_wedding_proj_id, v_mehndi_func_id, v_brand_id, 'lead_photographer', 'Zunair Ahmad', '2026-09-18 18:30:00+05', '2026-09-19 01:30:00+05', 'Serena Marquee, Faisalabad', 20000, FALSE, 'unpaid'),
    (v_wedding_proj_id, v_mehndi_func_id, v_brand_id, 'cinematographer', 'Shahid Jugnu', '2026-09-18 18:30:00+05', '2026-09-19 01:30:00+05', 'Serena Marquee, Faisalabad', 22000, FALSE, 'unpaid'),
    (v_wedding_proj_id, v_mehndi_func_id, v_brand_id, 'drone_operator', 'Kamran Ali (Freelancer)', '2026-09-18 19:00:00+05', '2026-09-18 23:00:00+05', 'Serena Marquee, Faisalabad', 15000, TRUE, 'unpaid');

  -- Barat Team
  INSERT INTO event_team_assignments (project_id, function_id, brand_id, role, person_name, call_time, end_time, location, agreed_cost, is_freelancer, payment_status)
  VALUES
    (v_wedding_proj_id, v_barat_func_id, v_brand_id, 'lead_photographer', 'Zunair Ahmad', '2026-09-19 18:00:00+05', '2026-09-20 01:00:00+05', 'Chenab Club, Faisalabad', 20000, FALSE, 'unpaid'),
    (v_wedding_proj_id, v_barat_func_id, v_brand_id, 'candid_photographer', 'Umair Jabbar', '2026-09-19 18:00:00+05', '2026-09-20 01:00:00+05', 'Chenab Club, Faisalabad', 18000, FALSE, 'unpaid'),
    (v_wedding_proj_id, v_barat_func_id, v_brand_id, 'cinematographer', 'Shahid Jugnu', '2026-09-19 18:00:00+05', '2026-09-20 01:00:00+05', 'Chenab Club, Faisalabad', 22000, FALSE, 'unpaid');

  -- Walima Team (Lahore)
  INSERT INTO event_team_assignments (project_id, function_id, brand_id, role, person_name, call_time, end_time, location, agreed_cost, is_freelancer, payment_status)
  VALUES
    (v_wedding_proj_id, v_walima_func_id, v_brand_id, 'lead_photographer', 'Muhammad Arif', '2026-09-20 19:00:00+05', '2026-09-21 01:30:00+05', 'PC Hotel, Lahore', 20000, FALSE, 'unpaid'),
    (v_wedding_proj_id, v_walima_func_id, v_brand_id, 'cinematographer', 'Shahid Jugnu', '2026-09-20 19:00:00+05', '2026-09-21 01:30:00+05', 'PC Hotel, Lahore', 22000, FALSE, 'unpaid');

  -- 7. EVENT COSTS (Freelancers, travel, accommodation, album printing)
  INSERT INTO event_costs (project_id, function_id, brand_id, category, description, amount, payment_status)
  VALUES
    (v_wedding_proj_id, v_mehndi_func_id, v_brand_id, 'drone', 'Drone Operator Freelance Fee — Kamran Ali', 15000, 'pending'),
    (v_wedding_proj_id, v_walima_func_id, v_brand_id, 'travel', 'Crew Fuel & Motorway Tolls (FSD -> LHR return)', 18000, 'paid'),
    (v_wedding_proj_id, v_walima_func_id, v_brand_id, 'accommodation', 'Crew Overnight Hotel Rooms in Lahore', 22000, 'paid'),
    (v_wedding_proj_id, NULL, v_brand_id, 'album_printing', 'Luxury Acrylic Album Printing & Binding Vendor', 28000, 'pending');

  -- 8. EDITING PIPELINE TASKS
  INSERT INTO editing_tasks (project_id, function_id, brand_id, title, deliverable_type, editor_name, deadline, status, priority)
  VALUES
    (v_wedding_proj_id, v_mehndi_func_id, v_brand_id, 'Mehndi Photo Curation & Color Grade', 'photo_color_correction', 'Umair Jabbar', '2026-09-28', 'editing_assigned', 'medium'),
    (v_wedding_proj_id, v_barat_func_id, v_brand_id, 'Barat Cinematic Highlight Film Edit', 'highlight_film', 'Shahid Jugnu', '2026-10-05', 'files_received', 'high'),
    (v_wedding_proj_id, v_walima_func_id, v_brand_id, 'Walima Full Length Ceremony Master', 'full_video', 'Bilal Tariq', '2026-10-15', 'not_started', 'medium');

  -- 9. DELIVERABLES
  INSERT INTO event_deliverables (project_id, brand_id, title, type, storage_reference, status, deadline)
  VALUES
    (v_wedding_proj_id, v_brand_id, 'Master Wedding Gallery (800+ Photos)', 'edited_photos', 's3://snap-service-deliverables/2026/noor-hamza-wedding/photos/', 'in_production', '2026-10-10'),
    (v_wedding_proj_id, v_brand_id, 'Cinematic Highlight Film (4K)', 'highlight_film', 's3://snap-service-deliverables/2026/noor-hamza-wedding/highlight/', 'in_production', '2026-10-15'),
    (v_wedding_proj_id, v_brand_id, 'Royal Acrylic Wedding Album (12x36)', 'album', 'local://faisalabad-vault/albums/noor-hamza.pdf', 'pending', '2026-11-01');

  -- 10. ALBUM ORDER
  INSERT INTO album_orders (project_id, client_id, brand_id, album_title, album_size, cover_type, pages_count, printing_cost, selling_price, status)
  VALUES (
    v_wedding_proj_id, v_client_noor_id, v_brand_id, 'Noor & Hamza — The Royal Story',
    '12x36', 'acrylic_glass', 34, 28000, 55000, 'pending_selection'
  );

  -- 11. HISTORICAL QUOTATION WITH SNAPSHOT PRICING
  INSERT INTO quotations (brand_id, client_id, project_id, quotation_number, amount, total_amount, status, valid_until, notes)
  VALUES (
    v_brand_id, v_client_noor_id, v_wedding_proj_id, 'QT-SRV-2026-1024',
    550000, 550000, 'accepted', '2026-09-01',
    'All-inclusive 3-day wedding coverage package with complimentary drone & luxury acrylic album'
  ) RETURNING id INTO v_quotation_id;

  INSERT INTO quotation_items (quotation_id, function_id, service_name, unit_price, quantity, discount_amount, total_price, sort_order)
  VALUES
    (v_quotation_id, v_mehndi_func_id, 'Mehndi Night — Dual Camera Coverage & Highlights', 140000, 1, 0, 140000, 1),
    (v_quotation_id, v_barat_func_id, 'Barat Ceremony — 3 Camera Team + Drone + Gimbal', 220000, 1, 0, 220000, 2),
    (v_quotation_id, v_walima_func_id, 'Walima Reception — Dual Camera Coverage (Lahore)', 150000, 1, 0, 150000, 3),
    (v_quotation_id, NULL, 'Royal Acrylic Glass Album (12x36, 34 pages)', 55000, 1, 15000, 40000, 4);

  -- 12. ADVANCE PAYMENT RECORDED & SYNCED TO CENTRAL TRANSACTIONS
  INSERT INTO payments (brand_id, client_id, project_id, amount, payment_method, status, due_date, paid_at, notes)
  VALUES (
    v_brand_id, v_client_noor_id, v_wedding_proj_id,
    250000, 'bank_transfer', 'paid', '2026-08-15', '2026-08-15 14:30:00+05',
    'Advance booking deposit (50%) for Noor & Hamza 3-day wedding'
  );

  INSERT INTO financial_transactions (brand_id, client_id, project_id, type, amount, currency, date, description, reference)
  VALUES (
    v_brand_id, v_client_noor_id, v_wedding_proj_id,
    'credit', 250000, 'PKR', '2026-08-15',
    'The Snap Service — Advance Payment received for Noor & Hamza Wedding', 'TX-SRV-2026-001'
  );

END $$;
