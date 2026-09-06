// ============================================================
// THE SNAP LEGACY ERP — Database Types
// ============================================================
// TypeScript types matching the PostgreSQL schema
// ============================================================

export type UUID = string;

// ============================================================
// ENUMS
// ============================================================
export type OrganizationStatus = 'active' | 'inactive';
export type BrandType = 'parent' | 'subsidiary';
export type BrandStatus = 'active' | 'inactive';
export type ProfileStatus = 'active' | 'inactive' | 'suspended';
export type ClientType = 'individual' | 'company' | 'government' | 'ngo';
export type ClientStatus = 'active' | 'inactive';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
export type EventStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
export type ServiceStatus = 'active' | 'inactive';
export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'revised';
export type AccountType = 'cash' | 'bank' | 'credit_card' | 'mobile_wallet' | 'receivable' | 'payable' | 'other';
export type AccountStatus = 'active' | 'inactive' | 'frozen';
export type FinancialCategoryType = 'income' | 'expense';
export type TransactionType = 'credit' | 'debit';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'cheque' | 'credit_card' | 'mobile_wallet' | 'online' | 'other';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'partial';
export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'paid';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern';
export type EmployeeStatus = 'active' | 'inactive' | 'terminated' | 'on_leave';
export type FreelancerRateType = 'per_hour' | 'per_day' | 'per_project' | 'per_event';
export type AssetCondition = 'new' | 'good' | 'fair' | 'poor' | 'damaged' | 'disposed';
export type AssetStatus = 'active' | 'in_use' | 'maintenance' | 'retired' | 'disposed';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type AuditAction = 'created' | 'updated' | 'archived' | 'restored' | 'deleted' | 'financial_change' | 'settings_change' | 'permission_change' | 'role_change' | 'login' | 'logout';

// ============================================================
// TABLE TYPES
// ============================================================

export interface Organization {
  id: UUID;
  name: string;
  slug: string;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  status: OrganizationStatus;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: UUID;
  organization_id: UUID;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  color: string | null;
  type: BrandType;
  status: BrandStatus;
  is_parent: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: UUID;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  status: ProfileStatus;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: UUID;
  name: string;
  slug: string;
  description: string | null;
  level: number;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: UUID;
  module: string;
  action: string;
  description: string | null;
  created_at: string;
}

export interface RolePermission {
  id: UUID;
  role_id: UUID;
  permission_id: UUID;
  created_at: string;
}

export interface UserRole {
  id: UUID;
  user_id: UUID;
  role_id: UUID;
  assigned_by: UUID | null;
  assigned_at: string;
  // Joined
  role?: Role;
}

export interface UserBrandAccess {
  id: UUID;
  user_id: UUID;
  brand_id: UUID;
  granted_by: UUID | null;
  granted_at: string;
  // Joined
  brand?: Brand;
}

export interface Client {
  id: UUID;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  type: ClientType;
  source: string | null;
  notes: string | null;
  status: ClientStatus;
  is_archived: boolean;
  archived_at: string | null;
  archived_by: UUID | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
  // Joined
  brand_associations?: ClientBrandAssociation[];
}

export interface ClientBrandAssociation {
  id: UUID;
  client_id: UUID;
  brand_id: UUID;
  created_at: string;
  // Joined
  brand?: Brand;
}

export interface Lead {
  id: UUID;
  brand_id: UUID | null;
  client_id: UUID | null;
  title: string;
  description: string | null;
  source: string | null;
  status: LeadStatus;
  value: number | null;
  currency: string;
  assigned_to: UUID | null;
  expected_close_date: string | null;
  notes: string | null;
  is_archived: boolean;
  archived_at: string | null;
  archived_by: UUID | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
  // Joined
  brand?: Brand;
  client?: Client;
  assigned_user?: Profile;
}

export interface Project {
  id: UUID;
  brand_id: UUID | null;
  client_id: UUID | null;
  lead_id: UUID | null;
  name: string;
  description: string | null;
  status: ProjectStatus;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  currency: string;
  notes: string | null;
  is_archived: boolean;
  archived_at: string | null;
  archived_by: UUID | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
  // Joined
  brand?: Brand;
  client?: Client;
}

