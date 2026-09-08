-- ============================================================
-- THE SNAP LEGACY ERP — Phase 1 Foundation Migration
-- ============================================================
-- This migration creates the complete Phase 1 database schema.
-- Run this in your Supabase SQL Editor or via Supabase CLI.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. ORGANIZATIONS
-- ============================================================
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. BRANDS
-- ============================================================
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  color TEXT,
  type TEXT NOT NULL DEFAULT 'subsidiary' CHECK (type IN ('parent', 'subsidiary')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_parent BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_brands_organization ON brands(organization_id);
CREATE INDEX idx_brands_status ON brands(status);

-- ============================================================
-- 3. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ============================================================
-- 4. ROLES
-- ============================================================
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  level INTEGER NOT NULL DEFAULT 0,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. PERMISSIONS
-- ============================================================
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(module, action)
);

CREATE INDEX idx_permissions_module ON permissions(module);

-- ============================================================
-- 6. ROLE_PERMISSIONS (many-to-many)
-- ============================================================
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);

-- ============================================================
-- 7. USER_ROLES
-- ============================================================
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  assigned_by UUID REFERENCES profiles(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);

-- ============================================================
-- 8. USER_BRAND_ACCESS
-- ============================================================
CREATE TABLE user_brand_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, brand_id)
);

CREATE INDEX idx_user_brand_access_user ON user_brand_access(user_id);
CREATE INDEX idx_user_brand_access_brand ON user_brand_access(brand_id);

-- ============================================================
-- 9. CLIENTS
-- ============================================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  type TEXT NOT NULL DEFAULT 'individual' CHECK (type IN ('individual', 'company', 'government', 'ngo')),
  source TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_archived ON clients(is_archived);
CREATE INDEX idx_clients_name ON clients(name);

-- ============================================================
-- 10. CLIENT_BRAND_ASSOCIATIONS (many-to-many)
-- ============================================================
CREATE TABLE client_brand_associations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(client_id, brand_id)
);

CREATE INDEX idx_client_brand_client ON client_brand_associations(client_id);
CREATE INDEX idx_client_brand_brand ON client_brand_associations(brand_id);

-- ============================================================
-- 11. LEADS
-- ============================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  value DECIMAL(15,2),
  currency TEXT NOT NULL DEFAULT 'PKR',
  assigned_to UUID REFERENCES profiles(id),
  expected_close_date DATE,
  notes TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_brand ON leads(brand_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_archived ON leads(is_archived);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);

-- ============================================================
-- 12. PROJECTS
-- ============================================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  budget DECIMAL(15,2),
  currency TEXT NOT NULL DEFAULT 'PKR',
  notes TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_brand ON projects(brand_id);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_archived ON projects(is_archived);

-- ============================================================
-- 13. EVENTS
-- ============================================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  location TEXT,
  venue TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed', 'cancelled', 'postponed')),
  notes TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_brand ON events(brand_id);
CREATE INDEX idx_events_project ON events(project_id);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_archived ON events(is_archived);

-- ============================================================
-- 14. SERVICES
-- ============================================================
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(15,2),
  currency TEXT NOT NULL DEFAULT 'PKR',
  unit TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_brand ON services(brand_id);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_archived ON services(is_archived);

-- ============================================================
-- 15. QUOTATIONS
-- ============================================================
CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  quotation_number TEXT,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PKR',
  tax_amount DECIMAL(15,2) DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired', 'revised')),
  valid_until DATE,
  notes TEXT,
  terms TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quotations_brand ON quotations(brand_id);
CREATE INDEX idx_quotations_client ON quotations(client_id);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_quotations_archived ON quotations(is_archived);

-- ============================================================
-- 16. ACCOUNTS (Financial)
-- ============================================================
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cash', 'bank', 'credit_card', 'mobile_wallet', 'receivable', 'payable', 'other')),
  account_number TEXT,
  bank_name TEXT,
  balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'PKR',
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'frozen')),
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_accounts_brand ON accounts(brand_id);
CREATE INDEX idx_accounts_type ON accounts(type);
CREATE INDEX idx_accounts_status ON accounts(status);
CREATE INDEX idx_accounts_archived ON accounts(is_archived);

-- ============================================================
-- 17. FINANCIAL_CATEGORIES
-- ============================================================
CREATE TABLE financial_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  parent_id UUID REFERENCES financial_categories(id) ON DELETE SET NULL,
  description TEXT,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fin_categories_brand ON financial_categories(brand_id);
CREATE INDEX idx_fin_categories_type ON financial_categories(type);

