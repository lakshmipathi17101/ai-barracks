import { CheckSquare } from 'lucide-react'

export default function Header() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center gap-2 text-violet-600">
        <CheckSquare size={32} strokeWidth={1.75} />
      </div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">
        My Todos
      </h1>
      <p className="mt-1 text-sm text-slate-500">Stay organised. Get things done.</p>
    </div>
  )
}
