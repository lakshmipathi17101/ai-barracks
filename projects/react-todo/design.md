# System Design: React Todo Application

**Author:** Senior Architect
**Date:** 2026-03-18
**Status:** Approved — ready for implementation

---

## Overview

A single-page React application for managing todos. Frontend-only; persistence
via localStorage. Built on Vite + React + TypeScript + Tailwind CSS. No backend,
no external API calls. State lives in a custom hook; components are pure UI.

---

## Technology Stack

| Layer | Choice | Rationale |
|---|---|---|
| Build tool | Vite | Fast dev server and build; industry standard for React SPAs |
| Framework | React 18 | Specified in requirement |
| Language | TypeScript | Type safety on the data model pays off in todo apps (nullable states) |
| Styling | Tailwind CSS | Utility-first; no separate CSS files; clean professional output fast |
| Icons | lucide-react | Lightweight, consistent icon set |
| Persistence | localStorage | Specified; synchronous, no dependencies needed |
| Testing | Vitest + Testing Library | Standard Vite-native test stack |
| Linting | ESLint + typescript-eslint | Catch issues at write-time |

---

## Component Tree

```
App
└── TodoApp                        ← Root component; owns all state via useTodos hook
    ├── Header                     ← App title only
    ├── TodoInput                  ← Controlled input + Add button
    ├── FilterBar                  ← All / Active / Completed filter tabs
    ├── TodoList                   ← Renders sorted/filtered list
    │   └── TodoItem (×n)          ← Single todo row; handles view + edit modes
    └── Footer                     ← Active count + Clear Completed button
```

---

## Component Interfaces

### `<TodoInput>`
```ts
interface TodoInputProps {
  onAdd: (text: string) => void;
}
```
Behaviour: trims input, rejects empty strings, clears field on submit.
Submit triggers: Enter key OR Add button click.

### `<FilterBar>`
```ts
type Filter = 'all' | 'active' | 'completed';

interface FilterBarProps {
  current: Filter;
  onChange: (filter: Filter) => void;
}
```

### `<TodoList>`
```ts
interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}
```

### `<TodoItem>`
```ts
interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (newText: string) => void;
}
```
Inline edit behaviour: double-click on text enters edit mode → shows input pre-filled
with current text → Enter or blur commits → Escape cancels → empty string on commit
is rejected (restores original text).

### `<Footer>`
```ts
interface FooterProps {
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}
```
"Clear completed" button is hidden when completedCount === 0.

---

## Data Model

```ts
interface Todo {
  id: string;          // crypto.randomUUID()
  text: string;        // trimmed, non-empty
  completed: boolean;
  createdAt: number;   // Date.now() timestamp — for stable sort order
}
```

---

## State Shape (in `useTodos` hook)

```ts
interface TodoState {
  todos: Todo[];
  filter: Filter;
}
```

Derived values (computed, not stored):
- `filteredTodos` — todos filtered by current filter
- `activeCount` — todos where completed === false
- `completedCount` — todos where completed === true

---

## localStorage Schema

```
Key:   "react-todo-app"
Value: JSON string of Todo[]

Example:
[
  { "id": "abc123", "text": "Buy milk", "completed": false, "createdAt": 1710000000000 },
  { "id": "def456", "text": "Write docs", "completed": true, "createdAt": 1710000001000 }
]
```

The filter selection is NOT persisted (resets to "all" on reload — intentional).

Read on mount; write on every state change via useEffect.

---

## File Structure

```
projects/react-todo/app/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css              ← Tailwind base imports only
    ├── types.ts               ← Todo and Filter type definitions
    ├── hooks/
    │   └── useTodos.ts        ← All state logic; localStorage sync
    └── components/
        ├── TodoApp.tsx
        ├── Header.tsx
        ├── TodoInput.tsx
        ├── FilterBar.tsx
        ├── TodoList.tsx
        ├── TodoItem.tsx
        └── Footer.tsx
```

---

## Security Considerations

- localStorage data is read via `JSON.parse` — wrap in try/catch, default to `[]` on
  parse failure to prevent blank screen on corrupted storage
- No user input is rendered as HTML — all text is rendered as React text nodes (safe by default)
- No external network requests

---

## Out of Scope

- Backend, database, or user accounts
- Drag-and-drop reordering
- Due dates, priorities, or tags
- Multi-list support
- Undo/redo
- Dark mode toggle (Tailwind dark mode classes may be used for aesthetics but no toggle)

---

## Handoff to: Frontend Developer

[READY FOR REVIEW]

**Frontend Developer owns:** All components in the tree above, the `useTodos` hook,
and the Vite project scaffold.

**Fixed contracts (do not deviate without Architect approval):**
- All component prop interfaces as specified above
- localStorage key: `"react-todo-app"`
- Data model: `Todo` interface exactly as specified
- Inline edit behaviour: double-click → edit → Enter/blur to commit, Escape to cancel

**No Backend Developer required** — this is a pure frontend project.
