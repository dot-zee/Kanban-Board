import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Plus, Inbox } from 'lucide-react';

export default function KanbanColumn({
  column,
  tasks = [],
  onAddTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onDropTask,
  activeDragId,
  setActiveDragId,
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    // Check if moving to an outside element
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain') || activeDragId;
    if (taskId && onDropTask) {
      onDropTask(taskId, column.id);
    }
    setActiveDragId(null);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col bg-slate-50/80 rounded-2xl border transition-all duration-200 min-h-[500px] ${
        isDragOver
          ? 'border-indigo-400 bg-indigo-50/60 ring-2 ring-indigo-200'
          : 'border-slate-200/80'
      }`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-slate-200/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`}></span>
          <h2 className="font-bold text-slate-800 text-sm tracking-tight">
            {column.title}
          </h2>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${column.badgeClass}`}
          >
            {tasks.length}
          </span>
        </div>

        {/* Quick Add Task in this Column */}
        <button
          type="button"
          onClick={() => onAddTask(column.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-all shadow-2xs hover:shadow-xs active:scale-95"
          title={`Add task to ${column.title}`}
          aria-label={`Add task to ${column.title}`}
        >
          <Plus className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      {/* Cards List / Drop Target */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {tasks.length === 0 ? (
          <div
            className={`h-full min-h-[220px] rounded-xl border border-dashed flex flex-col items-center justify-center p-6 text-center transition-colors ${
              isDragOver
                ? 'border-indigo-400 bg-indigo-50/80'
                : 'border-slate-200 bg-slate-100/50'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 mb-2 shadow-2xs">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-slate-600">
              {isDragOver ? 'Drop task here' : `No tasks in ${column.title}`}
            </p>
            <p className="text-2xs text-slate-400 mt-1 max-w-[180px]">
              {isDragOver
                ? 'Release to move to this column'
                : 'Click + above or drag a task into this column'}
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
              isDragging={activeDragId === task.id}
              onDragStart={(id) => setActiveDragId(id)}
              onDragEnd={() => setActiveDragId(null)}
            />
          ))
        )}
      </div>
    </div>
  );
}
