export interface DateInputProps {
  id: string
  disabled?: boolean
}

export const createDateInput = (props: DateInputProps): HTMLInputElement => {
  const date = new Date()
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const input = document.createElement('input')
  input.type = 'date'
  input.id = props.id
  input.value = `${yyyy}-${mm}-${dd}`
  input.disabled = props.disabled ?? false
  input.className =
    'px-3 py-2 text-sm border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 disabled:opacity-50 disabled:cursor-not-allowed'
  return input
}
