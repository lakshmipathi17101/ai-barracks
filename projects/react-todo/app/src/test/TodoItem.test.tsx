import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from '../components/TodoItem'
import type { Todo } from '../types'

const baseTodo: Todo = {
  id: 'abc',
  text: 'Test task',
  completed: false,
  createdAt: 1710000000000,
}

describe('TodoItem — view mode', () => {
  it('renders the todo text', () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    expect(screen.getByText('Test task')).toBeInTheDocument()
  })

  it('renders with strikethrough when completed', () => {
    const completed = { ...baseTodo, completed: true }
    render(<TodoItem todo={completed} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    const text = screen.getByText('Test task')
    expect(text).toHaveClass('line-through')
  })

  it('calls onToggle when checkbox is clicked', async () => {
    const onToggle = vi.fn()
    render(<TodoItem todo={baseTodo} onToggle={onToggle} onDelete={vi.fn()} onEdit={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /mark as completed/i }))
    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn()
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={onDelete} onEdit={vi.fn()} />)
    const del = screen.getByRole('button', { name: /delete/i })
    await userEvent.click(del)
    expect(onDelete).toHaveBeenCalledOnce()
  })
})

describe('TodoItem — inline edit mode', () => {
  it('enters edit mode on double-click', async () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={vi.fn()} />)
    await userEvent.dblClick(screen.getByText('Test task'))
    expect(screen.getByRole('textbox', { name: /edit todo/i })).toBeInTheDocument()
  })

  it('commits edit on Enter', async () => {
    const onEdit = vi.fn()
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={onEdit} />)
    await userEvent.dblClick(screen.getByText('Test task'))
    const input = screen.getByRole('textbox', { name: /edit todo/i })
    await userEvent.clear(input)
    await userEvent.type(input, 'Updated task{Enter}')
    expect(onEdit).toHaveBeenCalledWith('Updated task')
  })

  it('cancels edit on Escape without calling onEdit', async () => {
    const onEdit = vi.fn()
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} onEdit={onEdit} />)
    await userEvent.dblClick(screen.getByText('Test task'))
    await userEvent.keyboard('{Escape}')
    expect(onEdit).not.toHaveBeenCalled()
    expect(screen.getByText('Test task')).toBeInTheDocument()
  })
})
