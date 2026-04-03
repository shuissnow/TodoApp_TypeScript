import type { Todo } from '../types/todo'
import { createTodoItem } from './TodoItem'

/**
 * ローディングオーバーレイ（SVGスピナー）のDOM要素を生成する
 *
 * @returns オーバーレイの `<div>` 要素
 */
const createLoadingOverlay = (): HTMLElement => {
  const overlay = document.createElement('div')
  overlay.className = 'absolute inset-0 bg-white/70 flex items-center justify-center'

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', 'animate-spin h-6 w-6 text-blue-500')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('aria-label', '読み込み中')

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  circle.setAttribute('class', 'opacity-25')
  circle.setAttribute('cx', '12')
  circle.setAttribute('cy', '12')
  circle.setAttribute('r', '10')
  circle.setAttribute('stroke', 'currentColor')
  circle.setAttribute('stroke-width', '4')

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('class', 'opacity-75')
  path.setAttribute('fill', 'currentColor')
  path.setAttribute('d', 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z')

  svg.appendChild(circle)
  svg.appendChild(path)
  overlay.appendChild(svg)

  return overlay
}

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
    wrapper.appendChild(createLoadingOverlay())
  }

  return wrapper
}
