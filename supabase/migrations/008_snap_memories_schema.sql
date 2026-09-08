-- ============================================================
-- The Snap Legacy ERP — Migration 008
-- Snap Memories Schema: Dedicated Studio Operating System
-- Newborn, Baby Milestone, Cake Smash, Birthday, Family,
-- Anniversary, Special Moments & Lifestyle Sessions
-- STRICTLY EXCLUDED: Maternity, Wedding
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure updated_at trigger function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. STUDIO SERVICES CATALOG
CREATE TABLE IF NOT EXISTS memories_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Newborn', 'Baby Milestone', 'Cake Smash', 'Birthday',
    'Family', 'Anniversary', 'Special Moments', 'Lifestyle', 'Custom Session'
  )),
  description TEXT,
  session_duration_minutes INT NOT NULL DEFAULT 60,
  included_photos INT NOT NULL DEFAULT 15,
  default_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'PKR',
  pricing_type TEXT NOT NULL DEFAULT 'fixed' CHECK (pricing_type IN ('fixed', 'custom', 'package')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_services_brand ON memories_services(brand_id);
CREATE INDEX IF NOT EXISTS idx_mem_services_cat ON memories_services(category);
CREATE INDEX IF NOT EXISTS idx_mem_services_active ON memories_services(is_active);

-- 2. STUDIO PACKAGES
CREATE TABLE IF NOT EXISTS memories_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN (
    'Newborn', 'Baby Milestone', 'Cake Smash', 'Birthday',
    'Family', 'Anniversary', 'Special Moments', 'Lifestyle', 'Custom Session'
  )),
  description TEXT,
  base_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'PKR',
  duration_minutes INT NOT NULL DEFAULT 90,
  included_photos INT NOT NULL DEFAULT 25,
  included_reels INT NOT NULL DEFAULT 1,
  prints_included TEXT,
  frames_included TEXT,
  album_included TEXT,
  badge TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_packages_brand ON memories_packages(brand_id);
CREATE INDEX IF NOT EXISTS idx_mem_packages_type ON memories_packages(session_type);

-- 3. PACKAGE INCLUDED ITEMS
CREATE TABLE IF NOT EXISTS memories_package_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES memories_packages(id) ON DELETE CASCADE,
  service_id UUID REFERENCES memories_services(id) ON DELETE SET NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('session_time', 'retouched_photos', 'reel', 'print', 'frame', 'album', 'add_on')),
  name TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_package_items_pkg ON memories_package_items(package_id);

-- 4. STUDIO CLIENT PROFILES (CRM Extension linked to Central Clients Master)
CREATE TABLE IF NOT EXISTS memories_client_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  family_name TEXT,
  children_info JSONB DEFAULT '[]'::jsonb, -- Array of { name: text, birth_date: date, gender: text, notes: text }
  anniversary_date DATE,
  preferred_photographer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  special_instructions TEXT,
  allergies_or_sensitivities TEXT, -- Crucial for cake smash & newborn sessions
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'vip')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(client_id, brand_id)
);

CREATE INDEX IF NOT EXISTS idx_mem_client_profiles_client ON memories_client_profiles(client_id);
CREATE INDEX IF NOT EXISTS idx_mem_client_profiles_brand ON memories_client_profiles(brand_id);

-- 5. STUDIO LEADS / CRM
CREATE TABLE IF NOT EXISTS memories_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT NOT NULL CHECK (source IN (
    'Website', 'WhatsApp', 'Instagram', 'Facebook', 'Referral', 'Google', 'Walk-in', 'Repeat Client', 'Other'
  )),
  service_interest TEXT NOT NULL CHECK (service_interest IN (
    'Newborn', 'Baby Milestone', 'Cake Smash', 'Birthday',
    'Family', 'Anniversary', 'Special Moments', 'Lifestyle', 'Custom Session'
  )),
  preferred_session_date DATE,
  preferred_time TEXT,
  child_name TEXT,
  child_age_or_milestone TEXT,
  budget DECIMAL(15,2),
  notes TEXT,
  assigned_staff_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN (
    'NEW', 'CONTACTED', 'QUALIFIED', 'QUOTE_SENT', 'FOLLOW_UP', 'CONVERTED', 'LOST'
  )),
  converted_client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  lost_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_leads_brand ON memories_leads(brand_id);
