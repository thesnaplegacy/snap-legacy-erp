-- ============================================================
-- The Snap Legacy ERP — Migration 006
-- The Snap Agency Schema: Services, Packages, CRM Profiles,
-- Discovery Briefs, Proposals, Retainers, Campaigns,
-- Content Calendar, Creative Workflow, Client Approvals,
-- Cloud Deliverables, and Agency Costing
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

-- 1. AGENCY SERVICES
CREATE TABLE IF NOT EXISTS agency_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Digital Marketing', 'Social Media Management', 'Paid Advertising',
    'Branding', 'Graphic Design', 'Video Production', 'Content Creation',
    'Website Development', 'SEO', 'Consulting', 'Creative Strategy'
  )),
  description TEXT,
  default_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'PKR',
  pricing_type TEXT NOT NULL DEFAULT 'fixed' CHECK (pricing_type IN ('fixed', 'hourly', 'monthly', 'custom')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_services_brand ON agency_services(brand_id);
CREATE INDEX IF NOT EXISTS idx_agency_services_cat ON agency_services(category);
CREATE INDEX IF NOT EXISTS idx_agency_services_status ON agency_services(status);

-- 2. AGENCY PACKAGES & ITEMS
CREATE TABLE IF NOT EXISTS agency_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  price DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'PKR',
  badge TEXT,
  billing_interval TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_interval IN ('one_off', 'monthly', 'quarterly', 'yearly')),
  features_json JSONB DEFAULT '[]'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_packages_brand ON agency_packages(brand_id);

CREATE TABLE IF NOT EXISTS agency_package_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES agency_packages(id) ON DELETE CASCADE,
  service_id UUID REFERENCES agency_services(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  discount DECIMAL(15,2) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_package_items_pkg ON agency_package_items(package_id);

-- 3. AGENCY CLIENT PROFILES (CRM Extension linked to central clients)
CREATE TABLE IF NOT EXISTS agency_client_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  company_name TEXT,
  industry TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  monthly_budget DECIMAL(15,2),
  account_manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  brand_guidelines_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_hold')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(client_id, brand_id)
);

CREATE INDEX IF NOT EXISTS idx_agency_client_profiles_client ON agency_client_profiles(client_id);
CREATE INDEX IF NOT EXISTS idx_agency_client_profiles_brand ON agency_client_profiles(brand_id);

-- 4. AGENCY DISCOVERY RECORDS
CREATE TABLE IF NOT EXISTS agency_discovery_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  business_goals TEXT,
  target_audience TEXT,
  current_platforms TEXT[],
  marketing_challenges TEXT,
  required_services TEXT[],
  competitors TEXT,
  budget DECIMAL(15,2),
  timeline TEXT,
  brand_requirements TEXT,
  content_requirements TEXT,
  advertising_requirements TEXT,
  kpis TEXT,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_discovery_client ON agency_discovery_records(client_id);
CREATE INDEX IF NOT EXISTS idx_agency_discovery_lead ON agency_discovery_records(lead_id);
CREATE INDEX IF NOT EXISTS idx_agency_discovery_brand ON agency_discovery_records(brand_id);

-- 5. AGENCY QUOTATION ITEMS (Snapshot Pricing)
CREATE TABLE IF NOT EXISTS agency_quotation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  service_id UUID REFERENCES agency_services(id) ON DELETE SET NULL,
  package_id UUID REFERENCES agency_packages(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  description TEXT,
  quantity INT NOT NULL DEFAULT 1,
  duration_months INT DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_quote_items_quote ON agency_quotation_items(quotation_id);

-- 6. AGENCY PROPOSALS
CREATE TABLE IF NOT EXISTS agency_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  cover_title TEXT,
  client_overview TEXT,
  business_challenge TEXT,
  objectives TEXT,
  strategy TEXT,
  scope_of_work TEXT,
  deliverables TEXT,
  timeline_text TEXT,
  investment_summary TEXT,
  terms_and_conditions TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft', 'internal_review', 'sent', 'viewed', 'negotiation', 'approved', 'rejected', 'expired'
  )),
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  client_signature TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_proposals_client ON agency_proposals(client_id);
CREATE INDEX IF NOT EXISTS idx_agency_proposals_brand ON agency_proposals(brand_id);
CREATE INDEX IF NOT EXISTS idx_agency_proposals_status ON agency_proposals(status);

