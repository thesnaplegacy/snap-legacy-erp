'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser, hasPermission } from '@/lib/auth/permissions';
import { createAuditLog } from './audit';
import type { DashboardStats, BrandPerformance } from '@/lib/types/database';
import { DEMO_DASHBOARD_STATS, DEMO_BRAND_PERFORMANCE } from '@/lib/demo-data';

// ============================================================
// DASHBOARD DATA
// ============================================================

export async function getDashboardStats(): Promise<DashboardStats> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'false') {
    return DEMO_DASHBOARD_STATS;
  }

  const supabase = await createClient();

  // Total revenue (credits)
  const { data: revenueData } = await supabase
    .from('financial_transactions')
    .select('amount')
    .eq('type', 'credit')
    .eq('is_reversal', false);

  const totalRevenue = (revenueData || []).reduce((sum, t) => sum + Number(t.amount), 0);

  // Total expenses (debits)
  const { data: expenseData } = await supabase
    .from('financial_transactions')
    .select('amount')
    .eq('type', 'debit')
    .eq('is_reversal', false);

  const totalExpenses = (expenseData || []).reduce((sum, t) => sum + Number(t.amount), 0);

  // Reversals (need to subtract)
  const { data: reversalData } = await supabase
    .from('financial_transactions')
    .select('amount, type')
    .eq('is_reversal', true);

  const reversalCredits = (reversalData || []).filter(r => r.type === 'credit').reduce((sum, t) => sum + Number(t.amount), 0);
  const reversalDebits = (reversalData || []).filter(r => r.type === 'debit').reduce((sum, t) => sum + Number(t.amount), 0);

  const adjustedRevenue = totalRevenue - reversalDebits + reversalCredits;
  const adjustedExpenses = totalExpenses - reversalCredits + reversalDebits;

  // Accounts balances
  const { data: cashAccounts } = await supabase
    .from('accounts')
    .select('balance')
    .eq('type', 'cash')
    .eq('status', 'active');

  const { data: bankAccounts } = await supabase
    .from('accounts')
    .select('balance')
    .eq('type', 'bank')
    .eq('status', 'active');

  const { data: receivableAccounts } = await supabase
    .from('accounts')
    .select('balance')
    .eq('type', 'receivable')
    .eq('status', 'active');

  const { data: payableAccounts } = await supabase
    .from('accounts')
    .select('balance')
    .eq('type', 'payable')
    .eq('status', 'active');

  return {
    total_revenue: adjustedRevenue,
    total_expenses: adjustedExpenses,
    gross_profit: adjustedRevenue - adjustedExpenses,
    net_profit: adjustedRevenue - adjustedExpenses, // Simplified for Phase 1
    cash_balance: (cashAccounts || []).reduce((sum, a) => sum + Number(a.balance), 0),
    bank_balance: (bankAccounts || []).reduce((sum, a) => sum + Number(a.balance), 0),
    receivables: (receivableAccounts || []).reduce((sum, a) => sum + Number(a.balance), 0),
    payables: (payableAccounts || []).reduce((sum, a) => sum + Number(a.balance), 0),
  };
}

export async function getBrandPerformance(): Promise<BrandPerformance[]> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'false') {
    return DEMO_BRAND_PERFORMANCE;
  }

  const supabase = await createClient();

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .eq('status', 'active')
    .eq('is_parent', false)
    .order('name');

  if (!brands) return [];

  const performance: BrandPerformance[] = [];

  for (const brand of brands) {
    const { data: revenue } = await supabase
      .from('financial_transactions')
      .select('amount')
      .eq('brand_id', brand.id)
      .eq('type', 'credit')
      .eq('is_reversal', false);

    const { data: expenses } = await supabase
      .from('financial_transactions')
      .select('amount')
      .eq('brand_id', brand.id)
      .eq('type', 'debit')
      .eq('is_reversal', false);

    const { count: projectCount } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', brand.id)
      .in('status', ['planning', 'in_progress'])
      .eq('is_archived', false);

    const { count: leadCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', brand.id)
      .in('status', ['new', 'contacted', 'qualified', 'proposal', 'negotiation'])
      .eq('is_archived', false);

    performance.push({
      brand,
      revenue: (revenue || []).reduce((sum, t) => sum + Number(t.amount), 0),
      expenses: (expenses || []).reduce((sum, t) => sum + Number(t.amount), 0),
      active_projects: projectCount || 0,
      active_leads: leadCount || 0,
    });
  }

  return performance;
}

