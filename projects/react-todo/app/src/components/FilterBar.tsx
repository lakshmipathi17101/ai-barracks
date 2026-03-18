import type { Filter } from '../types'

interface FilterBarProps {
  current: Filter
  onChange: (filter: Filter) => void
}

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
]

export default function FilterBar({ current, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-1" role="tablist" aria-label="Filter todos">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          role="tab"
          aria-selected={current === value}
          onClick={() => onChange(value)}
          className={`
            px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
            focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-1
            ${
              current === value
                ? 'bg-violet-100 text-violet-700'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