-- 7. AGENCY PROJECTS (Operational Extension)
CREATE TABLE IF NOT EXISTS agency_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  project_type TEXT NOT NULL DEFAULT 'project' CHECK (project_type IN ('project', 'retainer', 'campaign')),
  description TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN (
    'planning', 'active', 'on_hold', 'internal_review', 'client_review', 'completed', 'cancelled'
  )),
  project_manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  budget DECIMAL(15,2) DEFAULT 0,
  contract_value DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_projects_project ON agency_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_agency_projects_client ON agency_projects(client_id);
CREATE INDEX IF NOT EXISTS idx_agency_projects_brand ON agency_projects(brand_id);
CREATE INDEX IF NOT EXISTS idx_agency_projects_status ON agency_projects(status);

-- 8. AGENCY RETAINERS & CYCLES
CREATE TABLE IF NOT EXISTS agency_retainers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  retainer_name TEXT NOT NULL,
  monthly_value DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'PKR',
  start_date DATE NOT NULL,
  end_date DATE,
  billing_day INT NOT NULL DEFAULT 1 CHECK (billing_day BETWEEN 1 AND 31),
  renewal_type TEXT NOT NULL DEFAULT 'auto_renew' CHECK (renewal_type IN ('auto_renew', 'manual')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'completed')),
  account_manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_retainers_client ON agency_retainers(client_id);
CREATE INDEX IF NOT EXISTS idx_agency_retainers_brand ON agency_retainers(brand_id);
CREATE INDEX IF NOT EXISTS idx_agency_retainers_status ON agency_retainers(status);

CREATE TABLE IF NOT EXISTS agency_retainer_cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  retainer_id UUID NOT NULL REFERENCES agency_retainers(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  cycle_month DATE NOT NULL, -- e.g. 2026-09-01
  revenue_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  cost_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invoiced', 'closed')),
  notes TEXT,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(retainer_id, cycle_month)
);

CREATE INDEX IF NOT EXISTS idx_agency_retainer_cycles_ret ON agency_retainer_cycles(retainer_id);
CREATE INDEX IF NOT EXISTS idx_agency_retainer_cycles_month ON agency_retainer_cycles(cycle_month);

-- 9. AGENCY CAMPAIGNS
CREATE TABLE IF NOT EXISTS agency_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  campaign_type TEXT NOT NULL CHECK (campaign_type IN (
    'Brand Awareness', 'Lead Generation', 'Product Launch', 'Sales',
    'Engagement', 'Traffic', 'Event Promotion', 'Seasonal Campaign', 'Content Campaign'
  )),
  objective TEXT,
  platform TEXT NOT NULL CHECK (platform IN (
    'Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'YouTube', 'Meta Ads', 'Google Ads', 'Multi-Platform', 'Other'
  )),
  budget DECIMAL(15,2) NOT NULL DEFAULT 0,
  spend DECIMAL(15,2) NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN (
    'Planning', 'Strategy', 'Creative Production', 'Client Approval',
    'Scheduled', 'Live', 'Monitoring', 'Completed'
  )),
  manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_campaigns_project ON agency_campaigns(project_id);
CREATE INDEX IF NOT EXISTS idx_agency_campaigns_client ON agency_campaigns(client_id);
CREATE INDEX IF NOT EXISTS idx_agency_campaigns_brand ON agency_campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_agency_campaigns_status ON agency_campaigns(status);