CREATE INDEX IF NOT EXISTS idx_mem_leads_status ON memories_leads(status);
CREATE INDEX IF NOT EXISTS idx_mem_leads_phone ON memories_leads(phone);

-- 6. STUDIO SESSIONS (Operational Record linked to Central Projects & Clients)
CREATE TABLE IF NOT EXISTS memories_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  package_id UUID REFERENCES memories_packages(id) ON DELETE SET NULL,
  quote_id UUID, -- Foreign key added below after memories_quotes definition
  title TEXT NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN (
    'Newborn', 'Baby Milestone', 'Cake Smash', 'Birthday',
    'Family', 'Anniversary', 'Special Moments', 'Lifestyle', 'Custom Session'
  )),
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL DEFAULT 'Studio Room A',
  studio_room TEXT DEFAULT 'Room A — Soft Light Studio',
  assigned_photographer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_assistant_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_editor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  booking_status TEXT NOT NULL DEFAULT 'hold' CHECK (booking_status IN ('hold', 'confirmed', 'released', 'expired', 'cancelled')),
  shoot_day_status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (shoot_day_status IN (
    'Scheduled', 'Team Ready', 'Client Arrived', 'Shoot Started', 'Shoot Completed'
  )),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN (
    'scheduled', 'in_progress', 'completed', 'in_editing', 'delivered', 'cancelled'
  )),
  pre_shoot_checklist JSONB DEFAULT '{
    "equipment_ready": false,
    "studio_ready": false,
    "props_ready": false,
    "client_contacted": false,
    "session_requirements_confirmed": false,
    "team_checked_in": false,
    "files_backed_up": false
  }'::jsonb,
  child_info TEXT,
  shoot_day_notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_sessions_date ON memories_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_mem_sessions_photog ON memories_sessions(assigned_photographer_id);
CREATE INDEX IF NOT EXISTS idx_mem_sessions_status ON memories_sessions(status);
CREATE INDEX IF NOT EXISTS idx_mem_sessions_brand ON memories_sessions(brand_id);
CREATE INDEX IF NOT EXISTS idx_mem_sessions_client ON memories_sessions(client_id);

