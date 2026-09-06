-- ============================================================
-- The Snap Legacy ERP — Migration 004
-- The Snap Service Schema: Multi-Day Weddings, Snapshot Quotations,
-- Team Scheduling & Conflict Detection, Production Pipeline,
-- Deliverables, Albums, and Event Costing
-- ============================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PACKAGES TABLE (Predefined service bundles like Silver, Gold, Platinum)
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PKR',
  badge TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  image_url TEXT,
  features_json JSONB DEFAULT '[]'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_packages_brand ON packages(brand_id);
CREATE INDEX IF NOT EXISTS idx_packages_active ON packages(is_active);

-- 2. EVENT FUNCTIONS (Multi-day wedding functions: Mehndi, Barat, Walima, etc.)
CREATE TABLE IF NOT EXISTS event_functions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  function_name TEXT NOT NULL, -- e.g. Mehndi, Barat, Walima, Qawwali Night
  function_type TEXT NOT NULL, -- mehndi, barat, walima, reception, nikah, portrait, event
  function_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  venue TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'Faisalabad',
  coverage_hours DECIMAL(4,1) DEFAULT 4.0,
  lead_photographer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  lead_cinematographer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'cancelled', 'postponed')),
  equipment_needed TEXT[],
  notes TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_functions_project ON event_functions(project_id);
CREATE INDEX IF NOT EXISTS idx_event_functions_date ON event_functions(function_date);
CREATE INDEX IF NOT EXISTS idx_event_functions_brand ON event_functions(brand_id);

-- 3. QUOTATION ITEMS (Snapshot Pricing — Price at quotation creation is preserved forever)
CREATE TABLE IF NOT EXISTS quotation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  function_id UUID REFERENCES event_functions(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL, -- Snapshot of service name
  description TEXT,
  unit_price DECIMAL(15,2) NOT NULL, -- Snapshot unit price
  quantity INT NOT NULL DEFAULT 1,
  discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(15,2) NOT NULL, -- Snapshot calculated total
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation ON quotation_items(quotation_id);

-- 4. EVENT TEAM ASSIGNMENTS (Photographers, videographers, drone, assistants with conflict tracking)
CREATE TABLE IF NOT EXISTS event_team_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  function_id UUID REFERENCES event_functions(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  role TEXT NOT NULL CHECK (role IN ('lead_photographer', 'candid_photographer', 'traditional_photographer', 'cinematographer', 'drone_operator', 'gimbal_operator', 'editor', 'assistant', 'coordinator')),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Internal employee
  freelancer_id UUID REFERENCES freelancers(id) ON DELETE SET NULL, -- External freelancer
  person_name TEXT NOT NULL,
  call_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  location TEXT,
  rate_type TEXT NOT NULL DEFAULT 'flat' CHECK (rate_type IN ('flat', 'hourly', 'daily')),
  agreed_cost DECIMAL(15,2) NOT NULL DEFAULT 0,
  is_freelancer BOOLEAN NOT NULL DEFAULT FALSE,
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partially_paid', 'paid')),
  amount_paid DECIMAL(15,2) NOT NULL DEFAULT 0,
  paid_at TIMESTAMPTZ,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_assignments_function ON event_team_assignments(function_id);
CREATE INDEX IF NOT EXISTS idx_team_assignments_profile ON event_team_assignments(profile_id);
CREATE INDEX IF NOT EXISTS idx_team_assignments_freelancer ON event_team_assignments(freelancer_id);

-- 5. EVENT COSTS (True cost structure: team, equipment rental, travel, hotel, printing, food)
CREATE TABLE IF NOT EXISTS event_costs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  function_id UUID REFERENCES event_functions(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  category TEXT NOT NULL CHECK (category IN ('photographer', 'videographer', 'drone', 'freelancer', 'travel', 'accommodation', 'food', 'album_printing', 'equipment_rental', 'editing', 'other')),
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PKR',
  vendor_name TEXT,
  assignment_id UUID REFERENCES event_team_assignments(id) ON DELETE SET NULL,
  freelancer_id UUID REFERENCES freelancers(id) ON DELETE SET NULL,
  expense_id UUID REFERENCES expenses(id) ON DELETE SET NULL, -- Sync with central expenses
  transaction_id UUID REFERENCES financial_transactions(id) ON DELETE SET NULL, -- Sync with central ledger
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'reimbursed')),
  receipt_url TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_costs_project ON event_costs(project_id);
CREATE INDEX IF NOT EXISTS idx_event_costs_brand ON event_costs(brand_id);

-- 6. EDITING TASKS (10-Stage post-production pipeline)
CREATE TABLE IF NOT EXISTS editing_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  function_id UUID REFERENCES event_functions(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  deliverable_type TEXT NOT NULL CHECK (deliverable_type IN ('highlight_film', 'full_video', 'teaser', 'reel', 'photo_selection', 'photo_color_correction', 'retouching', 'album_design')),
  editor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  editor_name TEXT,
  assigned_date DATE DEFAULT CURRENT_DATE,
  deadline DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'files_received', 'editing_assigned', 'in_progress', 'internal_review', 'client_proof', 'revision', 'approved', 'final_export', 'delivered')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  revision_count INT NOT NULL DEFAULT 0,
  delivery_url TEXT,
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_editing_tasks_project ON editing_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_editing_tasks_editor ON editing_tasks(editor_id);
CREATE INDEX IF NOT EXISTS idx_editing_tasks_status ON editing_tasks(status);

-- 7. EVENT DELIVERABLES (Client deliverables tracker with external storage references)
CREATE TABLE IF NOT EXISTS event_deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  function_id UUID REFERENCES event_functions(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('edited_photos', 'highlight_film', 'full_video', 'teaser', 'reel', 'album', 'prints', 'client_gallery', 'raw_footage')),
  storage_reference TEXT, -- e.g. s3://thesnapservice/2026/noor-wedding/photos/ or Dropbox/Google Drive URI
  item_count INT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_production', 'review', 'ready_for_delivery', 'delivered')),
  deadline DATE,
  delivered_at TIMESTAMPTZ,
  delivered_to TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deliverables_project ON event_deliverables(project_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_status ON event_deliverables(status);

-- 8. ALBUM ORDERS (Physical luxury wedding albums lifecycle)
CREATE TABLE IF NOT EXISTS album_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  album_title TEXT NOT NULL,
  album_size TEXT NOT NULL DEFAULT '12x36' CHECK (album_size IN ('12x18', '12x24', '12x30', '12x36', '14x40', 'custom')),
  cover_type TEXT NOT NULL DEFAULT 'leather' CHECK (cover_type IN ('leather', 'acrylic_glass', 'velvet', 'linen', 'hardcover')),
  pages_count INT NOT NULL DEFAULT 30,
  photos_selected_count INT NOT NULL DEFAULT 0,
  designer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  printing_vendor TEXT,
  printing_cost DECIMAL(15,2) NOT NULL DEFAULT 0,
  selling_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending_selection' CHECK (status IN ('pending_selection', 'selection_received', 'designing', 'client_review', 'revision', 'approved', 'printing', 'ready', 'delivered')),
  proof_url TEXT,
  delivery_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_album_orders_project ON album_orders(project_id);
CREATE INDEX IF NOT EXISTS idx_album_orders_status ON album_orders(status);