-- 10. AGENCY CONTENT CALENDAR ITEMS
CREATE TABLE IF NOT EXISTS agency_content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES agency_campaigns(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  caption TEXT,
  platform TEXT NOT NULL CHECK (platform IN ('Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'YouTube', 'Website', 'Other')),
  content_type TEXT NOT NULL CHECK (content_type IN ('Post', 'Carousel', 'Reel', 'Story', 'Video', 'Ad Creative', 'Blog', 'Banner', 'Graphic')),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  designer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  copywriter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  videographer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'idea' CHECK (status IN (
    'Idea', 'Briefed', 'In Design', 'In Editing', 'Internal Review',
    'Client Review', 'Revision', 'Approved', 'Scheduled', 'Published', 'Archived'
  )),
  media_url TEXT,
  media_type TEXT,
  published_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_content_campaign ON agency_content_items(campaign_id);
CREATE INDEX IF NOT EXISTS idx_agency_content_project ON agency_content_items(project_id);
CREATE INDEX IF NOT EXISTS idx_agency_content_date ON agency_content_items(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_agency_content_status ON agency_content_items(status);

-- 11. AGENCY CREATIVE TASKS
CREATE TABLE IF NOT EXISTS agency_creative_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES agency_campaigns(id) ON DELETE SET NULL,
  content_item_id UUID REFERENCES agency_content_items(id) ON DELETE SET NULL,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN (
    'Graphic Design', 'Video Editing', 'Motion Graphics', 'Copywriting',
    'Photography', 'Reels', 'Ad Creatives', 'Branding', 'Website Assets'
  )),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  deadline DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'revision', 'completed')),
  estimated_hours DECIMAL(5,2) DEFAULT 0,
  actual_hours DECIMAL(5,2) DEFAULT 0,
  notes TEXT,
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_tasks_proj ON agency_creative_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_agency_tasks_assignee ON agency_creative_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_agency_tasks_status ON agency_creative_tasks(status);

-- 12. AGENCY CLIENT APPROVALS (Permanent History)
CREATE TABLE IF NOT EXISTS agency_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content_item_id UUID REFERENCES agency_content_items(id) ON DELETE SET NULL,
  deliverable_id UUID,
  item_type TEXT NOT NULL CHECK (item_type IN ('content', 'deliverable', 'campaign', 'proposal')),
  item_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN (
    'pending_review', 'sent_to_client', 'viewed', 'approved', 'revision_requested', 'approved_after_revision'
  )),
  reviewer_name TEXT,
  reviewer_email TEXT,
  revision_number INT NOT NULL DEFAULT 1,
  feedback_comments TEXT,
  client_action_at TIMESTAMPTZ,
  approval_token TEXT UNIQUE DEFAULT uuid_generate_v4()::text,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_approvals_item ON agency_approvals(content_item_id);
CREATE INDEX IF NOT EXISTS idx_agency_approvals_proj ON agency_approvals(project_id);
CREATE INDEX IF NOT EXISTS idx_agency_approvals_token ON agency_approvals(approval_token);

-- 13. AGENCY DELIVERABLES (Asset Vault)
CREATE TABLE IF NOT EXISTS agency_deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES agency_campaigns(id) ON DELETE SET NULL,
  content_item_id UUID REFERENCES agency_content_items(id) ON DELETE SET NULL,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'Logo Package', 'Social Media Calendar', 'Reels Pack', 'Posts Pack',
    'Ad Creatives', 'Brand Guidelines', 'Video Campaign', 'Website Assets', 'Other'
  )),
  version TEXT NOT NULL DEFAULT 'v1.0',
  storage_reference TEXT NOT NULL,
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT,
  status TEXT NOT NULL DEFAULT 'in_production' CHECK (status IN (
    'in_production', 'client_review', 'approved', 'delivered'
  )),
  client_approved BOOLEAN NOT NULL DEFAULT FALSE,
  delivered_at TIMESTAMPTZ,
  delivered_to TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_deliv_proj ON agency_deliverables(project_id);
