import type { Todo } from '../types/todo'

/**
 * Todoアイテム1件分のDOM要素を生成する
 *
 * チェックボックス・テキスト・削除ボタンを含む `<li>` を返す。
 * 削除ボタンはホバー時のみ表示される（CSSの `group-hover` で制御）。
 * 各イベントの登録は `app.ts` の `setupEventListeners` で行う。
 *
 * @param todo - 表示するTodoアイテム
 * @param isLoading - API呼び出し中フラグ。trueのときチェックボックスと削除ボタンをdisabledにする
 * @returns Todoアイテムの `<li>` 要素
 */
export const createTodoItem = (todo: Todo, isLoading: boolean): HTMLElement => {
  const li = document.createElement('li')
  li.className = 'flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 group'

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = todo.completed
  checkbox.dataset['id'] = todo.id
  checkbox.disabled = isLoading
  checkbox.className = 'w-4 h-4 text-blue-500 rounded cursor-pointer flex-shrink-0 disabled:cursor-not-allowed'
  checkbox.setAttribute('aria-label', `「${todo.text}」を完了にする`)

  const text = document.createElement('span')
  text.textContent = todo.text
  text.className = [
    'flex-1 text-sm',
    todo.completed ? 'line-through text-gray-400' : 'text-gray-700',
  ].join(' ')

  const deleteButton = document.createElement('button')
  deleteButton.type = 'button'
  deleteButton.dataset['deleteId'] = todo.id
  deleteButton.textContent = '削除'
  deleteButton.disabled = isLoading
  deleteButton.className =
    'px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-not-allowed'
  deleteButton.setAttribute('aria-label', `「${todo.text}」を削除する`)

  li.appendChild(checkbox)
  li.appendChild(text)
  li.appendChild(deleteButton)

  return li
}