-- ============================================================
-- 18. FINANCIAL_TRANSACTIONS (IMMUTABLE LEDGER)
-- ============================================================
CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  account_id UUID REFERENCES accounts(id) ON DELETE RESTRICT,
  category_id UUID REFERENCES financial_categories(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  amount DECIMAL(15,2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'PKR',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  reference TEXT,
  related_transaction_id UUID REFERENCES financial_transactions(id) ON DELETE SET NULL,
  is_reversal BOOLEAN NOT NULL DEFAULT FALSE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fin_tx_brand ON financial_transactions(brand_id);
CREATE INDEX idx_fin_tx_account ON financial_transactions(account_id);
CREATE INDEX idx_fin_tx_category ON financial_transactions(category_id);
CREATE INDEX idx_fin_tx_type ON financial_transactions(type);
CREATE INDEX idx_fin_tx_date ON financial_transactions(date);
CREATE INDEX idx_fin_tx_related ON financial_transactions(related_transaction_id);

-- ============================================================
-- 19. PAYMENTS
-- ============================================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES financial_transactions(id) ON DELETE SET NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PKR',
  method TEXT CHECK (method IN ('cash', 'bank_transfer', 'cheque', 'credit_card', 'mobile_wallet', 'online', 'other')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'partial')),
  reference TEXT,
  notes TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_brand ON payments(brand_id);
CREATE INDEX idx_payments_client ON payments(client_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_date ON payments(date);
CREATE INDEX idx_payments_archived ON payments(is_archived);

-- ============================================================
-- 20. EXPENSES
-- ============================================================
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  transaction_id UUID REFERENCES financial_transactions(id) ON DELETE SET NULL,
  category_id UUID REFERENCES financial_categories(id) ON DELETE SET NULL,
  account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'PKR',
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  vendor TEXT,
  receipt_url TEXT,
  approved_by UUID REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_expenses_brand ON expenses(brand_id);
CREATE INDEX idx_expenses_category ON expenses(category_id);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_archived ON expenses(is_archived);

-- ============================================================
-- 21. EMPLOYEES
-- ============================================================
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  employee_code TEXT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  cnic TEXT,
  position TEXT,
  department TEXT,
  hire_date DATE,
  end_date DATE,
  salary DECIMAL(15,2),
  currency TEXT NOT NULL DEFAULT 'PKR',
  employment_type TEXT NOT NULL DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'intern')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated', 'on_leave')),
  emergency_contact TEXT,
  emergency_phone TEXT,
  address TEXT,
  notes TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_employees_brand ON employees(brand_id);
CREATE INDEX idx_employees_user ON employees(user_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_archived ON employees(is_archived);

-- ============================================================
-- 22. FREELANCERS
-- ============================================================
CREATE TABLE freelancers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  cnic TEXT,
  specialization TEXT,
  portfolio_url TEXT,
  rate DECIMAL(15,2),
  rate_type TEXT DEFAULT 'per_project' CHECK (rate_type IN ('per_hour', 'per_day', 'per_project', 'per_event')),
  currency TEXT NOT NULL DEFAULT 'PKR',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_freelancers_brand ON freelancers(brand_id);
CREATE INDEX idx_freelancers_status ON freelancers(status);
CREATE INDEX idx_freelancers_archived ON freelancers(is_archived);

-- ============================================================
-- 23. ASSETS
-- ============================================================
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  serial_number TEXT,
  model TEXT,
  manufacturer TEXT,
  purchase_date DATE,
  purchase_price DECIMAL(15,2),
  current_value DECIMAL(15,2),
  currency TEXT NOT NULL DEFAULT 'PKR',
  condition TEXT DEFAULT 'good' CHECK (condition IN ('new', 'good', 'fair', 'poor', 'damaged', 'disposed')),
  location TEXT,
  assigned_to UUID REFERENCES employees(id) ON DELETE SET NULL,
  warranty_expiry DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'in_use', 'maintenance', 'retired', 'disposed')),
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assets_brand ON assets(brand_id);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_archived ON assets(is_archived);

-- ============================================================
-- 24. TASKS
-- ============================================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  archived_by UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_brand ON tasks(brand_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_archived ON tasks(is_archived);

-- ============================================================
-- 25. DOCUMENTS
-- ============================================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  module TEXT NOT NULL,
  record_id UUID,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_brand ON documents(brand_id);
CREATE INDEX idx_documents_module ON documents(module);
CREATE INDEX idx_documents_record ON documents(record_id);

-- ============================================================
-- 26. NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  module TEXT,
  record_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- ============================================================
-- 27. AUDIT_LOGS (IMMUTABLE)
-- ============================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  record_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_module ON audit_logs(module);
CREATE INDEX idx_audit_record ON audit_logs(record_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- ============================================================
-- 28. SETTINGS
-- ============================================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'general',
  key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  updated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(brand_id, key)
);

CREATE INDEX idx_settings_brand ON settings(brand_id);
CREATE INDEX idx_settings_category ON settings(category);

-- ============================================================
-- TRIGGERS: Auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'organizations', 'brands', 'profiles', 'roles',
      'clients', 'leads', 'projects', 'events', 'services', 'quotations',
      'accounts', 'payments', 'expenses',
      'employees', 'freelancers', 'assets', 'tasks', 'settings'
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
-- TRIGGER: Auto-create profile on auth.users insert
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
