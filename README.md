# TaskFlow — Modern Responsive Kanban Task Board

A responsive, production-grade Kanban Task Management application built with **React 18**, **Vite**, **Tailwind CSS**, and **Lucide React**. Designed with a focus on clean architecture, accessible interactions, robust state persistence, and polished UI/UX.

---

## 🚀 Live Demo & Quick Start

### Prerequisites
- **Node.js** (v18.0.0 or later)
- **npm**, **yarn**, or **pnpm**

### Installation & Local Development

1. Clone or navigate to the project directory:
   ```bash
   cd "D:\Cohort 3.0\Kanban Board"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. Run unit and edge-case tests:
   ```bash
   npm test
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## 🌟 Key Features

### 1. Kanban Columns & Task Management
- **3 Workflow Columns**: `Todo`, `In Progress`, and `Completed`.
- **Add Tasks**: Modal with title validation, optional description, priority selection, due date picker, and column selection.
- **Edit Tasks**: Update title, description, priority, due date, and status while preserving unique task IDs.
- **Delete Tasks**: Confirmation modal displaying the exact task name to prevent accidental data loss.
- **Dual Status Management**:
  - **HTML5 Drag-and-Drop**: Drag cards between columns with visual feedback (drop-zone highlight, dragging opacity).
  - **Accessible Directional Arrows & Dropdown**: One-click `←` and `→` buttons and a direct status select dropdown on every card for accessibility and mobile ergonomics.

### 2. Search & Compound Filtering
- **Real-Time Title Search**: Instant, case-insensitive search by task title (with description fallback matching).
- **Priority Filter**: View `All Priorities`, `Low`, `Medium`, or `High`.
- **Status Filter**: View `All Statuses`, `Todo`, `In Progress`, or `Completed`.
- **Compound Evaluation**: Search query, priority filter, and status filter operate simultaneously without conflicts.
- **Clear Filters**: 1-click reset button showing the active filter count badge.

### 3. LocalStorage Persistence & Resilience
- Instant synchronization to browser `localStorage` on any CRUD operation or status move.
- Safe serialization with graceful error handling (`try/catch`) protecting against corrupted JSON.
- Automatic seeding of default starter tasks on clean installs for immediate evaluation.
- "Reset Demo" button in the header allows evaluators to reload sample tasks at any time.

### 4. Responsive & Accessible Design
- **Desktop**: 3 columns side-by-side with smooth column auto-heights.
- **Tablet & Mobile**: Responsive vertical stacking and fluid modal dialogs without horizontal overflow.
- **Keyboard Shortcuts**:
  - Press <kbd>N</kbd> anywhere on the page to open the Create Task modal.
  - Press <kbd>Esc</kbd> to close any open modal or dialog.
- **Visual Priority Badges**:
  - 🟢 **Low**: Emerald badge & green left border accent.
  - 🟡 **Medium**: Amber badge & orange/amber left border accent.
  - 🔴 **High**: Rose badge & red left border accent.
- **Overdue Indicator**: Prominent badge when a non-completed task has passed its due date.

---

## 🏛️ Project Architecture & Component Responsibilities

```
kanban-board/
├── index.html                  # HTML entry point with Inter font & dynamic favicon
├── package.json                # Project dependencies, build scripts, and test runner
├── postcss.config.js           # PostCSS Tailwind plugins configuration
├── tailwind.config.js          # Tailwind CSS theme customizations and tokens
├── vite.config.js              # Vite bundler configuration
│
├── src/
│   ├── main.jsx                # React root bootstrap with StrictMode
│   ├── App.jsx                 # Top-level composition, modal state, shortcuts
│   ├── index.css               # Base Tailwind layers, custom scrollbars, drag styles
│   │
│   ├── components/
│   │   ├── Header.jsx          # Brand logo, task metrics (Total/Active/Done), actions
│   │   ├── Toolbar.jsx         # Search bar, priority/status filters, active filter pill
│   │   ├── SearchBar.jsx       # Controlled search input with clear (X) button
│   │   ├── FilterDropdown.jsx  # Reusable styled select dropdown with chevron icon
│   │   ├── KanbanBoard.jsx     # Responsive 3-column layout grid & board empty states
│   │   ├── KanbanColumn.jsx    # Individual column container, drop target, "+ Add" header
│   │   ├── TaskCard.jsx        # Task card UI: priority badge, due date, edit/delete, move
│   │   ├── TaskModal.jsx       # Add/Edit task form modal with validation & focus management
│   │   ├── ConfirmDialog.jsx   # Accessible delete confirmation dialog with trap focus
│   │   └── EmptyState.jsx      # Empty state views (no tasks / no search results)
│   │
│   ├── hooks/
│   │   └── useTasks.js         # Centralized task state, CRUD methods, filters & metrics
│   │
│   └── utils/
│       ├── localStorage.js     # Safe reading, writing, and clearing from LocalStorage
│       └── taskHelpers.js      # Status/Priority constants, formatting, ID generation, filters
│
└── tests/
    └── taskflow.test.js        # Automated test suite covering all 15 edge cases
```

