import { createTextInput } from '../atoms/TextInput'
import { createButton } from '../atoms/Button'

export const createTodoInput = (isLoading: boolean): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'flex gap-2 mb-5'

  const input = createTextInput({
    id: 'todo-text-input',
    placeholder: 'タスクを入力...',
    maxLength: 200,
    disabled: isLoading,
  })

  const button = createButton({
    id: 'todo-add-button',
    text: isLoading ? '追加中...' : '追加',
    disabled: isLoading,
  })

  container.appendChild(input)
  container.appendChild(button)

  return container
}
