import type { FilterType } from '../types/todo'

/** フィルターボタンの定義リスト */
const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了済み' },
]

/**
 * フィルター切り替えバーのDOM要素を生成する
 *
 * 「すべて」「未完了」「完了済み」の3つのボタンを並べる。
 * 現在選択中のフィルターのボタンはアクティブスタイルで表示する。
 * クリックイベントの登録は `app.ts` の `setupEventListeners` で行う。
 *
 * @param current - 現在選択中のフィルター種別
 * @returns フィルターバーの `<div>` 要素
 */
export const createFilterBar = (current: FilterType): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'flex gap-1 px-4 pb-2'

  FILTERS.forEach(({ value, label }) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.dataset['filter'] = value
    button.textContent = label

    const isActive = value === current
    button.className = [
      'px-3 py-1 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
      isActive
        ? 'bg-blue-500 text-white'
        : 'text-gray-600 hover:bg-gray-100',
    ].join(' ')

    container.appendChild(button)
  })

  return container
}
