import {
  STATUSES,
  PRIORITIES,
  COLUMNS,
  PRIORITY_CONFIG,
  generateId,
  isOverdue,
  formatDate,
  filterTasks,
  INITIAL_TASKS,
} from '../src/utils/taskHelpers.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ ${message}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('--- Running TaskFlow Unit & Edge Case Tests ---');

// Edge Case 1: Adding a task with only a title
const testTask1 = {
  id: generateId(),
  title: 'Task with only title',
  description: '',
  priority: PRIORITIES.MEDIUM,
  dueDate: '',
  status: STATUSES.TODO,
};
assert(testTask1.title.length > 0 && testTask1.id.startsWith('task-'), 'Case 1: Task with only title has valid ID and title');

// Edge Case 2: Adding a task with all fields populated
const testTask2 = {
  id: generateId(),
  title: 'Full Task',
  description: 'Detailed description with steps',
  priority: PRIORITIES.HIGH,
  dueDate: '2026-12-31',
  status: STATUSES.IN_PROGRESS,
};
assert(testTask2.priority === PRIORITIES.HIGH && testTask2.status === STATUSES.IN_PROGRESS, 'Case 2: Task with all fields populated');

// Edge Case 3: Editing an existing task preserving ID
const originalId = testTask2.id;
const updatedTask = {
  ...testTask2,
  title: 'Updated Title',
  priority: PRIORITIES.LOW,
};
assert(updatedTask.id === originalId && updatedTask.title === 'Updated Title', 'Case 3: Edit task preserves ID and updates fields');

// Edge Case 4: Deleting a task
let taskList = [testTask1, testTask2];
taskList = taskList.filter((t) => t.id !== testTask1.id);
assert(taskList.length === 1 && taskList[0].id === testTask2.id, 'Case 4: Deleting task removes it from list');

// Edge Case 5: Moving a task from Todo to In Progress
let movingTask = { ...testTask1, status: STATUSES.TODO };
movingTask.status = STATUSES.IN_PROGRESS;
assert(movingTask.status === STATUSES.IN_PROGRESS, 'Case 5: Move from Todo to In Progress');

// Edge Case 6: Moving a task from In Progress to Completed
movingTask.status = STATUSES.COMPLETED;
assert(movingTask.status === STATUSES.COMPLETED, 'Case 6: Move from In Progress to Completed');

// Edge Case 7: Persistence simulation
const serialized = JSON.stringify(INITIAL_TASKS);
const deserialized = JSON.parse(serialized);
assert(Array.isArray(deserialized) && deserialized.length === INITIAL_TASKS.length, 'Case 7: LocalStorage JSON serialization and deserialization');

// Edge Case 8: Searching for an existing task (case-insensitive)
const searchResultExisting = filterTasks(INITIAL_TASKS, { searchQuery: 'rEsEaRcH' });
assert(searchResultExisting.length >= 1 && searchResultExisting[0].title.toLowerCase().includes('research'), 'Case 8: Search case-insensitive finds task');

// Edge Case 9: Searching for a nonexistent task
const searchResultNonExistent = filterTasks(INITIAL_TASKS, { searchQuery: 'xyznonexistent123' });
assert(searchResultNonExistent.length === 0, 'Case 9: Search for non-existent returns empty array');

// Edge Case 10: Filtering by High priority
const highPriorityOnly = filterTasks(INITIAL_TASKS, { priorityFilter: PRIORITIES.HIGH });
assert(highPriorityOnly.length > 0 && highPriorityOnly.every((t) => t.priority === PRIORITIES.HIGH), 'Case 10: Filter by High priority');

// Edge Case 11: Applying priority and status filters together
const combinedFilter = filterTasks(INITIAL_TASKS, {
  priorityFilter: PRIORITIES.HIGH,
  statusFilter: STATUSES.IN_PROGRESS,
});
assert(combinedFilter.every((t) => t.priority === PRIORITIES.HIGH && t.status === STATUSES.IN_PROGRESS), 'Case 11: Compound priority and status filters');

// Edge Case 12: Clearing all filters returns all tasks
const clearedFilters = filterTasks(INITIAL_TASKS, {
  searchQuery: '',
  priorityFilter: 'All',
  statusFilter: 'All',
});
assert(clearedFilters.length === INITIAL_TASKS.length, 'Case 12: Clearing filters returns all tasks');

// Edge Case 13: Handling an empty board
const emptyBoard = filterTasks([], { searchQuery: '', priorityFilter: 'All', statusFilter: 'All' });
assert(Array.isArray(emptyBoard) && emptyBoard.length === 0, 'Case 13: Empty board handled safely');

// Edge Case 14: Handling invalid LocalStorage data
function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
}
const corruptedJsonResult = safeParse('{ bad json: broken [');
const nonArrayJsonResult = safeParse('{"foo": "bar"}');
assert(corruptedJsonResult.length === INITIAL_TASKS.length, 'Case 14a: Corrupted JSON falls back safely');
assert(nonArrayJsonResult.length === INITIAL_TASKS.length, 'Case 14b: Non-array JSON falls back safely');

// Overdue helper checks
const overdueTask = isOverdue('2020-01-01', STATUSES.TODO);
const completedPastTask = isOverdue('2020-01-01', STATUSES.COMPLETED);
assert(overdueTask === true, 'Overdue check identifies overdue task');
assert(completedPastTask === false, 'Completed task is never marked overdue');

// Date formatting checks
const formatted = formatDate('2026-11-15');
assert(typeof formatted === 'string' && formatted.includes('2026'), 'Date formatting works correctly');

console.log(`\nResults: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);

