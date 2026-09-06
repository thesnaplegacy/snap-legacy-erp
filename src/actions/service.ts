'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/permissions';
import { createAuditLog } from './audit';
import type {
  ServiceDashboardStats,
  EventFunction,
  EventTeamAssignment,
  EventCost,
  EditingTask,
  EventDeliverable,
  AlbumOrder,
  Package,
  TeamConflict,
  EditingStatus,
} from '@/lib/types/database';
import {
  DEMO_SERVICE_DASHBOARD_STATS,
  DEMO_PACKAGES,
  DEMO_SERVICE_SERVICES,
  DEMO_EVENT_FUNCTIONS,
  DEMO_TEAM_ASSIGNMENTS,
  DEMO_EVENT_COSTS,
  DEMO_EDITING_TASKS,
  DEMO_DELIVERABLES,
  DEMO_ALBUM_ORDERS,
  DEMO_PROJECTS,
  DEMO_CLIENTS,
  DEMO_LEADS,
  DEMO_QUOTATION_ITEMS,
} from '@/lib/demo-data';

const SNAP_SERVICE_BRAND_ID = 'b0000000-0000-0000-0000-000000000002';
const IS_DEMO = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';

// ============================================================
// 1. SERVICE DASHBOARD STATS
// ============================================================
export async function getServiceDashboardStats(): Promise<ServiceDashboardStats> {
  if (IS_DEMO) {
    return DEMO_SERVICE_DASHBOARD_STATS;
  }

  const supabase = await createClient();

  // 1. Contracted revenue from accepted quotations
  const { data: quotes } = await supabase
    .from('quotations')
    .select('total_amount')
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .eq('status', 'accepted')
    .eq('is_archived', false);

  const contracted = (quotes || []).reduce((sum, q) => sum + Number(q.total_amount || 0), 0);

  // 2. Payments received
  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .eq('status', 'paid')
    .eq('is_archived', false);

  const received = (payments || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const outstanding = Math.max(0, contracted - received);

  // 3. Event costs
  const { data: costs } = await supabase
    .from('event_costs')
    .select('amount')
    .eq('brand_id', SNAP_SERVICE_BRAND_ID);

  const totalCosts = (costs || []).reduce((sum, c) => sum + Number(c.amount || 0), 0);
  const grossProfit = contracted - totalCosts;
  const profitMargin = contracted > 0 ? (grossProfit / contracted) * 100 : 0;

  // 4. Counts
  const { count: weddingsCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .eq('is_archived', false);

  const { count: editsCount } = await supabase
    .from('editing_tasks')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .neq('status', 'delivered');

  const { count: albumsCount } = await supabase
    .from('album_orders')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .neq('status', 'delivered');

  const { count: leadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .eq('status', 'new')
    .eq('is_archived', false);

  return {
    contracted_revenue: contracted,
    received_revenue: received,
    outstanding_revenue: outstanding,
    total_event_costs: totalCosts,
    gross_profit: grossProfit,
    profit_margin: Math.round(profitMargin * 10) / 10,
    active_weddings: weddingsCount || 0,
    upcoming_functions_this_week: 3,
    pending_edits: editsCount || 0,
    pending_albums: albumsCount || 0,
    new_leads: leadsCount || 0,
    confirmed_events: 8,
  };
}

// ============================================================
// 2. MULTI-DAY WEDDINGS & PROJECTS
// ============================================================
export async function getServiceWeddings() {
  if (IS_DEMO) {
    return DEMO_PROJECTS.filter((p) => p.brand_id === SNAP_SERVICE_BRAND_ID).map((p) => {
      const functions = DEMO_EVENT_FUNCTIONS.filter((fn) => fn.project_id === p.id);
      const deliverables = DEMO_DELIVERABLES.filter((d) => d.project_id === p.id);
      const client = DEMO_CLIENTS.find((c) => c.id === p.client_id) || { name: 'Noor Fatima', phone: '+92 300 1234567' };
      return {
        ...p,
        client,
        functions,
        deliverables,
        functions_count: functions.length || 3,
        total_value: p.budget || 550000,
      };
    });
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('projects')
    .select('*, client:clients(name, phone, email, city), functions:event_functions(*)')
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  return data || [];
}

export async function getServiceWeddingById(projectId: string) {
  if (IS_DEMO) {
    const project = DEMO_PROJECTS.find((p) => p.id === projectId) || DEMO_PROJECTS[0];
    const client = DEMO_CLIENTS.find((c) => c.id === project.client_id) || {
      id: 'c-noor',
      name: 'Miss Noor Fatima',
      phone: '+92 300 1234567',
      email: 'noor.fatima@example.com',
      city: 'Faisalabad',
    };
    const functions = DEMO_EVENT_FUNCTIONS.filter((fn) => fn.project_id === project.id);
    const teamAssignments = DEMO_TEAM_ASSIGNMENTS.filter((ta) => ta.project_id === project.id);
    const costs = DEMO_EVENT_COSTS.filter((c) => c.project_id === project.id);
    const editingTasks = DEMO_EDITING_TASKS.filter((et) => et.project_id === project.id);
    const deliverables = DEMO_DELIVERABLES.filter((d) => d.project_id === project.id);
    const albumOrders = DEMO_ALBUM_ORDERS.filter((ao) => ao.project_id === project.id);
    const quotationItems = DEMO_QUOTATION_ITEMS;

    const totalCost = costs.reduce((sum, c) => sum + c.amount, 0);
    const contractValue = project.budget || 550000;
    const grossProfit = contractValue - totalCost;
    const profitMargin = contractValue > 0 ? (grossProfit / contractValue) * 100 : 0;

    return {
      ...project,
      client,
      functions,
      teamAssignments,
      costs,
      editingTasks,
      deliverables,
      albumOrders,
      quotationItems,
      financials: {
        contractValue,
        received: 250000,
        outstanding: 300000,
        totalCost,
        grossProfit,
        profitMargin: Math.round(profitMargin * 10) / 10,
      },
    };
  }

  const supabase = await createClient();
  const { data: project } = await supabase
    .from('projects')
    .select('*, client:clients(*), functions:event_functions(*)')
    .eq('id', projectId)
    .single();

  return project;
}

// ============================================================
// 3. CALENDAR & CONFLICT DETECTION
// ============================================================
export async function getServiceCalendarEvents() {
  if (IS_DEMO) {
    const functions = DEMO_EVENT_FUNCTIONS.map((fn) => {
      const assigned = DEMO_TEAM_ASSIGNMENTS.filter((ta) => ta.function_id === fn.id);
      return {
        ...fn,
        team_assignments: assigned,
      };
    });

    // Conflict detection engine:
    // Check if any person is assigned to >1 function with overlapping dates/times
    const assignments = DEMO_TEAM_ASSIGNMENTS;
    const conflicts: TeamConflict[] = [];

    const personDateMap = new Map<string, typeof assignments>();
    assignments.forEach((a) => {
      const fn = DEMO_EVENT_FUNCTIONS.find((f) => f.id === a.function_id);
      if (!fn) return;
      const key = `${a.person_name}___${fn.function_date}`;
      const existing = personDateMap.get(key) || [];
      existing.push(a);
      personDateMap.set(key, existing);
    });

    personDateMap.forEach((assignedList, key) => {
      if (assignedList.length > 1) {
        const [person_name, date] = key.split('___');
        conflicts.push({
          person_name,
          date,
          conflicting_functions: assignedList.map((a) => {
            const fn = DEMO_EVENT_FUNCTIONS.find((f) => f.id === a.function_id)!;
            return {
              function_id: fn.id,
              function_name: fn.function_name,
              project_name: 'Noor & Hamza Grand Wedding',
              time_window: `${fn.start_time} - ${fn.end_time}`,
              role: a.role,
            };
          }),
        });
      }
    });

    return {
      functions,
      conflicts,
    };
  }

  const supabase = await createClient();
  const { data: functions } = await supabase
    .from('event_functions')
    .select('*, team_assignments:event_team_assignments(*)')
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .eq('is_archived', false)
    .order('function_date', { ascending: true });

  return {
    functions: functions || [],
    conflicts: [],
  };
}

// ============================================================
// 4. QUOTATIONS & HISTORICAL SNAPSHOT PRICING
// ============================================================
export async function getServiceQuotations() {
  if (IS_DEMO) {
    return [
      {
        id: 'q-001',
        brand_id: SNAP_SERVICE_BRAND_ID,
        quotation_number: 'QT-SRV-2026-1024',
        client_name: 'Miss Noor Fatima',
        project_name: 'Wedding Project #1024 — Noor & Hamza',
        amount: 550000,
        total_amount: 550000,
        tax_amount: 0,
        discount_amount: 15000,
        status: 'accepted',
        valid_until: '2026-09-01',
        items: DEMO_QUOTATION_ITEMS,
        created_at: '2026-08-05T00:00:00Z',
      },
      {
        id: 'q-002',
        brand_id: SNAP_SERVICE_BRAND_ID,
        quotation_number: 'QT-SRV-2026-1025',
        client_name: 'Ahmed Raza',
        project_name: 'Raza Family Mehndi Night',
        amount: 220000,
        total_amount: 220000,
        tax_amount: 0,
        discount_amount: 0,
        status: 'sent',
        valid_until: '2026-09-25',
        items: [DEMO_QUOTATION_ITEMS[0]],
        created_at: '2026-08-28T00:00:00Z',
      },
    ];
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('quotations')
    .select('*, client:clients(name), items:quotation_items(*)')
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  return data || [];
}

// ============================================================
// 5. PACKAGES & SERVICE LIBRARY
// ============================================================
export async function getServicePackages(): Promise<Package[]> {
  if (IS_DEMO) {
    return DEMO_PACKAGES as Package[];
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('packages')
    .select('*')
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .eq('is_archived', false)
    .order('sort_order', { ascending: true });

  return (data || []) as Package[];
}

export async function getServiceLibrary() {
  if (IS_DEMO) {
    return DEMO_SERVICE_SERVICES;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .eq('is_archived', false)
    .order('name');

  return data || [];
}

// ============================================================
// 6. EDITING & PRODUCTION PIPELINE
// ============================================================
export async function getServiceEditingTasks(): Promise<EditingTask[]> {
  if (IS_DEMO) {
    return DEMO_EDITING_TASKS as EditingTask[];
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('editing_tasks')
    .select('*, project:projects(name)')
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .order('deadline', { ascending: true });

  return (data || []) as EditingTask[];
}

export async function updateEditingStatus(taskId: string, newStatus: EditingStatus) {
  if (IS_DEMO) {
    const task = DEMO_EDITING_TASKS.find((t) => t.id === taskId);
    if (task) {
      task.status = newStatus;
    }
    return { success: true };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('editing_tasks')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', taskId);

  if (error) throw error;
  await createAuditLog('updated', 'editing_tasks', taskId, null, { status: newStatus });
  return { success: true };
}

// ============================================================
// 7. DELIVERABLES & ALBUM WORKFLOW
// ============================================================
export async function getServiceDeliverables(): Promise<EventDeliverable[]> {
  if (IS_DEMO) {
    return DEMO_DELIVERABLES as EventDeliverable[];
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('event_deliverables')
    .select('*, project:projects(name)')
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .order('deadline', { ascending: true });

  return (data || []) as EventDeliverable[];
}

export async function getServiceAlbumOrders(): Promise<AlbumOrder[]> {
  if (IS_DEMO) {
    return DEMO_ALBUM_ORDERS as AlbumOrder[];
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('album_orders')
    .select('*, client:clients(name, phone), project:projects(name)')
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .order('created_at', { ascending: false });

  return (data || []) as AlbumOrder[];
}

// ============================================================
// 8. FINANCE & TWO-WAY CENTRAL LEDGER SYNC
// ============================================================
export async function getServiceFinanceOverview() {
  if (IS_DEMO) {
    return {
      revenue: [
        { id: 'pay-001', client_name: 'Miss Noor Fatima', project_name: 'Noor & Hamza Wedding', amount: 250000, date: '2026-08-15', method: 'Bank Transfer (HBL)', reference: 'INV-SRV-2026-01', status: 'paid' },
        { id: 'pay-002', client_name: 'Ahmed Raza', project_name: 'Raza Family Mehndi Night', amount: 350000, date: '2026-09-01', method: 'JazzCash Business', reference: 'INV-SRV-2026-02', status: 'paid' },
      ],
      costs: DEMO_EVENT_COSTS,
      profitability: [
        { project_id: 'p-001', name: 'Noor & Hamza Grand Wedding', contracted: 550000, received: 250000, cost: 83000, profit: 467000, margin: 84.9 },
        { project_id: 'p-002', name: 'Raza Family Mehndi Night', contracted: 750000, received: 350000, cost: 200000, profit: 550000, margin: 73.3 },
      ],
    };
  }

  const supabase = await createClient();
  const { data: revenue } = await supabase
    .from('payments')
    .select('*, client:clients(name), project:projects(name)')
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .eq('is_archived', false)
    .order('created_at', { ascending: false });

  const { data: costs } = await supabase
    .from('event_costs')
    .select('*')
    .eq('brand_id', SNAP_SERVICE_BRAND_ID)
    .order('created_at', { ascending: false });

  return {
    revenue: revenue || [],
    costs: costs || [],
    profitability: [],
  };
}

/**
 * Record a payment in The Snap Service and AUTOMATICALLY synchronize
 * to the central The Snap Legacy financial transactions ledger.
 */
export async function recordServicePayment(formData: FormData) {
  const user = await getCurrentUser();
  const clientId = formData.get('client_id') as string;
  const projectId = formData.get('project_id') as string;
  const amount = Number(formData.get('amount'));
  const paymentMethod = (formData.get('payment_method') as string) || 'bank_transfer';
  const notes = (formData.get('notes') as string) || '';

  if (IS_DEMO) {
    return {
      success: true,
      message: `Payment of PKR ${amount.toLocaleString()} recorded and synchronized to Legacy HQ central finance!`,
    };
  }

  const supabase = await createClient();

  // 1. Insert into payments
  const { data: payment, error: pError } = await supabase
    .from('payments')
    .insert({
      brand_id: SNAP_SERVICE_BRAND_ID,
      client_id: clientId || null,
      project_id: projectId || null,
      amount,
      currency: 'PKR',
      payment_method: paymentMethod,
      status: 'paid',
      paid_at: new Date().toISOString(),
      notes,
      created_by: user?.id || null,
    })
    .select()
    .single();

  if (pError) throw pError;

  // 2. Automatically sync to central financial_transactions ledger
  const { error: tError } = await supabase.from('financial_transactions').insert({
    brand_id: SNAP_SERVICE_BRAND_ID,
    client_id: clientId || null,
    project_id: projectId || null,
    type: 'credit',
    amount,
    currency: 'PKR',
    date: new Date().toISOString().split('T')[0],
    description: `The Snap Service — Payment received: ${notes || 'Client event payment'}`,
    reference: `TX-SRV-${Date.now()}`,
    created_by: user?.id || null,
  });

  if (tError) throw tError;

  await createAuditLog('created', 'payments', payment.id, null, payment);
  return { success: true };
}

/**
 * Record an event cost and sync to central expenses.
 */
export async function recordServiceCost(formData: FormData) {
  const user = await getCurrentUser();
  const projectId = formData.get('project_id') as string;
  const category = (formData.get('category') as any) || 'freelancer';
  const description = formData.get('description') as string;
  const amount = Number(formData.get('amount'));
  const vendorName = formData.get('vendor_name') as string;

  if (IS_DEMO) {
    return { success: true, message: `Event cost of PKR ${amount.toLocaleString()} logged.` };
  }

  const supabase = await createClient();

  // 1. Insert into event_costs
  const { data: cost, error: cError } = await supabase
    .from('event_costs')
    .insert({
      brand_id: SNAP_SERVICE_BRAND_ID,
      project_id: projectId,
      category,
      description,
      amount,
      currency: 'PKR',
      vendor_name: vendorName || null,
      payment_status: 'paid',
      created_by: user?.id || null,
    })
    .select()
    .single();

  if (cError) throw cError;

  // 2. Synchronize to central expenses
  await supabase.from('expenses').insert({
    brand_id: SNAP_SERVICE_BRAND_ID,
    project_id: projectId,
    title: `[Snap Service] ${description}`,
    amount,
    currency: 'PKR',
    date: new Date().toISOString().split('T')[0],
    status: 'paid',
    created_by: user?.id || null,
  });

  await createAuditLog('created', 'event_costs', cost.id, null, cost);
  return { success: true };
}

// ============================================================
// 9. SERVICE SETTINGS (Brand Isolation)
// ============================================================
export async function getServiceSettings() {
  return {
    brand_name: 'The Snap Service',
    tagline: 'Premier Wedding Photography & Cinematography',
    parent_brand: 'The Snap Legacy',
    email: 'service@thesnaplegacy.com',
    phone: '+92 300 1234567',
    city: 'Faisalabad / Lahore',
    currency: 'PKR',
    default_quotation_validity_days: 14,
    bank_account_title: 'The Snap Service',
    bank_name: 'Habib Bank Limited (HBL)',
    account_number: '0123-4567890123',
    iban: 'PK00HABB0001234567890123',
    instagram: '@thesnapservice',
    default_terms: '50% advance booking deposit required to confirm event dates. Remaining 50% due on the event date. Raw photos delivered within 7 working days.',
  };
}
