import { createTodo, updateTodo, deleteTodoById, deleteCompleted } from '../services/todoApi'
import { store } from '../stores/store'

const MAX_TEXT_LENGTH = 200

/**
 * 新しいTodoをAPIで追加する
 *
 * 空文字・空白のみ・最大文字数超過の場合は何もしない
 *
 * @param text - タスクのテキスト
 * @param dueDate - 締め切り日（YYYY-MM-DD形式、省略可）
 * @param priorityId - 優先度ID（省略可）
 * @param onRender - 状態変更後に呼び出す再描画コールバック
 */
export const addTodo = async (
  text: string,
  dueDate?: string,
  priorityId?: string,
  onRender: () => void = () => {},
): Promise<void> => {
  const trimmed = text.trim()
  if (!trimmed || trimmed.length > MAX_TEXT_LENGTH) return

  store.isLoading = true
  onRender()
  try {
    const created = await createTodo(trimmed, dueDate, priorityId)
    store.todos = [...store.todos, created]
  } catch (err) {
    console.error('addTodo error:', err)
  } finally {
    store.isLoading = false
    onRender()
  }
}

/**
 * 指定IDのTodoの完了状態を反転する
 *
 * @param id - 対象TodoのID
 * @param onRender - 状態変更後に呼び出す再描画コールバック
 */
export const toggleTodo = async (id: number, onRender: () => void = () => {}): Promise<void> => {
  const target = store.todos.find((t) => t.id === id)
  if (!target) return

  store.isLoading = true
  onRender()
  try {
    const updated = await updateTodo(id, { completed: !target.completed })
    store.todos = store.todos.map((t) => (t.id === id ? updated : t))
  } catch (err) {
    console.error('toggleTodo error:', err)
  } finally {
    store.isLoading = false
    onRender()
  }
}

/**
 * 指定IDのTodoを削除する
 *
 * @param id - 対象TodoのID
 * @param onRender - 状態変更後に呼び出す再描画コールバック
 */
export const deleteTodo = async (id: number, onRender: () => void = () => {}): Promise<void> => {
  store.isLoading = true
  onRender()
  try {
    await deleteTodoById(id)
    store.todos = store.todos.filter((t) => t.id !== id)
  } catch (err) {
    console.error('deleteTodo error:', err)
  } finally {
    store.isLoading = false
    onRender()
  }
}

/**
 * 指定IDのTodoの期限日を更新する
 *
 * @param id - 対象TodoのID
 * @param value - 新しい期限日（YYYY-MM-DD形式）。空文字の場合は期限日をリセットする
 * @param onRender - 状態変更後に呼び出す再描画コールバック
 */
export const updateDueDate = async (
  id: number,
  value: string,
  onRender: () => void = () => {},
): Promise<void> => {
  const patch = value ? { dueDate: value } : { resetDueDate: true }
  store.isLoading = true
  onRender()
  try {
    const updated = await updateTodo(id, patch)
    store.todos = store.todos.map((t) => (t.id === id ? updated : t))
  } catch (err) {
    console.error('updateDueDate error:', err)
  } finally {
    store.isLoading = false
    onRender()
  }
}

/**
 * 指定IDのTodoの優先度を更新する
 *
 * @param id - 対象TodoのID
 * @param priorityId - 新しい優先度ID。空文字の場合は優先度をリセットする
 * @param onRender - 状態変更後に呼び出す再描画コールバック
 */
export const updatePriority = async (
  id: number,
  priorityId: string,
  onRender: () => void = () => {},
): Promise<void> => {
  const patch = priorityId ? { priorityId } : { priorityId: null }
  store.isLoading = true
  onRender()
  try {
    const updated = await updateTodo(id, patch)
    store.todos = store.todos.map((t) => (t.id === id ? updated : t))
  } catch (err) {
    console.error('updatePriority error:', err)
  } finally {
    store.isLoading = false
    onRender()
  }
}

/**
 * 完了済みのTodoをすべて削除する
 *
 * @param onRender - 状態変更後に呼び出す再描画コールバック
 */
export const clearCompleted = async (onRender: () => void = () => {}): Promise<void> => {
  store.isLoading = true
  onRender()
  try {
    await deleteCompleted()
    store.todos = store.todos.filter((t) => !t.completed)
  } catch (err) {
    console.error('clearCompleted error:', err)
  } finally {
    store.isLoading = false
    onRender()
  }
}
