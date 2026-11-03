import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import EmptyState from './EmptyState';
import { COLUMNS, STATUSES } from '../utils/taskHelpers';

export default function KanbanBoard({
  tasks = [],
  totalTasks = 0,
  searchQuery = '',
  activeFilterCount = 0,
  onOpenCreateModal,
  onOpenEditModal,
  onOpenDeleteDialog,
  onStatusChange,
  onDropTask,
  onResetFilters,
  onLoadSamples,
}) {
  const [activeDragId, setActiveDragId] = useState(null);

  // If entire board has 0 tasks (and no search query or filter is active)
  if (totalTasks === 0) {
    return (
      <EmptyState
        type="no-tasks"
        onAddTask={() => onOpenCreateModal(STATUSES.TODO)}
        onLoadSamples={onLoadSamples}
      />
    );
  }

  // If search/filters are active and yielded 0 results
  if (tasks.length === 0 && (activeFilterCount > 0 || searchQuery)) {
    return (
      <EmptyState
        type="no-results"
        searchQuery={searchQuery}
        onResetFilters={onResetFilters}
        onAddTask={() => onOpenCreateModal(STATUSES.TODO)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {COLUMNS.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        return (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={columnTasks}
            onAddTask={(columnStatus) => onOpenCreateModal(columnStatus)}
            onEditTask={(task) => onOpenEditModal(task)}
            onDeleteTask={(task) => onOpenDeleteDialog(task)}
            onStatusChange={onStatusChange}
            onDropTask={onDropTask}
            activeDragId={activeDragId}
            setActiveDragId={setActiveDragId}
          />
        );
      })}
    </div>
  );
}
