import type { Priority } from '../../types/todo'

export interface PrioritySelectProps {
  id: string
  disabled?: boolean
  priorities: Priority[]
  /** 選択中の priorityId。'' または省略で「なし」 */
  value?: string
}

/**
 * 優先度選択セレクトのDOM要素を生成する
 *
 * 選択中の Priority の foregroundColor / backgroundColor を inline style で反映する。
 * 「なし」選択時は緑ベースのデフォルトスタイルに戻る。
 *
 * @param props - セレクトのプロパティ
 * @returns `<select>` 要素
 */
export const createPrioritySelect = (props: PrioritySelectProps): HTMLSelectElement => {
  const select = document.createElement('select')
  select.id = props.id
  select.disabled = props.disabled ?? false
  select.className =
    'text-xs font-medium px-2 py-1.5 rounded-md border border-green-300 bg-white text-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50'

  // 「なし」オプション
  const noneOption = document.createElement('option')
  noneOption.value = ''
  noneOption.textContent = 'なし'
  select.appendChild(noneOption)

  props.priorities.forEach((p) => {
    const option = document.createElement('option')
    option.value = p.id
    option.textContent = p.name
    select.appendChild(option)
  })

  select.value = props.value ?? ''

  const applyColor = (): void => {
    const selected = props.priorities.find((p) => p.id === select.value)
    if (selected) {
      select.style.color = selected.foregroundColor
      select.style.backgroundColor = selected.backgroundColor
      select.style.borderColor = selected.foregroundColor
    } else {
      select.style.removeProperty('color')
      select.style.removeProperty('background-color')
      select.style.removeProperty('border-color')
    }
  }

  applyColor()
  select.addEventListener('change', applyColor)

  return select
}
