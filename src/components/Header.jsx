import React from 'react';
import {
  CheckSquare,
  Plus,
  BarChart3,
  RotateCcw,
  Sparkles,
  Layers,
} from 'lucide-react';

export default function Header({
  stats,
  onOpenCreateModal,
  onResetDefaults,
  onClearAll,
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md shadow-indigo-100 flex-shrink-0">
              <CheckSquare className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
                  TaskFlow
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Kanban
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Manage your work efficiently.
              </p>
            </div>
          </div>

          {/* Metrics & Actions */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
            {/* Quick Statistics Bar */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Total:</span>
                <span className="font-semibold text-slate-900 bg-white px-1.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  {stats.total}
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Active:</span>
                <span className="font-semibold text-slate-900 bg-white px-1.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  {stats.inProgress}
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Done:</span>
                <span className="font-semibold text-slate-900 bg-white px-1.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                  {stats.completed}
                </span>
              </div>
            </div>

            {/* Utility demo buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onResetDefaults}
                title="Reset to default sample tasks for demonstration"
                className="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-all shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden xl:inline">Reset Demo</span>
              </button>

              {/* Add Task Primary CTA */}
              <button
                type="button"
                onClick={() => onOpenCreateModal()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm hover:shadow active:scale-98 transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-label="Add new task"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
