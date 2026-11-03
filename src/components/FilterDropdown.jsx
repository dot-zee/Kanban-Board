import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
  icon: Icon,
}) {
  return (
    <div className="relative inline-flex items-center">
      {Icon && (
        <span className="absolute left-3 text-slate-400 pointer-events-none">
          <Icon className="w-3.5 h-3.5" />
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className={`appearance-none bg-white border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 py-2 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs cursor-pointer hover:border-slate-300 transition-colors ${
          Icon ? 'pl-8 pr-8' : 'pl-3 pr-8'
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-2.5 pointer-events-none text-slate-400">
        <ChevronDown className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
