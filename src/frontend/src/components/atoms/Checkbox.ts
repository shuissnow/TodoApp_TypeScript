export interface CheckboxProps {
  /** `data-id` 属性にセットする値。イベント委譲で使用する */
  dataId: string
  checked: boolean
  disabled?: boolean
  ariaLabel?: string
}

export const createCheckbox = (props: CheckboxProps): HTMLInputElement => {
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.checked = props.checked
  checkbox.disabled = props.disabled ?? false
  checkbox.dataset['id'] = props.dataId
  checkbox.className = 'w-4 h-4 text-blue-500 rounded cursor-pointer flex-shrink-0 disabled:cursor-not-allowed'
  if (props.ariaLabel) {
    checkbox.setAttribute('aria-label', props.ariaLabel)
  }
  return checkbox
}
