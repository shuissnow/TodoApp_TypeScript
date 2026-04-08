import type { Priority } from '../types/todo'

/**
 * 優先度バッジのDOM要素を生成する
 *
 * @param priority - 優先度（未設定の場合は「低」として扱う）
 * @returns バッジの `<span>` 要素
 */
export const createPriorityBadge = (priority: Priority | undefined): HTMLElement => {
  const badge = document.createElement('span')
  const resolved = priority ?? 'low'

  let label: string
  let colorClass: string
  switch (resolved) {
    case 'high':
      label = '高'
      colorClass = 'bg-red-50 text-red-700'
      break
    case 'mid':
      label = '中'
      colorClass = 'bg-amber-50 text-amber-700'
      break
    default:
      label = '低'
      colorClass = 'bg-green-50 text-green-700'
  }

  badge.textContent = label
  badge.className = `${colorClass} text-xs font-medium px-2 py-0.5 rounded-full`
  return badge
}

/**
 * ローディングオーバーレイ（SVGスピナー）のDOM要素を生成する
 *
 * @param spinnerColorClass - スピナーの色を表すTailwindクラス（例: `'text-green-600'`）
 * @returns オーバーレイの `<div>` 要素
 */
export const createLoadingOverlay = (spinnerColorClass: string = 'text-green-600'): HTMLElement => {
  const overlay = document.createElement('div')
  overlay.className = 'absolute inset-0 bg-white/70 flex items-center justify-center'

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('class', `animate-spin h-6 w-6 ${spinnerColorClass}`)
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
