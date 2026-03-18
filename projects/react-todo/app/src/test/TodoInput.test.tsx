import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoInput from '../components/TodoInput'

describe('TodoInput', () => {
  it('calls onAdd with trimmed text when Enter is pressed', async () => {
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} />)
    const input = screen.getByRole('textbox', { name: /new todo/i })
    await userEvent.type(input, '  Buy milk  {Enter}')
    expect(onAdd).toHaveBeenCalledWith('  Buy milk  ')
  })

  it('calls onAdd when Add button is clicked', async () => {
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} />)
    await userEvent.type(screen.getByRole('textbox'), 'Task one')
    await userEvent.click(screen.getByRole('button', { name: /add todo/i }))
    expect(onAdd).toHaveBeenCalledWith('Task one')
  })

  it('clears the input after submission', async () => {
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Something{Enter}')
    expect(input).toHaveValue('')
  })

  it('does not call onAdd for whitespace-only input', async () => {
    const onAdd = vi.fn()
    render(<TodoInput onAdd={onAdd} />)
    await userEvent.type(screen.getByRole('textbox'), '   {Enter}')
    expect(onAdd).not.toHaveBeenCalled()
  })
})
