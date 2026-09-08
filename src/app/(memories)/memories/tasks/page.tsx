'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ListTodo,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Sparkles,
  CheckSquare,
  Square,
} from 'lucide-react';
import { getMemoriesTasks, updateTaskStatus } from '@/actions/memories-actions';
import { MemoriesTask } from '@/lib/types/database';
import { formatDate } from '@/lib/constants';
import { Button } from '@/components/ui/button';

export default function MemoriesTasksPage() {
  const [tasks, setTasks] = useState<MemoriesTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMemoriesTasks();
        setTasks(data);
      } catch (e) {
        console.error('Failed to load tasks:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleTask = async (task: MemoriesTask) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    try {
      await updateTaskStatus(task.id, newStatus);
    } catch (e) {
      console.error('Failed to update task:', e);
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#46BBD4]/15 text-[#46BBD4] border border-[#46BBD4]/30">
              Operations Engine
            </span>
            <span className="text-xs text-neutral-400">
              Automated Prep & Quality Control
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Studio Tasks & Automated Workflows
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Track studio preparation, prop sanitization, smash cake orders, and follow-up checklists.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-[#46BBD4] hover:bg-[#57C1DA] text-neutral-950 font-bold gap-2">
            <Plus className="w-4 h-4" />
            New Studio Task
          </Button>
        </div>
      </div>

      {/* Task Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs text-neutral-400">Total Action Items</div>
          <div className="text-2xl font-bold text-white mt-1">{tasks.length}</div>
          <div className="text-xs text-[#46BBD4] mt-1">Automated & manual</div>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs text-neutral-400">Pending Execution</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{pendingTasks.length}</div>
          <div className="text-xs text-amber-500/80 mt-1">Action required</div>
        </div>
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="text-xs text-neutral-400">Completed Items</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{completedTasks.length}</div>
          <div className="text-xs text-emerald-500/80 mt-1">Studio QA passed</div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Pending Operational Tasks</h2>

        <div className="grid grid-cols-1 gap-3">
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task)}
              className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/80 hover:border-[#46BBD4]/40 cursor-pointer transition-all flex items-start gap-4 select-none"
            >
              <div className="mt-1">
                <Square className="w-5 h-5 text-neutral-500 hover:text-[#46BBD4]" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{task.title}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                      task.priority === 'urgent'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : task.priority === 'high'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">{task.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-500 pt-1">
                  <span>Due: {task.due_date ? formatDate(task.due_date) : 'ASAP'}</span>
                  <span>Assignee: {task.assignee?.full_name || 'Studio Team'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">
            Completed Archive
          </h2>
          <div className="grid grid-cols-1 gap-2 opacity-60 hover:opacity-100 transition-opacity">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task)}
                className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800/60 cursor-pointer flex items-center gap-3 select-none"
              >
                <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-xs text-neutral-400 line-through flex-1">{task.title}</span>
                <span className="text-[10px] text-neutral-500 font-mono">DONE</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
