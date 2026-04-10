import type { Priority, Todo } from '../types/todo'

/** バックエンドAPIのベースURL（環境変数から取得） */
const BASE_URL =
  (import.meta.env['VITE_API_BASE_URL'] as string | undefined) ?? 'http://localhost:8080'

/**
 * 優先度一覧をAPIから取得する
 *
 * @returns Priority配列（display_order 昇順）
 * @throws APIエラー時にErrorをスロー
 */
export const fetchPriorities = async (): Promise<Priority[]> => {
  const response = await fetch(`${BASE_URL}/api/priorities`)
  if (!response.ok) {
    throw new Error(`fetchPriorities failed: ${response.status}`)
  }
  return response.json() as Promise<Priority[]>
}

/**
 * タスク一覧をAPIから取得する
 *
 * @returns Todo配列
 * @throws APIエラー時にErrorをスロー
 */
export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${BASE_URL}/api/todos`)
  if (!response.ok) {
    throw new Error(`fetchTodos failed: ${response.status}`)
  }
  return response.json() as Promise<Todo[]>
}

/**
 * 新しいタスクをAPIで作成する
 *
 * @param text - タスクのテキスト内容
 * @param dueDate - 締め切り日（YYYY-MM-DD形式、省略可）
 * @param priorityId - 優先度ID（省略可）
 * @returns 作成されたTodo
 * @throws APIエラー時にErrorをスロー
 */
export const createTodo = async (text: string, dueDate?: string, priorityId?: string): Promise<Todo> => {
  const body: { text: string; dueDate?: string; priorityId?: string } = { text }
  if (dueDate) body.dueDate = dueDate
  if (priorityId) body.priorityId = priorityId
  const response = await fetch(`${BASE_URL}/api/todos`, {
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
 * 指定IDのタスクをAPIで更新する
 *
 * @param id - 更新対象TodoのID
 * @param patch - 更新内容（text・completed を部分的に指定可能）
 * @returns 更新後のTodo
 * @throws APIエラー時にErrorをスロー
 */
export const updateTodo = async (
  id: number,
  patch: { text?: string; completed?: boolean; dueDate?: string; resetDueDate?: boolean; priorityId?: string | null },
): Promise<Todo> => {
  const response = await fetch(`${BASE_URL}/api/todos/${id}`, {
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
  const response = await fetch(`${BASE_URL}/api/todos/${id}`, {
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
  const response = await fetch(`${BASE_URL}/api/todos/completed`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`deleteCompleted failed: ${response.status}`)
  }
}
