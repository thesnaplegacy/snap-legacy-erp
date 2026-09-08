'use server';

import { createClient } from '@/lib/supabase/server';
import {
  ChartOfAccount,
  JournalEntry,
  JournalLine,
  BankAccount,
  PayableBill,
  ConsolidatedPnL,
  RevenueStreamMetric,
  ExpenseIntelligenceBreakdown,
  ReceivablesAgingBucket,
  ExecutiveIntelligenceRadar,
  ExecutiveAlert,
} from '@/lib/types/database';
import { BRAND_IDS, BRAND_COLORS } from '@/lib/constants';

const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

// ============================================================
// 1. CENTRAL CHART OF ACCOUNTS
// ============================================================
export async function getCentralChartOfAccounts(): Promise<ChartOfAccount[]> {
  if (IS_DEMO) {
    return [
      // Assets 1000
      {
        id: 'a0000000-0000-0000-0000-000000001010',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '1010',
        account_name: 'Cash on Hand (Studio Safe)',
        account_type: 'asset',
        account_category: 'Current Assets',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: true,
        normal_balance: 'debit',
        current_balance: 180000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'a0000000-0000-0000-0000-000000001020',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '1020',
        account_name: 'Meezan Bank — Primary Operational',
        account_type: 'asset',
        account_category: 'Current Assets',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: true,
        normal_balance: 'debit',
        current_balance: 1850000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'a0000000-0000-0000-0000-000000001030',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '1030',
        account_name: 'HBL — Studio & Payroll',
        account_type: 'asset',
        account_category: 'Current Assets',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: true,
        normal_balance: 'debit',
        current_balance: 420000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'a0000000-0000-0000-0000-000000001040',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '1040',
        account_name: 'Digital Payment Gateway / Stripe',
        account_type: 'asset',
        account_category: 'Current Assets',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: true,
        normal_balance: 'debit',
        current_balance: 115000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'a0000000-0000-0000-0000-000000001100',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '1100',
        account_name: 'Accounts Receivable (Client Balances)',
        account_type: 'asset',
        account_category: 'Current Assets',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: false,
        normal_balance: 'debit',
        current_balance: 485000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'a0000000-0000-0000-0000-000000001500',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '1500',
        account_name: 'Studio Cameras & Production Gear',
        account_type: 'asset',
        account_category: 'Fixed Assets',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: false,
        normal_balance: 'debit',
        current_balance: 4200000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      // Liabilities 2000
      {
        id: 'a0000000-0000-0000-0000-000000002010',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '2010',
        account_name: 'Accounts Payable (Vendors & Labs)',
        account_type: 'liability',
        account_category: 'Current Liabilities',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: false,
        normal_balance: 'credit',
        current_balance: 137500,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      // Equity 3000
      {
        id: 'a0000000-0000-0000-0000-000000003010',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '3010',
        account_name: 'Owner Capital & Partner Equity',
        account_type: 'equity',
        account_category: 'Equity',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: false,
        normal_balance: 'credit',
        current_balance: 5500000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      // Revenue 4000
      {
        id: 'a0000000-0000-0000-0000-000000004010',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '4010',
        account_name: 'Wedding Photography & Cinema Revenue',
        account_type: 'revenue',
        account_category: 'The Snap Service',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: false,
        normal_balance: 'credit',
        current_balance: 950000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'a0000000-0000-0000-0000-000000004110',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '4110',
        account_name: 'Agency Monthly Retainer Billings',
        account_type: 'revenue',
        account_category: 'The Snap Agency',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: false,
        normal_balance: 'credit',
        current_balance: 470000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'a0000000-0000-0000-0000-000000004210',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '4210',
        account_name: 'Studio Portrait & Milestone Revenue',
        account_type: 'revenue',
        account_category: 'Snap Memories',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: false,
        normal_balance: 'credit',
        current_balance: 185000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'a0000000-0000-0000-0000-000000004220',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '4220',
        account_name: 'Heirloom Fine-Art Prints & Italian Frames',
        account_type: 'revenue',
        account_category: 'Snap Memories',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: false,
        normal_balance: 'credit',
        current_balance: 62000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      // COGS 5000
      {
        id: 'a0000000-0000-0000-0000-000000005010',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '5010',
        account_name: 'Freelance Shooters & Cinematographers',
        account_type: 'cogs',
        account_category: 'The Snap Service COGS',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: false,
        normal_balance: 'debit',
        current_balance: 120000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'a0000000-0000-0000-0000-000000005110',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '5110',
        account_name: 'Client Paid Ad Spend (Meta/Google)',
        account_type: 'cogs',
        account_category: 'The Snap Agency COGS',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: false,
        normal_balance: 'debit',
        current_balance: 45000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'a0000000-0000-0000-0000-000000005210',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '5210',
        account_name: 'Smash Cakes & Sanitized Baby Props',
        account_type: 'cogs',
        account_category: 'Snap Memories COGS',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: false,
        normal_balance: 'debit',
        current_balance: 11000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      // OpEx 6000
      {
        id: 'a0000000-0000-0000-0000-000000006010',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '6010',
        account_name: 'Studio & HQ Facility Rent',
        account_type: 'expense',
        account_category: 'Facility',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: false,
        normal_balance: 'debit',
        current_balance: 85000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'a0000000-0000-0000-0000-000000006020',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_code: '6020',
        account_name: 'Core Staff Payroll & Salaries',
        account_type: 'expense',
        account_category: 'Personnel',
        currency: 'PKR',
        is_active: true,
        is_reconcilable: false,
        normal_balance: 'debit',
        current_balance: 195000,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
    ];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('financial_chart_of_accounts')
    .select('*')
    .order('account_code');

  if (error) throw error;
  return data || [];
}

// ============================================================
// 2. DOUBLE-ENTRY GENERAL JOURNAL LEDGER
// ============================================================
export async function getJournalEntries(filters?: {
  brandId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<JournalEntry[]> {
  if (IS_DEMO) {
    return [
      {
        id: 'je-001',
        organization_id: '00000000-0000-0000-0000-000000000001',
        entry_number: 'JE-2026-0001',
        entry_date: '2026-09-01',
        brand_id: BRAND_IDS.THE_SNAP_SERVICE,
        source_module: 'service',
        reference: 'HBL-DEP-091',
        description: 'Ali & Fatima Wedding Photography Retainer Deposit',
        status: 'posted',
        total_debit: 150000,
        total_credit: 150000,
        posted_at: '2026-09-01T10:00:00Z',
        created_at: '2026-09-01T10:00:00Z',
        updated_at: '2026-09-01T10:00:00Z',
        brand: { name: 'The Snap Service', color: BRAND_COLORS['snap-service'] } as any,
        lines: [
          {
            account_id: 'a0000000-0000-0000-0000-000000001020',
            line_number: 1,
            debit_amount: 150000,
            credit_amount: 0,
            memo: 'Bank receipt into Meezan Operational',
            account: { account_code: '1020', account_name: 'Meezan Bank — Primary Operational' } as any,
          },
          {
            account_id: 'a0000000-0000-0000-0000-000000004010',
            line_number: 2,
            debit_amount: 0,
            credit_amount: 150000,
            memo: 'Recognized Wedding Service Revenue',
            account: { account_code: '4010', account_name: 'Wedding Photography & Cinema Revenue' } as any,
          },
        ],
      },
      {
        id: 'je-002',
        organization_id: '00000000-0000-0000-0000-000000000001',
        entry_number: 'JE-2026-0002',
        entry_date: '2026-09-03',
        brand_id: BRAND_IDS.THE_SNAP_AGENCY,
        source_module: 'agency',
        reference: 'INV-AGY-2026-08',
        description: 'Biryani Pizza Co. September Growth Retainer',
        status: 'posted',
        total_debit: 120000,
        total_credit: 120000,
        posted_at: '2026-09-03T11:30:00Z',
        created_at: '2026-09-03T11:30:00Z',
        updated_at: '2026-09-03T11:30:00Z',
        brand: { name: 'The Snap Agency', color: BRAND_COLORS['snap-agency'] } as any,
        lines: [
          {
            account_id: 'a0000000-0000-0000-0000-000000001020',
            line_number: 1,
            debit_amount: 120000,
            credit_amount: 0,
            memo: 'Direct bank transfer credit',
            account: { account_code: '1020', account_name: 'Meezan Bank — Primary Operational' } as any,
          },
          {
            account_id: 'a0000000-0000-0000-0000-000000004110',
            line_number: 2,
            debit_amount: 0,
            credit_amount: 120000,
            memo: 'Agency Retainer Revenue recognized',
            account: { account_code: '4110', account_name: 'Agency Monthly Retainer Billings' } as any,
          },
        ],
      },
      {
        id: 'je-003',
        organization_id: '00000000-0000-0000-0000-000000000001',
        entry_number: 'JE-2026-0003',
        entry_date: '2026-09-04',
        brand_id: BRAND_IDS.SNAP_MEMORIES,
        source_module: 'memories',
        reference: 'MEM-RCP-002',
        description: 'Dr. Ayesha Tariq Newborn Session Booking Retainer',
        status: 'posted',
        total_debit: 55000,
        total_credit: 55000,
        posted_at: '2026-09-04T14:00:00Z',
        created_at: '2026-09-04T14:00:00Z',
        updated_at: '2026-09-04T14:00:00Z',
        brand: { name: 'Snap Memories', color: BRAND_COLORS['snap-memories'] } as any,
        lines: [
          {
            account_id: 'a0000000-0000-0000-0000-000000001040',
            line_number: 1,
            debit_amount: 55000,
            credit_amount: 0,
            memo: 'Online card payment gateway credit',
            account: { account_code: '1040', account_name: 'Digital Payment Gateway / Stripe' } as any,
          },
          {
            account_id: 'a0000000-0000-0000-0000-000000004210',
            line_number: 2,
            debit_amount: 0,
            credit_amount: 55000,
            memo: 'Studio Session Revenue recognized',
            account: { account_code: '4210', account_name: 'Studio Portrait & Milestone Revenue' } as any,
          },
        ],
      },
    ];
  }

  const supabase = await createClient();
  let query = supabase
    .from('financial_journal_entries')
    .select('*, brand:brands(name, color), lines:financial_journal_lines(*, account:financial_chart_of_accounts(account_code, account_name))')
    .order('entry_date', { ascending: false });

  if (filters?.brandId) query = query.eq('brand_id', filters.brandId);
  if (filters?.status) query = query.eq('status', filters.status);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

// ============================================================
// 3. CONSOLIDATED CROSS-BRAND P&L (DRILL-DOWN ENABLED)
// ============================================================
export async function getConsolidatedProfitAndLoss(dateRange: string = 'Current Month'): Promise<ConsolidatedPnL> {
  const brands: ConsolidatedPnL['brands'] = [
    {
      brand_id: BRAND_IDS.THE_SNAP_SERVICE,
      brand_name: 'The Snap Service',
      brand_color: BRAND_COLORS['snap-service'],
      gross_revenue: 950000,
      direct_costs: 120000,
      gross_profit: 830000,
      gross_margin: 87.4,
      operating_expenses: 95000,
      net_operating_profit: 735000,
    },
    {
      brand_id: BRAND_IDS.THE_SNAP_AGENCY,
      brand_name: 'The Snap Agency',
      brand_color: BRAND_COLORS['snap-agency'],
      gross_revenue: 470000,
      direct_costs: 58000,
      gross_profit: 412000,
      gross_margin: 87.7,
      operating_expenses: 70000,
      net_operating_profit: 342000,
    },
    {
      brand_id: BRAND_IDS.SNAP_MEMORIES,
      brand_name: 'Snap Memories',
      brand_color: BRAND_COLORS['snap-memories'],
      gross_revenue: 247000,
      direct_costs: 24000,
      gross_profit: 223000,
      gross_margin: 90.3,
      operating_expenses: 45000,
      net_operating_profit: 178000,
    },
  ];

  const totalRev = brands.reduce((sum, b) => sum + b.gross_revenue, 0);
  const totalCogs = brands.reduce((sum, b) => sum + b.direct_costs, 0);
  const totalGrossProfit = totalRev - totalCogs;
  const grossMargin = totalRev > 0 ? parseFloat(((totalGrossProfit / totalRev) * 100).toFixed(1)) : 0;
  const totalOpEx = 320000; // Facility rent, core salaries, cloud software, HQ admin
  const netProfit = totalGrossProfit - totalOpEx;

  return {
    date_range: dateRange,
    consolidated: {
      gross_revenue: totalRev,
      direct_costs: totalCogs,
      gross_profit: totalGrossProfit,
      gross_margin: grossMargin,
      operating_expenses: totalOpEx,
      net_profit: netProfit,
    },
    brands,
  };
}

// ============================================================
// 4. REVENUE STREAM INTELLIGENCE
// ============================================================
export async function getRevenueStreamIntelligence(): Promise<RevenueStreamMetric[]> {
  const streams = [
    {
      stream_id: 'srv-wedding',
      stream_name: 'Wedding Photography & Cinema Packages',
      brand_name: 'The Snap Service',
      brand_color: BRAND_COLORS['snap-service'],
      amount: 820000,
      percentage_of_total: 49.2,
      transaction_count: 5,
      average_ticket: 164000,
    },
    {
      stream_id: 'srv-addons',
      stream_name: 'Wedding Add-ons (Drone & Luxury Albums)',
      brand_name: 'The Snap Service',
      brand_color: BRAND_COLORS['snap-service'],
      amount: 130000,
      percentage_of_total: 7.8,
      transaction_count: 4,
      average_ticket: 32500,
    },
    {
      stream_id: 'agy-retainers',
      stream_name: 'Agency Monthly Social Retainers',
      brand_name: 'The Snap Agency',
      brand_color: BRAND_COLORS['snap-agency'],
      amount: 350000,
      percentage_of_total: 21.0,
      transaction_count: 4,
      average_ticket: 87500,
    },
    {
      stream_id: 'agy-campaigns',
      stream_name: 'Performance Ad Strategy & Creative Projects',
      brand_name: 'The Snap Agency',
      brand_color: BRAND_COLORS['snap-agency'],
      amount: 120000,
      percentage_of_total: 7.2,
      transaction_count: 2,
      average_ticket: 60000,
    },
    {
      stream_id: 'mem-sessions',
      stream_name: 'Studio Sessions (Newborn, Milestone, Cake Smash)',
      brand_name: 'Snap Memories',
      brand_color: BRAND_COLORS['snap-memories'],
      amount: 185000,
      percentage_of_total: 11.1,
      transaction_count: 3,
      average_ticket: 61667,
    },
    {
      stream_id: 'mem-heirloom',
      stream_name: 'Heirloom Fine-Art Prints & Italian Floating Frames',
      brand_name: 'Snap Memories',
      brand_color: BRAND_COLORS['snap-memories'],
      amount: 62000,
      percentage_of_total: 3.7,
      transaction_count: 5,
      average_ticket: 12400,
    },
  ];

  return streams;
}

// ============================================================
// 5. EXPENSE INTELLIGENCE (COGS VS OPEX)
// ============================================================
export async function getExpenseIntelligence(): Promise<ExpenseIntelligenceBreakdown> {
  return {
    direct_cogs: {
      total: 202000,
      categories: [
        { name: 'Freelance Shooters & Drone Crew', amount: 120000, percentage: 59.4 },
        { name: 'Paid Ad Spend Passthrough', amount: 45000, percentage: 22.3 },
        { name: 'Specialist Motion Artists', amount: 13000, percentage: 6.4 },
        { name: 'Smash Cakes & Sanitized Baby Props', amount: 11000, percentage: 5.4 },
        { name: 'Fine-Art Paper & Printing Labs', amount: 13000, percentage: 6.4 },
      ],
    },
    operating_opex: {
      total: 320000,
      categories: [
        { name: 'Core Staff Payroll & Salaries', amount: 195000, percentage: 60.9 },
        { name: 'Studio & HQ Facility Rent', amount: 85000, percentage: 26.6 },
        { name: 'Electricity, Fiber Internet & Utilities', amount: 22000, percentage: 6.9 },
        { name: 'Cloud Hosting & Creative SaaS', amount: 12000, percentage: 3.8 },
        { name: 'Marketing & Brand Advertising', amount: 6000, percentage: 1.9 },
      ],
    },
    total_expenses: 522000,
  };
}

// ============================================================
// 6. RECEIVABLES & PAYABLES AGING RADAR
// ============================================================
export async function getReceivablesAgingReport(): Promise<ReceivablesAgingBucket[]> {
  return [
    {
      bucket_name: 'Current (0-30 Days)',
      amount: 320000,
      count: 4,
      items: [
        {
          client_name: 'Zainab Bilal',
          brand_name: 'Snap Memories',
          invoice_or_session: 'Cake Smash Deluxe Balance',
          date: '2026-09-04',
          balance_due: 45000,
          days_overdue: 4,
        },
        {
          client_name: 'Biryani Pizza Co.',
          brand_name: 'The Snap Agency',
          invoice_or_session: 'Q3 Creative Retainer Cycle',
          date: '2026-09-01',
          balance_due: 120000,
          days_overdue: 7,
        },
        {
          client_name: 'Hamza & Maryam',
          brand_name: 'The Snap Service',
          invoice_or_session: 'Wedding Barat Balance Due',
          date: '2026-09-02',
          balance_due: 110000,
          days_overdue: 6,
        },
        {
          client_name: 'Linker Builders',
          brand_name: 'The Snap Agency',
          invoice_or_session: 'Brand Identity Milestone 2',
          date: '2026-09-03',
          balance_due: 45000,
          days_overdue: 5,
        },
      ],
    },
    {
      bucket_name: '31-60 Days',
      amount: 115000,
      count: 2,
      items: [
        {
          client_name: 'GCH Retail Faisalabad',
          brand_name: 'The Snap Agency',
          invoice_or_session: 'Summer Campaign Remainder',
          date: '2026-08-05',
          balance_due: 65000,
          days_overdue: 34,
        },
        {
          client_name: 'Bilal & Zara',
          brand_name: 'The Snap Service',
          invoice_or_session: 'Post-Wedding Heirloom Album',
          date: '2026-08-10',
          balance_due: 50000,
          days_overdue: 29,
        },
      ],
    },
    {
      bucket_name: '61-90 Days',
      amount: 50000,
      count: 1,
      items: [
        {
          client_name: 'Royal Heritage Banquet',
          brand_name: 'The Snap Service',
          invoice_or_session: 'Commercial Venue Shoot',
          date: '2026-07-02',
          balance_due: 50000,
          days_overdue: 68,
        },
      ],
    },
    {
      bucket_name: '90+ Days Overdue',
      amount: 0,
      count: 0,
      items: [],
    },
  ];
}

export async function getPayablesSummary(): Promise<PayableBill[]> {
  if (IS_DEMO) {
    return [
      {
        id: 'bill-001',
        organization_id: '00000000-0000-0000-0000-000000000001',
        brand_id: BRAND_IDS.SNAP_MEMORIES,
        vendor_name: 'Sweet Bakes Kohinoor',
        vendor_category: 'bakery_props',
        bill_number: 'BILL-SBK-442',
        bill_date: '2026-09-04',
        due_date: '2026-09-15',
        amount: 4500,
        amount_paid: 0,
        balance_due: 4500,
        currency: 'PKR',
        status: 'unpaid',
        created_at: '2026-09-04T00:00:00Z',
      },
      {
        id: 'bill-002',
        organization_id: '00000000-0000-0000-0000-000000000001',
        brand_id: BRAND_IDS.THE_SNAP_SERVICE,
        vendor_name: 'Artisan Album Bookbinders Lahore',
        vendor_category: 'print_lab',
        bill_number: 'BILL-AAL-891',
        bill_date: '2026-09-02',
        due_date: '2026-09-20',
        amount: 28000,
        amount_paid: 10000,
        balance_due: 18000,
        currency: 'PKR',
        status: 'partially_paid',
        created_at: '2026-09-02T00:00:00Z',
      },
      {
        id: 'bill-003',
        organization_id: '00000000-0000-0000-0000-000000000001',
        brand_id: BRAND_IDS.THE_SNAP_LEGACY,
        vendor_name: 'Kohinoor One Plaza Management',
        vendor_category: 'studio_landlord',
        bill_number: 'BILL-KOP-SEP',
        bill_date: '2026-09-01',
        due_date: '2026-09-10',
        amount: 85000,
        amount_paid: 85000,
        balance_due: 0,
        currency: 'PKR',
        status: 'paid',
        created_at: '2026-09-01T00:00:00Z',
      },
    ];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('financial_payables_ledger')
    .select('*')
    .order('due_date');

  if (error) throw error;
  return data || [];
}

// ============================================================
// 7. MULTI-ACCOUNT BANKING & RECONCILIATION
// ============================================================
export async function getCashAndBankBalances(): Promise<BankAccount[]> {
  if (IS_DEMO) {
    return [
      {
        id: 'b-001',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_name: 'Meezan Bank — Primary Operational',
        account_type: 'bank',
        bank_name: 'Meezan Bank Ltd',
        account_number: '0281-0105829101',
        iban: 'PK82MEZN0002810105829101',
        currency: 'PKR',
        book_balance: 1850000,
        statement_balance: 1850000,
        last_reconciled_at: '2026-09-01T00:00:00Z',
        is_active: true,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'b-002',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_name: 'HBL — Studio & Payroll Account',
        account_type: 'bank',
        bank_name: 'Habib Bank Ltd',
        account_number: '1092-7901239801',
        iban: 'PK19HABB0010927901239801',
        currency: 'PKR',
        book_balance: 420000,
        statement_balance: 420000,
        last_reconciled_at: '2026-09-01T00:00:00Z',
        is_active: true,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-01T00:00:00Z',
      },
      {
        id: 'b-003',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_name: 'Studio Cash in Safe (Vault)',
        account_type: 'cash',
        bank_name: 'Physical Cash Safe',
        account_number: 'VAULT-01',
        currency: 'PKR',
        book_balance: 180000,
        statement_balance: 180000,
        last_reconciled_at: '2026-09-05T00:00:00Z',
        is_active: true,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-05T00:00:00Z',
      },
      {
        id: 'b-004',
        organization_id: '00000000-0000-0000-0000-000000000001',
        account_name: 'Digital Payment Gateway / Stripe',
        account_type: 'payment_gateway',
        bank_name: 'Stripe Inc',
        account_number: 'acct_1Mmemories',
        currency: 'PKR',
        book_balance: 115000,
        statement_balance: 115000,
        last_reconciled_at: '2026-09-06T00:00:00Z',
        is_active: true,
        created_at: '2026-09-01T00:00:00Z',
        updated_at: '2026-09-06T00:00:00Z',
      },
    ];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('financial_bank_accounts')
    .select('*')
    .order('account_type');

  if (error) throw error;
  return data || [];
}

// ============================================================
// 8. DOUBLE-ENTRY JOURNAL POSTING & REVERSALS (IMMUTABLE)
// ============================================================
export async function postJournalEntry(params: {
  date: string;
  brandId?: string;
  sourceModule: 'service' | 'agency' | 'memories' | 'shop' | 'manual' | 'payroll';
  reference?: string;
  description: string;
  lines: { accountId: string; debit: number; credit: number; memo?: string }[];
}) {
  const totalDebit = params.lines.reduce((sum, l) => sum + (l.debit || 0), 0);
  const totalCredit = params.lines.reduce((sum, l) => sum + (l.credit || 0), 0);

  // Strict Double-Entry check
  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    return {
      success: false,
      error: `Double-entry unbalance: Total Debits (PKR ${totalDebit}) must equal Total Credits (PKR ${totalCredit}).`,
    };
  }

  if (IS_DEMO) {
    return {
      success: true,
      entryNumber: `JE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      message: 'Journal entry posted successfully to general ledger.',
    };
  }

  const supabase = await createClient();
  const entryNumber = `JE-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;

  const { data: entry, error: entryErr } = await supabase
    .from('financial_journal_entries')
    .insert({
      entry_number: entryNumber,
      entry_date: params.date,
      brand_id: params.brandId || null,
      source_module: params.sourceModule,
      reference: params.reference || null,
      description: params.description,
      total_debit: totalDebit,
      total_credit: totalCredit,
      status: 'posted',
    })
    .select()
    .single();

  if (entryErr) throw entryErr;

  // Insert lines
  const linesToInsert = params.lines.map((l, idx) => ({
    entry_id: entry.id,
    account_id: l.accountId,
    brand_id: params.brandId || null,
    line_number: idx + 1,
    debit_amount: l.debit,
    credit_amount: l.credit,
    memo: l.memo || null,
  }));

  const { error: linesErr } = await supabase
    .from('financial_journal_lines')
    .insert(linesToInsert);

  if (linesErr) throw linesErr;

  return { success: true, entryNumber, message: 'Journal entry posted successfully.' };
}

export async function reverseJournalEntry(entryId: string, reason: string) {
  if (!reason.trim()) {
    return { success: false, error: 'Mandatory audit reason required to reverse a posted journal entry.' };
  }

  if (IS_DEMO) {
    return {
      success: true,
      reversalNumber: `REV-${Date.now().toString().slice(-4)}`,
      message: 'Reversal journal entry posted with audit record.',
    };
  }

  const supabase = await createClient();

  // Fetch original entry and lines
  const { data: original, error } = await supabase
    .from('financial_journal_entries')
    .select('*, lines:financial_journal_lines(*)')
    .eq('id', entryId)
    .single();

  if (error || !original) {
    return { success: false, error: 'Original journal entry not found.' };
  }

  if (original.status === 'reversed') {
    return { success: false, error: 'This journal entry has already been reversed.' };
  }

  // Create reversing entry (flip debits and credits)
  const revNumber = `REV-${original.entry_number}`;
  const { data: revEntry, error: revErr } = await supabase
    .from('financial_journal_entries')
    .insert({
      entry_number: revNumber,
      entry_date: new Date().toISOString().split('T')[0],
      brand_id: original.brand_id,
      source_module: original.source_module,
      source_record_id: original.id,
      reference: `Reversal of ${original.entry_number}`,
      description: `REVERSAL: ${original.description} (Reason: ${reason})`,
      total_debit: original.total_credit,
      total_credit: original.total_debit,
      status: 'posted',
    })
    .select()
    .single();

  if (revErr) throw revErr;

  // Swap lines
  const reversedLines = (original.lines || []).map((line: any, idx: number) => ({
    entry_id: revEntry.id,
    account_id: line.account_id,
    brand_id: line.brand_id,
    line_number: idx + 1,
    debit_amount: line.credit_amount,
    credit_amount: line.debit_amount,
    memo: `Reversing line ${line.line_number}: ${line.memo || ''}`,
  }));

  await supabase.from('financial_journal_lines').insert(reversedLines);

  // Mark original as reversed
  await supabase
    .from('financial_journal_entries')
    .update({ status: 'reversed' })
    .eq('id', original.id);

  // Log audit record
  await supabase.from('financial_reversals_audit').insert({
    original_journal_entry_id: original.id,
    reversal_journal_entry_id: revEntry.id,
    reason,
  });

  return { success: true, reversalNumber: revNumber, message: 'Reversal entry posted successfully.' };
}

// ============================================================
// 9. CEO EXECUTIVE INTELLIGENCE RADAR
// ============================================================
export async function getExecutiveIntelligenceRadar(): Promise<ExecutiveIntelligenceRadar> {
  const pnl = await getConsolidatedProfitAndLoss('Current Month');
  const revenueStreams = await getRevenueStreamIntelligence();
  const expenseBreakdown = await getExpenseIntelligence();
  const aging = await getReceivablesAgingReport();
  const banks = await getCashAndBankBalances();

  const totalCash = banks.find(b => b.account_type === 'cash')?.book_balance || 180000;
  const totalBank = banks.filter(b => b.account_type === 'bank' || b.account_type === 'payment_gateway').reduce((s, b) => s + b.book_balance, 0);
  const totalLiquidity = totalCash + totalBank;

  const totalAR = aging.reduce((sum, a) => sum + a.amount, 0);
  const totalAP = 22500; // Unpaid vendor balances
  const monthlyBurn = expenseBreakdown.total_expenses;
  const runwayMonths = monthlyBurn > 0 ? parseFloat((totalLiquidity / monthlyBurn).toFixed(1)) : 12;

  const alerts: ExecutiveAlert[] = [
    {
      id: 'alt-01',
      severity: 'warning',
      title: 'Accounts Receivable Attention',
      message: 'PKR 165,000 in client balances is aged beyond 30 days. Recommend automated WhatsApp reminder dispatch.',
      action_href: '/finance/receivables-aging',
      action_label: 'View Aging Radar',
    },
    {
      id: 'alt-02',
      severity: 'success',
      title: 'Strong Operating Margin',
      message: 'Consolidated Gross Margin is at 87.8% (well above the 80% enterprise benchmark).',
    },
    {
      id: 'alt-03',
      severity: 'info',
      title: 'Cash Runway Status',
      message: `Healthy liquidity: PKR ${(totalLiquidity / 1000000).toFixed(2)}M across Meezan, HBL, and Vault (${runwayMonths} months runway).`,
      action_href: '/finance/banking',
      action_label: 'Manage Accounts',
    },
  ];

  return {
    kpis: {
      total_revenue: pnl.consolidated.gross_revenue,
      total_direct_cost: pnl.consolidated.direct_costs,
      gross_profit: pnl.consolidated.gross_profit,
      gross_margin: pnl.consolidated.gross_margin,
      operating_expenses: pnl.consolidated.operating_expenses,
      net_profit: pnl.consolidated.net_profit,
      net_margin: parseFloat(((pnl.consolidated.net_profit / pnl.consolidated.gross_revenue) * 100).toFixed(1)),
      cash_in_hand: totalCash,
      bank_balance: totalBank,
      total_liquidity: totalLiquidity,
      accounts_receivable: totalAR,
      accounts_payable: totalAP,
      monthly_burn_rate: monthlyBurn,
      cash_runway_months: runwayMonths,
      mom_revenue_growth: 18.5,
    },
    best_performing_brand: {
      brand_name: 'The Snap Service',
      revenue: 950000,
      gross_margin: 87.4,
    },
    highest_revenue_stream: {
      stream_name: 'Wedding Photography & Cinema Packages',
      amount: 820000,
    },
    alerts,
    pnl,
    revenue_streams: revenueStreams,
    expense_breakdown: expenseBreakdown,
    aging,
  };
}