-- 7. BOOKING HOLDS
CREATE TABLE IF NOT EXISTS memories_booking_holds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES memories_sessions(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  photographer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  hold_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  deposit_required DECIMAL(15,2) NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'hold' CHECK (status IN ('hold', 'confirmed', 'released', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_holds_date ON memories_booking_holds(hold_date);
CREATE INDEX IF NOT EXISTS idx_mem_holds_status ON memories_booking_holds(status);

-- 8. STUDIO QUOTATIONS & PUBLIC TOKEN ACCESS
CREATE TABLE IF NOT EXISTS memories_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  session_id UUID REFERENCES memories_sessions(id) ON DELETE SET NULL,
  quote_number TEXT NOT NULL UNIQUE,
  access_key TEXT NOT NULL UNIQUE, -- High entropy crypto access key for /quote/[accessKey]
  session_type TEXT NOT NULL CHECK (session_type IN (
    'Newborn', 'Baby Milestone', 'Cake Smash', 'Birthday',
    'Family', 'Anniversary', 'Special Moments', 'Lifestyle', 'Custom Session'
  )),
  package_id UUID REFERENCES memories_packages(id) ON DELETE SET NULL,
  subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
  discount DECIMAL(15,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  deposit_required DECIMAL(15,2) NOT NULL DEFAULT 0,
  balance_due DECIMAL(15,2) NOT NULL DEFAULT 0,
  valid_until DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired', 'cancelled'
  )),
  client_notes TEXT,
  internal_notes TEXT,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  client_signature TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_quotes_client ON memories_quotes(client_id);
CREATE INDEX IF NOT EXISTS idx_mem_quotes_status ON memories_quotes(status);
CREATE INDEX IF NOT EXISTS idx_mem_quotes_token ON memories_quotes(access_key);

-- Link memories_sessions.quote_id foreign key
ALTER TABLE memories_sessions
  ADD CONSTRAINT fk_mem_sessions_quote
  FOREIGN KEY (quote_id) REFERENCES memories_quotes(id) ON DELETE SET NULL;

-- 9. QUOTE SNAPSHOT ITEMS (Immutable Historical Pricing)
CREATE TABLE IF NOT EXISTS memories_quote_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES memories_quotes(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  description TEXT,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  included_photos INT DEFAULT 0,
  included_prints INT DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_quote_items_quote ON memories_quote_items(quote_id);

-- 10. STUDIO GALLERIES (Proofing & Final Delivery)
CREATE TABLE IF NOT EXISTS memories_galleries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES memories_sessions(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  access_code TEXT UNIQUE NOT NULL DEFAULT uuid_generate_v4()::text,
  cover_image_url TEXT,
  total_photos INT NOT NULL DEFAULT 0,
  max_selections INT NOT NULL DEFAULT 20,
  selection_deadline DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'delivered_for_selection', 'selection_completed', 'editing_in_progress', 'final_delivered'
  )),
  storage_bucket TEXT NOT NULL DEFAULT 'memories-galleries',
  storage_folder_path TEXT NOT NULL,
  views_count INT NOT NULL DEFAULT 0,
  client_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_galleries_session ON memories_galleries(session_id);
CREATE INDEX IF NOT EXISTS idx_mem_galleries_code ON memories_galleries(access_code);

-- 11. CLIENT SELECTIONS
CREATE TABLE IF NOT EXISTS memories_selections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gallery_id UUID NOT NULL REFERENCES memories_galleries(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  selected_photos JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of photo file keys / filenames
  client_feedback TEXT,
  additional_photos_purchased INT NOT NULL DEFAULT 0,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_selections_gallery ON memories_selections(gallery_id);

-- 12. EDITING PIPELINE
CREATE TABLE IF NOT EXISTS memories_editing_pipeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES memories_sessions(id) ON DELETE CASCADE,
  gallery_id UUID REFERENCES memories_galleries(id) ON DELETE SET NULL,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  editor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN (
    'not_started', 'files_received', 'selecting', 'editing', 'in_review',
    'revision', 'approved', 'ready_for_delivery', 'delivered'
  )),
  photos_count INT NOT NULL DEFAULT 0,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  due_date DATE NOT NULL,
  revision_count INT NOT NULL DEFAULT 0,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_editing_session ON memories_editing_pipeline(session_id);
CREATE INDEX IF NOT EXISTS idx_mem_editing_editor ON memories_editing_pipeline(editor_id);
CREATE INDEX IF NOT EXISTS idx_mem_editing_status ON memories_editing_pipeline(status);

-- 13. STUDIO DELIVERABLES (Asset Registry)
CREATE TABLE IF NOT EXISTS memories_deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES memories_sessions(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  deliverable_type TEXT NOT NULL CHECK (deliverable_type IN (
    'High-Res Photos', 'Web-Size Photos', 'Reel Video', 'Print Files', 'Album Layout', 'Heirloom Frame Master'
  )),
  version TEXT NOT NULL DEFAULT 'v1.0',
  storage_provider TEXT NOT NULL DEFAULT 'supabase_storage',
  bucket TEXT NOT NULL DEFAULT 'memories-deliverables',
  object_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  file_size BIGINT,
  download_url TEXT,
  is_downloadable BOOLEAN NOT NULL DEFAULT TRUE,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_deliv_session ON memories_deliverables(session_id);
CREATE INDEX IF NOT EXISTS idx_mem_deliv_client ON memories_deliverables(client_id);

-- 14. STUDIO OPERATIONAL TASKS
CREATE TABLE IF NOT EXISTS memories_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'cancelled')),
  due_date DATE NOT NULL,
  entity_type TEXT CHECK (entity_type IN ('lead', 'client', 'quote', 'session', 'gallery', 'editing', 'delivery')),
  entity_id UUID,
  automation_key TEXT UNIQUE, -- Deterministic automation key prevents duplicate task creation
  created_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_tasks_status ON memories_tasks(status);
CREATE INDEX IF NOT EXISTS idx_mem_tasks_assignee ON memories_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_mem_tasks_auto ON memories_tasks(automation_key);

-- 15. AUTOMATED REMINDERS (7d, 3d, 1d)
CREATE TABLE IF NOT EXISTS memories_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES memories_sessions(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('7_days_before', '3_days_before', '1_day_before', 'post_delivery')),
  scheduled_for DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'due_today', 'sent', 'skipped', 'failed')),
  message TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, reminder_type)
);

