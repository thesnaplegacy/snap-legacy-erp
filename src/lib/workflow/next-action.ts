import type {
  MemoriesLead,
  MemoriesQuote,
  MemoriesSession,
  MemoriesGallery,
  MemoriesEditingPipeline,
  MemoriesNextAction,
} from '@/lib/types/database';

export interface WorkflowEntities {
  leads?: MemoriesLead[];
  quotes?: MemoriesQuote[];
  sessions?: MemoriesSession[];
  galleries?: MemoriesGallery[];
  editing?: MemoriesEditingPipeline[];
}

/**
 * Calculates the single most critical NEXT ACTION for a client or session.
 * Prioritizes urgent operational blockers over passive states.
 */
export function calculateNextActions(entities: WorkflowEntities): MemoriesNextAction[] {
  const actions: MemoriesNextAction[] = [];

  // 1. Leads not contacted
  (entities.leads || []).forEach((lead) => {
    if (lead.status === 'NEW') {
      actions.push({
        id: `na-lead-${lead.id}`,
        priority: 'urgent',
        title: `Contact New Inquiry: ${lead.name}`,
        reason: `New lead received via ${lead.source} for ${lead.service_interest}. Prompt response increases conversion by 70%.`,
        client_name: lead.name,
        entity_type: 'lead',
        entity_id: lead.id,
        action_label: 'Contact Lead via WhatsApp',
        action_href: '/memories/leads',
      });
    } else if (lead.status === 'QUOTE_SENT') {
      actions.push({
        id: `na-lead-follow-${lead.id}`,
        priority: 'normal',
        title: `Follow Up on Quote: ${lead.name}`,
        reason: `Quote sent for ${lead.service_interest}. Awaiting client response.`,
        client_name: lead.name,
        entity_type: 'lead',
        entity_id: lead.id,
        action_label: 'Send Follow-up Message',
        action_href: '/memories/leads',
      });
    }
  });

  // 2. Quotes accepted without deposit
  (entities.quotes || []).forEach((quote) => {
    if (quote.status === 'accepted' && quote.deposit_required > 0 && quote.balance_due === quote.total_amount) {
      actions.push({
        id: `na-quote-${quote.id}`,
        priority: 'urgent',
        title: `Verify Deposit: Quote #${quote.quote_number}`,
        reason: `Client accepted quote for ${quote.session_type}. Deposit of PKR ${quote.deposit_required.toLocaleString()} required to confirm slot.`,
        client_name: (quote.client as unknown as { name: string })?.name || 'Client',
        entity_type: 'quote',
        entity_id: quote.id,
        action_label: 'Verify Deposit & Confirm Hold',
        action_href: '/memories/payments',
      });
    }
  });

  // 3. Sessions: Pre-shoot preparation & Shoot-Day operations
  (entities.sessions || []).forEach((session) => {
    if (session.booking_status === 'confirmed' && session.status === 'scheduled') {
      const checklist = session.pre_shoot_checklist || {};
      const isIncomplete =
        !checklist.equipment_ready ||
        !checklist.studio_ready ||
        !checklist.props_ready ||
        !checklist.client_contacted;

      if (isIncomplete) {
        actions.push({
          id: `na-sess-prep-${session.id}`,
          priority: 'high',
          title: `Prepare Studio: ${session.title}`,
          reason: `Session scheduled for ${session.session_date} in ${session.location}. Checklist items require staff sign-off.`,
          client_name: (session.client as unknown as { name: string })?.name || 'Client',
          entity_type: 'session',
          entity_id: session.id,
          action_label: 'Complete Shoot-Day Checklist',
          action_href: `/memories/sessions/${session.id}/shoot-day`,
        });
      }
    } else if (session.shoot_day_status === 'Shoot Completed' && session.status === 'in_editing') {
      actions.push({
        id: `na-sess-gallery-${session.id}`,
        priority: 'high',
        title: `Create Proofing Gallery: ${session.title}`,
        reason: 'Shoot completed. Back up raw files and generate watermarked selection gallery for client.',
        client_name: (session.client as unknown as { name: string })?.name || 'Client',
        entity_type: 'session',
        entity_id: session.id,
        action_label: 'Create Proofing Gallery',
        action_href: '/memories/galleries',
      });
    }
  });

  // 4. Galleries: Awaiting client selection
  (entities.galleries || []).forEach((gallery) => {
    if (gallery.status === 'delivered_for_selection') {
      actions.push({
        id: `na-gal-${gallery.id}`,
        priority: 'normal',
        title: `Await Selection: ${gallery.title}`,
        reason: `Gallery delivered to client. Deadline: ${gallery.selection_deadline || 'Open'}. Maximum ${gallery.max_selections} selections.`,
        client_name: (gallery.client as unknown as { name: string })?.name || 'Client',
        entity_type: 'gallery',
        entity_id: gallery.id,
        action_label: 'View Gallery Status',
        action_href: '/memories/galleries',
      });
    } else if (gallery.status === 'selection_completed') {
      actions.push({
        id: `na-gal-edit-${gallery.id}`,
        priority: 'high',
        title: `Start Editing Selection: ${gallery.title}`,
        reason: 'Client submitted selected photo keys. Ready for high-end master retouching.',
        client_name: (gallery.client as unknown as { name: string })?.name || 'Client',
        entity_type: 'gallery',
        entity_id: gallery.id,
        action_label: 'Open Editing Pipeline',
        action_href: '/memories/editing',
      });
    }
  });

  // 5. Editing pipeline in final review
  (entities.editing || []).forEach((item) => {
    if (item.status === 'in_review') {
      actions.push({
        id: `na-edit-rev-${item.id}`,
        priority: 'high',
        title: 'Master Retouching Final Review',
        reason: `Retoucher submitted ${item.photos_count} retouched portraits. Lead photographer QC sign-off required.`,
        client_name: (item.session as unknown as { title: string })?.title || 'Session',
        entity_type: 'editing',
        entity_id: item.id,
        action_label: 'Review Retouched Portraits',
        action_href: '/memories/editing',
      });
    } else if (item.status === 'ready_for_delivery') {
      actions.push({
        id: `na-edit-deliv-${item.id}`,
        priority: 'normal',
        title: 'Deliver High-Res Cloud Vault',
        reason: 'Photos approved. Generate final download package and notify client via WhatsApp.',
        client_name: (item.session as unknown as { title: string })?.title || 'Session',
        entity_type: 'delivery',
        entity_id: item.id,
        action_label: 'Deliver to Client',
        action_href: '/memories/deliverables',
      });
    }
  });

  // Sort by priority (urgent -> high -> normal)
  const priorityWeight = { urgent: 3, high: 2, normal: 1 };
  return actions.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
}
