import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchActivePriorities } from '../../services/priorityApi'
import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodoById,
  deleteCompleted,
} from '../../services/todoApi'

describe('fetchPriorities', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('正常系: APIが200を返した場合、Priority配列を返す', async () => {
    const mockPriorities = [
      {
        id: '001',
        name: '高',
        foregroundColor: '#EF4444',
        backgroundColor: '#FEE2E2',
        displayOrder: 1,
      },
      {
        id: '002',
        name: '中',
        foregroundColor: '#F97316',
        backgroundColor: '#FFEDD5',
        displayOrder: 2,
      },
      {
        id: '003',
        name: '低',
        foregroundColor: '#3B82F6',
        backgroundColor: '#DBEAFE',
        displayOrder: 3,
      },
    ]
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPriorities),
      }),
    )

    const result = await fetchActivePriorities()

    expect(result).toEqual(mockPriorities)
  })

  it('正常系: GET /api/priorities を呼び出す', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    })
    vi.stubGlobal('fetch', mockFetch)

    await fetchActivePriorities()

    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/priorities'))
  })

  it('異常系: APIが500を返した場合、Errorをスローする', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    await expect(fetchActivePriorities()).rejects.toThrow('fetchPriorities failed: 500')
  })

  it('異常系: ネットワークエラーが発生した場合、Errorをスローする', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network Error')))

    await expect(fetchActivePriorities()).rejects.toThrow('Network Error')
  })
})

describe('fetchTodos', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('正常系: APIが200を返した場合、Todo配列を返す', async () => {
    const mockTodos = [
      {
        id: 1,
        text: 'テスト1',
        completed: false,
        createdAt: '2026-04-01T00:00:00Z',
      },
      {
        id: 2,
        text: 'テスト2',
        completed: true,
        createdAt: '2026-04-01T01:00:00Z',
      },
    ]
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      }),
    )

    const result = await fetchTodos()

    expect(result).toEqual(mockTodos)
  })

  it('正常系: APIが空配列を返した場合、空配列を返す', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      }),
    )

    const result = await fetchTodos()

    expect(result).toEqual([])
  })

  it('正常系: 正しいエンドポイント（GET /api/todos）を呼び出す', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    })
    vi.stubGlobal('fetch', mockFetch)

    await fetchTodos()

    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/api/todos'))
  })

  it('異常系: APIが500を返した場合、Errorをスローする', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    )

    await expect(fetchTodos()).rejects.toThrow('fetchTodos failed: 500')
  })

  it('異常系: APIが404を返した場合、Errorをスローする', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    )

    await expect(fetchTodos()).rejects.toThrow('fetchTodos failed: 404')
  })

  it('異常系: ネットワークエラーが発生した場合、Errorをスローする', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network Error')))

    await expect(fetchTodos()).rejects.toThrow('Network Error')
  })
})

describe('createTodo', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('正常系: APIが201を返した場合、作成されたTodoを返す', async () => {
    const mockTodo = {
      id: 1,
      text: '新タスク',
      completed: false,
      createdAt: '2026-04-01T00:00:00Z',
    }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTodo),
      }),
    )

    const result = await createTodo('新タスク')

    expect(result).toEqual(mockTodo)
  })

  it('正常系: POST /api/todos に text を JSON で送信する', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          text: 'テスト',
          completed: false,
          createdAt: '2026-04-01T00:00:00Z',
        }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await createTodo('テスト')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/todos'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: 'テスト' }),
      }),
    )
  })

  it('正常系: dueDate を指定した場合、リクエストボディに dueDate が含まれる', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          text: 'テスト',
          completed: false,
          createdAt: '2026-04-01T00:00:00Z',
          dueDate: '2026-04-30',
        }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await createTodo('テスト', '2026-04-30')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/todos'),
      expect.objectContaining({
        body: JSON.stringify({ text: 'テスト', dueDate: '2026-04-30' }),
      }),
    )
  })

  it('正常系: dueDate を省略した場合、リクエストボディに dueDate が含まれない', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          text: 'テスト',
          completed: false,
          createdAt: '2026-04-01T00:00:00Z',
        }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await createTodo('テスト')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/todos'),
      expect.objectContaining({
        body: JSON.stringify({ text: 'テスト' }),
      }),
    )
  })

  it('正常系: priorityId を指定した場合、リクエストボディに priorityId が含まれる', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          text: 'テスト',
          completed: false,
          createdAt: '2026-04-01T00:00:00Z',
          priority: {
            id: '001',
            name: '高',
            foregroundColor: '#EF4444',
            backgroundColor: '#FEE2E2',
          },
        }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await createTodo('テスト', undefined, '001')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/todos'),
      expect.objectContaining({
        body: JSON.stringify({ text: 'テスト', priorityId: '001' }),
      }),
    )
  })

  it('正常系: priorityId を省略した場合、リクエストボディに priorityId が含まれない', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          text: 'テスト',
          completed: false,
          createdAt: '2026-04-01T00:00:00Z',
        }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await createTodo('テスト')

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/todos'),
      expect.objectContaining({
        body: JSON.stringify({ text: 'テスト' }),
      }),
    )
  })

  it('異常系: APIが400を返した場合、Errorをスローする', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
      }),
    )

    await expect(createTodo('')).rejects.toThrow('createTodo failed: 400')
  })

  it('異常系: APIが500を返した場合、Errorをスローする', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      }),
    )

    await expect(createTodo('テスト')).rejects.toThrow('createTodo failed: 500')
  })

  it('異常系: ネットワークエラーが発生した場合、Errorをスローする', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network Error')))

    await expect(createTodo('テスト')).rejects.toThrow('Network Error')
  })
})

