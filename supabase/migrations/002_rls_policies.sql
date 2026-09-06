-- ============================================================
-- THE SNAP LEGACY ERP — RLS Policies
-- ============================================================
-- Run AFTER 001_foundation.sql
-- ============================================================

-- ============================================================
-- Helper function: Check if user is Super Admin
-- ============================================================
CREATE OR REPLACE FUNCTION is_super_admin(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = check_user_id AND r.slug = 'ceo_super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- Helper function: Get user's accessible brand IDs
-- ============================================================
CREATE OR REPLACE FUNCTION get_user_brand_ids(check_user_id UUID)
RETURNS SETOF UUID AS $$
BEGIN
  IF is_super_admin(check_user_id) THEN
    RETURN QUERY SELECT id FROM brands;
  ELSE
    RETURN QUERY SELECT brand_id FROM user_brand_access WHERE user_id = check_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ORGANIZATIONS — Only Super Admin can manage
-- ============================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admins can manage organizations"
  ON organizations FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

-- ============================================================
-- BRANDS — Viewable by authenticated, manageable by admin
-- ============================================================
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view brands"
  ON brands FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert brands"
  ON brands FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Admins can update brands"
  ON brands FOR UPDATE
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

-- ============================================================
-- PROFILES — Users see own + admins see all
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR is_super_admin(auth.uid()));

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "System can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================
-- ROLES — Viewable by all authenticated
-- ============================================================
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage roles"
  ON roles FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

-- ============================================================
-- PERMISSIONS — Viewable by all authenticated
-- ============================================================
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view permissions"
  ON permissions FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================
-- ROLE_PERMISSIONS — Viewable by all, manageable by admin
-- ============================================================
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view role_permissions"
  ON role_permissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage role_permissions"
  ON role_permissions FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

-- ============================================================
-- USER_ROLES — Users see own, admins see all
-- ============================================================
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_super_admin(auth.uid()));

CREATE POLICY "Admins can manage user roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

-- ============================================================
-- USER_BRAND_ACCESS — Users see own, admins see all
-- ============================================================
ALTER TABLE user_brand_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own brand access"
  ON user_brand_access FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_super_admin(auth.uid()));

CREATE POLICY "Admins can manage brand access"
  ON user_brand_access FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

-- ============================================================
-- CLIENTS — Brand-scoped
-- ============================================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view clients for their brands"
  ON clients FOR SELECT
  TO authenticated
  USING (
    is_super_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM client_brand_associations cba
      WHERE cba.client_id = clients.id
      AND cba.brand_id IN (SELECT get_user_brand_ids(auth.uid()))
    )
  );

CREATE POLICY "Users can insert clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update clients for their brands"
  ON clients FOR UPDATE
  TO authenticated
  USING (
    is_super_admin(auth.uid())
    OR EXISTS (
      SELECT 1 FROM client_brand_associations cba
      WHERE cba.client_id = clients.id
      AND cba.brand_id IN (SELECT get_user_brand_ids(auth.uid()))
    )
  );

-- ============================================================
-- CLIENT_BRAND_ASSOCIATIONS
-- ============================================================
ALTER TABLE client_brand_associations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view client brand associations"
  ON client_brand_associations FOR SELECT
  TO authenticated
  USING (
    is_super_admin(auth.uid())
    OR brand_id IN (SELECT get_user_brand_ids(auth.uid()))
  );

CREATE POLICY "Users can manage client brand associations"
  ON client_brand_associations FOR ALL
  TO authenticated
  USING (
    is_super_admin(auth.uid())
    OR brand_id IN (SELECT get_user_brand_ids(auth.uid()))
  )
  WITH CHECK (
    is_super_admin(auth.uid())
    OR brand_id IN (SELECT get_user_brand_ids(auth.uid()))
  );

-- ============================================================
-- BRAND-SCOPED TABLES MACRO
-- Apply same pattern to: leads, projects, events, services,
-- quotations, accounts, financial_categories, financial_transactions,
-- payments, expenses, employees, freelancers, assets, tasks, documents
-- ============================================================

-- LEADS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand-scoped select on leads" ON leads FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped insert on leads" ON leads FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped update on leads" ON leads FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

-- PROJECTS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand-scoped select on projects" ON projects FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped insert on projects" ON projects FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped update on projects" ON projects FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

-- EVENTS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand-scoped select on events" ON events FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped insert on events" ON events FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped update on events" ON events FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

-- SERVICES
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand-scoped select on services" ON services FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped insert on services" ON services FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped update on services" ON services FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

-- QUOTATIONS
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand-scoped select on quotations" ON quotations FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped insert on quotations" ON quotations FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped update on quotations" ON quotations FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

-- ACCOUNTS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand-scoped select on accounts" ON accounts FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped insert on accounts" ON accounts FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped update on accounts" ON accounts FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

-- FINANCIAL_CATEGORIES
ALTER TABLE financial_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand-scoped select on financial_categories" ON financial_categories FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped insert on financial_categories" ON financial_categories FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped update on financial_categories" ON financial_categories FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

-- FINANCIAL_TRANSACTIONS (IMMUTABLE — no update, no delete)
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand-scoped select on financial_transactions" ON financial_transactions FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped insert on financial_transactions" ON financial_transactions FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
-- NO UPDATE or DELETE policies — transactions are immutable

-- PAYMENTS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand-scoped select on payments" ON payments FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped insert on payments" ON payments FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped update on payments" ON payments FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

-- EXPENSES
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand-scoped select on expenses" ON expenses FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped insert on expenses" ON expenses FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped update on expenses" ON expenses FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

-- EMPLOYEES
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand-scoped select on employees" ON employees FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped insert on employees" ON employees FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped update on employees" ON employees FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

-- FREELANCERS
ALTER TABLE freelancers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand-scoped select on freelancers" ON freelancers FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped insert on freelancers" ON freelancers FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped update on freelancers" ON freelancers FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

-- ASSETS
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand-scoped select on assets" ON assets FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped insert on assets" ON assets FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped update on assets" ON assets FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

-- TASKS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand-scoped select on tasks" ON tasks FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped insert on tasks" ON tasks FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped update on tasks" ON tasks FOR UPDATE TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

-- DOCUMENTS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand-scoped select on documents" ON documents FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Brand-scoped insert on documents" ON documents FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

-- ============================================================
-- NOTIFICATIONS — User can only see own
-- ============================================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- AUDIT_LOGS — INSERT only, no UPDATE/DELETE
-- ============================================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Authenticated can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- NO UPDATE or DELETE policies — audit logs are immutable

-- ============================================================
-- SETTINGS — Brand-scoped
-- ============================================================
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view settings for their brands"
  ON settings FOR SELECT
  TO authenticated
  USING (
    is_super_admin(auth.uid())
    OR brand_id IN (SELECT get_user_brand_ids(auth.uid()))
    OR brand_id IS NULL
  );

CREATE POLICY "Admins can manage settings"
  ON settings FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));