CREATE INDEX IF NOT EXISTS idx_mem_reminders_date ON memories_reminders(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_mem_reminders_status ON memories_reminders(status);

-- 16. CHRONOLOGICAL CLIENT COMMUNICATION TIMELINE
CREATE TABLE IF NOT EXISTS memories_communications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  entity_type TEXT CHECK (entity_type IN ('lead', 'session', 'quote', 'gallery', 'delivery')),
  entity_id UUID,
  communication_type TEXT NOT NULL CHECK (communication_type IN (
    'whatsapp', 'email', 'phone', 'quote', 'booking_confirmation',
    'reminder', 'gallery', 'selection', 'delivery', 'review', 'internal_note'
  )),
  direction TEXT NOT NULL DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound', 'system')),
  message TEXT NOT NULL,
  staff_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_comms_client ON memories_communications(client_id);
CREATE INDEX IF NOT EXISTS idx_mem_comms_date ON memories_communications(created_at);

-- 17. AUTOMATION IDEMPOTENCY TRACKER
CREATE TABLE IF NOT EXISTS memories_automation_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_key TEXT NOT NULL UNIQUE, -- e.g. "lead_follow_up_leadId" or "remind_7d_sessionId"
  automation_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'executed' CHECK (status IN ('executed', 'failed', 'skipped')),
  result JSONB DEFAULT '{}'::jsonb,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_auto_key ON memories_automation_events(automation_key);

-- 18. DIRECT STUDIO EXPENSES (Props, Cake, Outfits, Retouching Freelancers)
CREATE TABLE IF NOT EXISTS memories_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  session_id UUID REFERENCES memories_sessions(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES financial_transactions(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Studio Props & Sets', 'Cake & Edibles', 'Outfits & Wraps',
    'Freelance Retoucher', 'Prints & Album Production', 'Equipment & Studio Rent', 'Other'
  )),
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'PKR',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  vendor TEXT,
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('pending', 'approved', 'paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mem_expenses_session ON memories_expenses(session_id);
CREATE INDEX IF NOT EXISTS idx_mem_expenses_brand ON memories_expenses(brand_id);

-- Auto-update updated_at triggers
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'memories_services', 'memories_packages', 'memories_client_profiles',
      'memories_leads', 'memories_sessions', 'memories_quotes',
      'memories_galleries', 'memories_editing_pipeline', 'memories_tasks',
      'memories_expenses'
    ])
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
      tbl
    );
  END LOOP;
END;
$$;

-- ============================================================
-- 19. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE memories_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_package_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_booking_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_editing_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_automation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories_expenses ENABLE ROW LEVEL SECURITY;