describe('updateTodo', () => {
  const TODO_ID = 1

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('正常系: completedのみ更新した場合、更新後のTodoを返す', async () => {
    const mockTodo = {
      id: TODO_ID,
      text: 'テスト',
      completed: true,
      createdAt: '2026-04-01T00:00:00Z',
    }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTodo),
      }),
    )

    const result = await updateTodo(TODO_ID, { completed: true })

    expect(result).toEqual(mockTodo)
  })

  it('正常系: PUT /api/todos/{id} に patch を JSON で送信する', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: TODO_ID,
          text: '更新後',
          completed: false,
          createdAt: '2026-04-01T00:00:00Z',
        }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await updateTodo(TODO_ID, { text: '更新後', completed: false })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/todos/${TODO_ID}`),
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: '更新後', completed: false }),
      }),
    )
  })

  it('正常系: dueDate を指定した場合、patch に dueDate が含まれる', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: TODO_ID,
          text: 'テスト',
          completed: false,
          createdAt: '2026-04-01T00:00:00Z',
          dueDate: '2026-04-30',
        }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await updateTodo(TODO_ID, { dueDate: '2026-04-30' })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/todos/${TODO_ID}`),
      expect.objectContaining({
        body: JSON.stringify({ dueDate: '2026-04-30' }),
      }),
    )
  })

  it('正常系: priorityId を指定した場合、patch に priorityId が含まれる', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: TODO_ID,
          text: 'テスト',
          completed: false,
          createdAt: '2026-04-01T00:00:00Z',
          priority: {
            id: '001',
            name: '高',
            foregroundColor: '#EF4444',
            backgroundColor: '#FEE2E2',
          },
        }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await updateTodo(TODO_ID, { priorityId: '001' })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/todos/${TODO_ID}`),
      expect.objectContaining({
        body: JSON.stringify({ priorityId: '001' }),
      }),
    )
  })

  it('正常系: priorityId=null を指定した場合、patch に priorityId: null が含まれる', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: TODO_ID,
          text: 'テスト',
          completed: false,
          createdAt: '2026-04-01T00:00:00Z',
        }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await updateTodo(TODO_ID, { priorityId: null })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/todos/${TODO_ID}`),
      expect.objectContaining({
        body: JSON.stringify({ priorityId: null }),
      }),
    )
  })

  it('正常系: resetDueDate=true を指定した場合、patch に含まれる', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: TODO_ID,
          text: 'テスト',
          completed: false,
          createdAt: '2026-04-01T00:00:00Z',
        }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await updateTodo(TODO_ID, { resetDueDate: true })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/todos/${TODO_ID}`),
      expect.objectContaining({
        body: JSON.stringify({ resetDueDate: true }),
      }),
    )
  })

  it('異常系: APIが404を返した場合、Errorをスローする', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    )

    await expect(updateTodo(TODO_ID, { completed: true })).rejects.toThrow('updateTodo failed: 404')
  })

  it('異常系: APIが400を返した場合、Errorをスローする', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
      }),
    )

    await expect(updateTodo(TODO_ID, { text: '' })).rejects.toThrow('updateTodo failed: 400')
  })

  it('異常系: ネットワークエラーが発生した場合、Errorをスローする', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network Error')))

    await expect(updateTodo(TODO_ID, { completed: true })).rejects.toThrow('Network Error')
  })
})

describe('deleteTodoById', () => {
  const TODO_ID = 1

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('正常系: APIが204を返した場合、undefinedを返す', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    const result = await deleteTodoById(TODO_ID)

    expect(result).toBeUndefined()
  })

  it('正常系: DELETE /api/todos/{id} を呼び出す', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', mockFetch)

    await deleteTodoById(TODO_ID)

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(`/api/todos/${TODO_ID}`),
      expect.objectContaining({ method: 'DELETE' }),
    )
  })

  it('異常系: APIが404を返した場合、Errorをスローする', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }))

    await expect(deleteTodoById(TODO_ID)).rejects.toThrow('deleteTodoById failed: 404')
  })

  it('異常系: APIが500を返した場合、Errorをスローする', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    await expect(deleteTodoById(TODO_ID)).rejects.toThrow('deleteTodoById failed: 500')
  })

  it('異常系: ネットワークエラーが発生した場合、Errorをスローする', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network Error')))

    await expect(deleteTodoById(TODO_ID)).rejects.toThrow('Network Error')
  })
})

describe('deleteCompleted', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('正常系: APIが204を返した場合、undefinedを返す', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))

    const result = await deleteCompleted()

    expect(result).toBeUndefined()
  })

  it('正常系: DELETE /api/todos/completed を呼び出す', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', mockFetch)

    await deleteCompleted()

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/todos/completed'),
      expect.objectContaining({ method: 'DELETE' }),
    )
  })

  it('異常系: APIが500を返した場合、Errorをスローする', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    await expect(deleteCompleted()).rejects.toThrow('deleteCompleted failed: 500')
  })

  it('異常系: ネットワークエラーが発生した場合、Errorをスローする', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network Error')))

    await expect(deleteCompleted()).rejects.toThrow('Network Error')
  })
})
