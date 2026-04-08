export interface TextInputProps {
  id: string
  placeholder?: string
  maxLength?: number
  disabled?: boolean
}

export const createTextInput = (props: TextInputProps): HTMLInputElement => {
  const input = document.createElement('input')
  input.type = 'text'
  input.id = props.id
  if (props.placeholder !== undefined) input.placeholder = props.placeholder
  if (props.maxLength !== undefined) input.maxLength = props.maxLength
  input.disabled = props.disabled ?? false
  input.className =
    'flex-1 h-[38px] border border-green-400 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-600 disabled:opacity-50 disabled:cursor-not-allowed'
  return input
}
