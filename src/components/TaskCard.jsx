import React from 'react';
import {
  Calendar,
  Edit3,
  Trash2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  GripVertical,
} from 'lucide-react';
import {
  PRIORITY_CONFIG,
  STATUSES,
  formatDate,
  isOverdue,
} from '../utils/taskHelpers';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  isDragging,
  onDragStart,
  onDragEnd,
}) {
  const priorityConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium;
  const overdue = isOverdue(task.dueDate, task.status);
  const formattedDueDate = formatDate(task.dueDate);

  // Status transitions
  const statusOptions = [
    { id: STATUSES.TODO, label: 'Todo' },
    { id: STATUSES.IN_PROGRESS, label: 'In Progress' },
    { id: STATUSES.COMPLETED, label: 'Completed' },
  ];

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart(task.id);
  };

  const getPreviousStatus = () => {
    if (task.status === STATUSES.COMPLETED) return STATUSES.IN_PROGRESS;
    if (task.status === STATUSES.IN_PROGRESS) return STATUSES.TODO;
    return null;
  };

  const getNextStatus = () => {
    if (task.status === STATUSES.TODO) return STATUSES.IN_PROGRESS;
    if (task.status === STATUSES.IN_PROGRESS) return STATUSES.COMPLETED;
    return null;
  };

  const prevStatus = getPreviousStatus();
  const nextStatus = getNextStatus();

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      className={`group relative bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 p-4 cursor-grab active:cursor-grabbing border-l-4 ${priorityConfig.barColor} ${
        isDragging ? 'opacity-40 scale-[0.98] border-dashed border-indigo-400' : ''
      }`}
    >
      {/* Top Header: Priority badge, Drag Handle, & Edit/Delete actions */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${priorityConfig.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dotColor}`}></span>
            {priorityConfig.label}
          </span>

          {overdue && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-rose-50 text-rose-700 border border-rose-200"
              title="This task is past its due date"
            >
              <AlertCircle className="w-3 h-3 text-rose-500" />
              Overdue
            </span>
          )}
        </div>

        {/* Quick action buttons (Edit, Delete) */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            title="Edit task"
            className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            aria-label={`Edit ${task.title}`}
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            title="Delete task"
            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Task Title */}
      <h3 className="font-semibold text-slate-800 text-sm leading-snug break-words mb-1.5">
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-3 break-words">
          {task.description}
        </p>
      )}

      {/* Card Footer: Due Date and Status Selector */}
      <div className="pt-2.5 mt-1 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 gap-2">
        {/* Due date */}
        <div className="flex items-center gap-1.5 min-w-0">
          {formattedDueDate ? (
            <div
              className={`flex items-center gap-1 text-2xs font-medium truncate ${
                overdue ? 'text-rose-600 font-semibold' : 'text-slate-500'
              }`}
              title={`Due date: ${formattedDueDate}`}
            >
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{formattedDueDate}</span>
            </div>
          ) : (
            <span className="text-2xs text-slate-400 italic">No due date</span>
          )}
        </div>

        {/* Status quick changer + directional arrows */}
        <div className="flex items-center gap-1">
          {prevStatus && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(task.id, prevStatus);
              }}
              title={`Move back to ${prevStatus}`}
              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              aria-label={`Move back to ${prevStatus}`}
            >
              <ArrowLeft className="w-3 h-3" />
            </button>
          )}

          <select
            value={task.status}
            onChange={(e) => {
              e.stopPropagation();
              onStatusChange(task.id, e.target.value);
            }}
            className="text-2xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md py-1 px-1.5 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            title="Move task to another status"
            aria-label={`Change status for ${task.title}`}
          >
            {statusOptions.map((st) => (
              <option key={st.id} value={st.id}>
                {st.label}
              </option>
            ))}
          </select>

          {nextStatus && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(task.id, nextStatus);
              }}
              title={`Move forward to ${nextStatus}`}
              className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
              aria-label={`Move forward to ${nextStatus}`}
            >
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
