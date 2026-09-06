-- ============================================================
-- THE SNAP LEGACY ERP — Seed Data
-- ============================================================
-- Run AFTER 001_foundation.sql and 002_rls_policies.sql
-- This seeds the initial organization, brands, roles, and permissions.
-- ============================================================

-- ============================================================
-- 1. ORGANIZATION
-- ============================================================
INSERT INTO organizations (id, name, slug, email, website, status)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'The Snap Legacy',
  'the-snap-legacy',
  'info@thesnaplegacy.com',
  'https://thesnaplegacy.com',
  'active'
);

-- ============================================================
-- 2. BRANDS
-- ============================================================
INSERT INTO brands (id, organization_id, name, slug, description, color, type, status, is_parent) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'The Snap Legacy', 'the-snap-legacy', 'Parent company and central command', '#C9A84C', 'parent', 'active', true),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'The Snap Service', 'the-snap-service', 'Service division', '#3B82F6', 'subsidiary', 'active', false),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'The Snap Agency', 'the-snap-agency', 'Creative agency division', '#8B5CF6', 'subsidiary', 'active', false),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Snap Memories', 'snap-memories', 'Photography and memories division', '#EC4899', 'subsidiary', 'active', false);

-- ============================================================
-- 3. ROLES
-- ============================================================
INSERT INTO roles (id, name, slug, description, level, is_system) VALUES
  ('r0000000-0000-0000-0000-000000000001', 'CEO / Super Admin', 'ceo_super_admin', 'Full system access across all brands and modules', 100, true),
  ('r0000000-0000-0000-0000-000000000002', 'Legacy Management', 'legacy_management', 'Management access across all brands', 80, true),
  ('r0000000-0000-0000-0000-000000000003', 'Finance Manager', 'finance_manager', 'Finance module access across assigned brands', 60, true),
  ('r0000000-0000-0000-0000-000000000004', 'HR Manager', 'hr_manager', 'People management across assigned brands', 60, true),
  ('r0000000-0000-0000-0000-000000000005', 'Brand Manager', 'brand_manager', 'Full access within assigned brand', 50, true),
  ('r0000000-0000-0000-0000-000000000006', 'Staff', 'staff', 'Limited operational access', 10, true);

-- ============================================================
-- 4. PERMISSIONS
-- ============================================================
-- Modules: brands, clients, leads, projects, events, services, quotations,
--          finance, payments, expenses, accounts, employees, freelancers,
--          assets, users, roles, settings, audit_logs, reports, tasks, documents
-- Actions: view, create, update, archive, restore

DO $$
DECLARE
  mod TEXT;
  act TEXT;
  modules TEXT[] := ARRAY[
    'brands', 'clients', 'leads', 'projects', 'events', 'services', 'quotations',
    'finance', 'payments', 'expenses', 'accounts', 'employees', 'freelancers',
    'assets', 'users', 'roles', 'settings', 'audit_logs', 'reports', 'tasks', 'documents'
  ];
  actions TEXT[] := ARRAY['view', 'create', 'update', 'archive', 'restore'];
BEGIN
  FOREACH mod IN ARRAY modules
  LOOP
    FOREACH act IN ARRAY actions
    LOOP
      INSERT INTO permissions (module, action, description)
      VALUES (mod, act, mod || ':' || act)
      ON CONFLICT (module, action) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$;

-- ============================================================
-- 5. ROLE_PERMISSIONS — CEO gets everything
-- ============================================================
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'r0000000-0000-0000-0000-000000000001', id FROM permissions;

-- Legacy Management — everything except roles and settings management
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'r0000000-0000-0000-0000-000000000002', id FROM permissions
WHERE module NOT IN ('roles', 'settings', 'audit_logs') OR action = 'view';

-- Finance Manager — finance-related + view everything
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'r0000000-0000-0000-0000-000000000003', id FROM permissions
WHERE module IN ('finance', 'payments', 'expenses', 'accounts', 'reports')
   OR (action = 'view' AND module IN ('clients', 'projects', 'brands', 'events'));

-- HR Manager — people-related + view everything
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'r0000000-0000-0000-0000-000000000004', id FROM permissions
WHERE module IN ('employees', 'freelancers', 'users')
   OR (action = 'view' AND module IN ('clients', 'projects', 'brands'));

-- Brand Manager — most things except system
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'r0000000-0000-0000-0000-000000000005', id FROM permissions
WHERE module NOT IN ('roles', 'settings', 'audit_logs', 'users')
   OR action = 'view';

-- Staff — view only for most, create/update for tasks
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'r0000000-0000-0000-0000-000000000006', id FROM permissions
WHERE action = 'view'
   OR (module IN ('tasks', 'leads') AND action IN ('create', 'update'));

-- ============================================================
-- 6. DEFAULT FINANCIAL CATEGORIES
-- ============================================================
-- Income categories (system-wide, no specific brand)
INSERT INTO financial_categories (name, type, description, is_system) VALUES
  ('Service Revenue', 'income', 'Revenue from services provided', true),
  ('Photography Revenue', 'income', 'Revenue from photography/videography', true),
  ('Agency Revenue', 'income', 'Revenue from agency creative work', true),
  ('Event Revenue', 'income', 'Revenue from events', true),
  ('Consultation Revenue', 'income', 'Revenue from consulting', true),
  ('Other Income', 'income', 'Miscellaneous income', true);

-- Expense categories
INSERT INTO financial_categories (name, type, description, is_system) VALUES
  ('Salaries & Wages', 'expense', 'Employee compensation', true),
  ('Freelancer Payments', 'expense', 'Freelancer and contractor payments', true),
  ('Rent & Utilities', 'expense', 'Office rent and utility bills', true),
  ('Equipment', 'expense', 'Equipment purchases and maintenance', true),
  ('Marketing', 'expense', 'Marketing and advertising expenses', true),
  ('Travel', 'expense', 'Business travel expenses', true),
  ('Software & Subscriptions', 'expense', 'Software licenses and subscriptions', true),
  ('Office Supplies', 'expense', 'Office consumables and supplies', true),
  ('Insurance', 'expense', 'Business insurance premiums', true),
  ('Tax & Government', 'expense', 'Tax payments and government fees', true),
  ('Miscellaneous', 'expense', 'Other business expenses', true);

-- ============================================================
-- 7. DEFAULT SETTINGS
-- ============================================================
-- Legacy-level settings (brand_id = Legacy brand)
INSERT INTO settings (brand_id, category, key, value, description) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'general', 'company_name', '"The Snap Legacy"', 'Company display name'),
  ('b0000000-0000-0000-0000-000000000001', 'general', 'currency', '"PKR"', 'Default currency'),
  ('b0000000-0000-0000-0000-000000000001', 'general', 'timezone', '"Asia/Karachi"', 'Default timezone'),
  ('b0000000-0000-0000-0000-000000000001', 'general', 'fiscal_year_start', '"July"', 'Fiscal year start month'),
  ('b0000000-0000-0000-0000-000000000001', 'general', 'date_format', '"DD/MM/YYYY"', 'Date display format'),
  ('b0000000-0000-0000-0000-000000000001', 'notifications', 'email_notifications', 'true', 'Enable email notifications'),
  ('b0000000-0000-0000-0000-000000000001', 'audit', 'audit_retention_days', '365', 'Audit log retention in days');
