import type { Todo } from '../types/todo'

/**
 * フッターのDOM要素を生成する
 *
 * 未完了件数の表示と、完了済みタスクがある場合は「完了済みを削除」ボタンを表示する。
 * ボタンのクリックイベントは `app.ts` の `setupEventListeners` で登録する。
 * タスクが1件もない場合、`app.ts` の `render()` からこの関数は呼ばれない。
 *
 * @param todos - 全Todo配列（フィルター前）
 * @param isLoading - API呼び出し中フラグ。trueのとき「完了済みを削除」ボタンをdisabledにする
 * @returns フッターの `<footer>` 要素
 */
export const createFooter = (todos: Todo[], isLoading: boolean): HTMLElement => {
  const footer = document.createElement('footer')
  footer.className = 'flex items-center justify-between px-4 py-3 text-sm text-gray-500 border-t border-gray-100'

  const activeCount = todos.filter((t) => !t.completed).length
  const completedCount = todos.filter((t) => t.completed).length

  const count = document.createElement('span')
  count.textContent = `${activeCount}件残っています`

  footer.appendChild(count)

  if (completedCount > 0) {
    const clearButton = document.createElement('button')
    clearButton.type = 'button'
    clearButton.id = 'clear-completed-button'
    clearButton.textContent = '完了済みを削除'
    clearButton.disabled = isLoading
    clearButton.className = 'text-sm text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    footer.appendChild(clearButton)
  }

  return footer
}