export async function getRecentTransactions(limit: number = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('financial_transactions')
    .select('*, account:accounts(name), category:financial_categories(name), brand:brands(name, color)')
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

export async function getUpcomingEvents(limit: number = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('events')
    .select('*, brand:brands(name, color)')
    .gte('event_date', new Date().toISOString())
    .eq('is_archived', false)
    .in('status', ['upcoming', 'in_progress'])
    .order('event_date', { ascending: true })
    .limit(limit);
  return data || [];
}

export async function getActiveProjects(limit: number = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('projects')
    .select('*, brand:brands(name, color), client:clients(name)')
    .in('status', ['planning', 'in_progress'])
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

export async function getOutstandingPayments(limit: number = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('payments')
    .select('*, client:clients(name), brand:brands(name, color)')
    .eq('status', 'pending')
    .eq('is_archived', false)
    .order('due_date', { ascending: true })
    .limit(limit);
  return data || [];
}

export async function getRecentLeads(limit: number = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('leads')
    .select('*, brand:brands(name, color), client:clients(name)')
    .eq('is_archived', false)
    .order('created_at', { ascending: false })
    .limit(limit);
  return data || [];
}

// ============================================================
// ACCOUNTS
// ============================================================

export async function getAccounts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('accounts')
    .select('*, brand:brands(name, color)')
    .eq('is_archived', false)
    .order('name');
  if (error) throw error;
  return data || [];
}

export async function createAccount(formData: FormData) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'accounts', 'create')) return { error: 'Unauthorized' };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('accounts')
    .insert({
      brand_id: (formData.get('brand_id') as string) || null,
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      account_number: (formData.get('account_number') as string) || null,
      bank_name: (formData.get('bank_name') as string) || null,
      balance: parseFloat(formData.get('balance') as string) || 0,
      currency: (formData.get('currency') as string) || 'PKR',
      description: (formData.get('description') as string) || null,
      created_by: user?.id,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  await createAuditLog('created', 'accounts', data.id, null, data);
  return { success: true, data };
}

// ============================================================
// TRANSACTIONS (IMMUTABLE)
// ============================================================

export async function getTransactions(options?: { limit?: number; brandId?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from('financial_transactions')
    .select('*, account:accounts(name), category:financial_categories(name), brand:brands(name, color)')
    .order('created_at', { ascending: false });

  if (options?.brandId) query = query.eq('brand_id', options.brandId);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createTransaction(formData: FormData) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'finance', 'create')) return { error: 'Unauthorized' };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('financial_transactions')
    .insert({
      brand_id: (formData.get('brand_id') as string) || null,
      account_id: formData.get('account_id') as string,
      category_id: (formData.get('category_id') as string) || null,
      type: formData.get('type') as string,
      amount: parseFloat(formData.get('amount') as string),
      currency: (formData.get('currency') as string) || 'PKR',
      date: (formData.get('date') as string) || new Date().toISOString().split('T')[0],
      description: (formData.get('description') as string) || null,
      reference: (formData.get('reference') as string) || null,
      client_id: (formData.get('client_id') as string) || null,
      project_id: (formData.get('project_id') as string) || null,
      created_by: user?.id,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  await createAuditLog('created', 'finance', data.id, null, data);
  return { success: true, data };
}

/**
 * Create a reversal transaction — preserves the original transaction
 * and creates an adjustment entry.
 */
export async function createReversalTransaction(originalTransactionId: string, reason: string) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'finance', 'create')) return { error: 'Unauthorized' };

  const supabase = await createClient();

  // Get original transaction
  const { data: original } = await supabase
    .from('financial_transactions')
    .select('*')
    .eq('id', originalTransactionId)
    .single();

  if (!original) return { error: 'Original transaction not found' };

  // Create reversal (opposite type)
  const { data, error } = await supabase
    .from('financial_transactions')
    .insert({
      brand_id: original.brand_id,
      account_id: original.account_id,
      category_id: original.category_id,
      type: original.type === 'credit' ? 'debit' : 'credit',
      amount: original.amount,
      currency: original.currency,
      date: new Date().toISOString().split('T')[0],
      description: `REVERSAL: ${reason} (Original: ${original.description || original.id})`,
      reference: `REV-${original.id.slice(0, 8)}`,
      related_transaction_id: original.id,
      is_reversal: true,
      client_id: original.client_id,
      project_id: original.project_id,
      created_by: user?.id,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  await createAuditLog('financial_change', 'finance', data.id, original, data);
  return { success: true, data };
}

// ============================================================
// PAYMENTS
// ============================================================

export async function getPayments(options?: { status?: string }) {
  const supabase = await createClient();
  let query = supabase
    .from('payments')
    .select('*, client:clients(name), brand:brands(name, color)')
    .eq('is_archived', false)
    .order('date', { ascending: false });

  if (options?.status) query = query.eq('status', options.status);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createPayment(formData: FormData) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'payments', 'create')) return { error: 'Unauthorized' };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('payments')
    .insert({
      brand_id: (formData.get('brand_id') as string) || null,
      client_id: (formData.get('client_id') as string) || null,
      project_id: (formData.get('project_id') as string) || null,
      amount: parseFloat(formData.get('amount') as string),
      currency: (formData.get('currency') as string) || 'PKR',
      method: (formData.get('method') as string) || null,
      date: (formData.get('date') as string) || new Date().toISOString().split('T')[0],
      due_date: (formData.get('due_date') as string) || null,
      status: (formData.get('status') as string) || 'pending',
      reference: (formData.get('reference') as string) || null,
      notes: (formData.get('notes') as string) || null,
      created_by: user?.id,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  await createAuditLog('created', 'payments', data.id, null, data);
  return { success: true, data };
}

// ============================================================
// EXPENSES
// ============================================================

export async function getExpenses() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('expenses')
    .select('*, category:financial_categories(name), brand:brands(name, color), account:accounts(name)')
    .eq('is_archived', false)
    .order('date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createExpense(formData: FormData) {
  const user = await getCurrentUser();
  if (!hasPermission(user, 'expenses', 'create')) return { error: 'Unauthorized' };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      brand_id: (formData.get('brand_id') as string) || null,
      category_id: (formData.get('category_id') as string) || null,
      account_id: (formData.get('account_id') as string) || null,
      amount: parseFloat(formData.get('amount') as string),
      currency: (formData.get('currency') as string) || 'PKR',
      description: formData.get('description') as string,
      date: (formData.get('date') as string) || new Date().toISOString().split('T')[0],
      vendor: (formData.get('vendor') as string) || null,
      status: (formData.get('status') as string) || 'pending',
      created_by: user?.id,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  await createAuditLog('created', 'expenses', data.id, null, data);
  return { success: true, data };
}

// ============================================================
// FINANCIAL CATEGORIES
// ============================================================

export async function getFinancialCategories(type?: 'income' | 'expense') {
  const supabase = await createClient();
  let query = supabase.from('financial_categories').select('*').order('name');
  if (type) query = query.eq('type', type);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}
