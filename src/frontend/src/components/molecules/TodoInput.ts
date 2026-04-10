import type { Priority } from '../../types/todo'
import { createTextInput } from '../atoms/TextInput'
import { createDateInput } from '../atoms/DateInput'
import { createPrioritySelect } from '../atoms/PrioritySelect'
import { createButton } from '../atoms/Button'

/**
 * タスク入力フォーム（テキスト + 期限日 + 優先度 + 追加ボタン）のDOM要素を生成する
 *
 * @param isLoading - API呼び出し中フラグ。trueのとき各入力要素をdisabledにする
 * @param priorities - 優先度選択肢一覧
 * @returns フォームの `<div>` 要素
 */
export const createTodoInput = (isLoading: boolean, priorities: Priority[]): HTMLElement => {
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

  const prioritySelect = createPrioritySelect({
    id: 'todo-priority-select',
    disabled: isLoading,
    priorities,
  })

  const button = createButton({
    id: 'todo-add-button',
    text: isLoading ? '追加中...' : '追加',
    disabled: isLoading,
  })

  container.appendChild(input)
  container.appendChild(dateInput)
  container.appendChild(prioritySelect)
  container.appendChild(button)

  return container
}
