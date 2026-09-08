-- ============================================================
-- The Snap Legacy ERP — Migration 010
-- Central Finance, Cross-Brand Reporting & Executive Intelligence
-- Phase 5: The Financial Brain of The Snap Legacy
-- Double-Entry Chart of Accounts, General Ledger,
-- Revenue Streams, Multi-Account Banking & Reversals Audit
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure trigger function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. CENTRAL CHART OF ACCOUNTS (HIERARCHICAL)
-- Standard Account Classifications:
-- 1000-1999: Assets
-- 2000-2999: Liabilities
-- 3000-3999: Equity
-- 4000-4999: Revenue
-- 5000-5999: Direct Costs / COGS
-- 6000-6999: Operating Expenses (OpEx)
-- 7000-7999: Other Income & Expenses
CREATE TABLE IF NOT EXISTS financial_chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  account_code VARCHAR(10) NOT NULL UNIQUE,
  account_name VARCHAR(100) NOT NULL,
  account_type VARCHAR(20) NOT NULL CHECK (account_type IN (
    'asset', 'liability', 'equity', 'revenue', 'cogs', 'expense', 'other_income', 'other_expense'
  )),
  account_category VARCHAR(50) NOT NULL,
  description TEXT,
  parent_account_id UUID REFERENCES financial_chart_of_accounts(id) ON DELETE RESTRICT,
  currency VARCHAR(3) NOT NULL DEFAULT 'PKR',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_reconcilable BOOLEAN NOT NULL DEFAULT FALSE,
  normal_balance VARCHAR(6) NOT NULL CHECK (normal_balance IN ('debit', 'credit')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coa_code ON financial_chart_of_accounts(account_code);
CREATE INDEX IF NOT EXISTS idx_coa_type ON financial_chart_of_accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_coa_parent ON financial_chart_of_accounts(parent_account_id);

-- 2. DOUBLE-ENTRY GENERAL JOURNAL BATCH HEADERS
CREATE TABLE IF NOT EXISTS financial_journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  entry_number VARCHAR(30) NOT NULL UNIQUE, -- e.g. JE-2026-0001
  entry_date DATE NOT NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  source_module VARCHAR(50) NOT NULL, -- 'service', 'agency', 'memories', 'shop', 'manual', 'payroll'
  source_record_id VARCHAR(100), -- invoice_id, payment_id, session_id, etc.
  reference VARCHAR(100), -- Bank slip, cheque no, transaction ref
  description TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'posted' CHECK (status IN ('draft', 'posted', 'reversed')),
  total_debit DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  total_credit DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  posted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_je_number ON financial_journal_entries(entry_number);
CREATE INDEX IF NOT EXISTS idx_je_date ON financial_journal_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_je_brand ON financial_journal_entries(brand_id);
CREATE INDEX IF NOT EXISTS idx_je_source ON financial_journal_entries(source_module, source_record_id);

-- 3. DOUBLE-ENTRY JOURNAL LINES
CREATE TABLE IF NOT EXISTS financial_journal_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_id UUID NOT NULL REFERENCES financial_journal_entries(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES financial_chart_of_accounts(id) ON DELETE RESTRICT,
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  line_number INT NOT NULL,
  debit_amount DECIMAL(14,2) NOT NULL DEFAULT 0.00 CHECK (debit_amount >= 0),
  credit_amount DECIMAL(14,2) NOT NULL DEFAULT 0.00 CHECK (credit_amount >= 0),
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_debit_or_credit CHECK (
    (debit_amount > 0 AND credit_amount = 0) OR
    (credit_amount > 0 AND debit_amount = 0)
  )
);

CREATE INDEX IF NOT EXISTS idx_jl_entry ON financial_journal_lines(entry_id);
CREATE INDEX IF NOT EXISTS idx_jl_account ON financial_journal_lines(account_id);
CREATE INDEX IF NOT EXISTS idx_jl_brand ON financial_journal_lines(brand_id);

-- 4. MULTI-ACCOUNT CASH & BANK MANAGER
CREATE TABLE IF NOT EXISTS financial_bank_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  account_name VARCHAR(100) NOT NULL, -- e.g. "Meezan Bank - Main Operational"
  account_type VARCHAR(20) NOT NULL CHECK (account_type IN (
    'cash', 'bank', 'payment_gateway', 'digital_wallet', 'petty_cash'
  )),
  bank_name VARCHAR(100),
  account_number VARCHAR(50),
  iban VARCHAR(50),
  currency VARCHAR(3) NOT NULL DEFAULT 'PKR',
  chart_of_account_id UUID REFERENCES financial_chart_of_accounts(id) ON DELETE RESTRICT,
  book_balance DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  statement_balance DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  last_reconciled_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fba_org ON financial_bank_accounts(organization_id);

-- 5. BANK RECONCILIATION SESSIONS
CREATE TABLE IF NOT EXISTS financial_bank_reconciliations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bank_account_id UUID NOT NULL REFERENCES financial_bank_accounts(id) ON DELETE RESTRICT,
  reconciliation_date DATE NOT NULL,
  statement_start_date DATE NOT NULL,
  statement_end_date DATE NOT NULL,
  statement_starting_balance DECIMAL(14,2) NOT NULL,
  statement_ending_balance DECIMAL(14,2) NOT NULL,
  cleared_deposits DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  cleared_withdrawals DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  reconciled_book_balance DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  difference DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'cancelled')),
  reconciled_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. VENDOR BILLS & PAYABLES LEDGER
