/**
 * タスク入力エリアのDOM要素を生成する
 *
 * テキスト入力フィールド（id: `todo-text-input`）と
 * 追加ボタン（id: `todo-add-button`）を含む `<div>` を返す。
 * イベントの登録は `app.ts` の `setupEventListeners` で行う。
 *
 * @param isLoading - API呼び出し中フラグ。trueのとき入力とボタンをdisabledにする
 * @returns 入力エリアの `<div>` 要素
 */
export const createTodoInput = (isLoading: boolean): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'flex gap-2 p-4'

  const input = document.createElement('input')
  input.type = 'text'
  input.id = 'todo-text-input'
  input.placeholder = 'タスクを入力...'
  input.maxLength = 200
  input.disabled = isLoading
  input.className =
    'flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'

  const button = document.createElement('button')
  button.type = 'button'
  button.id = 'todo-add-button'
  button.textContent = isLoading ? '追加中...' : '追加'
  button.disabled = isLoading
  button.className =
    'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  container.appendChild(input)
  container.appendChild(button)

  return container
}
