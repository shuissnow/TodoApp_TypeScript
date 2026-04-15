import type { AppStore } from '../../stores/store'
import { createTodoInput } from '../molecules/TodoInput'
import { createViewToggle } from '../molecules/ViewToggle'
import { createTaskListView } from './TaskListView'
import { createTaskBoardView } from './TaskBoardView'
import { DOM_IDS } from '../../utils/domIds'

/**
 * Todo一覧画面のコンテンツを生成する
 *
 * セクション見出し・入力フォーム・ビュー切り替え・タスク一覧を含む。
 * DOM生成後にイベントリスナーを内部で登録する。
 *
 * @param store - アプリの状態
 * @param onAddTodo - Todo追加コールバック
 * @param onToggleTodo - Todo完了切り替えコールバック
 * @param onUpdateDueDate - 期限日更新コールバック
 * @param onUpdatePriority - 優先度更新コールバック
 * @param onToggleViewType - ビュー切り替えコールバック
 * @returns Todo一覧画面のルート要素
 */
export const createTodoTop = (
  store: AppStore,
  onAddTodo: (text: string, dueDate?: string, priorityId?: string) => void,
  onToggleTodo: (id: number) => void,
  onUpdateDueDate: (id: number, value: string) => void,
  onUpdatePriority: (id: number, priorityId: string) => void,
  onToggleViewType: () => void,
): HTMLElement => {
  // フィルターされたTodoを取得する
  const filtered = (() => {
    if (store.filter === 'active') return store.todos.filter((t) => !t.completed)
    if (store.filter === 'completed') return store.todos.filter((t) => t.completed)
    return store.todos
  })()

  // セクション見出し
  const sectionTitle = document.createElement('h2')
  sectionTitle.textContent = 'タスク一覧'
  sectionTitle.className = 'text-lg font-medium text-green-800 mb-5'

  // 区切り線
  const divider = document.createElement('hr')
  divider.className = 'border-green-200 mb-2.5'

  // タスクビュー
  const taskView: HTMLElement =
    store.viewType === 'list'
      ? createTaskListView(filtered, store.isLoading, store.priorities)
      : createTaskBoardView(filtered)

  // ルート要素の組み立て
  const root = document.createElement('div')
  root.appendChild(sectionTitle)
  root.appendChild(createTodoInput(store.isLoading, store.priorities))
  root.appendChild(divider)
  root.appendChild(createViewToggle(store.viewType))
  root.appendChild(taskView)

  setupEvents(root, onAddTodo, onToggleTodo, onUpdateDueDate, onUpdatePriority, onToggleViewType)

  return root
}

/**
 * Todo一覧画面のイベントリスナーを登録する
 *
 * @param root - イベントを登録するルート要素
 * @param onAddTodo - Todo追加コールバック
 * @param onToggleTodo - Todo完了切り替えコールバック
 * @param onUpdateDueDate - 期限日更新コールバック
 * @param onUpdatePriority - 優先度更新コールバック
 * @param onToggleViewType - ビュー切り替えコールバック
 */
const setupEvents = (
  root: HTMLElement,
  onAddTodo: (text: string, dueDate?: string, priorityId?: string) => void,
  onToggleTodo: (id: number) => void,
  onUpdateDueDate: (id: number, value: string) => void,
  onUpdatePriority: (id: number, priorityId: string) => void,
  onToggleViewType: () => void,
): void => {
  const input = root.querySelector<HTMLInputElement>(DOM_IDS.TODO_TEXT_INPUT)
  const deadlineInput = root.querySelector<HTMLInputElement>(DOM_IDS.TODO_DEADLINE_INPUT)
  const prioritySelect = root.querySelector<HTMLSelectElement>(DOM_IDS.TODO_PRIORITY_SELECT)
  const addButton = root.querySelector<HTMLButtonElement>(DOM_IDS.ADD_TODO_BTN)

  const clearInputs = (): void => {
    if (input) input.value = ''
    if (deadlineInput) deadlineInput.value = ''
    if (prioritySelect) prioritySelect.value = ''
  }

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      onAddTodo(input.value, deadlineInput?.value, prioritySelect?.value)
      clearInputs()
    }
  })

  addButton?.addEventListener('click', () => {
    if (input) {
      onAddTodo(input.value, deadlineInput?.value, prioritySelect?.value)
      clearInputs()
    }
  })

  // 期限日インライン編集: spanクリックでinputに切り替え
  root.querySelectorAll<HTMLSpanElement>('[data-due-date-display-id]').forEach((span) => {
    span.addEventListener('click', () => {
      const id = span.dataset['dueDateDisplayId']
      if (!id) return
      const editInput = root.querySelector<HTMLInputElement>(`[data-due-date-edit-id="${id}"]`)
      if (!editInput) return
      span.classList.add('hidden')
      editInput.classList.remove('hidden')
      editInput.focus()
    })
  })

  // 期限日インライン編集: change で保存
  root.querySelectorAll<HTMLInputElement>('[data-due-date-edit-id]').forEach((editInput) => {
    let saved = false

    editInput.addEventListener('change', () => {
      saved = true
      const id = editInput.dataset['dueDateEditId']
      if (!id) return
      onUpdateDueDate(Number(id), editInput.value)
    })

    editInput.addEventListener('blur', () => {
      if (saved) return
      const id = editInput.dataset['dueDateEditId']
      if (!id) return
      const span = root.querySelector<HTMLSpanElement>(`[data-due-date-display-id="${id}"]`)
      if (!span) return
      editInput.classList.add('hidden')
      span.classList.remove('hidden')
    })

    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        saved = true
        const id = editInput.dataset['dueDateEditId']
        if (!id) return
        const span = root.querySelector<HTMLSpanElement>(`[data-due-date-display-id="${id}"]`)
        if (!span) return
        editInput.classList.add('hidden')
        span.classList.remove('hidden')
      }
    })
  })

  // 優先度インライン編集: バッジwrapクリックでselectに切り替え
  root.querySelectorAll<HTMLSpanElement>('[data-priority-display-id]').forEach((wrap) => {
    wrap.addEventListener('click', () => {
      const id = wrap.dataset['priorityDisplayId']
      if (!id) return
      const editSelect = root.querySelector<HTMLSelectElement>(`[data-priority-edit-id="${id}"]`)
      if (!editSelect) return
      wrap.classList.add('hidden')
      editSelect.classList.remove('hidden')
      editSelect.focus()
    })
  })

  // 優先度インライン編集: change で保存
  root.querySelectorAll<HTMLSelectElement>('[data-priority-edit-id]').forEach((editSelect) => {
    let saved = false

    editSelect.addEventListener('change', () => {
      saved = true
      const id = editSelect.dataset['priorityEditId']
      if (!id) return
      onUpdatePriority(Number(id), editSelect.value)
    })

    editSelect.addEventListener('blur', () => {
      if (saved) return
      const id = editSelect.dataset['priorityEditId']
      if (!id) return
      const wrap = root.querySelector<HTMLSpanElement>(`[data-priority-display-id="${id}"]`)
      if (!wrap) return
      editSelect.classList.add('hidden')
      wrap.classList.remove('hidden')
    })
  })

  // ビュー切り替えボタン
  root.querySelector<HTMLButtonElement>(DOM_IDS.VIEW_TOGGLE_BTN)?.addEventListener('click', () => {
    onToggleViewType()
  })

  // Todoチェックボタン
  root.querySelectorAll<HTMLButtonElement>('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      onToggleTodo(Number(btn.dataset['id']!))
    })
  })
}
