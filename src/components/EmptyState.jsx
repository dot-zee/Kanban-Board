import React from 'react';
import { Plus, SearchX, CheckSquare, RotateCcw } from 'lucide-react';

export default function EmptyState({
  type = 'no-tasks',
  searchQuery = '',
  onAddTask,
  onResetFilters,
  onLoadSamples,
}) {
  if (type === 'no-results') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xs">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100 shadow-2xs">
          <SearchX className="w-7 h-7 stroke-[1.8]" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          No matching tasks found
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed max-w-sm mx-auto">
          We couldn't find any tasks matching your active search query
          {searchQuery ? ` "${searchQuery}"` : ''} or selected filters.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
          >
            Clear All Filters
          </button>
          <button
            type="button"
            onClick={onAddTask}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.2]" />
            <span>Add New Task</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-14 text-center max-w-lg mx-auto shadow-2xs">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-xs">
        <CheckSquare className="w-8 h-8 stroke-[1.8]" />
      </div>
      <h3 className="text-xl font-bold text-slate-800">
        Your board is clear
      </h3>
      <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
        No tasks have been added yet. Start planning, organizing, and tracking your work by creating your first task card.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onAddTask}
          className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-all shadow-xs flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Your First Task</span>
        </button>
        {onLoadSamples && (
          <button
            type="button"
            onClick={onLoadSamples}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Load Sample Tasks</span>
          </button>
        )}
      </div>
    </div>
  );
}
