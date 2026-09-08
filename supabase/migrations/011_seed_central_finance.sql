-- ============================================================
-- The Snap Legacy ERP — Migration 011
-- Seed Data: Central Chart of Accounts, Bank Accounts,
-- and Double-Entry Foundation Ledger
-- ============================================================

DO $$
DECLARE
  v_org_id UUID;
  v_brand_hq UUID := 'b0000000-0000-0000-0000-000000000001';
  v_brand_service UUID := 'b0000000-0000-0000-0000-000000000002';
  v_brand_agency UUID := 'b0000000-0000-0000-0000-000000000003';
  v_brand_memories UUID := 'b0000000-0000-0000-0000-000000000004';
  
  -- Key Account IDs
  v_acc_cash UUID := 'a0000000-0000-0000-0000-000000001010';
  v_acc_meezan UUID := 'a0000000-0000-0000-0000-000000001020';
  v_acc_hbl UUID := 'a0000000-0000-0000-0000-000000001030';
  v_acc_gateway UUID := 'a0000000-0000-0000-0000-000000001040';
  v_acc_ar UUID := 'a0000000-0000-0000-0000-000000001100';
  v_acc_ap UUID := 'a0000000-0000-0000-0000-000000002010';
  v_acc_unearned UUID := 'a0000000-0000-0000-0000-000000002100';
  v_acc_capital UUID := 'a0000000-0000-0000-0000-000000003010';
  v_acc_retained UUID := 'a0000000-0000-0000-0000-000000003020';
  
  -- Revenue Accounts
  v_rev_service_wedding UUID := 'a0000000-0000-0000-0000-000000004010';
  v_rev_service_addon UUID := 'a0000000-0000-0000-0000-000000004020';
  v_rev_agency_retainer UUID := 'a0000000-0000-0000-0000-000000004110';
  v_rev_agency_campaign UUID := 'a0000000-0000-0000-0000-000000004120';
  v_rev_memories_session UUID := 'a0000000-0000-0000-0000-000000004210';
  v_rev_memories_product UUID := 'a0000000-0000-0000-0000-000000004220';
  v_rev_shop_retail UUID := 'a0000000-0000-0000-0000-000000004310';
  
  -- Direct Cost (COGS) Accounts
  v_cogs_service_crew UUID := 'a0000000-0000-0000-0000-000000005010';
  v_cogs_agency_adspend UUID := 'a0000000-0000-0000-0000-000000005110';
  v_cogs_agency_freelance UUID := 'a0000000-0000-0000-0000-000000005120';
  v_cogs_memories_props UUID := 'a0000000-0000-0000-0000-000000005210';
  v_cogs_memories_labs UUID := 'a0000000-0000-0000-0000-000000005220';
  
  -- Operating Expense Accounts
  v_opex_rent UUID := 'a0000000-0000-0000-0000-000000006010';
  v_opex_payroll UUID := 'a0000000-0000-0000-0000-000000006020';
  v_opex_utilities UUID := 'a0000000-0000-0000-0000-000000006030';
  v_opex_software UUID := 'a0000000-0000-0000-0000-000000006040';
  v_opex_marketing UUID := 'a0000000-0000-0000-0000-000000006050';

  v_je_01 UUID := uuid_generate_v4();
  v_je_02 UUID := uuid_generate_v4();
  v_je_03 UUID := uuid_generate_v4();
