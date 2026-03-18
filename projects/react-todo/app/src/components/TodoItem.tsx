import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { Trash2 } from 'lucide-react'
import type { Todo } from '../types'

interface TodoItemProps {
  todo: Todo
  onToggle: () => void
  onDelete: () => void
  onEdit: (newText: string) => void
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when edit mode activates
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  function startEdit() {
    setDraft(todo.text)
    setEditing(true)
  }

  function commitEdit() {
    if (draft.trim()) {
      onEdit(draft.trim())
    }
    // If empty, revert silently (useTodos also rejects empty)
    setEditing(false)
  }

  function cancelEdit() {
    setDraft(todo.text)
    setEditing(false)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') cancelEdit()
  }

  return (
    <li className="flex items-center gap-3 py-3 group">
      {/* Checkbox */}
      <button
        onClick={onToggle}
        aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
        className={`
          flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
          transition-colors focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1
          ${todo.completed
            ? 'bg-violet-500 border-violet-500'
            : 'border-slate-300 hover:border-violet-400'
          }
        `}
      >
        {todo.completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Text or edit input */}
      {editing ? (
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={commitEdit}
          aria-label="Edit todo"
          className="
            flex-1 rounded-lg border border-violet-300 bg-violet-50 px-2 py-1
            text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-400
          "
        />
      ) : (
        <span
          onDoubleClick={startEdit}
          title="Double-click to edit"
          className={`
            flex-1 text-sm cursor-default select-none
            ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700'}
          `}
        >
          {todo.text}
        </span>
      )}

      {/* Delete button */}
      {!editing && (
        <button
          onClick={onDelete}
          aria-label={`Delete "${todo.text}"`}
          className="
            flex-shrink-0 p-1 rounded-lg text-slate-300 transition-colors
            hover:text-red-500 hover:bg-red-50
            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1
            opacity-0 group-hover:opacity-100 focus:opacity-100
          "
        >
          <Trash2 size={15} />
        </button>
      )}
    </li>
  )
}
