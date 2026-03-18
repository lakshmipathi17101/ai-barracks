# Test Plan: React Todo Application

**Author:** QA Engineer
**Date:** 2026-03-18
**Build tested:** commit 0b634d4

---

## Scope

**In scope:** All acceptance criteria from the PM Task Brief, plus localStorage contract validation and edge cases.

**Out of scope:** Cross-browser compatibility, performance testing, screen-reader audit.

---

## Test Cases

### TC-001: Add todo via Enter key
- **Acceptance criterion:** User can add a new todo by pressing Enter
- **Type:** Functional (unit)
- **Test:** `useTodos.test.ts` — "addTodo: adds a todo with trimmed text"

### TC-002: Add todo via Add button
- **Acceptance criterion:** User can add via clicking Add
- **Type:** Functional (component)
- **Test:** `TodoInput.test.tsx` — "calls onAdd when Add button is clicked"

### TC-003: Reject empty add
- **Acceptance criterion:** Empty/whitespace input is not added
- **Type:** Edge case
- **Test:** `useTodos.test.ts` + `TodoInput.test.tsx` — both cover empty rejection

### TC-004: Toggle complete
- **Acceptance criterion:** User can mark a todo as complete
- **Type:** Functional (unit)
- **Test:** `useTodos.test.ts` — "toggleTodo: flips completed state"

### TC-005: Toggle renders strikethrough
- **Acceptance criterion:** Completed todo is visually distinct
- **Type:** Functional (component)
- **Test:** `TodoItem.test.tsx` — "renders with strikethrough when completed"

### TC-006: Delete todo
- **Acceptance criterion:** User can delete a todo
- **Type:** Functional (unit + component)
- **Test:** `useTodos.test.ts` + `TodoItem.test.tsx`

### TC-007: Inline edit — double-click enters edit mode
- **Acceptance criterion:** User can edit existing todo text inline
- **Type:** Functional (component)
- **Test:** `TodoItem.test.tsx` — "enters edit mode on double-click"

### TC-008: Inline edit — commit on Enter
- **Acceptance criterion:** Edit commits with new text on Enter
- **Type:** Functional (component)
- **Test:** `TodoItem.test.tsx` — "commits edit on Enter"

### TC-009: Inline edit — cancel on Escape
- **Acceptance criterion:** Edit cancels without change on Escape
- **Type:** Functional (component)
- **Test:** `TodoItem.test.tsx` — "cancels edit on Escape without calling onEdit"

### TC-010: Edit rejects empty text
- **Acceptance criterion:** Empty edit is rejected, original text preserved
- **Type:** Edge case
- **Test:** `useTodos.test.ts` — "editTodo: rejects empty string"

### TC-011: Filter — Active
- **Acceptance criterion:** Filter "Active" shows only incomplete todos
- **Type:** Functional (unit)
- **Test:** `useTodos.test.ts` — filter "active"

### TC-012: Filter — Completed
- **Acceptance criterion:** Filter "Completed" shows only completed todos
- **Type:** Functional (unit)
- **Test:** `useTodos.test.ts` — filter "completed"

### TC-013: Filter — All
- **Acceptance criterion:** Filter "All" shows all todos
- **Type:** Functional (unit)
- **Test:** `useTodos.test.ts` — filter "all"

### TC-014: Clear completed
- **Acceptance criterion:** User can clear all completed todos in one action
- **Type:** Functional (unit)
- **Test:** `useTodos.test.ts` — "clearCompleted: removes only completed todos"

### TC-015: Active count display
- **Acceptance criterion:** Count of remaining active todos is displayed
- **Type:** Functional (unit)
- **Test:** `useTodos.test.ts` — "activeCount and completedCount are correct"

### TC-016: Persist to localStorage
- **Acceptance criterion:** Todos persist across page refreshes
- **Type:** Functional (unit)
- **Test:** `useTodos.test.ts` — "persists todos to localStorage on add"

### TC-017: Load from localStorage on mount
- **Acceptance criterion:** Existing todos load on page refresh
- **Type:** Functional (unit)
- **Test:** `useTodos.test.ts` — "loads todos from localStorage on mount"

### TC-018: Corrupted localStorage handled gracefully
- **Acceptance criterion:** App does not crash on bad storage data
- **Type:** Edge case (resilience)
- **Test:** `useTodos.test.ts` — "handles corrupted localStorage gracefully"

### TC-019: Input clears after add
- **Acceptance criterion:** Input field resets after submission
- **Type:** Functional (component)
- **Test:** `TodoInput.test.tsx` — "clears the input after submission"

---

## Execution

Tests are co-located with source under `src/test/`. Run with:
```bash
npm run test
```
(Requires `npm install` first.)
