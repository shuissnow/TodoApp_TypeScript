import type { ViewType } from '../types/todo'

/**
 * ビュー切り替えボタンのDOM要素を生成する
 *
 * list表示中はボードアイコン、board表示中はリストアイコンを表示する。
 * クリックイベントの登録は `app.ts` の `setupEventListeners` で行う。
 *
 * @param viewType - 現在のビュー種別
 * @returns ビュー切り替えボタンを包む `<div>` 要素
 */
export const createViewToggle = (viewType: ViewType): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'flex justify-end mb-3'

  const button = document.createElement('button')
  button.type = 'button'
  button.id = 'view-toggle-button'
  button.className =
    'w-8 h-8 border border-green-400 rounded-lg bg-green-50 text-green-800 hover:bg-green-200 transition-colors flex items-center justify-center'
  button.title =
    viewType === 'list' ? 'ボード表示に切り替え' : 'リスト表示に切り替え'

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '16')
  svg.setAttribute('height', '16')
  svg.setAttribute('viewBox', '0 0 16 16')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '1.5')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')

  if (viewType === 'list') {
    // ボードアイコン（4つの四角形グリッド）
    const rect1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect1.setAttribute('x', '2')
    rect1.setAttribute('y', '2')
    rect1.setAttribute('width', '5')
    rect1.setAttribute('height', '5')
    rect1.setAttribute('rx', '1')
    rect1.setAttribute('fill', 'currentColor')
    rect1.setAttribute('stroke', 'none')

    const rect2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect2.setAttribute('x', '9')
    rect2.setAttribute('y', '2')
    rect2.setAttribute('width', '5')
    rect2.setAttribute('height', '5')
    rect2.setAttribute('rx', '1')
    rect2.setAttribute('fill', 'currentColor')
    rect2.setAttribute('stroke', 'none')

    const rect3 = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect3.setAttribute('x', '2')
    rect3.setAttribute('y', '9')
    rect3.setAttribute('width', '5')
    rect3.setAttribute('height', '5')
    rect3.setAttribute('rx', '1')
    rect3.setAttribute('fill', 'currentColor')
    rect3.setAttribute('stroke', 'none')

    const rect4 = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect4.setAttribute('x', '9')
    rect4.setAttribute('y', '9')
    rect4.setAttribute('width', '5')
    rect4.setAttribute('height', '5')
    rect4.setAttribute('rx', '1')
    rect4.setAttribute('fill', 'currentColor')
    rect4.setAttribute('stroke', 'none')

    svg.appendChild(rect1)
    svg.appendChild(rect2)
    svg.appendChild(rect3)
    svg.appendChild(rect4)
  } else {
    // リストアイコン（3本の横線）
    const lines = [
      { x1: '2', y1: '4', x2: '14', y2: '4' },
      { x1: '2', y1: '8', x2: '14', y2: '8' },
      { x1: '2', y1: '12', x2: '14', y2: '12' },
    ]
    lines.forEach(({ x1, y1, x2, y2 }) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', x1)
      line.setAttribute('y1', y1)
      line.setAttribute('x2', x2)
      line.setAttribute('y2', y2)
      svg.appendChild(line)
    })
  }

  button.appendChild(svg)
  container.appendChild(button)

  return container
}
