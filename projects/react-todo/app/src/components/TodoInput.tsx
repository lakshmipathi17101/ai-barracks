import { useState, type KeyboardEvent } from 'react'
import { Plus } from 'lucide-react'

interface TodoInputProps {
  onAdd: (text: string) => void
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [value, setValue] = useState('')

  function submit() {
    if (!value.trim()) return
    onAdd(value)
    setValue('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') submit()
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="What needs to be done?"
        aria-label="New todo"
        className="
          flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5
          text-sm text-slate-800 placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent
          transition
        "
      />
      <button
        onClick={submit}
        aria-label="Add todo"
        className="
          flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5
          text-sm font-semibold text-white shadow-sm
          hover:bg-violet-700 active:bg-violet-800
          focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1
          transition-colors
        "
      >
        <Plus size={16} strokeWidth={2.5} />
        Add
      </button>
    </div>
  )
}
