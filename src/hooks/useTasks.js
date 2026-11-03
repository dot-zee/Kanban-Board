import { useState, useEffect, useMemo, useCallback } from 'react';
import { loadTasksFromStorage, saveTasksToStorage } from '../utils/localStorage';
import {
  STATUSES,
  PRIORITIES,
  generateId,
  filterTasks,
  INITIAL_TASKS,
} from '../utils/taskHelpers';

export const useTasks = () => {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Persist to LocalStorage whenever tasks state updates
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Derived task counts and metrics
  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === STATUSES.TODO).length;
    const inProgress = tasks.filter((t) => t.status === STATUSES.IN_PROGRESS).length;
    const completed = tasks.filter((t) => t.status === STATUSES.COMPLETED).length;
    return { total, todo, inProgress, completed };
  }, [tasks]);

  // Derived filtered tasks
  const filteredTasks = useMemo(() => {
    return filterTasks(tasks, { searchQuery, priorityFilter, statusFilter });
  }, [tasks, searchQuery, priorityFilter, statusFilter]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim().length > 0) count++;
    if (priorityFilter !== 'All' && priorityFilter !== 'All Priorities') count++;
    if (statusFilter !== 'All' && statusFilter !== 'All Statuses') count++;
    return count;
  }, [searchQuery, priorityFilter, statusFilter]);

  // Reset filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setPriorityFilter('All');
    setStatusFilter('All');
  }, []);

  // Add Task
  const addTask = useCallback((taskData) => {
    const trimmedTitle = taskData.title ? taskData.title.trim() : '';
    if (!trimmedTitle) {
      return { success: false, error: 'Task title is required.' };
    }

    const newTask = {
      id: generateId(),
      title: trimmedTitle,
      description: taskData.description ? taskData.description.trim() : '',
      priority: taskData.priority || PRIORITIES.MEDIUM,
      dueDate: taskData.dueDate || '',
      status: taskData.status || STATUSES.TODO,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    return { success: true, task: newTask };
  }, []);

  // Update Task
  const updateTask = useCallback((id, updatedData) => {
    const trimmedTitle = updatedData.title ? updatedData.title.trim() : '';
    if (!trimmedTitle) {
      return { success: false, error: 'Task title cannot be empty.' };
    }

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            title: trimmedTitle,
            description: updatedData.description !== undefined ? updatedData.description.trim() : task.description,
            priority: updatedData.priority || task.priority,
            dueDate: updatedData.dueDate !== undefined ? updatedData.dueDate : task.dueDate,
            status: updatedData.status || task.status,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
    return { success: true };
  }, []);

  // Delete Task
  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  // Move Task to a different Status
  const moveTask = useCallback((id, targetStatus) => {
    if (!Object.values(STATUSES).includes(targetStatus)) return;

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            status: targetStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return task;
      })
    );
  }, []);

  // Reorder or drop into a specific column position
  const reorderTasks = useCallback((draggedTaskId, targetColumnStatus, targetIndex) => {
    setTasks((prev) => {
      const taskToMove = prev.find((t) => t.id === draggedTaskId);
      if (!taskToMove) return prev;

      // Filter out moved task
      const remainingTasks = prev.filter((t) => t.id !== draggedTaskId);
      const updatedTask = {
        ...taskToMove,
        status: targetColumnStatus,
        updatedAt: new Date().toISOString(),
      };

      if (typeof targetIndex === 'number' && targetIndex >= 0) {
        // Find index in full array where it should be placed
        let columnMatchesSeen = 0;
        let insertFullIndex = remainingTasks.length;

        for (let i = 0; i < remainingTasks.length; i++) {
          if (remainingTasks[i].status === targetColumnStatus) {
            if (columnMatchesSeen === targetIndex) {
              insertFullIndex = i;
              break;
            }
            columnMatchesSeen++;
          }
        }

        const newArr = [...remainingTasks];
        newArr.splice(insertFullIndex, 0, updatedTask);
        return newArr;
      }

      // Default: place at the top of target column
      return [updatedTask, ...remainingTasks];
    });
  }, []);

  // Reset to default sample tasks
  const resetToDefaults = useCallback(() => {
    setTasks(INITIAL_TASKS);
    clearFilters();
  }, [clearFilters]);

  // Clear all tasks (for testing empty state)
  const clearAllTasks = useCallback(() => {
    setTasks([]);
  }, []);

  return {
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
    reorderTasks,
    resetToDefaults,
    clearAllTasks,
  };
};