BEGIN
  -- Get default organization
  SELECT id INTO v_org_id FROM organizations LIMIT 1;
  IF v_org_id IS NULL THEN
    v_org_id := '00000000-0000-0000-0000-000000000001';
  END IF;

  -- 1. SEED CENTRAL CHART OF ACCOUNTS (HIERARCHICAL)
  INSERT INTO financial_chart_of_accounts (id, organization_id, account_code, account_name, account_type, account_category, normal_balance, is_reconcilable) VALUES
    -- 1000 Assets
    (v_acc_cash, v_org_id, '1010', 'Cash on Hand (Studio Safe)', 'asset', 'Current Assets', 'debit', true),
    (v_acc_meezan, v_org_id, '1020', 'Meezan Bank — Primary Operational', 'asset', 'Current Assets', 'debit', true),
    (v_acc_hbl, v_org_id, '1030', 'HBL — Studio & Payroll Account', 'asset', 'Current Assets', 'debit', true),
    (v_acc_gateway, v_org_id, '1040', 'Digital Payment Gateway / Stripe', 'asset', 'Current Assets', 'debit', true),
    (v_acc_ar, v_org_id, '1100', 'Accounts Receivable (Client Balances)', 'asset', 'Current Assets', 'debit', false),
    ('a0000000-0000-0000-0000-000000001500', v_org_id, '1500', 'Studio Cameras & Production Equipment', 'asset', 'Fixed Assets', 'debit', false),
    ('a0000000-0000-0000-0000-000000001510', v_org_id, '1510', 'Studio Fixtures & Furniture', 'asset', 'Fixed Assets', 'debit', false),
    
    -- 2000 Liabilities
    (v_acc_ap, v_org_id, '2010', 'Accounts Payable (Vendors & Labs)', 'liability', 'Current Liabilities', 'credit', false),
    (v_acc_unearned, v_org_id, '2100', 'Unearned Client Retainers & Advances', 'liability', 'Current Liabilities', 'credit', false),
    ('a0000000-0000-0000-0000-000000002200', v_org_id, '2200', 'Sales Tax / PRA Payable', 'liability', 'Current Liabilities', 'credit', false),

    -- 3000 Equity
    (v_acc_capital, v_org_id, '3010', 'Owner Capital & Investment', 'equity', 'Equity', 'credit', false),
    (v_acc_retained, v_org_id, '3020', 'Retained Earnings', 'equity', 'Equity', 'credit', false),

    -- 4000 Revenue
    (v_rev_service_wedding, v_org_id, '4010', 'Wedding Photography & Cinema Revenue', 'revenue', 'The Snap Service', 'credit', false),
    (v_rev_service_addon, v_org_id, '4020', 'Wedding Drone & Album Addons', 'revenue', 'The Snap Service', 'credit', false),
    (v_rev_agency_retainer, v_org_id, '4110', 'Agency Monthly Retainer Billings', 'revenue', 'The Snap Agency', 'credit', false),
    (v_rev_agency_campaign, v_org_id, '4120', 'Performance Campaigns & Strategy Revenue', 'revenue', 'The Snap Agency', 'credit', false),
    (v_rev_memories_session, v_org_id, '4210', 'Studio Portrait & Milestone Revenue', 'revenue', 'Snap Memories', 'credit', false),
    (v_rev_memories_product, v_org_id, '4220', 'Heirloom Fine-Art Prints & Italian Frames', 'revenue', 'Snap Memories', 'credit', false),
    (v_rev_shop_retail, v_org_id, '4310', 'Online Retail Shop Merchandise', 'revenue', 'Heirloom Shop', 'credit', false),

    -- 5000 Direct Costs / COGS
    (v_cogs_service_crew, v_org_id, '5010', 'Freelance Shooters & Cinematographers', 'cogs', 'The Snap Service COGS', 'debit', false),
    (v_cogs_agency_adspend, v_org_id, '5110', 'Client Paid Ad Spend (Meta/Google)', 'cogs', 'The Snap Agency COGS', 'debit', false),
    (v_cogs_agency_freelance, v_org_id, '5120', 'External Motion & Copy Specialists', 'cogs', 'The Snap Agency COGS', 'debit', false),
    (v_cogs_memories_props, v_org_id, '5210', 'Smash Cakes & Sanitized Baby Props', 'cogs', 'Snap Memories COGS', 'debit', false),
    (v_cogs_memories_labs, v_org_id, '5220', 'Fine-Art Paper & Cotton Rag Print Labs', 'cogs', 'Snap Memories COGS', 'debit', false),

    -- 6000 Operating Expenses (OpEx)
    (v_opex_rent, v_org_id, '6010', 'Studio & HQ Facility Rent', 'expense', 'Facility', 'debit', false),
    (v_opex_payroll, v_org_id, '6020', 'Core Staff Payroll & Salaries', 'expense', 'Personnel', 'debit', false),
    (v_opex_utilities, v_org_id, '6030', 'Electricity, Internet & Utilities', 'expense', 'Facility', 'debit', false),
    (v_opex_software, v_org_id, '6040', 'Cloud Hosting, Supabase & Creative SaaS', 'expense', 'Technology', 'debit', false),
    (v_opex_marketing, v_org_id, '6050', 'Brand Advertising & Studio Promotion', 'expense', 'Marketing', 'debit', false)
  ON CONFLICT (account_code) DO NOTHING;

  -- 2. SEED MULTI-ACCOUNT BANK REGISTRY
  INSERT INTO financial_bank_accounts (id, organization_id, account_name, account_type, bank_name, account_number, iban, chart_of_account_id, book_balance, statement_balance) VALUES
    ('b0000000-0000-0000-0000-000000000010', v_org_id, 'Meezan Bank — Primary Operational', 'bank', 'Meezan Bank Ltd', '0281-0105829101', 'PK82MEZN0002810105829101', v_acc_meezan, 1850000.00, 1850000.00),
    ('b0000000-0000-0000-0000-000000000020', v_org_id, 'HBL — Studio & Payroll', 'bank', 'Habib Bank Ltd', '1092-7901239801', 'PK19HABB0010927901239801', v_acc_hbl, 420000.00, 420000.00),
    ('b0000000-0000-0000-0000-000000000030', v_org_id, 'Studio Cash in Vault', 'cash', 'Physical Cash Safe', 'VAULT-01', NULL, v_acc_cash, 180000.00, 180000.00),
    ('b0000000-0000-0000-0000-000000000040', v_org_id, 'Stripe / Online Checkout Gateway', 'payment_gateway', 'Stripe Inc', 'acct_1Mmemories', NULL, v_acc_gateway, 115000.00, 115000.00)
  ON CONFLICT DO NOTHING;

  -- 3. SEED BASELINE DOUBLE-ENTRY GENERAL JOURNAL ENTRIES
  -- Entry 1: Wedding Booking Retainer (The Snap Service)
  INSERT INTO financial_journal_entries (id, organization_id, entry_number, entry_date, brand_id, source_module, reference, description, total_debit, total_credit, status) VALUES
    (v_je_01, v_org_id, 'JE-2026-0001', '2026-09-01', v_brand_service, 'service', 'HBL-DEP-091', 'Ali & Fatima Wedding Photography Retainer Deposit', 150000.00, 150000.00, 'posted')
  ON CONFLICT DO NOTHING;

  INSERT INTO financial_journal_lines (entry_id, account_id, brand_id, line_number, debit_amount, credit_amount, memo) VALUES
    (v_je_01, v_acc_meezan, v_brand_service, 1, 150000.00, 0.00, 'Bank receipt into Meezan Operational'),
    (v_je_01, v_rev_service_wedding, v_brand_service, 2, 0.00, 150000.00, 'Recognized Wedding Service Revenue')
  ON CONFLICT DO NOTHING;

  -- Entry 2: Monthly Retainer Billing (The Snap Agency)
  INSERT INTO financial_journal_entries (id, organization_id, entry_number, entry_date, brand_id, source_module, reference, description, total_debit, total_credit, status) VALUES
    (v_je_02, v_org_id, 'JE-2026-0002', '2026-09-03', v_brand_agency, 'agency', 'INV-AGY-2026-08', 'Biryani Pizza Co. September Growth Retainer', 120000.00, 120000.00, 'posted')
  ON CONFLICT DO NOTHING;

  INSERT INTO financial_journal_lines (entry_id, account_id, brand_id, line_number, debit_amount, credit_amount, memo) VALUES
    (v_je_02, v_acc_meezan, v_brand_agency, 1, 120000.00, 0.00, 'Bank deposit from Biryani Pizza Co.'),
    (v_je_02, v_rev_agency_retainer, v_brand_agency, 2, 0.00, 120000.00, 'Agency Retainer Revenue recognized')
  ON CONFLICT DO NOTHING;

  -- Entry 3: Newborn Session & Smash Cake (Snap Memories)
  INSERT INTO financial_journal_entries (id, organization_id, entry_number, entry_date, brand_id, source_module, reference, description, total_debit, total_credit, status) VALUES
    (v_je_03, v_org_id, 'JE-2026-0003', '2026-09-04', v_brand_memories, 'memories', 'MEM-RCP-002', 'Dr. Ayesha Tariq Newborn Session Booking', 55000.00, 55000.00, 'posted')
  ON CONFLICT DO NOTHING;

  INSERT INTO financial_journal_lines (entry_id, account_id, brand_id, line_number, debit_amount, credit_amount, memo) VALUES
    (v_je_03, v_acc_gateway, v_brand_memories, 1, 55000.00, 0.00, 'Online card payment collected'),
    (v_je_03, v_rev_memories_session, v_brand_memories, 2, 0.00, 55000.00, 'Snap Memories Session Revenue')
  ON CONFLICT DO NOTHING;

  -- 4. SEED PAYABLES LEDGER ENTRIES
  INSERT INTO financial_payables_ledger (organization_id, brand_id, vendor_name, vendor_category, bill_number, bill_date, due_date, amount, amount_paid, balance_due, status) VALUES
    (v_org_id, v_brand_memories, 'Sweet Bakes Kohinoor', 'bakery_props', 'BILL-SBK-442', '2026-09-04', '2026-09-15', 4500.00, 0.00, 4500.00, 'unpaid'),
    (v_org_id, v_brand_service, 'Artisan Album Bookbinders Lahore', 'print_lab', 'BILL-AAL-891', '2026-09-02', '2026-09-20', 28000.00, 10000.00, 18000.00, 'partially_paid'),
    (v_org_id, v_brand_hq, 'Kohinoor One Plaza Management', 'studio_landlord', 'BILL-KOP-SEP', '2026-09-01', '2026-09-10', 85000.00, 85000.00, 0.00, 'paid')
  ON CONFLICT DO NOTHING;

END $$;