export interface Event {
  id: UUID;
  brand_id: UUID | null;
  project_id: UUID | null;
  client_id: UUID | null;
  name: string;
  description: string | null;
  event_date: string | null;
  end_date: string | null;
  location: string | null;
  venue: string | null;
  status: EventStatus;
  notes: string | null;
  is_archived: boolean;
  archived_at: string | null;
  archived_by: UUID | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
  // Joined
  brand?: Brand;
  project?: Project;
}

export interface Service {
  id: UUID;
  brand_id: UUID | null;
  name: string;
  description: string | null;
  base_price: number | null;
  currency: string;
  unit: string | null;
  status: ServiceStatus;
  is_archived: boolean;
  archived_at: string | null;
  archived_by: UUID | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
}

export interface Quotation {
  id: UUID;
  brand_id: UUID | null;
  client_id: UUID | null;
  project_id: UUID | null;
  quotation_number: string | null;
  amount: number;
  currency: string;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  status: QuotationStatus;
  valid_until: string | null;
  notes: string | null;
  terms: string | null;
  is_archived: boolean;
  archived_at: string | null;
  archived_by: UUID | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: UUID;
  brand_id: UUID | null;
  name: string;
  type: AccountType;
  account_number: string | null;
  bank_name: string | null;
  balance: number;
  currency: string;
  description: string | null;
  status: AccountStatus;
  is_archived: boolean;
  archived_at: string | null;
  archived_by: UUID | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
}