-- Brand-scoped RLS policies for direct brand_id tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'memories_services', 'memories_packages', 'memories_client_profiles',
      'memories_leads', 'memories_sessions', 'memories_booking_holds',
      'memories_quotes', 'memories_galleries', 'memories_selections',
      'memories_editing_pipeline', 'memories_deliverables', 'memories_tasks',
      'memories_reminders', 'memories_communications', 'memories_expenses'
    ])
  LOOP
    EXECUTE format('
      CREATE POLICY "Brand-scoped select on %I" ON %I FOR SELECT TO authenticated
        USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
      CREATE POLICY "Brand-scoped insert on %I" ON %I FOR INSERT TO authenticated
        WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
      CREATE POLICY "Brand-scoped update on %I" ON %I FOR UPDATE TO authenticated
        USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
      CREATE POLICY "Brand-scoped delete on %I" ON %I FOR DELETE TO authenticated
        USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
    ', tbl, tbl, tbl, tbl, tbl, tbl, tbl, tbl);
  END LOOP;
END;
$$;

-- Relational RLS policies for itemized tables
CREATE POLICY "Brand-scoped select on memories_package_items" ON memories_package_items FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR package_id IN (SELECT id FROM memories_packages WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));
CREATE POLICY "Brand-scoped insert on memories_package_items" ON memories_package_items FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR package_id IN (SELECT id FROM memories_packages WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));
CREATE POLICY "Brand-scoped update on memories_package_items" ON memories_package_items FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR package_id IN (SELECT id FROM memories_packages WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));
CREATE POLICY "Brand-scoped delete on memories_package_items" ON memories_package_items FOR DELETE TO authenticated
  USING (is_super_admin(auth.uid()) OR package_id IN (SELECT id FROM memories_packages WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));

CREATE POLICY "Brand-scoped select on memories_quote_items" ON memories_quote_items FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR quote_id IN (SELECT id FROM memories_quotes WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));
CREATE POLICY "Brand-scoped insert on memories_quote_items" ON memories_quote_items FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR quote_id IN (SELECT id FROM memories_quotes WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));
CREATE POLICY "Brand-scoped update on memories_quote_items" ON memories_quote_items FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR quote_id IN (SELECT id FROM memories_quotes WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));
CREATE POLICY "Brand-scoped delete on memories_quote_items" ON memories_quote_items FOR DELETE TO authenticated
  USING (is_super_admin(auth.uid()) OR quote_id IN (SELECT id FROM memories_quotes WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));

-- Automation events: authenticated staff can manage
CREATE POLICY "Staff select on memories_automation_events" ON memories_automation_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff insert on memories_automation_events" ON memories_automation_events FOR INSERT TO authenticated WITH CHECK (true);

-- Public token policies for Customer Quote Portal (/quote/[accessKey])
CREATE POLICY "Public quote select by accessKey" ON memories_quotes FOR SELECT TO anon
  USING (access_key IS NOT NULL AND status IN ('sent', 'viewed', 'accepted'));
CREATE POLICY "Public quote item select" ON memories_quote_items FOR SELECT TO anon
  USING (quote_id IN (SELECT id FROM memories_quotes WHERE access_key IS NOT NULL));
CREATE POLICY "Public quote acceptance update" ON memories_quotes FOR UPDATE TO anon
  USING (access_key IS NOT NULL AND status IN ('sent', 'viewed'));

-- Public token policies for Customer Gallery Proofing (/gallery/[accessCode])
CREATE POLICY "Public gallery select by accessCode" ON memories_galleries FOR SELECT TO anon
  USING (access_code IS NOT NULL AND status IN ('delivered_for_selection', 'selection_completed', 'final_delivered'));
CREATE POLICY "Public selection insert" ON memories_selections FOR INSERT TO anon
  WITH CHECK (gallery_id IN (SELECT id FROM memories_galleries WHERE access_code IS NOT NULL));
