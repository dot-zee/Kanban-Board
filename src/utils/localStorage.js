import { INITIAL_TASKS } from './taskHelpers';

const STORAGE_KEY = 'taskflow_tasks_v1';

/**
 * Loads tasks from LocalStorage safely.
 * Returns initial sample tasks if LocalStorage is empty.
 * Returns empty array or initial tasks if corrupted JSON is found.
 */
export const loadTasksFromStorage = () => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      // First-time visit: seed with clean starter tasks for instant evaluation
      saveTasksToStorage(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    console.warn('[LocalStorage] Corrupted data shape detected. Resetting to defaults.');
    return INITIAL_TASKS;
  } catch (error) {
    console.error('[LocalStorage] Failed to parse stored tasks:', error);
    return INITIAL_TASKS;
  }
};

/**
 * Saves tasks to LocalStorage safely.
 */
export const saveTasksToStorage = (tasks) => {
  try {
    if (!Array.isArray(tasks)) {
      console.error('[LocalStorage] Attempted to save non-array data');
      return false;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    console.error('[LocalStorage] Failed to save tasks:', error);
    return false;
  }
};

/**
 * Clears stored tasks (for testing/resetting purposes).
 */
export const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('[LocalStorage] Failed to clear storage:', error);
    return false;
  }
};