export interface FinancialCategory {
  id: UUID;
  brand_id: UUID | null;
  name: string;
  type: FinancialCategoryType;
  parent_id: UUID | null;
  description: string | null;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinancialTransaction {
  id: UUID;
  brand_id: UUID | null;
  account_id: UUID;
  category_id: UUID | null;
  type: TransactionType;
  amount: number;
  currency: string;
  date: string;
  description: string | null;
  reference: string | null;
  related_transaction_id: UUID | null;
  is_reversal: boolean;
  client_id: UUID | null;
  project_id: UUID | null;
  created_by: UUID | null;
  created_at: string;
  // Joined
  account?: Account;
  category?: FinancialCategory;
  brand?: Brand;
  related_transaction?: FinancialTransaction;
}

export interface Payment {
  id: UUID;
  brand_id: UUID | null;
  client_id: UUID | null;
  project_id: UUID | null;
  transaction_id: UUID | null;
  amount: number;
  currency: string;
  method: PaymentMethod | null;
  date: string;
  due_date: string | null;
  status: PaymentStatus;
  reference: string | null;
  notes: string | null;
  is_archived: boolean;
  archived_at: string | null;
  archived_by: UUID | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
  // Joined
  client?: Client;
  brand?: Brand;
}

export interface Expense {
  id: UUID;
  brand_id: UUID | null;
  transaction_id: UUID | null;
  category_id: UUID | null;
  account_id: UUID | null;
  amount: number;
  currency: string;
  description: string;
  date: string;
  vendor: string | null;
  receipt_url: string | null;
  approved_by: UUID | null;
  status: ExpenseStatus;
  is_archived: boolean;
  archived_at: string | null;
  archived_by: UUID | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
  // Joined
  category?: FinancialCategory;
  brand?: Brand;
  account?: Account;
}

export interface Employee {
  id: UUID;
  user_id: UUID | null;
  brand_id: UUID;
  employee_code: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  cnic: string | null;
  position: string | null;
  department: string | null;
  hire_date: string | null;
  end_date: string | null;
  salary: number | null;
  currency: string;
  employment_type: EmploymentType;
  status: EmployeeStatus;
  emergency_contact: string | null;
  emergency_phone: string | null;
  address: string | null;
  notes: string | null;
  is_archived: boolean;
  archived_at: string | null;
  archived_by: UUID | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
  // Joined
  brand?: Brand;
}

export interface Freelancer {
  id: UUID;
  brand_id: UUID;
  name: string;
  email: string | null;
  phone: string | null;
  cnic: string | null;
  specialization: string | null;
  portfolio_url: string | null;
  rate: number | null;
  rate_type: FreelancerRateType | null;
  currency: string;
  status: 'active' | 'inactive';
  notes: string | null;
  is_archived: boolean;
  archived_at: string | null;
  archived_by: UUID | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
  // Joined
  brand?: Brand;
}

export interface Asset {
  id: UUID;
  brand_id: UUID;
  name: string;
  type: string;
  serial_number: string | null;
  model: string | null;
  manufacturer: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  current_value: number | null;
  currency: string;
  condition: AssetCondition;
  location: string | null;
  assigned_to: UUID | null;
  warranty_expiry: string | null;
  notes: string | null;
  status: AssetStatus;
  is_archived: boolean;
  archived_at: string | null;
  archived_by: UUID | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
  // Joined
  brand?: Brand;
  assigned_employee?: Employee;
}

export interface Task {
  id: UUID;
  brand_id: UUID | null;
  project_id: UUID | null;
  title: string;
  description: string | null;
  assigned_to: UUID | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  completed_at: string | null;
  is_archived: boolean;
  archived_at: string | null;
  archived_by: UUID | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: UUID;
  brand_id: UUID | null;
  module: string;
  record_id: UUID | null;
  name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_by: UUID | null;
  created_at: string;
}

export interface Notification {
  id: UUID;
  user_id: UUID;
  title: string;
  message: string | null;
  type: NotificationType;
  module: string | null;
  record_id: UUID | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: UUID;
  user_id: UUID | null;
  action: string;
  module: string;
  record_id: UUID | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  // Joined
  user?: Profile;
}

export interface Setting {
  id: UUID;
  brand_id: UUID | null;
  category: string;
  key: string;
  value: unknown;
  description: string | null;
  updated_by: UUID | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// COMPOSITE TYPES (for dashboard / UI)
// ============================================================

export interface UserWithDetails extends Profile {
  roles: UserRole[];
  brand_access: UserBrandAccess[];
  permissions: string[]; // 'module:action' format
}

export interface DashboardStats {
  total_revenue: number;
  total_expenses: number;
  gross_profit: number;
  net_profit: number;
  cash_balance: number;
  bank_balance: number;
  receivables: number;
  payables: number;
}

export interface BrandPerformance {
  brand: Brand;
  revenue: number;
  expenses: number;
  active_projects: number;
  active_leads: number;
}

// ============================================================
// THE SNAP SERVICE (PHASE 2 WORKSPACE TYPES)
// ============================================================

export interface Package {
  id: UUID;
  brand_id: UUID | null;
  name: string;
  slug: string;
  price: number;
  currency: string;
  badge?: string | null;
  featured: boolean;
  image_url?: string | null;
  features_json: string[];
  sort_order: number;
  is_active: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventFunction {
  id: UUID;
  project_id: UUID;
  event_id?: UUID | null;
  brand_id: UUID | null;
  function_name: string;
  function_type: 'mehndi' | 'barat' | 'walima' | 'reception' | 'nikah' | 'portrait' | 'event';
  function_date: string;
  start_time?: string | null;
  end_time?: string | null;
  venue: string;
  city: string;
  coverage_hours?: number;
  lead_photographer_id?: UUID | null;
  lead_cinematographer_id?: UUID | null;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  equipment_needed?: string[];
  notes?: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  team_assignments?: EventTeamAssignment[];
}

export interface QuotationItem {
  id: UUID;
  quotation_id: UUID;
  service_id?: UUID | null;
  package_id?: UUID | null;
  function_id?: UUID | null;
  service_name: string;
  description?: string | null;
  unit_price: number;
  quantity: number;
  discount_amount: number;
  total_price: number;
  sort_order: number;
  created_at: string;
}

export type TeamRole =
  | 'lead_photographer'
  | 'candid_photographer'
  | 'traditional_photographer'
  | 'cinematographer'
  | 'drone_operator'
  | 'gimbal_operator'
  | 'editor'
  | 'assistant'
  | 'coordinator';

export interface EventTeamAssignment {
  id: UUID;
  project_id: UUID;
  function_id: UUID;
  event_id?: UUID | null;
  brand_id: UUID | null;
  role: TeamRole;
  profile_id?: UUID | null;
  freelancer_id?: UUID | null;
  person_name: string;
  call_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  rate_type: 'flat' | 'hourly' | 'daily';
  agreed_cost: number;
  is_freelancer: boolean;
  payment_status: 'unpaid' | 'partially_paid' | 'paid';
  amount_paid: number;
  paid_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  function?: EventFunction;
}

export type EventCostCategory =
  | 'photographer'
  | 'videographer'
  | 'drone'
  | 'freelancer'
  | 'travel'
  | 'accommodation'
  | 'food'
  | 'album_printing'
  | 'equipment_rental'
  | 'editing'
  | 'other';

export interface EventCost {
  id: UUID;
  project_id: UUID;
  function_id?: UUID | null;
  brand_id: UUID | null;
  category: EventCostCategory;
  description: string;
  amount: number;
  currency: string;
  vendor_name?: string | null;
  assignment_id?: UUID | null;
  freelancer_id?: UUID | null;
  expense_id?: UUID | null;
  transaction_id?: UUID | null;
  payment_status: 'pending' | 'paid' | 'reimbursed';
  receipt_url?: string | null;
  created_at: string;
  updated_at: string;
}

export type EditingStatus =
  | 'not_started'
  | 'files_received'
  | 'editing_assigned'
  | 'in_progress'
  | 'internal_review'
  | 'client_proof'
  | 'revision'
  | 'approved'
  | 'final_export'
  | 'delivered';

export interface EditingTask {
  id: UUID;
  project_id: UUID;
  function_id?: UUID | null;
  brand_id: UUID | null;
  title: string;
  deliverable_type: string;
  editor_id?: UUID | null;
  editor_name?: string | null;
  assigned_date?: string | null;
  deadline: string;
  status: EditingStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  revision_count: number;
  delivery_url?: string | null;
  notes?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  project_name?: string;
  client_name?: string;
}

export interface EventDeliverable {
  id: UUID;
  project_id: UUID;
  function_id?: UUID | null;
  brand_id: UUID | null;
  title: string;
  type: 'edited_photos' | 'highlight_film' | 'full_video' | 'teaser' | 'reel' | 'album' | 'prints' | 'client_gallery' | 'raw_footage';
  storage_reference?: string | null;
  item_count?: number | null;
  status: 'pending' | 'in_production' | 'review' | 'ready_for_delivery' | 'delivered';
  deadline?: string | null;
  delivered_at?: string | null;
  delivered_to?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  project_name?: string;
}

export interface AlbumOrder {
  id: UUID;
  project_id: UUID;
  client_id?: UUID | null;
  brand_id: UUID | null;
  album_title: string;
  album_size: '12x18' | '12x24' | '12x30' | '12x36' | '14x40' | 'custom';
  cover_type: 'leather' | 'acrylic_glass' | 'velvet' | 'linen' | 'hardcover';
  pages_count: number;
  photos_selected_count: number;
  designer_id?: UUID | null;
  printing_vendor?: string | null;
  printing_cost: number;
  selling_price: number;
  status: 'pending_selection' | 'selection_received' | 'designing' | 'client_review' | 'revision' | 'approved' | 'printing' | 'ready' | 'delivered';
  proof_url?: string | null;
  delivery_date?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  client?: Client;
  project?: Project;
}

export interface ServiceDashboardStats {
  contracted_revenue: number;
  received_revenue: number;
  outstanding_revenue: number;
  total_event_costs: number;
  gross_profit: number;
  profit_margin: number;
  active_weddings: number;
  upcoming_functions_this_week: number;
  pending_edits: number;
  pending_albums: number;
  new_leads: number;
  confirmed_events: number;
}

export interface TeamConflict {
  person_name: string;
  date: string;
  conflicting_functions: {
    function_id: string;
    function_name: string;
    project_name: string;
    time_window: string;
    role: string;
  }[];
}
