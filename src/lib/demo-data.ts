// ============================================================
// THE SNAP LEGACY ERP — Demo Data
// ============================================================
// Mock data used when NEXT_PUBLIC_DEMO_MODE=true
// ============================================================

import type {
  DashboardStats,
  BrandPerformance,
  UserWithDetails,
} from '@/lib/types/database';

export const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// ============================================================
// DEMO USER (Super Admin)
// ============================================================
export const DEMO_USER: UserWithDetails = {
  id: '00000000-0000-0000-0000-000000000001',
  full_name: 'Snap Admin',
  email: 'admin@thesnaplegacy.com',
  phone: '+92 300 1234567',
  avatar_url: null,
  status: 'active',
  last_login_at: new Date().toISOString(),
  created_at: '2024-01-01T00:00:00Z',
  updated_at: new Date().toISOString(),
  roles: [
    {
      id: 'ur-001',
      user_id: '00000000-0000-0000-0000-000000000001',
      role_id: 'r-001',
      assigned_by: null,
      assigned_at: '2024-01-01T00:00:00Z',
      role: {
        id: 'r-001',
        name: 'CEO / Super Admin',
        slug: 'ceo_super_admin',
        description: 'Full system access',
        level: 100,
        is_system: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    },
  ],
  brand_access: [],
  permissions: ['*:*'],
};

// ============================================================
// BRANDS
// ============================================================
export const DEMO_BRANDS = [
  {
    id: 'b0000000-0000-0000-0000-000000000001',
    organization_id: 'org-001',
    name: 'The Snap Legacy',
    slug: 'the-snap-legacy',
    description: 'Parent holding company',
    logo_url: null,
    color: '#C9A84C',
    type: 'parent',
    status: 'active',
    is_parent: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    organization_id: 'org-001',
    name: 'The Snap Service',
    slug: 'the-snap-service',
    description: 'Event management & production',
    logo_url: null,
    color: '#3B82F6',
    type: 'subsidiary',
    status: 'active',
    is_parent: false,
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000003',
    organization_id: 'org-001',
    name: 'The Snap Agency',
    slug: 'the-snap-agency',
    description: 'Creative & marketing agency',
    logo_url: null,
    color: '#8B5CF6',
    type: 'subsidiary',
    status: 'active',
    is_parent: false,
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000004',
    organization_id: 'org-001',
    name: 'Snap Memories',
    slug: 'snap-memories',
    description: 'Photography & videography',
    logo_url: null,
    color: '#EC4899',
    type: 'subsidiary',
    status: 'active',
    is_parent: false,
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z',
  },
];

// ============================================================
// CLIENTS
// ============================================================
export const DEMO_CLIENTS = [
  {
    id: 'c-001',
    name: 'Ahmed Raza',
    email: 'ahmed.raza@outlook.com',
    phone: '+92 321 9876543',
    company: 'Raza Enterprises',
    address: '45 Gulberg III',
    city: 'Lahore',
    country: 'Pakistan',
    type: 'company',
    source: 'referral',
    notes: null,
    status: 'active',
    is_archived: false,
    archived_at: null,
    archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-03-10T00:00:00Z',
    client_brand_associations: [
      { id: 'cba-001', brand: { id: 'b0000000-0000-0000-0000-000000000002', name: 'The Snap Service', slug: 'the-snap-service', color: '#3B82F6' } },
    ],
  },
  {
    id: 'c-002',
    name: 'Sara Khan',
    email: 'sara.khan@gmail.com',
    phone: '+92 333 4567890',
    company: null,
    address: '12 DHA Phase 5',
    city: 'Karachi',
    country: 'Pakistan',
    type: 'individual',
    source: 'instagram',
    notes: 'VIP wedding client',
    status: 'active',
    is_archived: false,
    archived_at: null,
    archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-04-05T00:00:00Z',
    updated_at: '2024-04-05T00:00:00Z',
    client_brand_associations: [
      { id: 'cba-002', brand: { id: 'b0000000-0000-0000-0000-000000000002', name: 'The Snap Service', slug: 'the-snap-service', color: '#3B82F6' } },
      { id: 'cba-003', brand: { id: 'b0000000-0000-0000-0000-000000000004', name: 'Snap Memories', slug: 'snap-memories', color: '#EC4899' } },
    ],
  },
  {
    id: 'c-003',
    name: 'Bilal Motors',
    email: 'info@bilalmotors.pk',
    phone: '+92 42 35761234',
    company: 'Bilal Motors Pvt Ltd',
    address: 'Main Boulevard, Johar Town',
    city: 'Lahore',
    country: 'Pakistan',
    type: 'company',
    source: 'website',
    notes: null,
    status: 'active',
    is_archived: false,
    archived_at: null,
    archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-05-20T00:00:00Z',
    updated_at: '2024-05-20T00:00:00Z',
    client_brand_associations: [
      { id: 'cba-004', brand: { id: 'b0000000-0000-0000-0000-000000000003', name: 'The Snap Agency', slug: 'the-snap-agency', color: '#8B5CF6' } },
    ],
  },
  {
    id: 'c-004',
    name: 'Fatima Hassan',
    email: 'fatima.h@yahoo.com',
    phone: '+92 300 1112233',
    company: null,
    address: 'Bahria Town Phase 7',
    city: 'Islamabad',
    country: 'Pakistan',
    type: 'individual',
    source: 'referral',
    notes: 'Corporate event series',
    status: 'active',
    is_archived: false,
    archived_at: null,
    archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
    client_brand_associations: [
      { id: 'cba-005', brand: { id: 'b0000000-0000-0000-0000-000000000002', name: 'The Snap Service', slug: 'the-snap-service', color: '#3B82F6' } },
    ],
  },
];

// ============================================================
// LEADS
// ============================================================
export const DEMO_LEADS = [
  {
    id: 'l-001', brand_id: 'b0000000-0000-0000-0000-000000000002', client_id: null,
    title: 'Grand Wedding Reception — Dec 2024', description: 'Full event management for 800+ guests',
    source: 'referral', status: 'proposal', value: 2500000, currency: 'PKR',
    assigned_to: null, expected_close_date: '2024-11-15', notes: null,
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-08-01T00:00:00Z', updated_at: '2024-08-01T00:00:00Z',
    brand: { name: 'The Snap Service', color: '#3B82F6' },
    client: null, assigned_user: null,
  },
  {
    id: 'l-002', brand_id: 'b0000000-0000-0000-0000-000000000003', client_id: 'c-003',
    title: 'Bilal Motors Brand Refresh', description: 'Complete rebranding + social media',
    source: 'website', status: 'negotiation', value: 850000, currency: 'PKR',
    assigned_to: null, expected_close_date: '2024-10-01', notes: null,
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-08-10T00:00:00Z', updated_at: '2024-08-10T00:00:00Z',
    brand: { name: 'The Snap Agency', color: '#8B5CF6' },
    client: { name: 'Bilal Motors' }, assigned_user: null,
  },
  {
    id: 'l-003', brand_id: 'b0000000-0000-0000-0000-000000000004', client_id: null,
    title: 'Destination Wedding Shoot — Turkey', description: '3-day destination wedding coverage',
    source: 'instagram', status: 'qualified', value: 1200000, currency: 'PKR',
    assigned_to: null, expected_close_date: '2024-12-01', notes: null,
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-08-15T00:00:00Z', updated_at: '2024-08-15T00:00:00Z',
    brand: { name: 'Snap Memories', color: '#EC4899' },
    client: null, assigned_user: null,
  },
  {
    id: 'l-004', brand_id: 'b0000000-0000-0000-0000-000000000002', client_id: 'c-004',
    title: 'Corporate Gala Night 2025', description: 'Annual corporate event planning',
    source: 'referral', status: 'new', value: 1800000, currency: 'PKR',
    assigned_to: null, expected_close_date: '2025-02-01', notes: null,
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-09-01T00:00:00Z', updated_at: '2024-09-01T00:00:00Z',
    brand: { name: 'The Snap Service', color: '#3B82F6' },
    client: { name: 'Fatima Hassan' }, assigned_user: null,
  },
];

// ============================================================
// PROJECTS
// ============================================================
export const DEMO_PROJECTS = [
  {
    id: 'p-001', brand_id: 'b0000000-0000-0000-0000-000000000002', client_id: 'c-001', lead_id: null,
    name: 'Raza Family Mehndi Night', description: 'Full production for mehndi ceremony',
    status: 'in_progress', start_date: '2024-09-15', end_date: '2024-10-05',
    budget: 750000, currency: 'PKR', notes: null,
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-07-20T00:00:00Z', updated_at: '2024-07-20T00:00:00Z',
    brand: { name: 'The Snap Service', color: '#3B82F6' },
    client: { name: 'Ahmed Raza' },
  },
  {
    id: 'p-002', brand_id: 'b0000000-0000-0000-0000-000000000003', client_id: 'c-003', lead_id: null,
    name: 'Bilal Motors Social Campaign', description: 'Q4 social media marketing campaign',
    status: 'planning', start_date: '2024-10-01', end_date: '2024-12-31',
    budget: 450000, currency: 'PKR', notes: null,
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-08-05T00:00:00Z', updated_at: '2024-08-05T00:00:00Z',
    brand: { name: 'The Snap Agency', color: '#8B5CF6' },
    client: { name: 'Bilal Motors' },
  },
  {
    id: 'p-003', brand_id: 'b0000000-0000-0000-0000-000000000004', client_id: 'c-002', lead_id: null,
    name: 'Sara & Ali Wedding Photography', description: 'Full wedding photography + album',
    status: 'in_progress', start_date: '2024-09-01', end_date: '2024-11-30',
    budget: 600000, currency: 'PKR', notes: null,
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-06-15T00:00:00Z', updated_at: '2024-06-15T00:00:00Z',
    brand: { name: 'Snap Memories', color: '#EC4899' },
    client: { name: 'Sara Khan' },
  },
];

// ============================================================
// EVENTS
// ============================================================
export const DEMO_EVENTS = [
  {
    id: 'e-001', brand_id: 'b0000000-0000-0000-0000-000000000002', project_id: 'p-001', client_id: 'c-001',
    name: 'Raza Mehndi Night', description: 'Grand mehndi ceremony',
    event_date: '2024-10-05T18:00:00Z', end_date: '2024-10-06T02:00:00Z',
    location: 'Lahore', venue: 'Pearl Continental Hotel',
    status: 'upcoming', notes: null,
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-07-20T00:00:00Z', updated_at: '2024-07-20T00:00:00Z',
    brand: { name: 'The Snap Service', color: '#3B82F6' },
  },
  {
    id: 'e-002', brand_id: 'b0000000-0000-0000-0000-000000000002', project_id: null, client_id: null,
    name: 'Legacy Annual Showcase', description: 'Annual portfolio showcase event',
    event_date: '2024-11-20T17:00:00Z', end_date: '2024-11-20T23:00:00Z',
    location: 'Islamabad', venue: 'Marriott Hotel',
    status: 'upcoming', notes: null,
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-08-01T00:00:00Z', updated_at: '2024-08-01T00:00:00Z',
    brand: { name: 'The Snap Service', color: '#3B82F6' },
  },
];

// ============================================================
// FINANCIAL DATA
// ============================================================
export const DEMO_TRANSACTIONS = [
  {
    id: 't-001', brand_id: 'b0000000-0000-0000-0000-000000000002',
    account_id: 'a-001', category_id: 'cat-001',
    type: 'credit', amount: 350000, currency: 'PKR',
    date: '2024-09-01', description: 'Raza Family — Advance Payment',
    reference: 'INV-2024-001', related_transaction_id: null,
    is_reversal: false, client_id: 'c-001', project_id: 'p-001',
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-09-01T10:00:00Z',
    account: { name: 'JazzCash Business' }, category: { name: 'Event Revenue' },
    brand: { name: 'The Snap Service', color: '#3B82F6' },
  },
  {
    id: 't-002', brand_id: 'b0000000-0000-0000-0000-000000000003',
    account_id: 'a-002', category_id: 'cat-002',
    type: 'credit', amount: 200000, currency: 'PKR',
    date: '2024-09-03', description: 'Bilal Motors — Campaign Retainer',
    reference: 'INV-2024-002', related_transaction_id: null,
    is_reversal: false, client_id: 'c-003', project_id: 'p-002',
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-09-03T11:00:00Z',
    account: { name: 'HBL Business Account' }, category: { name: 'Agency Revenue' },
    brand: { name: 'The Snap Agency', color: '#8B5CF6' },
  },
  {
    id: 't-003', brand_id: 'b0000000-0000-0000-0000-000000000002',
    account_id: 'a-001', category_id: 'cat-003',
    type: 'debit', amount: 85000, currency: 'PKR',
    date: '2024-09-04', description: 'Venue Booking Deposit — PC Hotel',
    reference: 'EXP-2024-001', related_transaction_id: null,
    is_reversal: false, client_id: null, project_id: 'p-001',
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-09-04T09:00:00Z',
    account: { name: 'JazzCash Business' }, category: { name: 'Venue Costs' },
    brand: { name: 'The Snap Service', color: '#3B82F6' },
  },
  {
    id: 't-004', brand_id: 'b0000000-0000-0000-0000-000000000004',
    account_id: 'a-002', category_id: 'cat-001',
    type: 'credit', amount: 300000, currency: 'PKR',
    date: '2024-09-05', description: 'Sara Khan — Wedding Photography Package',
    reference: 'INV-2024-003', related_transaction_id: null,
    is_reversal: false, client_id: 'c-002', project_id: 'p-003',
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-09-05T14:00:00Z',
    account: { name: 'HBL Business Account' }, category: { name: 'Photography Revenue' },
    brand: { name: 'Snap Memories', color: '#EC4899' },
  },
  {
    id: 't-005', brand_id: 'b0000000-0000-0000-0000-000000000003',
    account_id: 'a-001', category_id: 'cat-003',
    type: 'debit', amount: 45000, currency: 'PKR',
    date: '2024-09-06', description: 'Adobe Creative Cloud — Annual License',
    reference: 'EXP-2024-002', related_transaction_id: null,
    is_reversal: false, client_id: null, project_id: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-09-06T08:00:00Z',
    account: { name: 'JazzCash Business' }, category: { name: 'Software & Tools' },
    brand: { name: 'The Snap Agency', color: '#8B5CF6' },
  },
];

export const DEMO_PAYMENTS = [
  {
    id: 'pay-001', brand_id: 'b0000000-0000-0000-0000-000000000002',
    client_id: 'c-001', project_id: 'p-001', transaction_id: null,
    amount: 400000, currency: 'PKR', method: 'bank_transfer',
    date: '2024-10-10', due_date: '2024-10-15', status: 'pending',
    reference: 'PAY-2024-001', notes: 'Remaining balance for mehndi event',
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-09-01T00:00:00Z', updated_at: '2024-09-01T00:00:00Z',
    client: { name: 'Ahmed Raza' }, brand: { name: 'The Snap Service', color: '#3B82F6' },
  },
  {
    id: 'pay-002', brand_id: 'b0000000-0000-0000-0000-000000000004',
    client_id: 'c-002', project_id: 'p-003', transaction_id: null,
    amount: 300000, currency: 'PKR', method: 'cash',
    date: '2024-11-01', due_date: '2024-11-15', status: 'pending',
    reference: 'PAY-2024-002', notes: 'Final payment post-album delivery',
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-09-05T00:00:00Z', updated_at: '2024-09-05T00:00:00Z',
    client: { name: 'Sara Khan' }, brand: { name: 'Snap Memories', color: '#EC4899' },
  },
  {
    id: 'pay-003', brand_id: 'b0000000-0000-0000-0000-000000000003',
    client_id: 'c-003', project_id: 'p-002', transaction_id: null,
    amount: 250000, currency: 'PKR', method: 'bank_transfer',
    date: '2024-10-30', due_date: '2024-11-05', status: 'pending',
    reference: 'PAY-2024-003', notes: 'Social campaign milestone #2',
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-08-05T00:00:00Z', updated_at: '2024-08-05T00:00:00Z',
    client: { name: 'Bilal Motors' }, brand: { name: 'The Snap Agency', color: '#8B5CF6' },
  },
];

export const DEMO_ACCOUNTS = [
  {
    id: 'a-001', brand_id: null, name: 'JazzCash Business', type: 'mobile_wallet',
    account_number: '0300-1234567', bank_name: null, balance: 520000, currency: 'PKR',
    description: 'Primary mobile wallet', status: 'active',
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-09-06T00:00:00Z',
    brand: null,
  },
  {
    id: 'a-002', brand_id: null, name: 'HBL Business Account', type: 'bank',
    account_number: '1234-5678-9012', bank_name: 'Habib Bank Limited', balance: 1850000, currency: 'PKR',
    description: 'Primary business bank account', status: 'active',
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-09-06T00:00:00Z',
    brand: null,
  },
  {
    id: 'a-003', brand_id: null, name: 'Office Cash', type: 'cash',
    account_number: null, bank_name: null, balance: 175000, currency: 'PKR',
    description: 'Petty cash for office expenses', status: 'active',
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-09-06T00:00:00Z',
    brand: null,
  },
];

export const DEMO_EXPENSES = [
  {
    id: 'exp-001', brand_id: 'b0000000-0000-0000-0000-000000000002', transaction_id: 't-003',
    category_id: 'cat-003', account_id: 'a-001', amount: 85000, currency: 'PKR',
    description: 'Venue Booking Deposit — PC Hotel', date: '2024-09-04', vendor: 'Pearl Continental',
    receipt_url: null, approved_by: null, status: 'approved',
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-09-04T00:00:00Z', updated_at: '2024-09-04T00:00:00Z',
    category: { name: 'Venue Costs' }, brand: { name: 'The Snap Service', color: '#3B82F6' }, account: { name: 'JazzCash Business' },
  },
  {
    id: 'exp-002', brand_id: 'b0000000-0000-0000-0000-000000000003', transaction_id: 't-005',
    category_id: 'cat-004', account_id: 'a-001', amount: 45000, currency: 'PKR',
    description: 'Adobe Creative Cloud Annual', date: '2024-09-06', vendor: 'Adobe Inc.',
    receipt_url: null, approved_by: null, status: 'paid',
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-09-06T00:00:00Z', updated_at: '2024-09-06T00:00:00Z',
    category: { name: 'Software & Tools' }, brand: { name: 'The Snap Agency', color: '#8B5CF6' }, account: { name: 'JazzCash Business' },
  },
];

// ============================================================
// DASHBOARD STATS
// ============================================================
export const DEMO_DASHBOARD_STATS: DashboardStats = {
  total_revenue: 850000,
  total_expenses: 130000,
  gross_profit: 720000,
  net_profit: 720000,
  cash_balance: 175000,
  bank_balance: 1850000,
  receivables: 950000,
  payables: 85000,
};

export const DEMO_BRAND_PERFORMANCE: BrandPerformance[] = [
  {
    brand: DEMO_BRANDS[1] as BrandPerformance['brand'],
    revenue: 350000,
    expenses: 85000,
    active_projects: 1,
    active_leads: 2,
  },
  {
    brand: DEMO_BRANDS[2] as BrandPerformance['brand'],
    revenue: 200000,
    expenses: 45000,
    active_projects: 1,
    active_leads: 1,
  },
  {
    brand: DEMO_BRANDS[3] as BrandPerformance['brand'],
    revenue: 300000,
    expenses: 0,
    active_projects: 1,
    active_leads: 1,
  },
];

// ============================================================
// PEOPLE
// ============================================================
export const DEMO_EMPLOYEES = [
  {
    id: 'emp-001', user_id: null, brand_id: 'b0000000-0000-0000-0000-000000000002',
    employee_code: 'TSS-001', name: 'Usman Ali', email: 'usman@thesnapservice.com',
    phone: '+92 301 5551234', cnic: '35202-1234567-1', position: 'Event Manager',
    department: 'Operations', hire_date: '2023-06-01', end_date: null,
    salary: 120000, currency: 'PKR', employment_type: 'full_time', status: 'active',
    emergency_contact: 'Father — Tariq Ali', emergency_phone: '+92 300 9998877',
    address: 'Model Town, Lahore', notes: null,
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2023-06-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    brand: { name: 'The Snap Service', color: '#3B82F6' },
  },
  {
    id: 'emp-002', user_id: null, brand_id: 'b0000000-0000-0000-0000-000000000003',
    employee_code: 'TSA-001', name: 'Ayesha Malik', email: 'ayesha@thesnapagency.com',
    phone: '+92 333 7779999', cnic: '35201-7654321-2', position: 'Creative Director',
    department: 'Creative', hire_date: '2023-09-15', end_date: null,
    salary: 180000, currency: 'PKR', employment_type: 'full_time', status: 'active',
    emergency_contact: 'Spouse — Kamran Malik', emergency_phone: '+92 321 4443322',
    address: 'DHA Phase 6, Lahore', notes: null,
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2023-09-15T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    brand: { name: 'The Snap Agency', color: '#8B5CF6' },
  },
  {
    id: 'emp-003', user_id: null, brand_id: 'b0000000-0000-0000-0000-000000000004',
    employee_code: 'SM-001', name: 'Hassan Rauf', email: 'hassan@snapmemories.com',
    phone: '+92 312 8889999', cnic: '35202-9876543-3', position: 'Lead Photographer',
    department: 'Photography', hire_date: '2024-01-10', end_date: null,
    salary: 150000, currency: 'PKR', employment_type: 'full_time', status: 'active',
    emergency_contact: 'Mother — Rukhsana Rauf', emergency_phone: '+92 300 1112233',
    address: 'Gulberg, Lahore', notes: null,
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-01-10T00:00:00Z', updated_at: '2024-01-10T00:00:00Z',
    brand: { name: 'Snap Memories', color: '#EC4899' },
  },
];

export const DEMO_FREELANCERS = [
  {
    id: 'fr-001', brand_id: 'b0000000-0000-0000-0000-000000000004',
    name: 'Zainab Qureshi', email: 'zainab.q@gmail.com', phone: '+92 345 6667788',
    cnic: null, specialization: 'Drone Videography', portfolio_url: 'https://zainabq.com',
    rate: 25000, rate_type: 'per_event', currency: 'PKR', status: 'active',
    notes: 'Excellent drone work', is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-03-01T00:00:00Z', updated_at: '2024-03-01T00:00:00Z',
    brand: { name: 'Snap Memories', color: '#EC4899' },
  },
  {
    id: 'fr-002', brand_id: 'b0000000-0000-0000-0000-000000000003',
    name: 'Ali Haider', email: 'ali.h@gmail.com', phone: '+92 300 3334455',
    cnic: null, specialization: 'Motion Graphics', portfolio_url: null,
    rate: 5000, rate_type: 'per_hour', currency: 'PKR', status: 'active',
    notes: null, is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-04-15T00:00:00Z', updated_at: '2024-04-15T00:00:00Z',
    brand: { name: 'The Snap Agency', color: '#8B5CF6' },
  },
];

export const DEMO_ASSETS = [
  {
    id: 'as-001', brand_id: 'b0000000-0000-0000-0000-000000000004',
    name: 'Canon R5 Body', type: 'Camera', serial_number: 'CR5-2024-001',
    model: 'EOS R5', manufacturer: 'Canon',
    purchase_date: '2024-01-15', purchase_price: 850000, current_value: 750000,
    currency: 'PKR', condition: 'good', location: 'Office', assigned_to: 'emp-003',
    warranty_expiry: '2026-01-15', notes: null, status: 'in_use',
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-01-15T00:00:00Z', updated_at: '2024-01-15T00:00:00Z',
    brand: { name: 'Snap Memories', color: '#EC4899' },
  },
  {
    id: 'as-002', brand_id: 'b0000000-0000-0000-0000-000000000003',
    name: 'MacBook Pro 16"', type: 'Laptop', serial_number: 'MBP-2024-001',
    model: 'MacBook Pro M3 Max', manufacturer: 'Apple',
    purchase_date: '2024-02-10', purchase_price: 1200000, current_value: 1050000,
    currency: 'PKR', condition: 'good', location: 'Agency Office', assigned_to: 'emp-002',
    warranty_expiry: '2025-02-10', notes: null, status: 'in_use',
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-02-10T00:00:00Z', updated_at: '2024-02-10T00:00:00Z',
    brand: { name: 'The Snap Agency', color: '#8B5CF6' },
  },
  {
    id: 'as-003', brand_id: 'b0000000-0000-0000-0000-000000000002',
    name: 'DJI Ronin RS3 Pro', type: 'Equipment', serial_number: 'DJI-RS3-001',
    model: 'Ronin RS3 Pro', manufacturer: 'DJI',
    purchase_date: '2024-03-20', purchase_price: 180000, current_value: 155000,
    currency: 'PKR', condition: 'good', location: 'Equipment Room', assigned_to: null,
    warranty_expiry: '2025-03-20', notes: null, status: 'active',
    is_archived: false, archived_at: null, archived_by: null,
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2024-03-20T00:00:00Z', updated_at: '2024-03-20T00:00:00Z',
    brand: { name: 'The Snap Service', color: '#3B82F6' },
  },
];

export const DEMO_ROLES = [
  { id: 'r-001', name: 'CEO / Super Admin', slug: 'ceo_super_admin', description: 'Full system access', level: 100, is_system: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'r-002', name: 'Legacy Management', slug: 'legacy_management', description: 'Manage the parent brand', level: 90, is_system: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'r-003', name: 'Finance Manager', slug: 'finance_manager', description: 'Full financial access', level: 80, is_system: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'r-004', name: 'Brand Manager', slug: 'brand_manager', description: 'Manage assigned brands', level: 70, is_system: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'r-005', name: 'Staff', slug: 'staff', description: 'Basic staff access', level: 10, is_system: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

export const DEMO_USERS = [
  {
    ...DEMO_USER,
    user_roles: [{ id: 'ur-001', user_id: DEMO_USER.id, role_id: 'r-001', assigned_by: null, assigned_at: '2024-01-01T00:00:00Z', role: DEMO_ROLES[0] }],
    user_brand_access: [],
  },
];

export const DEMO_AUDIT_LOGS = [
  {
    id: 'al-001', user_id: '00000000-0000-0000-0000-000000000001',
    action: 'login', module: 'auth', record_id: null,
    old_value: null, new_value: null, ip_address: '192.168.1.1', user_agent: 'Chrome',
    created_at: new Date().toISOString(),
    user: { full_name: 'Snap Admin', email: 'admin@thesnaplegacy.com' },
  },
  {
    id: 'al-002', user_id: '00000000-0000-0000-0000-000000000001',
    action: 'created', module: 'clients', record_id: 'c-001',
    old_value: null, new_value: { name: 'Ahmed Raza' }, ip_address: '192.168.1.1', user_agent: 'Chrome',
    created_at: '2024-09-05T12:00:00Z',
    user: { full_name: 'Snap Admin', email: 'admin@thesnaplegacy.com' },
  },
  {
    id: 'al-003', user_id: '00000000-0000-0000-0000-000000000001',
    action: 'created', module: 'finance', record_id: 't-001',
    old_value: null, new_value: { description: 'Raza Family — Advance Payment', amount: 350000 }, ip_address: '192.168.1.1', user_agent: 'Chrome',
    created_at: '2024-09-04T10:00:00Z',
    user: { full_name: 'Snap Admin', email: 'admin@thesnaplegacy.com' },
  },
];

export const DEMO_SETTINGS = [
  { id: 's-001', brand_id: null, category: 'general', key: 'company_name', value: '"The Snap Legacy"', description: 'Company display name', updated_by: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 's-002', brand_id: null, category: 'general', key: 'default_currency', value: '"PKR"', description: 'Default currency for transactions', updated_by: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 's-003', brand_id: null, category: 'finance', key: 'tax_rate', value: '17', description: 'Default tax rate percentage', updated_by: null, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];

export const DEMO_FINANCIAL_CATEGORIES = [
  { id: 'cat-001', brand_id: null, name: 'Event Revenue', type: 'income', parent_id: null, description: 'Income from events', is_system: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-002', brand_id: null, name: 'Agency Revenue', type: 'income', parent_id: null, description: 'Income from agency work', is_system: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-003', brand_id: null, name: 'Venue Costs', type: 'expense', parent_id: null, description: 'Venue related expenses', is_system: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-004', brand_id: null, name: 'Software & Tools', type: 'expense', parent_id: null, description: 'Software subscriptions', is_system: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
  { id: 'cat-005', brand_id: null, name: 'Photography Revenue', type: 'income', parent_id: null, description: 'Income from photography', is_system: true, created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z' },
];
