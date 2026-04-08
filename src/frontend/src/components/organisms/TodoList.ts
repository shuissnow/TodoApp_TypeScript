import type { Todo } from '../../types/todo'
import { createTodoItem } from '../molecules/TodoItem'
import { createLoadingOverlay } from '../../utils/uiHelpers'

/**
 * TodoリストのDOM要素を生成する
 *
 * `todos` が空の場合は「タスクがありません」のメッセージを表示する。
 * 各アイテムは {@link createTodoItem} で生成する。
 * `isLoading` が true のとき、リストの上にスピナーオーバーレイを表示する。
 *
 * @param todos - 表示するTodo配列（フィルター適用済み）
 * @param isLoading - API呼び出し中フラグ。trueのときスピナーを表示する
 * @returns Todoリストを包む `<div>` 要素
 */
export const createTodoList = (todos: Todo[], isLoading: boolean): HTMLElement => {
  const wrapper = document.createElement('div')
  wrapper.className = 'relative'

  const ul = document.createElement('ul')
  ul.className = 'divide-y divide-gray-100'

  if (todos.length === 0) {
    const empty = document.createElement('li')
    empty.className = 'px-4 py-8 text-center text-sm text-gray-400'
    empty.textContent = 'タスクがありません'
    ul.appendChild(empty)
  } else {
    todos.forEach((todo) => {
      ul.appendChild(createTodoItem(todo, isLoading))
    })
  }

  wrapper.appendChild(ul)

  if (isLoading) {
    wrapper.appendChild(createLoadingOverlay('text-blue-500'))
  }

  return wrapper
}
