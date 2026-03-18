interface FooterProps {
  activeCount: number
  completedCount: number
  onClearCompleted: () => void
}

export default function Footer({ activeCount, completedCount, onClearCompleted }: FooterProps) {
  return (
    <div className="flex items-center justify-between text-xs text-slate-400">
      <span>
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>

      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="
            hover:text-red-500 transition-colors
            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 rounded
          "
        >
          Clear completed ({completedCount})
        </button>
      )}
    </div>
  )
}
