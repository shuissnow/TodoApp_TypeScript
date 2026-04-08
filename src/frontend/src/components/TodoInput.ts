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
  container.className = 'flex gap-2 mb-5'

  const input = document.createElement('input')
  input.type = 'text'
  input.id = 'todo-text-input'
  input.placeholder = 'タスクを入力...'
  input.maxLength = 200
  input.disabled = isLoading
  input.className =
    'flex-1 h-[38px] border border-green-400 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 disabled:opacity-50 disabled:cursor-not-allowed'

  const button = document.createElement('button')
  button.type = 'button'
  button.id = 'todo-add-button'
  button.textContent = isLoading ? '追加中...' : '追加'
  button.disabled = isLoading
  button.className =
    'h-[38px] px-4 bg-green-800 text-green-50 text-sm font-medium rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  container.appendChild(input)
  container.appendChild(button)

  return container
}
