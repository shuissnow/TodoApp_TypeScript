import { createTextInput } from '../atoms/TextInput'
import { createDateInput } from '../atoms/DateInput'
import { createButton } from '../atoms/Button'

/**
 * タスク入力フォーム（テキスト + 期限日 + 追加ボタン）のDOM要素を生成する
 *
 * @param isLoading - API呼び出し中フラグ。trueのとき各入力要素をdisabledにする
 * @returns フォームの `<div>` 要素
 */
export const createTodoInput = (isLoading: boolean): HTMLElement => {
  const container = document.createElement('div')
  container.className = 'flex gap-2 mb-5'

  const input = createTextInput({
    id: 'todo-text-input',
    placeholder: 'タスクを入力...',
    maxLength: 200,
    disabled: isLoading,
  })

  const dateInput = createDateInput({
    id: 'todo-deadline-input',
    disabled: isLoading,
  })

  const button = createButton({
    id: 'todo-add-button',
    text: isLoading ? '追加中...' : '追加',
    disabled: isLoading,
  })

  container.appendChild(input)
  container.appendChild(dateInput)
  container.appendChild(button)

  return container
}
