import type { Todo } from '../../types/todo'
import { createPriorityBadge } from '../../utils/uiHelpers'

/** カンバン列の定義 */
interface BoardColumn {
  label: string
  todos: Todo[]
}

/**
 * カンバンボードのDOM要素を生成する
 *
 * 3列構成: 未着手（未完了）/ 進行中（プレースホルダー）/ 完了
 *
 * @param todos - 全Todo配列
 * @returns ボードの `<div>` 要素
 */
export const createTaskBoardView = (todos: Todo[]): HTMLElement => {
  const board = document.createElement('div')
  board.className = 'grid grid-cols-1 sm:grid-cols-3 gap-3'

  const columns: BoardColumn[] = [
    { label: '未着手', todos: todos.filter((t) => !t.completed) },
    { label: '進行中', todos: [] },
    { label: '完了', todos: todos.filter((t) => t.completed) },
  ]

  columns.forEach((col) => {
    board.appendChild(createColumn(col))
  })

  return board
}

/**
 * カンバン列のDOM要素を生成する
 *
 * @param column - 列定義（ラベルとTodo配列）
 * @returns 列の `<div>` 要素
 */
const createColumn = (column: BoardColumn): HTMLElement => {
  const col = document.createElement('div')
  col.className = 'bg-green-50 rounded-xl p-3'

  // 列ヘッダー
  const header = document.createElement('div')
  header.className = 'flex items-center gap-2 mb-2'

  // カンバンボードのタイトル
  const label = document.createElement('span')
  label.textContent = column.label
  label.className = 'text-xs font-medium text-green-800'

  // カンバンコードのTodo件数
  const countBadge = document.createElement('span')
  countBadge.textContent = String(column.todos.length)
  countBadge.className = 'bg-green-200 text-green-900 rounded-full px-2 py-0.5 text-xs'

  header.appendChild(label)
  header.appendChild(countBadge)
  col.appendChild(header)

  // カード一覧
  const cards = document.createElement('div')
  cards.className = 'space-y-2'

  if (column.todos.length === 0) {
    const empty = document.createElement('p')
    empty.textContent = 'タスクなし'
    empty.className = 'text-xs text-gray-400 py-2 text-center'
    cards.appendChild(empty)
  } else {
    column.todos.forEach((todo) => {
      cards.appendChild(createCard(todo))
    })
  }

  col.appendChild(cards)

  return col
}

/**
 * カンバンカードのDOM要素を生成する
 *
 * @param todo - 表示するTodo
 * @returns カードの `<div>` 要素
 */
const createCard = (todo: Todo): HTMLElement => {
  const card = document.createElement('div')
  card.className = 'bg-white border border-green-200 rounded-lg p-3 space-y-1.5'

  // text
  const title = document.createElement('p')
  title.textContent = todo.text
  title.className = todo.completed ? 'text-sm line-through text-gray-400' : 'text-sm text-gray-900'
  card.appendChild(title)

  // priority
  const meta = document.createElement('div')
  meta.className = 'flex items-center gap-1.5'
  meta.appendChild(createPriorityBadge(todo.priority))

  // 期限日
  if (todo.dueDate) {
    const dueDate = document.createElement('span')
    dueDate.textContent = todo.dueDate
    dueDate.className = 'text-xs text-black-400'
    meta.appendChild(dueDate)
  }

  card.appendChild(meta)

  return card
}