### Component Responsibilities:
1. **`App.jsx`**: Coordinates top-level modal dialogs (Task Modal, Confirm Dialog), registers global keyboard shortcuts, and connects the `useTasks` hook to UI components.
2. **`useTasks.js`**: Custom hook encapsulating all task business logic (add, edit, delete, move, filter, reorder, reset). Keeps UI components purely presentational.
3. **`Header.jsx`**: Displays branding, live task statistics (total, active in-progress, completed), "Reset Demo" button, and "+ Add Task" button.
4. **`Toolbar.jsx`**: Hosts the search bar and filter dropdowns. Computes active filter pills and allows 1-click filter clearing.
5. **`KanbanBoard.jsx`**: Renders the 3 columns horizontally on desktop and vertically on mobile. Handles empty state rendering when no tasks match filters or when the board is empty.
6. **`KanbanColumn.jsx`**: Represents a single column status (`Todo`, `In Progress`, `Completed`), acts as an HTML5 drag-over drop target, and contains a quick "+ Add" button that pre-selects the column.
7. **`TaskCard.jsx`**: Displays individual task attributes with color-coded priority bars, due dates, overdue badges, edit/delete actions, and directional/dropdown status controls.
8. **`TaskModal.jsx`**: Reusable modal for creating and editing tasks. Enforces non-empty title validation and handles escape-key dismissal.
9. **`ConfirmDialog.jsx`**: Safety dialog to verify task deletion before permanently removing data.

---

## 🔄 State Management & LocalStorage Persistence

### 1. State Management
The application uses React's `useState`, `useMemo`, and `useCallback` inside the custom `useTasks` hook:
- Tasks are stored in a normalized array of objects:
  ```ts
  {
    id: string;          // Unique timestamp + random ID (e.g., 'task-1712345678-abc123')
    title: string;       // Required, non-empty, trimmed
    description: string; // Optional context
    priority: 'Low' | 'Medium' | 'High';
    dueDate: string;     // ISO format 'YYYY-MM-DD'
    status: 'Todo' | 'In Progress' | 'Completed';
    createdAt: string;   // ISO timestamp
    updatedAt: string;   // ISO timestamp
  }
  ```
- **Derived State (`useMemo`)**:
  - `stats`: Real-time calculation of total, todo, in-progress, and completed counts.
  - `filteredTasks`: Efficient compound filter evaluation on search query, priority, and status.
  - `activeFilterCount`: Number of non-default filters currently active.

### 2. LocalStorage Persistence
- **Storage Key**: `taskflow_tasks_v1`
- **Mount Initialization**: `loadTasksFromStorage()` safely reads `localStorage`. If empty or null, it seeds default sample tasks so the board is instantly interactive.
- **Error Recovery**: If stored JSON is malformed or corrupted, `try...catch` catches the error, logs a clean warning, and gracefully falls back to initial tasks without crashing the application.
- **Immediate Sync**: A React `useEffect` watches the `tasks` state and automatically invokes `saveTasksToStorage(tasks)` on every create, edit, delete, or status move.

---

## 🔍 How Search & Filters Work

The search and filter engine evaluates all three filter criteria simultaneously in `src/utils/taskHelpers.js`:

```javascript
export const filterTasks = (tasks = [], { searchQuery = '', priorityFilter = 'All', statusFilter = 'All' } = {}) => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    // 1. Title search (case-insensitive)
    const matchesSearch =
      !normalizedQuery ||
      task.title?.toLowerCase().includes(normalizedQuery) ||
      task.description?.toLowerCase().includes(normalizedQuery);

    // 2. Priority filter ('All', 'Low', 'Medium', 'High')
    const matchesPriority =
      priorityFilter === 'All' ||
      priorityFilter === 'All Priorities' ||
      task.priority === priorityFilter;

    // 3. Status filter ('All', 'Todo', 'In Progress', 'Completed')
    const matchesStatus =
      statusFilter === 'All' ||
      statusFilter === 'All Statuses' ||
      task.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });
};
```

When no tasks match the compound criteria, `EmptyState` is triggered with a "Clear All Filters" button.

---

## 🧪 Edge Cases Tested & Verified

All 15 interview evaluation scenarios have been automated and tested in `tests/taskflow.test.js`:

1. ✅ **Adding a task with only a title**: Description & due date remain optional; unique ID is assigned.
2. ✅ **Adding a task with all fields populated**: Title, description, priority, due date, status stored properly.
3. ✅ **Editing an existing task**: Task ID is strictly preserved while attributes update.
4. ✅ **Deleting a task**: Modal confirms action, task is removed from state and localStorage.
5. ✅ **Moving a task from Todo to In Progress**: Triggered via drag-and-drop or status selector.
6. ✅ **Moving a task from In Progress to Completed**: Handled cleanly with immediate column update.
7. ✅ **Refreshing browser after changes**: Stored state rehydrates from LocalStorage.
8. ✅ **Searching for existing task**: Real-time case-insensitive query matches title.
9. ✅ **Searching for nonexistent task**: Friendly "No matching tasks found" empty state appears.
10. ✅ **Filtering by High priority**: Only high priority tasks are rendered across columns.
11. ✅ **Priority + Status compound filtering**: Both filters apply simultaneously.
12. ✅ **Clearing all filters**: Resets all inputs and displays all tasks.
13. ✅ **Handling an empty board**: Displays empty state with "Add Your First Task" CTA.
14. ✅ **Corrupted LocalStorage handling**: Recovers gracefully from invalid JSON.
15. ✅ **Mobile responsiveness**: Responsive column grid and accessible touch-friendly buttons.

---

## 🚢 Deployment Instructions

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel` (or connect your GitHub repository directly on [vercel.com](https://vercel.com)).
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy:
   ```bash
   vercel
   ```

### Deploy to Netlify
1. Connect repository on [netlify.com](https://netlify.com) or use Netlify CLI.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy:
   ```bash
   netlify deploy --prod --dir=dist
   ```

---

## 📄 License
MIT © TaskFlow

