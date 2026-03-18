import type { Todo } from '../types'
import TodoItem from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, newText: string) => void
}

export default function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-slate-400 select-none">
        Nothing here yet.
      </div>
    )
  }

  return (
    <ul className="divide-y divide-slate-100" aria-label="Todo list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggle(todo.id)}
          onDelete={() => onDelete(todo.id)}
          onEdit={newText => onEdit(todo.id, newText)}
        />
      ))}
    </ul>
  )
}