CREATE INDEX IF NOT EXISTS idx_agency_deliv_brand ON agency_deliverables(brand_id);

-- 14. AGENCY EXPENSES (Direct Costs Synchronization)
CREATE TABLE IF NOT EXISTS agency_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES agency_campaigns(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES financial_transactions(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Meta Ads', 'Google Ads', 'Freelancer', 'Stock Assets',
    'Printing', 'Travel', 'Software Subscription', 'Production', 'Equipment Rental', 'Other'
  )),
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'PKR',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  vendor TEXT,
  employee_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  freelancer_id UUID REFERENCES freelancers(id) ON DELETE SET NULL,
  receipt_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_expenses_proj ON agency_expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_agency_expenses_brand ON agency_expenses(brand_id);
CREATE INDEX IF NOT EXISTS idx_agency_expenses_tx ON agency_expenses(transaction_id);

-- Auto-update updated_at triggers
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'agency_services', 'agency_packages', 'agency_client_profiles',
      'agency_discovery_records', 'agency_proposals', 'agency_projects',
      'agency_retainers', 'agency_retainer_cycles', 'agency_campaigns',
      'agency_content_items', 'agency_creative_tasks', 'agency_approvals',
      'agency_deliverables', 'agency_expenses'
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
-- 15. ROW LEVEL SECURITY (RLS) POLICIES FOR AGENCY TABLES
-- ============================================================

-- Enable RLS on all agency tables
ALTER TABLE agency_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_package_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_discovery_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_retainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_retainer_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_creative_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_expenses ENABLE ROW LEVEL SECURITY;

-- Brand-scoped policies for direct brand_id tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'agency_services', 'agency_packages', 'agency_client_profiles',
      'agency_discovery_records', 'agency_proposals', 'agency_projects',
      'agency_retainers', 'agency_retainer_cycles', 'agency_campaigns',
      'agency_content_items', 'agency_creative_tasks', 'agency_deliverables',
      'agency_expenses'
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

-- Relational RLS policies for package items and quotation items
CREATE POLICY "Brand-scoped select on agency_package_items" ON agency_package_items FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR package_id IN (SELECT id FROM agency_packages WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));
CREATE POLICY "Brand-scoped insert on agency_package_items" ON agency_package_items FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR package_id IN (SELECT id FROM agency_packages WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));
CREATE POLICY "Brand-scoped update on agency_package_items" ON agency_package_items FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR package_id IN (SELECT id FROM agency_packages WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));
CREATE POLICY "Brand-scoped delete on agency_package_items" ON agency_package_items FOR DELETE TO authenticated
  USING (is_super_admin(auth.uid()) OR package_id IN (SELECT id FROM agency_packages WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));

CREATE POLICY "Brand-scoped select on agency_quotation_items" ON agency_quotation_items FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR quotation_id IN (SELECT id FROM quotations WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));
CREATE POLICY "Brand-scoped insert on agency_quotation_items" ON agency_quotation_items FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR quotation_id IN (SELECT id FROM quotations WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));
CREATE POLICY "Brand-scoped update on agency_quotation_items" ON agency_quotation_items FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR quotation_id IN (SELECT id FROM quotations WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));
CREATE POLICY "Brand-scoped delete on agency_quotation_items" ON agency_quotation_items FOR DELETE TO authenticated
  USING (is_super_admin(auth.uid()) OR quotation_id IN (SELECT id FROM quotations WHERE brand_id IN (SELECT get_user_brand_ids(auth.uid()))));

-- Approvals: brand-scoped for authenticated users, token-scoped for public client review
CREATE POLICY "Brand-scoped access on agency_approvals" ON agency_approvals FOR ALL TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

CREATE POLICY "Public token access on agency_approvals" ON agency_approvals FOR SELECT TO anon
  USING (approval_token IS NOT NULL);

CREATE POLICY "Public token update on agency_approvals" ON agency_approvals FOR UPDATE TO anon
  USING (approval_token IS NOT NULL);

