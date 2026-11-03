export const STATUSES = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

export const PRIORITIES = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

export const COLUMNS = [
  {
    id: STATUSES.TODO,
    title: 'Todo',
    description: 'Tasks pending or queued up',
    badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    dotColor: 'bg-indigo-500',
  },
  {
    id: STATUSES.IN_PROGRESS,
    title: 'In Progress',
    description: 'Tasks currently being actively worked on',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    dotColor: 'bg-amber-500',
  },
  {
    id: STATUSES.COMPLETED,
    title: 'Completed',
    description: 'Tasks completed and verified',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
];

export const PRIORITY_CONFIG = {
  [PRIORITIES.LOW]: {
    label: 'Low',
    color: 'emerald',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
    barColor: 'border-l-emerald-500',
  },
  [PRIORITIES.MEDIUM]: {
    label: 'Medium',
    color: 'amber',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
    barColor: 'border-l-amber-500',
  },
  [PRIORITIES.HIGH]: {
    label: 'High',
    color: 'rose',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    dotColor: 'bg-rose-500',
    barColor: 'border-l-rose-500',
  },
};

export const generateId = () => {
  return `task-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
};

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === STATUSES.COMPLETED) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const taskDate = new Date(dueDate);
  return taskDate < today;
};

export const formatDate = (dateString) => {
  if (!dateString) return null;
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const filterTasks = (tasks = [], { searchQuery = '', priorityFilter = 'All', statusFilter = 'All' } = {}) => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    // Search query match (title search required; also checks description for better UX)
    const matchesSearch =
      !normalizedQuery ||
      task.title?.toLowerCase().includes(normalizedQuery) ||
      task.description?.toLowerCase().includes(normalizedQuery);

    // Priority filter match
    const matchesPriority =
      priorityFilter === 'All' ||
      priorityFilter === 'All Priorities' ||
      task.priority === priorityFilter;

    // Status filter match
    const matchesStatus =
      statusFilter === 'All' ||
      statusFilter === 'All Statuses' ||
      task.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });
};

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Research Competitor Kanban Boards',
    description: 'Analyze UX flows, drag-and-drop mechanics, and column metrics across Trello, Linear, and Jira.',
    priority: PRIORITIES.HIGH,
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    status: STATUSES.TODO,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Design Responsive Mobile Layout',
    description: 'Create fluid column transitions and ensure touch targets are comfortable on smaller screens.',
    priority: PRIORITIES.MEDIUM,
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // In 2 days
    status: STATUSES.TODO,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Implement LocalStorage State Sync',
    description: 'Build safe serialization hook with error recovery and persistence across refreshes.',
    priority: PRIORITIES.HIGH,
    dueDate: new Date().toISOString().split('T')[0], // Today
    status: STATUSES.IN_PROGRESS,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Build Search & Multi-Filter Engine',
    description: 'Support real-time debounced search by title and compound priority + status filtering.',
    priority: PRIORITIES.MEDIUM,
    dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0], // In 3 days
    status: STATUSES.IN_PROGRESS,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Setup Vite & Tailwind CSS Architecture',
    description: 'Configure standard modern tooling with postcss, autoprefixer, and design token scales.',
    priority: PRIORITIES.LOW,
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday (completed)
    status: STATUSES.COMPLETED,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-6',
    title: 'Audit Keyboard Accessibility (A11y)',
    description: 'Verify focus traps in modals, keyboard navigation shortcuts, and ARIA labels.',
    priority: PRIORITIES.LOW,
    dueDate: new Date(Date.now() + 345600000).toISOString().split('T')[0],
    status: STATUSES.COMPLETED,
    createdAt: new Date().toISOString(),
  },
];
