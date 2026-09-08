'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Clock,
  MapPin,
  Baby,
  Thermometer,
  ShieldCheck,
  Phone,
  Camera,
  Coffee,
  Sparkles,
  Save,
  CheckSquare,
  Square,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMemoriesSessionById, updateShootDayChecklist, completeShootDay } from '@/actions/memories-actions';
import { MemoriesSession } from '@/lib/types/database';

export default function ShootDayStationPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.id as string;

  const [session, setSession] = useState<MemoriesSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [notes, setNotes] = useState('');

  // Default standard luxury studio checklist items
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    heater_ready: false,
    props_sanitized: false,
    white_noise_on: false,
    organic_wipes_ready: false,
    room_temperature_optimal: false,
    parent_comfort_setup: false,
    cake_inspected: false,
    splash_tub_warmed: false,
    camera_batteries_memory_cards: false,
    emergency_contacts_verified: false,
  });

  useEffect(() => {
    async function loadData() {
      if (!sessionId) return;
      try {
        const data = await getMemoriesSessionById(sessionId);
        if (data) {
          setSession(data);
          if (data.pre_shoot_checklist) {
            setChecklist((prev) => ({
              ...prev,
              ...(data.pre_shoot_checklist as unknown as Record<string, boolean>),
            }));
          }
          if (data.shoot_day_notes) {
            setNotes(data.shoot_day_notes);
          }
        }
      } catch (err) {
        console.error('Failed to load session:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [sessionId]);

  const toggleCheck = async (key: string) => {
    const newVal = !checklist[key];
    setChecklist((prev) => ({ ...prev, [key]: newVal }));
    try {
      await updateShootDayChecklist(sessionId, key, newVal);
    } catch (e) {
      console.error('Failed to update checklist item', e);
    }
  };

  const handleCompleteShoot = async () => {
    setSaving(true);
    try {
      await completeShootDay(sessionId, notes);
      setCompleted(true);
      setTimeout(() => {
        router.push('/memories/galleries');
      }, 1500);
    } catch (e) {
      console.error('Failed to complete shoot day', e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-neutral-400">
        <div className="w-8 h-8 border-2 border-[#46BBD4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Loading Shoot Day Command Station...</p>
      </div>
    );
  }

  const checklistItems = [
    {
      key: 'heater_ready',
      label: 'Studio Space Heater & Warmer Lamp Active (78°F - 80°F)',
      desc: 'Critical for newborn undressed safety and comforting sleepy baby.',
      icon: Thermometer,
      category: 'Safety & Warmth',
    },
    {
      key: 'props_sanitized',
      label: 'Props, Wraps & Blankets Steam Sanitized',
      desc: 'Fresh organic cotton wraps, washed in baby-safe scentless detergent.',
      icon: ShieldCheck,
      category: 'Hygiene',
    },
    {
      key: 'white_noise_on',
      label: 'Continuous White Noise / Womb Shusher Active',
      desc: 'Placed 4 feet away at low soothing frequency.',
      icon: Sparkles,
      category: 'Atmosphere',
    },
    {
      key: 'organic_wipes_ready',
      label: 'Hypoallergenic Organic Wipes, Diapers & Towels Ready',
      desc: 'Placed within arm reach of posing beanbag.',
      icon: Baby,
      category: 'Baby Care',
    },
    {
      key: 'cake_inspected',
      label: 'Smash Cake Inspected (Eggless / Allergy Confirmed)',
      desc: 'Decorated according to palette; safe edible non-toxic frosting.',
      icon: Coffee,
      category: 'Cake Smash',
    },
    {
      key: 'camera_batteries_memory_cards',
      label: 'Dual SD Memory Cards Formatted & Full Battery Banks',
      desc: 'Primary & secondary mirrorless bodies synced.',
      icon: Camera,
      category: 'Equipment',
    },
    {
      key: 'parent_comfort_setup',
      label: 'Parent Seating, Mineral Water & Refreshments Station',
      desc: 'Comfortable sofa with clear view of the posing pod.',
      icon: Coffee,
      category: 'Hospitality',
    },
    {
      key: 'emergency_contacts_verified',
      label: 'Emergency Parent & Pediatrician Info On Call',
      desc: 'Direct phone line active in studio reception.',
      icon: Phone,
      category: 'Safety',
    },
  ];

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Top Breadcrumb & Action */}
      <div className="flex items-center justify-between">
        <Link
          href="/memories/sessions"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Sessions</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Live Floor Station
          </span>
        </div>
      </div>

      {/* Hero Station Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Flame className="w-48 h-48 text-[#46BBD4]" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#46BBD4]/20 text-[#46BBD4] border border-[#46BBD4]/30">
                {session?.session_type || 'Studio Session'}
              </span>
              <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-medium">
                {session?.studio_room || 'Room A — Studio Pod'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              {session?.title || 'Active Shoot Day Station'}
            </h1>
            <p className="text-sm text-neutral-300">
              Parent: <span className="font-semibold text-white">{session?.client?.name || 'Sara Khan'}</span>
              {session?.client?.phone && ` • Contact: ${session?.client?.phone}`}
            </p>
          </div>

          <div className="bg-neutral-950/80 p-4 rounded-xl border border-neutral-800 text-center min-w-[160px]">
            <div className="text-xs text-neutral-400">Preparation Progress</div>
            <div className="text-3xl font-black text-[#46BBD4] mt-1">{progressPercent}%</div>
            <div className="text-[11px] text-neutral-400 mt-1">
              {completedCount} of {checklistItems.length} checked
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden border border-neutral-800">
        <div
          className="bg-gradient-to-r from-[#46BBD4] to-emerald-400 h-2 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#46BBD4]" />
            Pre-Shoot Safety, Comfort & Hygiene Protocol
          </h2>
          <span className="text-xs text-neutral-400">Click any card to mark ready</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklistItems.map((item) => {
            const isChecked = Boolean(checklist[item.key]);
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                onClick={() => toggleCheck(item.key)}
                className={`p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                  isChecked
                    ? 'bg-[#46BBD4]/10 border-[#46BBD4]/50'
                    : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-[#46BBD4]" />
                    ) : (
                      <Square className="w-5 h-5 text-neutral-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-semibold ${
                          isChecked ? 'text-white line-through decoration-[#46BBD4]/60' : 'text-neutral-200'
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shoot Day Floor Notes & Log */}
      <div className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <label className="text-sm font-semibold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          Floor Logs & Baby Feeding Pauses
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. 11:20 AM: 20 min feeding pause. Baby calm in sage wrap. 12:05 PM: Cake smash sequence started, gentle reactions."
          className="w-full rounded-lg bg-neutral-950 border border-neutral-800 p-3 text-sm text-neutral-200 focus:outline-none focus:border-[#46BBD4]"
        />
      </div>

      {/* Finish Shoot & Pipeline Trigger */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Wrap Up & Ingest Pipeline</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Marks shoot as completed, logs timestamp, and queues proofing gallery task for editors.
          </p>
        </div>

        <Button
          onClick={handleCompleteShoot}
          disabled={saving || completed}
          className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-neutral-950 font-bold px-6 py-2.5 gap-2 shadow-lg shadow-emerald-500/20"
        >
          {completed ? (
            <>
              <CheckCircle2 className="w-4 h-4 fill-neutral-950" />
              Completed! Redirecting...
            </>
          ) : saving ? (
            <>
              <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
              Ingesting...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Complete Shoot & Trigger Ingest
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
