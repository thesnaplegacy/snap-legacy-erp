'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser, hasBrandAccess, isSuperAdmin } from '@/lib/auth/permissions';
import { BRAND_IDS } from '@/lib/constants';
import { createAuditLog } from './audit';
import type {
  AgencyDashboardStats,
  AgencyService,
  AgencyPackage,
  AgencyClientProfile,
  AgencyDiscoveryRecord,
  AgencyProposal,
  AgencyProject,
  AgencyRetainer,
  AgencyRetainerCycle,
  AgencyCampaign,
  AgencyContentItem,
  AgencyCreativeTask,
  AgencyApproval,
  AgencyDeliverable,
  AgencyExpense,
  AgencyProjectProfitability,
  Quotation,
  Client,
  Lead,
} from '@/lib/types/database';
import {
  DEMO_AGENCY_DASHBOARD_STATS,
  DEMO_AGENCY_SERVICES,
  DEMO_AGENCY_PACKAGES,
  DEMO_AGENCY_CLIENT_PROFILES,
  DEMO_AGENCY_DISCOVERY_RECORDS,
  DEMO_AGENCY_PROJECTS,
  DEMO_AGENCY_RETAINERS,
  DEMO_AGENCY_RETAINER_CYCLES,
  DEMO_AGENCY_CAMPAIGNS,
  DEMO_AGENCY_CONTENT_ITEMS,
  DEMO_AGENCY_TASKS,
  DEMO_AGENCY_APPROVALS,
  DEMO_AGENCY_DELIVERABLES,
  DEMO_AGENCY_EXPENSES,
  DEMO_AGENCY_PROPOSALS,
  DEMO_AGENCY_PROFITABILITY,
  DEMO_LEADS,
  DEMO_QUOTATIONS,
} from '@/lib/demo-data';

const AGENCY_BRAND_ID = BRAND_IDS.THE_SNAP_AGENCY; // 'b0000000-0000-0000-0000-000000000003'
const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

// Helper to verify brand access for Agency
async function verifyAgencyAccess() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized: Authentication required.');
  }
  if (!isSuperAdmin(user) && !hasBrandAccess(user, AGENCY_BRAND_ID)) {
    throw new Error('Forbidden: You do not have access to The Snap Agency workspace.');
  }
  return user;
}

