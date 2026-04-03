import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Todo } from '../types/todo'

vi.mock('../services/api', () => ({
  fetchTodos: vi.fn(),
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodoById: vi.fn(),
  deleteCompleted: vi.fn(),
}))

import * as api from '../services/api'
import { addTodo, toggleTodo, deleteTodo, clearCompleted, setFilter, render } from '../app'

const makeTodo = (id: string, completed = false): Todo => ({
  id,
  text: `タスク${id}`,
  completed,
  createdAt: '2026-04-01T00:00:00Z',
})

const setupDom = () => {
  document.body.innerHTML = '<div id="app"></div>'
}

beforeEach(() => {
  setupDom()
  vi.resetAllMocks()
  vi.mocked(api.fetchTodos).mockResolvedValue([])
})

describe('render', () => {
  it('#app 要素が存在しないとき、エラーなく終了する', () => {
    document.body.innerHTML = ''
    expect(() => render()).not.toThrow()
  })

  it('#app 要素にコンテンツが描画される', () => {
    render()
    const app = document.querySelector('#app')
    expect(app?.children.length).toBeGreaterThan(0)
  })
})

describe('setFilter', () => {
  it('フィルターを変更すると再描画される', () => {
    render()
    expect(() => setFilter('active')).not.toThrow()
    expect(() => setFilter('completed')).not.toThrow()
    expect(() => setFilter('all')).not.toThrow()
  })
})

describe('addTodo', () => {
  it('正常系: テキストを渡すと createTodo が呼ばれる', async () => {
    const newTodo = makeTodo('new-1')
    vi.mocked(api.createTodo).mockResolvedValue(newTodo)

    await addTodo('新しいタスク')

    expect(api.createTodo).toHaveBeenCalledWith('新しいタスク')
  })

  it('正常系: 前後の空白はトリムして createTodo が呼ばれる', async () => {
    vi.mocked(api.createTodo).mockResolvedValue(makeTodo('new-1'))

    await addTodo('  タスク  ')

    expect(api.createTodo).toHaveBeenCalledWith('タスク')
  })

  it('境界値: 空文字のとき createTodo が呼ばれない', async () => {
    await addTodo('')
    expect(api.createTodo).not.toHaveBeenCalled()
  })

  it('境界値: 空白のみのとき createTodo が呼ばれない', async () => {
    await addTodo('   ')
    expect(api.createTodo).not.toHaveBeenCalled()
  })

  it('境界値: 200文字ちょうどのとき createTodo が呼ばれる', async () => {
    vi.mocked(api.createTodo).mockResolvedValue(makeTodo('new-1'))
    const text = 'a'.repeat(200)

    await addTodo(text)

    expect(api.createTodo).toHaveBeenCalledWith(text)
  })

  it('境界値: 201文字のとき createTodo が呼ばれない', async () => {
    await addTodo('a'.repeat(201))
    expect(api.createTodo).not.toHaveBeenCalled()
  })

  it('異常系: createTodo がエラーをスローしても例外が伝播しない', async () => {
    vi.mocked(api.createTodo).mockRejectedValue(new Error('API Error'))

    await expect(addTodo('テスト')).resolves.toBeUndefined()
  })
})

describe('toggleTodo', () => {
  it('正常系: 対象Todoのcompletedを反転して updateTodo が呼ばれる', async () => {
    const todo = makeTodo('t-1', false)
    vi.mocked(api.createTodo).mockResolvedValue(todo)
    vi.mocked(api.updateTodo).mockResolvedValue({ ...todo, completed: true })

    await addTodo(todo.text)
    await toggleTodo('t-1')

    expect(api.updateTodo).toHaveBeenCalledWith('t-1', { completed: true })
  })

  it('異常系: updateTodo がエラーをスローしても例外が伝播しない', async () => {
    vi.mocked(api.createTodo).mockResolvedValue(makeTodo('t-1', false))
    vi.mocked(api.updateTodo).mockRejectedValue(new Error('API Error'))

    await addTodo('テスト')
    await expect(toggleTodo('t-1')).resolves.toBeUndefined()
  })
})

describe('deleteTodo', () => {
  it('正常系: deleteTodoById が対象IDで呼ばれる', async () => {
    vi.mocked(api.createTodo).mockResolvedValue(makeTodo('d-1'))
    vi.mocked(api.deleteTodoById).mockResolvedValue(undefined)

    await addTodo('削除タスク')
    await deleteTodo('d-1')

    expect(api.deleteTodoById).toHaveBeenCalledWith('d-1')
  })

  it('異常系: deleteTodoById がエラーをスローしても例外が伝播しない', async () => {
    vi.mocked(api.deleteTodoById).mockRejectedValue(new Error('API Error'))

    await expect(deleteTodo('d-1')).resolves.toBeUndefined()
  })
})

describe('clearCompleted', () => {
  it('正常系: deleteCompleted が呼ばれる', async () => {
    vi.mocked(api.deleteCompleted).mockResolvedValue(undefined)

    await clearCompleted()

    expect(api.deleteCompleted).toHaveBeenCalled()
  })

  it('異常系: deleteCompleted がエラーをスローしても例外が伝播しない', async () => {
    vi.mocked(api.deleteCompleted).mockRejectedValue(new Error('API Error'))

    await expect(clearCompleted()).resolves.toBeUndefined()
  })
})