CREATE TABLE IF NOT EXISTS financial_payables_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  vendor_name VARCHAR(150) NOT NULL,
  vendor_category VARCHAR(50) NOT NULL CHECK (vendor_category IN (
    'print_lab', 'freelance_crew', 'bakery_props', 'equipment_rental',
    'ad_spend_platform', 'studio_landlord', 'utility_provider', 'software_saas', 'other'
  )),
  bill_number VARCHAR(50),
  bill_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  amount_paid DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  balance_due DECIMAL(14,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'PKR',
  status VARCHAR(20) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partially_paid', 'paid', 'cancelled')),
  source_record_id VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fpl_vendor ON financial_payables_ledger(vendor_name);
CREATE INDEX IF NOT EXISTS idx_fpl_due ON financial_payables_ledger(due_date);
CREATE INDEX IF NOT EXISTS idx_fpl_status ON financial_payables_ledger(status);

-- 7. IMMUTABLE FINANCIAL REVERSALS & ADJUSTMENT AUDIT
CREATE TABLE IF NOT EXISTS financial_reversals_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_journal_entry_id UUID NOT NULL REFERENCES financial_journal_entries(id) ON DELETE RESTRICT,
  reversal_journal_entry_id UUID NOT NULL REFERENCES financial_journal_entries(id) ON DELETE RESTRICT,
  reversed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  reversed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TRIGGERS FOR UPDATED_AT
CREATE TRIGGER trg_fcoa_updated_at BEFORE UPDATE ON financial_chart_of_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_fje_updated_at BEFORE UPDATE ON financial_journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_fba_updated_at BEFORE UPDATE ON financial_bank_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_fbr_updated_at BEFORE UPDATE ON financial_bank_reconciliations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_fpl_updated_at BEFORE UPDATE ON financial_payables_ledger FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY POLICIES
ALTER TABLE financial_chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_journal_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_bank_reconciliations ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_payables_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_reversals_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Central finance view policy" ON financial_chart_of_accounts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Central finance admin modify" ON financial_chart_of_accounts FOR ALL TO authenticated USING (is_super_admin(auth.uid()));

CREATE POLICY "Journal entries view policy" ON financial_journal_entries FOR SELECT TO authenticated
  USING (is_super_admin(auth.uid()) OR brand_id IS NULL OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));
CREATE POLICY "Journal entries insert policy" ON financial_journal_entries FOR INSERT TO authenticated
  WITH CHECK (is_super_admin(auth.uid()) OR brand_id IS NULL OR brand_id IN (SELECT get_user_brand_ids(auth.uid())));

CREATE POLICY "Journal lines view policy" ON financial_journal_lines FOR SELECT TO authenticated USING (true);
CREATE POLICY "Journal lines insert policy" ON financial_journal_lines FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Bank accounts view policy" ON financial_bank_accounts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Bank accounts admin modify" ON financial_bank_accounts FOR ALL TO authenticated USING (is_super_admin(auth.uid()));

CREATE POLICY "Payables ledger view policy" ON financial_payables_ledger FOR SELECT TO authenticated USING (true);
CREATE POLICY "Payables ledger modify" ON financial_payables_ledger FOR ALL TO authenticated USING (is_super_admin(auth.uid()));

CREATE POLICY "Reversals audit view policy" ON financial_reversals_audit FOR SELECT TO authenticated USING (true);
CREATE POLICY "Reversals audit insert policy" ON financial_reversals_audit FOR INSERT TO authenticated WITH CHECK (true);
