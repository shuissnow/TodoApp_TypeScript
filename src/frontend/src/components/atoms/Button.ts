export interface ButtonProps {
  id: string
  text: string
  disabled?: boolean
}

export const createButton = (props: ButtonProps): HTMLButtonElement => {
  const button = document.createElement('button')
  button.type = 'button'
  button.id = props.id
  button.textContent = props.text
  button.disabled = props.disabled ?? false
  button.className =
    'h-[38px] px-4 bg-green-800 text-green-50 text-sm font-medium rounded-lg hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
  return button
}