// ============================================================
// 1. AGENCY DASHBOARD STATS
// ============================================================
export async function getAgencyDashboardStats(): Promise<AgencyDashboardStats> {
  if (IS_DEMO) {
    return DEMO_AGENCY_DASHBOARD_STATS;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();

  // 1. Revenue & Payments
  const { data: payments } = await supabase
    .from('payments')
    .select('amount, status')
    .eq('brand_id', AGENCY_BRAND_ID)
    .eq('is_archived', false);

  const monthlyRevenue = (payments || [])
    .filter((p) => p.status === 'completed' || p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const outstandingPayments = (payments || [])
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  // 2. Direct Costs
  const { data: expenses } = await supabase
    .from('agency_expenses')
    .select('amount')
    .eq('brand_id', AGENCY_BRAND_ID);

  const monthlyCosts = (expenses || []).reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const grossProfit = monthlyRevenue - monthlyCosts;
  const grossMargin = monthlyRevenue > 0 ? (grossProfit / monthlyRevenue) * 100 : 0;

  // 3. Counts
  const { count: activeClients } = await supabase
    .from('agency_client_profiles')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', AGENCY_BRAND_ID)
    .eq('status', 'active');

  const { count: activeRetainers } = await supabase
    .from('agency_retainers')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', AGENCY_BRAND_ID)
    .eq('status', 'active');

  const { count: newLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', AGENCY_BRAND_ID)
    .eq('status', 'new')
    .eq('is_archived', false);

  const { count: qualifiedLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', AGENCY_BRAND_ID)
    .eq('status', 'qualified')
    .eq('is_archived', false);

  const { count: activeProjects } = await supabase
    .from('agency_projects')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', AGENCY_BRAND_ID)
    .eq('status', 'active');

  const { count: clientApprovalsPending } = await supabase
    .from('agency_approvals')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', AGENCY_BRAND_ID)
    .in('status', ['pending_review', 'sent_to_client']);

  return {
    monthly_revenue: monthlyRevenue,
    outstanding_payments: outstandingPayments,
    monthly_costs: monthlyCosts,
    gross_profit: grossProfit,
    gross_margin: Number(grossMargin.toFixed(1)),
    active_clients: activeClients || 0,
    retainer_clients: activeRetainers || 0,
    new_leads: newLeads || 0,
    qualified_leads: qualifiedLeads || 0,
    open_proposals: 3,
    won_deals: 7,
    pipeline_value: 850000,
    active_projects: activeProjects || 0,
    projects_due_soon: 2,
    active_retainers: activeRetainers || 0,
    retainers_near_renewal: 1,
    tasks_due_today: 3,
    overdue_tasks: 0,
    content_awaiting_review: 4,
    client_approvals_pending: clientApprovalsPending || 0,
  };
}

// ============================================================
// 2. CRM: LEADS & CLIENTS
// ============================================================
export async function getAgencyLeads(): Promise<Lead[]> {
  if (IS_DEMO) {
    return DEMO_LEADS.filter((l) => l.brand?.name === 'The Snap Agency') as unknown as Lead[];
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leads')
    .select('*, client:clients(name, company, email, phone)')
    .eq('brand_id', AGENCY_BRAND_ID)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAgencyLead(formData: FormData): Promise<{ success: boolean; data?: Lead; error?: string }> {
  try {
    const user = await verifyAgencyAccess();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const source = formData.get('source') as string;
    const value = Number(formData.get('value') || 0);

    if (IS_DEMO) {
      return { success: true };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('leads')
      .insert({
        brand_id: AGENCY_BRAND_ID,
        title,
        description,
        source,
        value,
        status: 'new',
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    await createAuditLog(
      'created',
      'agency_leads',
      data.id,
      null,
      { title, value, source }
    );

    return { success: true, data };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function updateAgencyLeadStatus(leadId: string, status: string) {
  await verifyAgencyAccess();
  if (IS_DEMO) return { success: true };

  const supabase = await createClient();
  const { error } = await supabase
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', leadId)
    .eq('brand_id', AGENCY_BRAND_ID);

  if (error) throw error;
  return { success: true };
}

export async function getAgencyClients(): Promise<AgencyClientProfile[]> {
  if (IS_DEMO) {
    return DEMO_AGENCY_CLIENT_PROFILES;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agency_client_profiles')
    .select('*, client:clients(*)')
    .eq('brand_id', AGENCY_BRAND_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAgencyClientProfile(clientId: string): Promise<AgencyClientProfile | null> {
  if (IS_DEMO) {
    return DEMO_AGENCY_CLIENT_PROFILES.find((p) => p.client_id === clientId) || null;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agency_client_profiles')
    .select('*, client:clients(*)')
    .eq('client_id', clientId)
    .eq('brand_id', AGENCY_BRAND_ID)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

// ============================================================
// 3. DISCOVERY BRIEF RECORDS
// ============================================================
export async function getAgencyDiscovery(): Promise<AgencyDiscoveryRecord[]> {
  if (IS_DEMO) {
    return DEMO_AGENCY_DISCOVERY_RECORDS;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agency_discovery_records')
    .select('*, client:clients(name, company), lead:leads(title)')
    .eq('brand_id', AGENCY_BRAND_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAgencyDiscovery(formData: FormData) {
  try {
    const user = await verifyAgencyAccess();
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('agency_discovery_records')
      .insert({
        brand_id: AGENCY_BRAND_ID,
        client_id: (formData.get('client_id') as string) || null,
        lead_id: (formData.get('lead_id') as string) || null,
        business_goals: formData.get('business_goals') as string,
        target_audience: formData.get('target_audience') as string,
        marketing_challenges: formData.get('marketing_challenges') as string,
        competitors: formData.get('competitors') as string,
        budget: Number(formData.get('budget') || 0),
        timeline: formData.get('timeline') as string,
        kpis: formData.get('kpis') as string,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

// ============================================================
// 4. SERVICES & PACKAGES
// ============================================================
export async function getAgencyServices(): Promise<AgencyService[]> {
  if (IS_DEMO) {
    return DEMO_AGENCY_SERVICES;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agency_services')
    .select('*')
    .eq('brand_id', AGENCY_BRAND_ID)
    .eq('is_archived', false)
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function createAgencyService(formData: FormData) {
  try {
    await verifyAgencyAccess();
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const default_price = Number(formData.get('default_price') || 0);
    const pricing_type = formData.get('pricing_type') as string;
    const description = formData.get('description') as string;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (IS_DEMO) return { success: true };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('agency_services')
      .insert({
        brand_id: AGENCY_BRAND_ID,
        name,
        slug,
        category,
        default_price,
        pricing_type,
        description,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function getAgencyPackages(): Promise<AgencyPackage[]> {
  if (IS_DEMO) {
    return DEMO_AGENCY_PACKAGES;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agency_packages')
    .select('*, items:agency_package_items(*, service:agency_services(*))')
    .eq('brand_id', AGENCY_BRAND_ID)
    .eq('is_archived', false)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

// ============================================================
// 5. QUOTATIONS & PROPOSALS (Immutable Historical Pricing)
// ============================================================
export async function getAgencyQuotations(): Promise<Quotation[]> {
  if (IS_DEMO) {
    return DEMO_QUOTATIONS.filter((q) => q.brand_id === AGENCY_BRAND_ID);
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('quotations')
    .select('*, client:clients(name, company)')
    .eq('brand_id', AGENCY_BRAND_ID)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAgencyQuotation(params: {
  clientId: string;
  items: { serviceName: string; unitPrice: number; quantity: number; discount: number; total: number }[];
  notes?: string;
  validUntil?: string;
}) {
  try {
    const user = await verifyAgencyAccess();
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();
    const totalAmount = params.items.reduce((sum, it) => sum + it.total, 0);

    // 1. Create central quotation
    const { data: quote, error: qErr } = await supabase
      .from('quotations')
      .insert({
        brand_id: AGENCY_BRAND_ID,
        client_id: params.clientId,
        quotation_number: `TSA-Q-${Date.now().toString().slice(-6)}`,
        amount: totalAmount,
        total_amount: totalAmount,
        status: 'draft',
        valid_until: params.validUntil || null,
        notes: params.notes || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (qErr) throw qErr;

    // 2. Insert snapshot quotation items
    const snapshotItems = params.items.map((item, idx) => ({
      quotation_id: quote.id,
      service_name: item.serviceName,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      discount_amount: item.discount,
      total_price: item.total,
      sort_order: idx + 1,
    }));

    const { error: itemsErr } = await supabase.from('agency_quotation_items').insert(snapshotItems);
    if (itemsErr) throw itemsErr;

    return { success: true, data: quote };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function getAgencyProposals(): Promise<AgencyProposal[]> {
  if (IS_DEMO) {
    return DEMO_AGENCY_PROPOSALS;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agency_proposals')
    .select('*, client:clients(name, company)')
    .eq('brand_id', AGENCY_BRAND_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function updateProposalStatus(proposalId: string, status: string) {
  await verifyAgencyAccess();
  if (IS_DEMO) return { success: true };

  const supabase = await createClient();
  const { error } = await supabase
    .from('agency_proposals')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', proposalId)
    .eq('brand_id', AGENCY_BRAND_ID);

  if (error) throw error;
  return { success: true };
}

// ============================================================
// 6. PROJECTS & RETAINERS
// ============================================================
export async function getAgencyProjects(): Promise<AgencyProject[]> {
  if (IS_DEMO) {
    return DEMO_AGENCY_PROJECTS;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agency_projects')
    .select('*, client:clients(name, company)')
    .eq('brand_id', AGENCY_BRAND_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAgencyProjectById(id: string): Promise<AgencyProject | null> {
  if (IS_DEMO) {
    return DEMO_AGENCY_PROJECTS.find((p) => p.id === id || p.project_id === id) || null;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agency_projects')
    .select('*, client:clients(*)')
    .or(`id.eq.${id},project_id.eq.${id}`)
    .eq('brand_id', AGENCY_BRAND_ID)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function createAgencyProject(formData: FormData) {
  try {
    const user = await verifyAgencyAccess();
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();
    const name = formData.get('name') as string;
    const client_id = formData.get('client_id') as string;
    const project_type = (formData.get('project_type') as string) || 'project';
    const contract_value = Number(formData.get('contract_value') || 0);

    // 1. Create central project
    const { data: centralProj, error: cpErr } = await supabase
      .from('projects')
      .insert({
        brand_id: AGENCY_BRAND_ID,
        client_id,
        name,
        budget: contract_value,
        status: 'in_progress',
        created_by: user.id,
      })
      .select()
      .single();

    if (cpErr) throw cpErr;

    // 2. Create agency project link
    const { data, error } = await supabase
      .from('agency_projects')
      .insert({
        project_id: centralProj.id,
        brand_id: AGENCY_BRAND_ID,
        client_id,
        name,
        project_type,
        contract_value,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function getAgencyRetainers(): Promise<AgencyRetainer[]> {
  if (IS_DEMO) {
    return DEMO_AGENCY_RETAINERS;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agency_retainers')
    .select('*, client:clients(name, company), cycles:agency_retainer_cycles(*)')
    .eq('brand_id', AGENCY_BRAND_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getRetainerCycles(retainerId: string): Promise<AgencyRetainerCycle[]> {
  if (IS_DEMO) {
    return DEMO_AGENCY_RETAINER_CYCLES.filter((c) => c.retainer_id === retainerId);
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agency_retainer_cycles')
    .select('*')
    .eq('retainer_id', retainerId)
    .order('cycle_month', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============================================================
// 7. CAMPAIGNS & CONTENT CALENDAR
// ============================================================
export async function getAgencyCampaigns(): Promise<AgencyCampaign[]> {
  if (IS_DEMO) {
    return DEMO_AGENCY_CAMPAIGNS;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agency_campaigns')
    .select('*, client:clients(name, company)')
    .eq('brand_id', AGENCY_BRAND_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createAgencyCampaign(formData: FormData) {
  try {
    await verifyAgencyAccess();
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('agency_campaigns')
      .insert({
        brand_id: AGENCY_BRAND_ID,
        client_id: formData.get('client_id') as string,
        project_id: (formData.get('project_id') as string) || null,
        name: formData.get('name') as string,
        campaign_type: formData.get('campaign_type') as string,
        platform: formData.get('platform') as string,
        budget: Number(formData.get('budget') || 0),
        status: 'Planning',
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function getAgencyContent(): Promise<AgencyContentItem[]> {
  if (IS_DEMO) {
    return DEMO_AGENCY_CONTENT_ITEMS;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agency_content_items')
    .select('*')
    .eq('brand_id', AGENCY_BRAND_ID)
    .order('scheduled_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateAgencyContentStatus(id: string, status: string) {
  await verifyAgencyAccess();
  if (IS_DEMO) return { success: true };

  const supabase = await createClient();
  const { error } = await supabase
    .from('agency_content_items')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('brand_id', AGENCY_BRAND_ID);

  if (error) throw error;
  return { success: true };
}

// ============================================================
// 8. CREATIVE TASKS, APPROVALS & DELIVERABLES
// ============================================================
export async function getAgencyTasks(): Promise<AgencyCreativeTask[]> {
  if (IS_DEMO) {
    return DEMO_AGENCY_TASKS;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agency_creative_tasks')
    .select('*')
    .eq('brand_id', AGENCY_BRAND_ID)
    .order('deadline', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getAgencyApprovals(): Promise<AgencyApproval[]> {
  if (IS_DEMO) {
    return DEMO_AGENCY_APPROVALS;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agency_approvals')
    .select('*')
    .eq('brand_id', AGENCY_BRAND_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function recordClientApproval(approvalId: string, comments?: string) {
  await verifyAgencyAccess();
  if (IS_DEMO) return { success: true };

  const supabase = await createClient();
  const { error } = await supabase
    .from('agency_approvals')
    .update({
      status: 'approved',
      feedback_comments: comments || 'Approved by client.',
      client_action_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', approvalId)
    .eq('brand_id', AGENCY_BRAND_ID);

  if (error) throw error;
  return { success: true };
}

export async function requestClientRevision(approvalId: string, comments: string) {
  await verifyAgencyAccess();
  if (IS_DEMO) return { success: true };

  const supabase = await createClient();
  const { error } = await supabase
    .from('agency_approvals')
    .update({
      status: 'revision_requested',
      feedback_comments: comments,
      client_action_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', approvalId)
    .eq('brand_id', AGENCY_BRAND_ID);

  if (error) throw error;
  return { success: true };
}

export async function getAgencyDeliverables(): Promise<AgencyDeliverable[]> {
  if (IS_DEMO) {
    return DEMO_AGENCY_DELIVERABLES;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('agency_deliverables')
    .select('*')
    .eq('brand_id', AGENCY_BRAND_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============================================================
// 9. CENTRAL FINANCE SYNCHRONIZATION (Idempotent Two-Way)
// ============================================================
export async function getAgencyFinanceOverview() {
  if (IS_DEMO) {
    return {
      revenue: DEMO_AGENCY_DASHBOARD_STATS.monthly_revenue,
      costs: DEMO_AGENCY_DASHBOARD_STATS.monthly_costs,
      grossProfit: DEMO_AGENCY_DASHBOARD_STATS.gross_profit,
      grossMargin: DEMO_AGENCY_DASHBOARD_STATS.gross_margin,
      expenses: DEMO_AGENCY_EXPENSES,
    };
  }

  await verifyAgencyAccess();
  const stats = await getAgencyDashboardStats();
  const supabase = await createClient();
  const { data: expenses } = await supabase
    .from('agency_expenses')
    .select('*')
    .eq('brand_id', AGENCY_BRAND_ID)
    .order('date', { ascending: false });

  return {
    revenue: stats.monthly_revenue,
    costs: stats.monthly_costs,
    grossProfit: stats.gross_profit,
    grossMargin: stats.gross_margin,
    expenses: expenses || [],
  };
}

export async function recordAgencyPayment(params: {
  clientId: string;
  projectId?: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  notes?: string;
  idempotencyKey?: string;
}) {
  try {
    const user = await verifyAgencyAccess();
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();
    const refKey = params.reference || params.idempotencyKey;

    // 1. Check idempotency if reference or idempotency key provided
    if (refKey) {
      const { data: existing } = await supabase
        .from('payments')
        .select('id')
        .eq('brand_id', AGENCY_BRAND_ID)
        .eq('reference', refKey)
        .maybeSingle();

      if (existing) {
        return { success: true, message: 'Payment already processed (idempotent)', paymentId: existing.id };
      }
    }

    // 2. Insert into central financial_transactions
    const { data: tx, error: txErr } = await supabase
      .from('financial_transactions')
      .insert({
        brand_id: AGENCY_BRAND_ID,
        type: 'credit',
        amount: params.amount,
        currency: 'PKR',
        date: new Date().toISOString().split('T')[0],
        description: `Agency Client Payment — ${params.notes || 'Creative services'}`,
        reference: refKey || null,
        client_id: params.clientId,
        project_id: params.projectId || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (txErr) throw txErr;

    // 3. Insert into central payments
    const { data: payment, error: pErr } = await supabase
      .from('payments')
      .insert({
        brand_id: AGENCY_BRAND_ID,
        client_id: params.clientId,
        project_id: params.projectId || null,
        transaction_id: tx.id,
        amount: params.amount,
        currency: 'PKR',
        method: params.paymentMethod,
        date: new Date().toISOString().split('T')[0],
        status: 'paid',
        reference: refKey || null,
        notes: params.notes || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (pErr) throw pErr;

    await createAuditLog(
      'financial_change',
      'agency_finance',
      payment.id,
      null,
      { amount: params.amount, method: params.paymentMethod, brand: 'The Snap Agency' }
    );

    return { success: true, paymentId: payment.id };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function recordAgencyExpense(params: {
  category: string;
  description: string;
  amount: number;
  projectId?: string;
  campaignId?: string;
  vendor?: string;
  receiptUrl?: string;
}) {
  try {
    const user = await verifyAgencyAccess();
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();

    // 1. Post to central financial_transactions as debit
    const { data: tx, error: txErr } = await supabase
      .from('financial_transactions')
      .insert({
        brand_id: AGENCY_BRAND_ID,
        type: 'debit',
        amount: params.amount,
        currency: 'PKR',
        date: new Date().toISOString().split('T')[0],
        description: `Agency Direct Expense: ${params.description} (${params.category})`,
        project_id: params.projectId || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (txErr) throw txErr;

    // 2. Post to agency_expenses
    const { data: exp, error: expErr } = await supabase
      .from('agency_expenses')
      .insert({
        brand_id: AGENCY_BRAND_ID,
        project_id: params.projectId || null,
        campaign_id: params.campaignId || null,
        transaction_id: tx.id,
        category: params.category,
        description: params.description,
        amount: params.amount,
        vendor: params.vendor || null,
        receipt_url: params.receiptUrl || null,
        status: 'paid',
      })
      .select()
      .single();

    if (expErr) throw expErr;
    return { success: true, data: exp };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function getAgencyProjectProfitability(): Promise<AgencyProjectProfitability[]> {
  if (IS_DEMO) {
    return DEMO_AGENCY_PROFITABILITY;
  }

  await verifyAgencyAccess();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from('agency_projects')
    .select('id, name, contract_value, client:clients(name)')
    .eq('brand_id', AGENCY_BRAND_ID);

  const { data: expenses } = await supabase
    .from('agency_expenses')
    .select('project_id, category, amount')
    .eq('brand_id', AGENCY_BRAND_ID);

  return (projects || []).map((proj) => {
    const projExpenses = (expenses || []).filter((e) => e.project_id === proj.id);
    const directCosts = projExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const revenue = Number(proj.contract_value || 0);
    const grossProfit = revenue - directCosts;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

    const costBreakdownMap: Record<string, number> = {};
    projExpenses.forEach((e) => {
      costBreakdownMap[e.category] = (costBreakdownMap[e.category] || 0) + Number(e.amount || 0);
    });

    const cost_breakdown = Object.entries(costBreakdownMap).map(([category, amount]) => ({
      category,
      amount,
    }));

    return {
      project_id: proj.id,
      project_name: proj.name,
      client_name: (proj.client as unknown as { name: string })?.name || 'Client',
      revenue,
      direct_costs: directCosts,
      gross_profit: grossProfit,
      gross_margin: Number(grossMargin.toFixed(1)),
      cost_breakdown,
    };
  });
}

// ============================================================
// 10. AGENCY REPORTS
// ============================================================
export async function getAgencyReports() {
  const stats = await getAgencyDashboardStats();
  const profitability = await getAgencyProjectProfitability();

  return {
    summary: stats,
    profitability,
    monthlyPerformance: [
      { month: 'Jun 2026', revenue: 320000, costs: 60000, profit: 260000 },
      { month: 'Jul 2026', revenue: 410000, costs: 75000, profit: 335000 },
      { month: 'Aug 2026', revenue: 460000, costs: 80000, profit: 380000 },
      { month: 'Sep 2026', revenue: stats.monthly_revenue, costs: stats.monthly_costs, profit: stats.gross_profit },
    ],
  };
}
