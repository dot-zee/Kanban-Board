import React from 'react';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import { PRIORITIES, STATUSES } from '../utils/taskHelpers';
import { Filter, SlidersHorizontal, X } from 'lucide-react';

export default function Toolbar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  statusFilter,
  onStatusChange,
  onClearFilters,
  activeFilterCount,
  totalMatching,
  totalTasks,
}) {
  const priorityOptions = [
    { label: 'All Priorities', value: 'All' },
    { label: 'Low Priority', value: PRIORITIES.LOW },
    { label: 'Medium Priority', value: PRIORITIES.MEDIUM },
    { label: 'High Priority', value: PRIORITIES.HIGH },
  ];

  const statusOptions = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Todo', value: STATUSES.TODO },
    { label: 'In Progress', value: STATUSES.IN_PROGRESS },
    { label: 'Completed', value: STATUSES.COMPLETED },
  ];

  const hasFiltersApplied = activeFilterCount > 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-3 sm:p-4 mb-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Search bar */}
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onClear={() => onSearchChange('')}
        />

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1 hidden sm:flex">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters:</span>
          </div>

          <FilterDropdown
            label="Filter by Priority"
            value={priorityFilter}
            options={priorityOptions}
            onChange={onPriorityChange}
            icon={Filter}
          />

          <FilterDropdown
            label="Filter by Status"
            value={statusFilter}
            options={statusOptions}
            onChange={onStatusChange}
          />

          {hasFiltersApplied && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 hover:text-rose-700 active:scale-95 transition-all shadow-2xs"
              title="Reset all active filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear filters ({activeFilterCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter status summary line */}
      {hasFiltersApplied && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-700">{totalMatching}</strong> of{' '}
            <strong className="text-slate-700">{totalTasks}</strong> total tasks
            {searchQuery && (
              <span>
                {' '}
                matching "<span className="text-indigo-600 font-medium">{searchQuery}</span>"
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

