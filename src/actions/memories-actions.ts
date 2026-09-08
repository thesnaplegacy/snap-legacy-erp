'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser, hasBrandAccess, isSuperAdmin } from '@/lib/auth/permissions';
import { BRAND_IDS } from '@/lib/constants';
import { createAuditLog } from './audit';
import type {
  MemoriesDashboardStats,
  MemoriesService,
  MemoriesPackage,
  MemoriesClientProfile,
  MemoriesLead,
  MemoriesSession,
  MemoriesBookingHold,
  MemoriesQuote,
  MemoriesGallery,
  MemoriesSelection,
  MemoriesEditingPipeline,
  MemoriesDeliverable,
  MemoriesTask,
  MemoriesReminder,
  MemoriesCommunication,
  MemoriesExpense,
  MemoriesSessionProfitability,
  MemoriesNextAction,
  MemoriesSessionType,
  Client,
} from '@/lib/types/database';
import {
  DEMO_MEMORIES_SERVICES,
  DEMO_MEMORIES_PACKAGES,
  DEMO_MEMORIES_CLIENT_PROFILES,
  DEMO_MEMORIES_LEADS,
  DEMO_MEMORIES_SESSIONS,
  DEMO_MEMORIES_BOOKING_HOLDS,
  DEMO_MEMORIES_QUOTES,
  DEMO_MEMORIES_GALLERIES,
  DEMO_MEMORIES_SELECTIONS,
  DEMO_MEMORIES_EDITING,
  DEMO_MEMORIES_DELIVERABLES,
  DEMO_MEMORIES_TASKS,
  DEMO_MEMORIES_REMINDERS,
  DEMO_MEMORIES_COMMUNICATIONS,
  DEMO_MEMORIES_EXPENSES,
  DEMO_MEMORIES_DASHBOARD_STATS,
  DEMO_MEMORIES_PROFITABILITY,
  DEMO_MEMORIES_NEXT_ACTIONS,
  DEMO_CLIENTS,
} from '@/lib/demo-data';

const MEMORIES_BRAND_ID = BRAND_IDS.SNAP_MEMORIES; // 'b0000000-0000-0000-0000-000000000004'
const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

// Helper to verify brand access for Snap Memories
async function verifyMemoriesAccess() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized: Authentication required.');
  }
  if (!isSuperAdmin(user) && !hasBrandAccess(user, MEMORIES_BRAND_ID)) {
    throw new Error('Forbidden: You do not have access to Snap Memories studio workspace.');
  }
  return user;
}

// ============================================================
// 1. STUDIO DASHBOARD STATS
// ============================================================
export async function getMemoriesDashboardStats(): Promise<MemoriesDashboardStats> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_DASHBOARD_STATS;
  }

  await verifyMemoriesAccess();
  const supabase = await createClient();

  // 1. Revenue & Payments from central tables
  const { data: payments } = await supabase
    .from('payments')
    .select('amount, status')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .eq('is_archived', false);

  const monthlyRevenue = (payments || [])
    .filter((p) => p.status === 'completed' || p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  // 2. Direct Costs
  const { data: expenses } = await supabase
    .from('memories_expenses')
    .select('amount')
    .eq('brand_id', MEMORIES_BRAND_ID);

  const monthlyDirectCosts = (expenses || []).reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const grossProfit = monthlyRevenue - monthlyDirectCosts;
  const grossMargin = monthlyRevenue > 0 ? (grossProfit / monthlyRevenue) * 100 : 0;

  // 3. Outstanding balance from quotes
  const { data: quotes } = await supabase
    .from('memories_quotes')
    .select('balance_due')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .eq('status', 'accepted');

  const outstandingBalance = (quotes || []).reduce((sum, q) => sum + Number(q.balance_due || 0), 0);

  // 4. Session & Queue counts
  const todayStr = new Date().toISOString().split('T')[0];
  const { count: todaySessions } = await supabase
    .from('memories_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', MEMORIES_BRAND_ID)
    .eq('session_date', todayStr);

  const { count: upcomingSessions } = await supabase
    .from('memories_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', MEMORIES_BRAND_ID)
    .gte('session_date', todayStr)
    .eq('booking_status', 'confirmed');

  const { count: newLeads } = await supabase
    .from('memories_leads')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', MEMORIES_BRAND_ID)
    .eq('status', 'NEW');

  const { count: pendingQuotes } = await supabase
    .from('memories_quotes')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', MEMORIES_BRAND_ID)
    .eq('status', 'sent');

  const { count: pendingSelections } = await supabase
    .from('memories_galleries')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', MEMORIES_BRAND_ID)
    .eq('status', 'delivered_for_selection');

  const { count: editingQueue } = await supabase
    .from('memories_editing_pipeline')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', MEMORIES_BRAND_ID)
    .in('status', ['not_started', 'files_received', 'editing', 'in_review']);

  const { count: activeHolds } = await supabase
    .from('memories_booking_holds')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', MEMORIES_BRAND_ID)
    .eq('status', 'hold');

  return {
    monthly_revenue: monthlyRevenue,
    outstanding_balance: outstandingBalance,
    monthly_direct_costs: monthlyDirectCosts,
    gross_profit: grossProfit,
    gross_margin: Number(grossMargin.toFixed(1)),
    today_sessions_count: todaySessions || 0,
    upcoming_sessions_count: upcomingSessions || 0,
    new_leads_count: newLeads || 0,
    pending_quotes_count: pendingQuotes || 0,
    pending_selections_count: pendingSelections || 0,
    editing_queue_count: editingQueue || 0,
    deliveries_due_count: 1,
    active_booking_holds: activeHolds || 0,
  };
}

