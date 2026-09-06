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
