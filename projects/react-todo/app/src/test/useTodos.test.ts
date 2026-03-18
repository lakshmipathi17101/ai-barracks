import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTodos } from '../hooks/useTodos'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock crypto.randomUUID
let uuidCounter = 0
vi.stubGlobal('crypto', {
  randomUUID: () => `test-uuid-${++uuidCounter}`,
})

beforeEach(() => {
  localStorageMock.clear()
  uuidCounter = 0
})

describe('useTodos — core CRUD', () => {
  it('starts with an empty list', () => {
    const { result } = renderHook(() => useTodos())
    expect(result.current.todos).toHaveLength(0)
  })

  it('addTodo: adds a todo with trimmed text', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('  Buy milk  '))
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('Buy milk')
    expect(result.current.todos[0].completed).toBe(false)
  })

  it('addTodo: ignores empty or whitespace-only strings', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('   '))
    expect(result.current.todos).toHaveLength(0)
  })

  it('toggleTodo: flips completed state', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('Task'))
    const id = result.current.todos[0].id
    act(() => result.current.toggleTodo(id))
    expect(result.current.todos[0].completed).toBe(true)
    act(() => result.current.toggleTodo(id))
    expect(result.current.todos[0].completed).toBe(false)
  })

  it('deleteTodo: removes the correct todo', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('A'); result.current.addTodo('B') })
    const idA = result.current.todos[0].id
    act(() => result.current.deleteTodo(idA))
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('B')
  })

  it('editTodo: updates text correctly', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('Old text'))
    const id = result.current.todos[0].id
    act(() => result.current.editTodo(id, 'New text'))
    expect(result.current.todos[0].text).toBe('New text')
  })

  it('editTodo: rejects empty string (keeps original)', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('Original'))
    const id = result.current.todos[0].id
    act(() => result.current.editTodo(id, '   '))
    expect(result.current.todos[0].text).toBe('Original')
  })

  it('clearCompleted: removes only completed todos', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('Active'); result.current.addTodo('Done') })
    const doneId = result.current.todos[1].id
    act(() => result.current.toggleTodo(doneId))
    act(() => result.current.clearCompleted())
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('Active')
  })
})

describe('useTodos — filtering', () => {
  it('filter "active" returns only incomplete todos', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('A'); result.current.addTodo('B') })
    act(() => result.current.toggleTodo(result.current.todos[0].id))
    act(() => result.current.setFilter('active'))
    expect(result.current.filteredTodos).toHaveLength(1)
    expect(result.current.filteredTodos[0].text).toBe('B')
  })

  it('filter "completed" returns only completed todos', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('A'); result.current.addTodo('B') })
    act(() => result.current.toggleTodo(result.current.todos[0].id))
    act(() => result.current.setFilter('completed'))
    expect(result.current.filteredTodos).toHaveLength(1)
    expect(result.current.filteredTodos[0].text).toBe('A')
  })

  it('filter "all" returns all todos', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('A'); result.current.addTodo('B') })
    act(() => result.current.toggleTodo(result.current.todos[0].id))
    act(() => result.current.setFilter('all'))
    expect(result.current.filteredTodos).toHaveLength(2)
  })
})

describe('useTodos — counts', () => {
  it('activeCount and completedCount are correct', () => {
    const { result } = renderHook(() => useTodos())
    act(() => { result.current.addTodo('A'); result.current.addTodo('B'); result.current.addTodo('C') })
    act(() => result.current.toggleTodo(result.current.todos[0].id))
    expect(result.current.activeCount).toBe(2)
    expect(result.current.completedCount).toBe(1)
  })
})

describe('useTodos — localStorage persistence', () => {
  it('persists todos to localStorage on add', () => {
    const { result } = renderHook(() => useTodos())
    act(() => result.current.addTodo('Persist me'))
    const stored = JSON.parse(localStorageMock.getItem('react-todo-app') ?? '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].text).toBe('Persist me')
  })

  it('loads todos from localStorage on mount', () => {
    localStorageMock.setItem('react-todo-app', JSON.stringify([
      { id: 'preloaded-1', text: 'Pre-existing', completed: false, createdAt: 1710000000000 }
    ]))
    const { result } = renderHook(() => useTodos())
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('Pre-existing')
  })

  it('handles corrupted localStorage gracefully (returns empty)', () => {
    localStorageMock.setItem('react-todo-app', 'NOT_VALID_JSON{{{{')
    const { result } = renderHook(() => useTodos())
    expect(result.current.todos).toHaveLength(0)
  })
})
