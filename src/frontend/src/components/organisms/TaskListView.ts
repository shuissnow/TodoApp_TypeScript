import type { Todo } from '../../types/todo'
import { createPriorityBadge, createLoadingOverlay } from '../../utils/uiHelpers'

/**
 * チェックボタン（円形）のDOM要素を生成する
 *
 * @param todo - 対象のTodo
 * @param isLoading - ローディング中フラグ
 * @returns `<button>` 要素
 */
const createCheckButton = (todo: Todo, isLoading: boolean): HTMLElement => {
  const button = document.createElement('button')
  button.type = 'button'
  button.dataset['id'] = todo.id
  button.disabled = isLoading
  button.setAttribute(
    'aria-label',
    `「${todo.text}」を${todo.completed ? '未完了に' : '完了に'}する`,
  )

  if (todo.completed) {
    button.className =
      'w-4 h-4 rounded-full bg-green-600 border-2 border-green-600 flex items-center justify-center flex-shrink-0 disabled:cursor-not-allowed'

    // チェックマーク（白）
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '10')
    svg.setAttribute('height', '10')
    svg.setAttribute('viewBox', '0 0 10 10')
    svg.setAttribute('fill', 'none')
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', 'M2 5l2.5 2.5L8 3')
    path.setAttribute('stroke', 'white')
    path.setAttribute('stroke-width', '1.5')
    path.setAttribute('stroke-linecap', 'round')
    path.setAttribute('stroke-linejoin', 'round')
    svg.appendChild(path)
    button.appendChild(svg)
  } else {
    button.className =
      'w-4 h-4 rounded-full border-2 border-green-400 flex-shrink-0 hover:border-green-600 transition-colors disabled:cursor-not-allowed'
  }

  return button
}

/**
 * テーブル行（1件分）のDOM要素を生成する
 *
 * @param todo - 表示するTodo
 * @param isLoading - ローディング中フラグ
 * @returns `<tr>` 要素
 */
const createTableRow = (todo: Todo, isLoading: boolean): HTMLElement => {
  const tr = document.createElement('tr')
  tr.className = 'border-b border-gray-100 last:border-0'

  // チェック列
  const tdCheck = document.createElement('td')
  tdCheck.className = 'py-2.5 px-3 w-8'
  tdCheck.appendChild(createCheckButton(todo, isLoading))
  tr.appendChild(tdCheck)

  // タスク名列
  const tdText = document.createElement('td')
  tdText.className = 'py-2.5 px-3'
  const textSpan = document.createElement('span')
  textSpan.textContent = todo.text
  textSpan.className = todo.completed
    ? 'text-sm line-through text-gray-400'
    : 'text-sm text-gray-900'
  tdText.appendChild(textSpan)
  tr.appendChild(tdText)

  // 締め切り列
  const tdDeadline = document.createElement('td')
  tdDeadline.className = 'py-2.5 px-3 w-[100px]'
  const deadlineSpan = document.createElement('span')
  deadlineSpan.textContent = todo.deadline ?? '—'
  deadlineSpan.className = 'text-sm text-gray-900'
  tdDeadline.appendChild(deadlineSpan)
  tr.appendChild(tdDeadline)

  // 優先度列
  const tdPriority = document.createElement('td')
  tdPriority.className = 'py-2.5 px-3 w-[72px]'
  tdPriority.appendChild(createPriorityBadge(todo.priority))
  tr.appendChild(tdPriority)

  // ステータス列
  const tdStatus = document.createElement('td')
  tdStatus.className = 'py-2.5 px-3 w-[72px]'
  const statusSpan = document.createElement('span')
  statusSpan.textContent = todo.completed ? '完了' : '未完了'
  statusSpan.className = 'text-sm text-gray-900'
  tdStatus.appendChild(statusSpan)
  tr.appendChild(tdStatus)

  return tr
}

/**
 * テーブル形式のタスクリストのDOM要素を生成する
 *
 * @param todos - 表示するTodo配列
 * @param isLoading - ローディング中フラグ
 * @returns テーブルを包む `<div>` 要素
 */
export const createTaskListView = (todos: Todo[], isLoading: boolean): HTMLElement => {
  const wrapper = document.createElement('div')
  wrapper.className = 'relative overflow-x-auto'

  if (todos.length === 0) {
    const empty = document.createElement('p')
    empty.className = 'py-8 text-center text-sm text-gray-400'
    empty.textContent = 'タスクがありません'
    wrapper.appendChild(empty)
    return wrapper
  }

  const table = document.createElement('table')
  table.className = 'w-full'

  // thead
  const thead = document.createElement('thead')
  thead.className = 'border-b border-green-200'
  const headerRow = document.createElement('tr')
  const headers = [
    { label: '', className: 'w-8' },
    { label: 'タスク名', className: '' },
    { label: '締め切り', className: 'w-[100px]' },
    { label: '優先度', className: 'w-[72px]' },
    { label: 'ステータス', className: 'w-[72px]' },
  ]
  headers.forEach(({ label, className }) => {
    const th = document.createElement('th')
    th.scope = 'col'
    th.className = `text-xs font-medium text-gray-500 py-1.5 px-3 text-left ${className}`
    th.textContent = label
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)
  table.appendChild(thead)

  // tbody
  const tbody = document.createElement('tbody')
  todos.forEach((todo) => {
    tbody.appendChild(createTableRow(todo, isLoading))
  })
  table.appendChild(tbody)

  wrapper.appendChild(table)

  if (isLoading) {
    wrapper.appendChild(createLoadingOverlay())
  }

  return wrapper
}
