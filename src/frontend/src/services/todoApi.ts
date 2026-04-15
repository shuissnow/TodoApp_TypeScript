import type { Todo } from '../types/todo'
import { BASE_URL } from './config'

/**
 * タスク一覧をAPIから取得します。
 *
 * @returns Todo配列
 * @throws APIエラー時にErrorをスロー
 */
export const fetchTodos = async (): Promise<Todo[]> => {
  const response: Response = await fetch(`${BASE_URL}/api/todos`)

  if (!response.ok) {
    throw new Error(`fetchTodos failed: ${response.status}`)
  }

  return response.json() as Promise<Todo[]>
}

/**
 * 新しいタスクをAPIで作成します。
 *
 * @param text - タスクのテキスト内容
 * @param dueDate - 締め切り日（YYYY-MM-DD形式、省略可）
 * @param priorityId - 優先度ID（省略可）
 * @returns 作成されたTodo
 * @throws APIエラー時にErrorをスロー
 */
export const createTodo = async (
  text: string,
  dueDate?: string,
  priorityId?: string,
): Promise<Todo> => {
  const body: { text: string; dueDate?: string; priorityId?: string } = { text }

  // 期限日
  if (dueDate) body.dueDate = dueDate

  // 優先度
  if (priorityId) body.priorityId = priorityId

  const response: Response = await fetch(`${BASE_URL}/api/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`createTodo failed: ${response.status}`)
  }

  return response.json() as Promise<Todo>
}

/**
 * 指定IDのタスクをAPIで更新します。
 *
 * @param id - 更新対象TodoのID
 * @param patch - 更新内容（text・completed を部分的に指定可能）
 * @returns 更新後のTodo
 * @throws APIエラー時にErrorをスロー
 */
export const updateTodo = async (
  id: number,
  patch: {
    text?: string
    completed?: boolean
    dueDate?: string
    resetDueDate?: boolean
    priorityId?: string | null
  },
): Promise<Todo> => {
  const response: Response = await fetch(`${BASE_URL}/api/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })

  if (!response.ok) {
    throw new Error(`updateTodo failed: ${response.status}`)
  }

  return response.json() as Promise<Todo>
}

/**
 * 指定IDのタスクをAPIで削除する
 *
 * @param id - 削除対象TodoのID
 * @throws APIエラー時にErrorをスロー
 */
export const deleteTodoById = async (id: number): Promise<void> => {
  const response: Response = await fetch(`${BASE_URL}/api/todos/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`deleteTodoById failed: ${response.status}`)
  }
}

/**
 * 完了済みのタスクをすべてAPIで削除する
 *
 * @throws APIエラー時にErrorをスロー
 */
export const deleteCompleted = async (): Promise<void> => {
  const response: Response = await fetch(`${BASE_URL}/api/todos/completed`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`deleteCompleted failed: ${response.status}`)
  }
}