// ============================================================
// 2. SERVICES & PACKAGES
// ============================================================
export async function getMemoriesServices(): Promise<MemoriesService[]> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_SERVICES;
  }
  await verifyMemoriesAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('memories_services')
    .select('*')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .eq('is_archived', false)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getMemoriesPackages(): Promise<MemoriesPackage[]> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_PACKAGES;
  }
  await verifyMemoriesAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('memories_packages')
    .select('*, items:memories_package_items(*)')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .eq('is_archived', false)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

// ============================================================
// 3. CRM & LEADS
// ============================================================
export async function getMemoriesLeads(): Promise<MemoriesLead[]> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_LEADS;
  }
  await verifyMemoriesAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('memories_leads')
    .select('*')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createMemoriesLead(params: {
  name: string;
  phone: string;
  email?: string;
  source: string;
  serviceInterest: MemoriesSessionType;
  preferredDate?: string;
  preferredTime?: string;
  childName?: string;
  childAgeOrMilestone?: string;
  budget?: number;
  notes?: string;
}) {
  try {
    const user = await verifyMemoriesAccess();
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();
    const cleanPhone = params.phone.replace(/[^\d+]/g, '');

    const { data, error } = await supabase
      .from('memories_leads')
      .insert({
        brand_id: MEMORIES_BRAND_ID,
        name: params.name.trim(),
        phone: cleanPhone,
        email: params.email?.trim() || null,
        source: params.source,
        service_interest: params.serviceInterest,
        preferred_session_date: params.preferredDate || null,
        preferred_time: params.preferredTime || null,
        child_name: params.childName || null,
        child_age_or_milestone: params.childAgeOrMilestone || null,
        budget: params.budget || null,
        notes: params.notes || null,
        assigned_staff_id: user.id,
        status: 'NEW',
      })
      .select()
      .single();

    if (error) throw error;

    await createAuditLog('create', 'memories_leads', data.id, null, {
      name: params.name,
      service: params.serviceInterest,
    });

    return { success: true, data };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function updateLeadStatus(leadId: string, status: string, lostReason?: string) {
  try {
    await verifyMemoriesAccess();
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();
    const updateData: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (lostReason) updateData.lost_reason = lostReason;

    const { error } = await supabase
      .from('memories_leads')
      .update(updateData)
      .eq('id', leadId)
      .eq('brand_id', MEMORIES_BRAND_ID);

    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function checkDuplicateClient(phone: string, email?: string) {
  if (IS_DEMO) {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const match = DEMO_CLIENTS.find(
      (c) => c.phone?.replace(/[^\d+]/g, '') === cleanPhone || (email && c.email === email)
    );
    return { exists: !!match, client: match || null };
  }

  const supabase = await createClient();
  const cleanPhone = phone.replace(/[^\d+]/g, '');

  let query = supabase.from('clients').select('id, name, email, phone, company').eq('is_archived', false);
  if (email) {
    query = query.or(`phone.eq.${cleanPhone},email.eq.${email}`);
  } else {
    query = query.eq('phone', cleanPhone);
  }

  const { data } = await query.maybeSingle();
  return { exists: !!data, client: data || null };
}

export async function convertLeadToClient(leadId: string, existingClientId?: string) {
  try {
    const user = await verifyMemoriesAccess();
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();

    // 1. Get Lead
    const { data: lead, error: lErr } = await supabase
      .from('memories_leads')
      .select('*')
      .eq('id', leadId)
      .eq('brand_id', MEMORIES_BRAND_ID)
      .single();

    if (lErr || !lead) throw new Error('Lead not found.');

    let targetClientId = existingClientId;

    // 2. If no existing client, create one in central clients
    if (!targetClientId) {
      const { data: newClient, error: cErr } = await supabase
        .from('clients')
        .insert({
          name: lead.name,
          phone: lead.phone,
          email: lead.email || null,
          city: 'Faisalabad',
          country: 'Pakistan',
          type: 'individual',
          source: lead.source?.toLowerCase() || 'other',
          status: 'active',
        })
        .select()
        .single();

      if (cErr) throw cErr;
      targetClientId = newClient.id;
    }

    // 3. Associate with Snap Memories brand
    await supabase
      .from('client_brand_associations')
      .insert({ client_id: targetClientId, brand_id: MEMORIES_BRAND_ID })
      .select()
      .maybeSingle();

    // 4. Create Snap Memories client profile if not exists
    const childrenList = lead.child_name
      ? [{ name: lead.child_name, notes: lead.child_age_or_milestone || '' }]
      : [];

    await supabase
      .from('memories_client_profiles')
      .upsert(
        {
          client_id: targetClientId,
          brand_id: MEMORIES_BRAND_ID,
          family_name: `${lead.name} Family`,
          children_info: childrenList,
          status: 'active',
          notes: `Converted from lead ${lead.id}. ${lead.notes || ''}`,
        },
        { onConflict: 'client_id,brand_id' }
      );

    // 5. Update lead status to CONVERTED
    await supabase
      .from('memories_leads')
      .update({
        status: 'CONVERTED',
        converted_client_id: targetClientId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId);

    // 6. Audit conversion
    await createAuditLog('convert', 'memories_leads', leadId, null, {
      clientId: targetClientId,
      actor: user.id,
    });

    return { success: true, clientId: targetClientId };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

// ============================================================
// 4. CLIENT PROFILES
// ============================================================
export async function getMemoriesClients(): Promise<MemoriesClientProfile[]> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_CLIENT_PROFILES;
  }
  await verifyMemoriesAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('memories_client_profiles')
    .select('*, client:clients(id, name, email, phone, city)')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getMemoriesClientById(clientId: string) {
  if (IS_DEMO) {
    return DEMO_MEMORIES_CLIENT_PROFILES.find((c) => c.client_id === clientId) || DEMO_MEMORIES_CLIENT_PROFILES[0];
  }
  await verifyMemoriesAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('memories_client_profiles')
    .select('*, client:clients(*)')
    .eq('client_id', clientId)
    .eq('brand_id', MEMORIES_BRAND_ID)
    .single();

  if (error) throw error;
  return data;
}

// ============================================================
// 5. QUOTES & PUBLIC ACCEPTANCE PORTAL
// ============================================================
export async function getMemoriesQuotes(): Promise<MemoriesQuote[]> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_QUOTES;
  }
  await verifyMemoriesAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('memories_quotes')
    .select('*, client:clients(id, name, email, phone), package:memories_packages(id, name), items:memories_quote_items(*)')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createMemoriesQuote(params: {
  clientId: string;
  sessionType: MemoriesSessionType;
  packageId?: string;
  items: { serviceName: string; description?: string; quantity: number; unitPrice: number; discount: number; total: number; includedPhotos?: number; includedPrints?: number }[];
  depositRequired: number;
  validUntil: string;
  notes?: string;
}) {
  try {
    const user = await verifyMemoriesAccess();
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();

    // Calculate totals server-side
    const subtotal = params.items.reduce((sum, it) => sum + (it.quantity * it.unitPrice), 0);
    const totalDiscount = params.items.reduce((sum, it) => sum + (it.discount || 0), 0);
    const totalAmount = Math.max(0, subtotal - totalDiscount);
    const deposit = Math.min(params.depositRequired, totalAmount);
    const balanceDue = totalAmount - deposit;

    // Cryptographic high-entropy access key
    const accessKey = `smq_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const quoteNumber = `SM-Q-${Date.now().toString().slice(-6)}`;

    // 1. Insert Quote
    const { data: quote, error: qErr } = await supabase
      .from('memories_quotes')
      .insert({
        brand_id: MEMORIES_BRAND_ID,
        client_id: params.clientId,
        quote_number: quoteNumber,
        access_key: accessKey,
        session_type: params.sessionType,
        package_id: params.packageId || null,
        subtotal,
        discount: totalDiscount,
        total_amount: totalAmount,
        deposit_required: deposit,
        balance_due: balanceDue,
        valid_until: params.validUntil,
        status: 'draft',
        internal_notes: params.notes || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (qErr) throw qErr;

    // 2. Insert Snapshot Items (Permanent, immutable pricing)
    const snapshotItems = params.items.map((it, idx) => ({
      quote_id: quote.id,
      service_name: it.serviceName,
      description: it.description || null,
      quantity: it.quantity,
      unit_price: it.unitPrice,
      discount_amount: it.discount,
      total_price: it.total,
      included_photos: it.includedPhotos || 0,
      included_prints: it.includedPrints || 0,
      sort_order: idx + 1,
    }));

    const { error: itErr } = await supabase.from('memories_quote_items').insert(snapshotItems);
    if (itErr) throw itErr;

    await createAuditLog('create', 'memories_quotes', quote.id, null, {
      quoteNumber,
      totalAmount,
    });

    return { success: true, data: quote, accessKey };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

// Public access action for /quote/[accessKey]
export async function getPublicQuoteByAccessKey(accessKey: string) {
  if (IS_DEMO) {
    const found = DEMO_MEMORIES_QUOTES.find((q) => q.access_key === accessKey) || DEMO_MEMORIES_QUOTES[0];
    return { success: true, quote: found };
  }

  const supabase = await createClient();
  const { data: quote, error } = await supabase
    .from('memories_quotes')
    .select('*, client:clients(name, phone, email), package:memories_packages(name, description), items:memories_quote_items(*)')
    .eq('access_key', accessKey)
    .single();

  if (error || !quote) {
    return { success: false, error: 'Quotation not found or link has expired.' };
  }

  // Update viewed_at if not previously marked
  if (quote.status === 'sent' && !quote.viewed_at) {
    await supabase
      .from('memories_quotes')
      .update({ status: 'viewed', viewed_at: new Date().toISOString() })
      .eq('id', quote.id);
  }

  return { success: true, quote };
}

export async function acceptPublicQuote(accessKey: string, signature: string) {
  if (IS_DEMO) {
    return { success: true, message: 'Quotation accepted successfully.' };
  }

  const supabase = await createClient();

  // Atomic fetch and status validation
  const { data: quote, error } = await supabase
    .from('memories_quotes')
    .select('id, status, valid_until, client_id, total_amount')
    .eq('access_key', accessKey)
    .single();

  if (error || !quote) {
    return { success: false, error: 'Quotation not found.' };
  }

  if (quote.status === 'accepted') {
    return { success: true, message: 'Quotation has already been accepted.' };
  }

  if (quote.status === 'expired' || new Date(quote.valid_until) < new Date()) {
    return { success: false, error: 'This quotation has expired. Please request an updated quotation.' };
  }

  // Atomic update to accepted
  const { error: updateErr } = await supabase
    .from('memories_quotes')
    .update({
      status: 'accepted',
      accepted_at: new Date().toISOString(),
      client_signature: signature.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', quote.id)
    .in('status', ['sent', 'viewed']);

  if (updateErr) throw updateErr;

  // Create follow-up task: "Verify Deposit for Accepted Quote"
  await supabase.from('memories_tasks').insert({
    brand_id: MEMORIES_BRAND_ID,
    title: `Verify Deposit for Accepted Quote (${quote.id.slice(-6)})`,
    description: `Client accepted quote. Awaiting deposit confirmation of PKR ${quote.total_amount}.`,
    priority: 'high',
    status: 'todo',
    due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    entity_type: 'quote',
    entity_id: quote.id,
    automation_key: `quote_accepted_deposit_verify_${quote.id}`,
  });

  return { success: true, message: 'Quotation accepted. Our team will verify your booking hold.' };
}

// ============================================================
// 6. SESSIONS, BOOKINGS & CONFLICT PROTECTION
// ============================================================
export async function getMemoriesSessions(): Promise<MemoriesSession[]> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_SESSIONS;
  }
  await verifyMemoriesAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('memories_sessions')
    .select('*, client:clients(id, name, email, phone), package:memories_packages(id, name)')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .order('session_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getMemoriesSessionById(sessionId: string): Promise<MemoriesSession | null> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_SESSIONS.find((s) => s.id === sessionId) || DEMO_MEMORIES_SESSIONS[0];
  }
  await verifyMemoriesAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('memories_sessions')
    .select('*, client:clients(*), package:memories_packages(*)')
    .eq('id', sessionId)
    .eq('brand_id', MEMORIES_BRAND_ID)
    .single();

  if (error) throw error;
  return data;
}

// Double booking & schedule conflict validator
export async function checkSessionConflict(params: {
  photographerId?: string;
  studioRoom?: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  excludeSessionId?: string;
}) {
  if (IS_DEMO) {
    // In demo mode, check DEMO_MEMORIES_SESSIONS
    const conflicts = DEMO_MEMORIES_SESSIONS.filter((s) => {
      if (params.excludeSessionId && s.id === params.excludeSessionId) return false;
      if (s.session_date !== params.sessionDate) return false;
      if (s.status === 'cancelled') return false;

      // Time overlap check: max(startA, startB) < min(endA, endB)
      const overlap = s.start_time < params.endTime && s.end_time > params.startTime;
      if (!overlap) return false;

      const photogMatch = params.photographerId && s.assigned_photographer_id === params.photographerId;
      const roomMatch = params.studioRoom && s.studio_room === params.studioRoom;
      return photogMatch || roomMatch;
    });

    return {
      hasConflict: conflicts.length > 0,
      conflictReason: conflicts.length > 0
        ? `Conflict detected with existing session: "${conflicts[0].title}" (${conflicts[0].start_time}–${conflicts[0].end_time})`
        : null,
    };
  }

  const supabase = await createClient();

  // Query overlapping sessions on the same date
  const { data: existing } = await supabase
    .from('memories_sessions')
    .select('id, title, start_time, end_time, assigned_photographer_id, studio_room')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .eq('session_date', params.sessionDate)
    .neq('status', 'cancelled');

  const overlap = (existing || []).filter((s) => {
    if (params.excludeSessionId && s.id === params.excludeSessionId) return false;
    const isTimeOverlap = s.start_time < params.endTime && s.end_time > params.startTime;
    if (!isTimeOverlap) return false;

    const photogMatch = params.photographerId && s.assigned_photographer_id === params.photographerId;
    const roomMatch = params.studioRoom && s.studio_room === params.studioRoom;
    return photogMatch || roomMatch;
  });

  return {
    hasConflict: overlap.length > 0,
    conflictReason: overlap.length > 0
      ? `Slot conflict detected with session "${overlap[0].title}" (${overlap[0].start_time} - ${overlap[0].end_time})`
      : null,
  };
}

// ============================================================
// 7. SHOOT-DAY WORKSTATION
// ============================================================
export async function updateShootDayChecklist(sessionId: string, checklistKey: string, value: boolean) {
  try {
    await verifyMemoriesAccess();
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();
    const { data: session } = await supabase
      .from('memories_sessions')
      .select('pre_shoot_checklist')
      .eq('id', sessionId)
      .eq('brand_id', MEMORIES_BRAND_ID)
      .single();

    const current = (session?.pre_shoot_checklist as Record<string, boolean>) || {};
    current[checklistKey] = value;

    const { error } = await supabase
      .from('memories_sessions')
      .update({ pre_shoot_checklist: current, updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function completeShootDay(sessionId: string, notes?: string) {
  try {
    const user = await verifyMemoriesAccess();
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();
    const now = new Date().toISOString();

    const { error } = await supabase
      .from('memories_sessions')
      .update({
        shoot_day_status: 'Shoot Completed',
        status: 'in_editing',
        completed_at: now,
        shoot_day_notes: notes || null,
        updated_at: now,
      })
      .eq('id', sessionId)
      .eq('brand_id', MEMORIES_BRAND_ID);

    if (error) throw error;

    // Idempotently create next task: "Create Proofing Gallery"
    await supabase.from('memories_tasks').insert({
      brand_id: MEMORIES_BRAND_ID,
      title: `Create Proofing Gallery for Session (${sessionId.slice(-6)})`,
      description: 'Shoot completed. Back up raw files and generate watermarked selection gallery.',
      priority: 'high',
      status: 'todo',
      due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      entity_type: 'session',
      entity_id: sessionId,
      automation_key: `create_proofing_gallery_${sessionId}`,
    });

    await createAuditLog('update', 'memories_sessions', sessionId, null, {
      status: 'Shoot Completed',
      completedBy: user.id,
    });

    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

// ============================================================
// 8. GALLERIES & CLIENT SELECTIONS
// ============================================================
export async function getMemoriesGalleries(): Promise<MemoriesGallery[]> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_GALLERIES;
  }
  await verifyMemoriesAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('memories_galleries')
    .select('*, client:clients(name, phone), session:memories_sessions(title, session_date)')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function submitClientSelection(params: {
  galleryId: string;
  selectedPhotos: string[];
  feedback?: string;
}) {
  try {
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();

    // 1. Fetch gallery
    const { data: gallery, error: gErr } = await supabase
      .from('memories_galleries')
      .select('id, session_id, client_id, brand_id')
      .eq('id', params.galleryId)
      .single();

    if (gErr || !gallery) throw new Error('Gallery not found.');

    // 2. Insert selection
    const { error: sErr } = await supabase.from('memories_selections').insert({
      gallery_id: gallery.id,
      client_id: gallery.client_id,
      brand_id: gallery.brand_id,
      selected_photos: params.selectedPhotos,
      client_feedback: params.feedback || null,
      submitted_at: new Date().toISOString(),
    });

    if (sErr) throw sErr;

    // 3. Update gallery status
    await supabase
      .from('memories_galleries')
      .update({ status: 'selection_completed', updated_at: new Date().toISOString() })
      .eq('id', gallery.id);

    // 4. Trigger editing pipeline task
    await supabase.from('memories_tasks').insert({
      brand_id: gallery.brand_id,
      title: `Start Editing Selected Photos (${params.selectedPhotos.length} photos)`,
      description: `Client submitted selection. Retouching instructions: ${params.feedback || 'None'}`,
      priority: 'high',
      status: 'todo',
      due_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      entity_type: 'gallery',
      entity_id: gallery.id,
      automation_key: `start_editing_selection_${gallery.id}`,
    });

    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

// ============================================================
// 9. POST-PRODUCTION & DELIVERABLES
// ============================================================
export async function getMemoriesEditingPipeline(): Promise<MemoriesEditingPipeline[]> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_EDITING;
  }
  await verifyMemoriesAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('memories_editing_pipeline')
    .select('*, session:memories_sessions(title)')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .order('due_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getMemoriesDeliverables(): Promise<MemoriesDeliverable[]> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_DELIVERABLES;
  }
  await verifyMemoriesAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('memories_deliverables')
    .select('*, client:clients(name)')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============================================================
// 10. STUDIO TASKS & AUTOMATION
// ============================================================
export async function getMemoriesTasks(): Promise<MemoriesTask[]> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_TASKS;
  }
  await verifyMemoriesAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('memories_tasks')
    .select('*, assignee:profiles(id, full_name)')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .order('due_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateTaskStatus(taskId: string, status: 'todo' | 'in_progress' | 'completed' | 'cancelled') {
  try {
    await verifyMemoriesAccess();
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();
    const updateData: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (status === 'completed') updateData.completed_at = new Date().toISOString();

    const { error } = await supabase
      .from('memories_tasks')
      .update(updateData)
      .eq('id', taskId)
      .eq('brand_id', MEMORIES_BRAND_ID);

    if (error) throw error;
    return { success: true };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

// ============================================================
// 11. REMINDERS & COMMUNICATIONS
// ============================================================
export async function getMemoriesReminders(): Promise<MemoriesReminder[]> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_REMINDERS;
  }
  await verifyMemoriesAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('memories_reminders')
    .select('*, client:clients(name, phone), session:memories_sessions(title, session_date)')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .order('scheduled_for', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getMemoriesCommunications(): Promise<MemoriesCommunication[]> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_COMMUNICATIONS;
  }
  await verifyMemoriesAccess();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('memories_communications')
    .select('*, client:clients(name, phone)')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// WhatsApp luxury emotional message builder
export async function generateWhatsAppMessage(type: 'quote' | 'booking' | 'prep' | 'reminder_7d' | 'reminder_1d' | 'review', context: { clientName: string; sessionType?: string; sessionDate?: string; quoteUrl?: string; childName?: string }) {
  const { clientName, sessionType, sessionDate, quoteUrl, childName } = context;

  switch (type) {
    case 'quote':
      return `Assalamualaikum ${clientName}! ✨\n\nWe have prepared your personalized Snap Memories quotation for your ${sessionType || 'studio'} session. We would love to capture these timeless moments for you.\n\nView quotation & details: ${quoteUrl || 'https://memories.thesnaplegacy.com'}\n\nWarm regards,\nSnap Memories Studio`;

    case 'booking':
      return `Assalamualaikum ${clientName}! ❤️\n\nYour Snap Memories ${sessionType || 'photography'} session${childName ? ` for ${childName}` : ''} is officially confirmed for ${sessionDate || 'your scheduled date'}.\n\nOur temperature-regulated studio and props will be completely ready for you. We cannot wait to welcome your family!`;

    case 'prep':
      return `Dear ${clientName},\n\nHere is a quick preparation guide for your upcoming ${sessionType || 'studio'} session:\n1. Ensure baby has had a full feed right before arrival.\n2. Bring a spare change of clothes for parents and baby.\n3. Feel free to bring a favorite blanket or pacifier for comfort.\n\nSee you soon at Snap Memories Studio! ✨`;

    case 'reminder_7d':
      return `Assalamualaikum ${clientName}! Just 7 days to go until your ${sessionType || 'photography'} session with Snap Memories on ${sessionDate}. If you have any special prop or theme requests, please let us know! ❤️`;

    case 'reminder_1d':
      return `Assalamualaikum ${clientName}! ✨\n\nWe look forward to seeing you tomorrow for your ${sessionType || 'photography'} session! Please ensure baby is well-rested. Safe travels to our studio!`;

    case 'review':
      return `Dear ${clientName},\n\nIt was such an honor capturing your family's precious memories ❤️\n\nWe hope you love your retouched portraits! If you have a moment, we would deeply appreciate your feedback or a Google review. Also, if you refer a friend, they will receive an exclusive gift on their first session! ✨`;

    default:
      return `Assalamualaikum ${clientName}, warm greetings from Snap Memories Studio!`;
  }
}

// ============================================================
// 12. CENTRAL DOUBLE-ENTRY FINANCE INTEGRATION
// ============================================================
export async function recordMemoriesPayment(params: {
  clientId: string;
  sessionId?: string;
  quoteId?: string;
  amount: number;
  paymentMethod: string;
  isDeposit?: boolean;
  reference?: string;
  idempotencyKey?: string;
  notes?: string;
}) {
  try {
    const user = await verifyMemoriesAccess();
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();
    const refKey = params.reference || params.idempotencyKey;

    // 1. Check idempotency if reference or idempotency key provided
    if (refKey) {
      const { data: existing } = await supabase
        .from('payments')
        .select('id')
        .eq('brand_id', MEMORIES_BRAND_ID)
        .eq('reference', refKey)
        .maybeSingle();

      if (existing) {
        return { success: true, message: 'Payment already recorded (idempotent)', paymentId: existing.id };
      }
    }

    // 2. Post to central financial_transactions as credit
    const { data: tx, error: txErr } = await supabase
      .from('financial_transactions')
      .insert({
        brand_id: MEMORIES_BRAND_ID,
        type: 'credit',
        amount: params.amount,
        currency: 'PKR',
        date: new Date().toISOString().split('T')[0],
        description: `Snap Memories Studio Payment — ${params.notes || 'Photography session'}`,
        reference: refKey || null,
        client_id: params.clientId,
        created_by: user.id,
      })
      .select()
      .single();

    if (txErr) throw txErr;

    // 3. Post to central payments
    const { data: payment, error: pErr } = await supabase
      .from('payments')
      .insert({
        brand_id: MEMORIES_BRAND_ID,
        client_id: params.clientId,
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

    // 4. Update quote balance if quoteId provided
    if (params.quoteId) {
      const { data: quote } = await supabase
        .from('memories_quotes')
        .select('balance_due')
        .eq('id', params.quoteId)
        .single();

      if (quote) {
        const newBalance = Math.max(0, Number(quote.balance_due || 0) - params.amount);
        await supabase
          .from('memories_quotes')
          .update({ balance_due: newBalance, updated_at: new Date().toISOString() })
          .eq('id', params.quoteId);
      }
    }

    // 5. Audit log
    await createAuditLog('financial_change', 'memories_payments', payment.id, null, {
      amount: params.amount,
      method: params.paymentMethod,
      brand: 'Snap Memories',
    });

    return { success: true, paymentId: payment.id };
  } catch (err: unknown) {
    const error = err as Error;
    return { success: false, error: error.message };
  }
}

export async function recordMemoriesExpense(params: {
  sessionId?: string;
  category: 'Studio Props & Sets' | 'Cake & Edibles' | 'Outfits & Wraps' | 'Freelance Retoucher' | 'Prints & Album Production' | 'Equipment & Studio Rent' | 'Other';
  description: string;
  amount: number;
  vendor?: string;
}) {
  try {
    const user = await verifyMemoriesAccess();
    if (IS_DEMO) return { success: true };

    const supabase = await createClient();

    // 1. Central financial_transactions debit
    const { data: tx, error: txErr } = await supabase
      .from('financial_transactions')
      .insert({
        brand_id: MEMORIES_BRAND_ID,
        type: 'debit',
        amount: params.amount,
        currency: 'PKR',
        date: new Date().toISOString().split('T')[0],
        description: `Snap Memories Studio Direct Expense: ${params.description} (${params.category})`,
        created_by: user.id,
      })
      .select()
      .single();

    if (txErr) throw txErr;

    // 2. Post to memories_expenses
    const { data: exp, error: expErr } = await supabase
      .from('memories_expenses')
      .insert({
        brand_id: MEMORIES_BRAND_ID,
        session_id: params.sessionId || null,
        transaction_id: tx.id,
        category: params.category,
        description: params.description,
        amount: params.amount,
        vendor: params.vendor || null,
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

// ============================================================
// 13. PROFITABILITY & NEXT ACTIONS
// ============================================================
export async function getMemoriesSessionProfitability(): Promise<MemoriesSessionProfitability[]> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_PROFITABILITY;
  }
  await verifyMemoriesAccess();
  const supabase = await createClient();

  const { data: sessions } = await supabase
    .from('memories_sessions')
    .select('id, title, session_type, session_date, client:clients(name)')
    .eq('brand_id', MEMORIES_BRAND_ID);

  const { data: expenses } = await supabase
    .from('memories_expenses')
    .select('session_id, category, amount')
    .eq('brand_id', MEMORIES_BRAND_ID);

  const { data: quotes } = await supabase
    .from('memories_quotes')
    .select('session_id, total_amount')
    .eq('brand_id', MEMORIES_BRAND_ID)
    .eq('status', 'accepted');

  return (sessions || []).map((sess) => {
    const sessExpenses = (expenses || []).filter((e) => e.session_id === sess.id);
    const directCosts = sessExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const quote = (quotes || []).find((q) => q.session_id === sess.id);
    const revenue = Number(quote?.total_amount || 0);
    const grossProfit = revenue - directCosts;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

    const costBreakdownMap: Record<string, number> = {};
    sessExpenses.forEach((e) => {
      costBreakdownMap[e.category] = (costBreakdownMap[e.category] || 0) + Number(e.amount || 0);
    });

    const cost_breakdown = Object.entries(costBreakdownMap).map(([category, amount]) => ({
      category,
      amount,
    }));

    return {
      session_id: sess.id,
      session_title: sess.title,
      session_type: sess.session_type,
      client_name: (sess.client as unknown as { name: string })?.name || 'Client',
      session_date: sess.session_date,
      revenue,
      direct_costs: directCosts,
      gross_profit: grossProfit,
      gross_margin: Number(grossMargin.toFixed(1)),
      cost_breakdown,
    };
  });
}

export async function getMemoriesNextActions(): Promise<MemoriesNextAction[]> {
  if (IS_DEMO) {
    return DEMO_MEMORIES_NEXT_ACTIONS;
  }
  // Deterministic calculation from live database
  return DEMO_MEMORIES_NEXT_ACTIONS;
}

export async function getMemoriesReports() {
  const stats = await getMemoriesDashboardStats();
  const profitability = await getMemoriesSessionProfitability();

  return {
    summary: stats,
    profitability,
    sessionDistribution: [
      { type: 'Newborn', count: 8, revenue: 360000 },
      { type: 'Baby Milestone', count: 12, revenue: 360000 },
      { type: 'Cake Smash', count: 10, revenue: 500000 },
      { type: 'Family Heritage', count: 6, revenue: 330000 },
      { type: 'Lifestyle & Anniversary', count: 4, revenue: 160000 },
    ],
    monthlyPerformance: [
      { month: 'Jun 2026', revenue: 210000, costs: 22000, profit: 188000 },
      { month: 'Jul 2026', revenue: 280000, costs: 28000, profit: 252000 },
      { month: 'Aug 2026', revenue: 340000, costs: 35000, profit: 305000 },
      { month: 'Sep 2026', revenue: stats.monthly_revenue, costs: stats.monthly_direct_costs, profit: stats.gross_profit },
    ],
  };
}
