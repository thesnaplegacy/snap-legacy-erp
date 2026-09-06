// ============================================================
// THE SNAP LEGACY ERP — Constants
// ============================================================

export const APP_NAME = 'The Snap Legacy';
export const APP_DESCRIPTION = 'The Snap Legacy ERP — Central Command';

// Brand IDs (matching seed data)
export const BRAND_IDS = {
  THE_SNAP_LEGACY: 'b0000000-0000-0000-0000-000000000001',
  THE_SNAP_SERVICE: 'b0000000-0000-0000-0000-000000000002',
  THE_SNAP_AGENCY: 'b0000000-0000-0000-0000-000000000003',
  SNAP_MEMORIES: 'b0000000-0000-0000-0000-000000000004',
} as const;

// Role slugs
export const ROLE_SLUGS = {
  CEO_SUPER_ADMIN: 'ceo_super_admin',
  LEGACY_MANAGEMENT: 'legacy_management',
  FINANCE_MANAGER: 'finance_manager',
  HR_MANAGER: 'hr_manager',
  BRAND_MANAGER: 'brand_manager',
  STAFF: 'staff',
} as const;

// Brand colors
export const BRAND_COLORS: Record<string, string> = {
  'the-snap-legacy': '#C9A84C',
  'the-snap-service': '#3B82F6',
  'the-snap-agency': '#8B5CF6',
  'snap-memories': '#EC4899',
};

// Currency
export const DEFAULT_CURRENCY = 'PKR';

// Status labels
export const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
  frozen: 'Frozen',
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
  planning: 'Planning',
  in_progress: 'In Progress',
  on_hold: 'On Hold',
  completed: 'Completed',
  cancelled: 'Cancelled',
  upcoming: 'Upcoming',
  postponed: 'Postponed',
  draft: 'Draft',
  sent: 'Sent',
  accepted: 'Accepted',
  rejected: 'Rejected',
  expired: 'Expired',
  revised: 'Revised',
  pending: 'Pending',
  failed: 'Failed',
  refunded: 'Refunded',
  partial: 'Partial',
  approved: 'Approved',
  paid: 'Paid',
  terminated: 'Terminated',
  on_leave: 'On Leave',
  todo: 'To Do',
  review: 'Review',
  credit: 'Credit',
  debit: 'Debit',
};

// Status color variants for badges
export const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'default',
  inactive: 'secondary',
  suspended: 'destructive',
  completed: 'default',
  cancelled: 'destructive',
  pending: 'outline',
  in_progress: 'default',
  on_hold: 'secondary',
  planning: 'outline',
  new: 'outline',
  won: 'default',
  lost: 'destructive',
  approved: 'default',
  rejected: 'destructive',
  draft: 'outline',
  paid: 'default',
  failed: 'destructive',
};

// Format currency
export function formatCurrency(amount: number, currency: string = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format date
export function formatDate(dateString?: string | null): string {
  if (!dateString) return '—';
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

// Format datetime
export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return '—';
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}
