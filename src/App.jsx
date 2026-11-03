import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import KanbanBoard from './components/KanbanBoard';
import TaskModal from './components/TaskModal';
import ConfirmDialog from './components/ConfirmDialog';
import { useTasks } from './hooks/useTasks';
import { STATUSES } from './utils/taskHelpers';

export default function App() {
  const {
    tasks,
    filteredTasks,
    stats,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    statusFilter,
    setStatusFilter,
    clearFilters,
    activeFilterCount,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    resetToDefaults,
    clearAllTasks,
  } = useTasks();

  // Modal and Dialog UI States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultStatusForNew, setDefaultStatusForNew] = useState(STATUSES.TODO);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Keyboard shortcut: 'n' for new task when no inputs are focused
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      const isInputActive = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select';

      if (!isInputActive && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        openCreateModal(STATUSES.TODO);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Add / Edit Modal
  const openCreateModal = (columnStatus = STATUSES.TODO) => {
    setEditingTask(null);
    setDefaultStatusForNew(columnStatus);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleTaskSubmit = (formData) => {
    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
  };

  // Handlers for Delete Dialog
  const openDeleteDialog = (task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete?.id) {
      deleteTask(taskToDelete.id);
      closeDeleteDialog();
    }
  };

  // Handlers for status update / drop
  const handleDropTask = (taskId, targetStatus) => {
    moveTask(taskId, targetStatus);
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Application Header */}
      <Header
        stats={stats}
        onOpenCreateModal={() => openCreateModal(STATUSES.TODO)}
        onResetDefaults={resetToDefaults}
        onClearAll={clearAllTasks}
      />

      {/* Main Board Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Toolbar: Search, Filters, and Clear */}
        <Toolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onClearFilters={clearFilters}
          activeFilterCount={activeFilterCount}
          totalMatching={filteredTasks.length}
          totalTasks={tasks.length}
        />

        {/* 3-Column Kanban Board */}
        <KanbanBoard
          tasks={filteredTasks}
          totalTasks={tasks.length}
          searchQuery={searchQuery}
          activeFilterCount={activeFilterCount}
          onOpenCreateModal={openCreateModal}
          onOpenEditModal={openEditModal}
          onOpenDeleteDialog={openDeleteDialog}
          onStatusChange={moveTask}
          onDropTask={handleDropTask}
          onResetFilters={clearFilters}
          onLoadSamples={resetToDefaults}
        />
      </main>

      {/* Subtle modern footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} TaskFlow • Modern Kanban Task Management</p>
          <div className="flex items-center gap-4 text-2xs text-slate-400">
            <span>Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-slate-600">N</kbd> anywhere for new task</span>
            <span>•</span>
            <span>Drag & drop cards to change status</span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        onSubmit={handleTaskSubmit}
        initialData={editingTask}
        defaultStatus={defaultStatusForNew}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        taskTitle={taskToDelete?.title}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteDialog}
      />
    </div>
  );
}
