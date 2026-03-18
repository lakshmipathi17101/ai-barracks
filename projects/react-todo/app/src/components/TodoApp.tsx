import { useTodos } from '../hooks/useTodos'
import Header from './Header'
import TodoInput from './TodoInput'
import FilterBar from './FilterBar'
import TodoList from './TodoList'
import Footer from './Footer'

export default function TodoApp() {
  const {
    filteredTodos,
    filter,
    setFilter,
    activeCount,
    completedCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
  } = useTodos()

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-slate-50 to-blue-50 flex flex-col items-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-lg">
        <Header />

        <div className="mt-8 bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden">
          {/* Input */}
          <div className="p-5 border-b border-slate-100">
            <TodoInput onAdd={addTodo} />
          </div>

          {/* Filter */}
          <div className="px-5 pt-4">
            <FilterBar current={filter} onChange={setFilter} />
          </div>

          {/* List */}
          <div className="px-5 pb-2 mt-2">
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/60">
            <Footer
              activeCount={activeCount}
              completedCount={completedCount}
              onClearCompleted={clearCompleted}
            />
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Double-click any todo to edit &nbsp;·&nbsp; Changes save automatically
        </p>
      </div>
    </div>
  )
}
