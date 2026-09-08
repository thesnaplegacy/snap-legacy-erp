'use client';

import React, { useState } from 'react';
import {
  Settings,
  Heart,
  Save,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Bell,
  MapPin,
  Camera,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MemoriesSettingsPage() {
  const [studioName, setStudioName] = useState('Snap Memories');
  const [primaryColor, setPrimaryColor] = useState('#46BBD4');
  const [roomATemp, setRoomATemp] = useState('78°F - 80°F');
  const [roomBTemp, setRoomBTemp] = useState('72°F - 74°F');
  const [reminder7d, setReminder7d] = useState(true);
  const [reminder3d, setReminder3d] = useState(true);
  const [reminder1d, setReminder1d] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Studio Configuration
            </span>
            <span className="text-xs text-neutral-400">
              Brand ID: b0000000-0000-0000-0000-000000000004
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Snap Memories Studio Settings
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Studio room environment rules, automated WhatsApp reminder dispatch, and brand parameters.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
            Settings Preserved
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Identity */}
        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#46BBD4]" />
            Brand Identity & Visual Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Studio Brand Name</label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">Brand Signature Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white font-mono"
                />
                <div
                  className="w-9 h-9 rounded-xl border border-neutral-700 flex-shrink-0"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Studio Environmental Controls */}
        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#46BBD4]" />
            Studio Room Environment Standards
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Room A (Newborn & Sitter Pod) Target Temp
              </label>
              <input
                type="text"
                value={roomATemp}
                onChange={(e) => setRoomATemp(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
              />
              <p className="text-[11px] text-neutral-500 mt-1">Calibrated for unclothed baby comfort.</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Room B (Cake Smash & Family) Target Temp
              </label>
              <input
                type="text"
                value={roomBTemp}
                onChange={(e) => setRoomBTemp(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white"
              />
              <p className="text-[11px] text-neutral-500 mt-1">Splash tub warm water temperature 98°F-100°F.</p>
            </div>
          </div>
        </div>

        {/* Automation Dispatch Rules */}
        <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#46BBD4]" />
            Automated Parent Prep & Reminder Dispatches
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">7-Day Shoot Preparation Guide</span>
                <span className="text-[11px] text-neutral-400">Sends clothing palette guidance and nap timing suggestions.</span>
              </div>
              <input
                type="checkbox"
                checked={reminder7d}
                onChange={(e) => setReminder7d(e.target.checked)}
                className="accent-[#46BBD4] w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">3-Day Logistics & Cake Inspection</span>
                <span className="text-[11px] text-neutral-400">Verifies extra outfits and bakery smash cake confirmation.</span>
              </div>
              <input
                type="checkbox"
                checked={reminder3d}
                onChange={(e) => setReminder3d(e.target.checked)}
                className="accent-[#46BBD4] w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-white block">1-Day Studio Arrival Notice</span>
                <span className="text-[11px] text-neutral-400">Sends studio room assignment and parking concierge pin.</span>
              </div>
              <input
                type="checkbox"
                checked={reminder1d}
                onChange={(e) => setReminder1d(e.target.checked)}
                className="accent-[#46BBD4] w-4 h-4"
              />
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#46BBD4] hover:bg-[#57C1DA] text-neutral-950 font-bold px-6 py-2.5 gap-2 shadow-lg shadow-[#46BBD4]/20"
          >
            <Save className="w-4 h-4" />
            Save Studio Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
