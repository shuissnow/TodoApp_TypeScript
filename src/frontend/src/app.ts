import type { Todo } from './types/todo'
import type { FilterType } from './types/filtertype'
import type { ViewType } from './types/viewtype'
import type { Priority } from './types/priority'

import {
  fetchTodos,
  createTodo,
  updateTodo,
  deleteTodoById,
  deleteCompleted,
} from './services/todoApi'

import { fetchAllPriorities, updatePriority as updatePriorityMaster } from './services/priorityApi'
import { createTodoInput } from './components/molecules/TodoInput'
import { createViewToggle } from './components/molecules/ViewToggle'
import { createTaskListView } from './components/organisms/TaskListView'
import { createTaskBoardView } from './components/organisms/TaskBoardView'
import { createFooter } from './components/organisms/Footer'
import { createHeader } from './components/organisms/Header'
import { createAppLayout } from './components/templates/AppLayout'
import { createMasterTop } from './components/organisms/MasterTop'
import { createMasterPriority } from './components/organisms/MasterPriority'
import { DOM_IDS } from './utils/domIds'

/** 全Todoの状態 */
let todos: Todo[] = []

/** 優先度マスタの状態 */
let priorities: Priority[] = []

/** 現在選択中のフィルター */
let filter: FilterType = 'all'

/** 現在のビュー種別 */
let viewType: ViewType = 'list'

/** API呼び出し中フラグ */
let isLoading = false

/** タスクテキストの最大文字数 */
const MAX_TEXT_LENGTH = 200

/**
 * 新しいTodoをAPIで追加する
 *
 * 空文字・空白のみ・最大文字数超過の場合は何もしない
 *
 * @param text - タスクのテキスト
 * @param dueDate - 締め切り日（YYYY-MM-DD形式、省略可）
 * @param priorityId - 優先度ID（省略可）
 */
export const addTodo = async (
  text: string,
  dueDate?: string,
  priorityId?: string,
): Promise<void> => {
  const trimmed = text.trim()
  if (!trimmed || trimmed.length > MAX_TEXT_LENGTH) return

  isLoading = true
  render()
  try {
    const created = await createTodo(trimmed, dueDate, priorityId)
    todos = [...todos, created]
  } catch (err) {
    console.error('addTodo error:', err)
  } finally {
    isLoading = false
    render()
  }
}

/**
 * 指定IDのTodoの完了状態を反転する
 *
 * @param id - 対象TodoのID
 */
export const toggleTodo = async (id: number): Promise<void> => {
  const target = todos.find((t) => t.id === id)
  if (!target) return

  isLoading = true
  render()
  try {
    const updated = await updateTodo(id, { completed: !target.completed })
    todos = todos.map((t) => (t.id === id ? updated : t))
  } catch (err) {
    console.error('toggleTodo error:', err)
  } finally {
    isLoading = false
    render()
  }
}

/**
 * 指定IDのTodoを削除する
 *
 * @param id - 対象TodoのID
 */
export const deleteTodo = async (id: number): Promise<void> => {
  isLoading = true
  render()
  try {
    await deleteTodoById(id)
    todos = todos.filter((t) => t.id !== id)
  } catch (err) {
    console.error('deleteTodo error:', err)
  } finally {
    isLoading = false
    render()
  }
}

/**
 * 指定IDのTodoの期限日を更新する
 *
 * @param id - 対象TodoのID
 * @param value - 新しい期限日（YYYY-MM-DD形式）。空文字の場合は期限日をリセットする
 */
export const updateDueDate = async (id: number, value: string): Promise<void> => {
  const patch = value ? { dueDate: value } : { resetDueDate: true }
  isLoading = true
  render()
  try {
    const updated = await updateTodo(id, patch)
    todos = todos.map((t) => (t.id === id ? updated : t))
  } catch (err) {
    console.error('updateDueDate error:', err)
  } finally {
    isLoading = false
    render()
  }
}

/**
 * 指定IDのTodoの優先度を更新する
 *
 * @param id - 対象TodoのID
 * @param priorityId - 新しい優先度ID。空文字の場合は優先度をリセットする
 */
export const updatePriority = async (id: number, priorityId: string): Promise<void> => {
  const patch = priorityId ? { priorityId } : { priorityId: null }
  isLoading = true
  render()
  try {
    const updated = await updateTodo(id, patch)
    todos = todos.map((t) => (t.id === id ? updated : t))
  } catch (err) {
    console.error('updatePriority error:', err)
  } finally {
    isLoading = false
    render()
  }
}

/**
 * 完了済みのTodoをすべて削除する
 */
export const clearCompleted = async (): Promise<void> => {
  isLoading = true
  render()
  try {
    await deleteCompleted()
    todos = todos.filter((t) => !t.completed)
  } catch (err) {
    console.error('clearCompleted error:', err)
  } finally {
    isLoading = false
    render()
  }
}

/**
 * フィルターを変更して画面を再描画する
 *
 * @param filterType - 設定するフィルター種別
 */
export const setFilter = (filterType: FilterType): void => {
  filter = filterType
  render()
}

/**
 * ビュー種別をトグルして画面を再描画する
 */
export const toggleViewType = (): void => {
  viewType = viewType === 'list' ? 'board' : 'list'
  render()
}

/**
 * 現在のフィルターに基づいてTodosを絞り込む
 *
 * @returns フィルター済みのTodo配列
 */
const getFilteredTodos = (): Todo[] => {
  if (filter === 'active') return todos.filter((t) => !t.completed)
  if (filter === 'completed') return todos.filter((t) => t.completed)
  return todos
}

/**
 * アプリ全体を再描画する
 *
 * `#app` 要素の中身をクリアし、各コンポーネントのDOM要素を組み立て直す。
 * 描画後に {@link setupEventListeners} を呼んでイベントを再登録する。
 */
export const render = (): void => {
  const app = document.querySelector<HTMLDivElement>(DOM_IDS.APP)
  if (!app) return

  const hash = window.location.hash
  if (hash === '#/master') {
    // マスタ管理画面を表示
    const root = createAppLayout({
      header: createHeader(),
      contentChildren: [createMasterTop()],
      footer: createFooter(),
    })
    app.replaceChildren()
    app.appendChild(root)
    return
  } else if (hash == '#/master/priority') {
    const root = createAppLayout({
      header: createHeader(),
      contentChildren: [
        createMasterPriority(
          priorities,
          togglePriorityStatus,
          updatePriorityName,
          updatePriorityForeground,
          updatePriorityBackground,
        ),
      ],
      footer: createFooter(),
    })
    app.replaceChildren()
    app.appendChild(root)
    setupMasterPriorityEventListeners()
    return
  }

  // フィルターされたTodoを取得する。
  const filtered = getFilteredTodos()

  // #app要素の中身を削除する。
  app.replaceChildren()

  // セクション見出し
  const sectionTitle = document.createElement('h2')
  sectionTitle.textContent = 'タスク一覧'
  sectionTitle.className = 'text-lg font-medium text-green-800 mb-5'

  // 区切り線
  const divider = document.createElement('hr')
  divider.className = 'border-green-200 mb-2.5'

  // タスクビュー
  const taskView: HTMLElement =
    viewType === 'list'
      ? createTaskListView(filtered, isLoading, priorities)
      : createTaskBoardView(filtered)

  const root = createAppLayout({
    header: createHeader(),
    contentChildren: [
      sectionTitle,
      createTodoInput(isLoading, priorities),
      divider,
      createViewToggle(viewType),
      taskView,
    ],
    footer: createFooter(),
  })

  app.appendChild(root)

  setupEventListeners()
}

/**
 * DOM要素にイベントリスナーを登録する
 *
 * `render()` の後に毎回呼ばれる。
 *
 * 登録するイベント:
 * - テキスト入力のEnterキー → {@link addTodo}
 * - 「追加」ボタンのクリック → {@link addTodo}
 * - ビュー切り替えボタンのクリック → {@link toggleViewType}
 * - チェックボタンのクリック → {@link toggleTodo}
 * - 優先度バッジのクリック → インライン編集に切り替え
 * - 優先度セレクトの change → {@link updatePriority}
 */
const setupEventListeners = (): void => {
  const input = document.querySelector<HTMLInputElement>(DOM_IDS.TODO_TEXT_INPUT)
  const deadlineInput = document.querySelector<HTMLInputElement>(DOM_IDS.TODO_DEADLINE_INPUT)
  const prioritySelect = document.querySelector<HTMLSelectElement>(DOM_IDS.TODO_PRIORITY_SELECT)
  const addButton = document.querySelector<HTMLButtonElement>(DOM_IDS.ADD_TODO_BTN)

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      void addTodo(input.value, deadlineInput?.value, prioritySelect?.value)
      input.value = ''
      if (deadlineInput) deadlineInput.value = ''
      if (prioritySelect) prioritySelect.value = ''
    }
  })

  addButton?.addEventListener('click', () => {
    if (input) {
      void addTodo(input.value, deadlineInput?.value, prioritySelect?.value)
      input.value = ''
      if (deadlineInput) deadlineInput.value = ''
      if (prioritySelect) prioritySelect.value = ''
    }
  })

  // 期限日インライン編集: spanクリックでinputに切り替え
  document.querySelectorAll<HTMLSpanElement>('[data-due-date-display-id]').forEach((span) => {
    span.addEventListener('click', () => {
      const id = span.dataset['dueDateDisplayId']
      if (!id) return
      const editInput = document.querySelector<HTMLInputElement>(`[data-due-date-edit-id="${id}"]`)
      if (!editInput) return
      span.classList.add('hidden')
      editInput.classList.remove('hidden')
      editInput.focus()
    })
  })

  // 期限日インライン編集: change で保存
  document.querySelectorAll<HTMLInputElement>('[data-due-date-edit-id]').forEach((editInput) => {
    let saved = false

    editInput.addEventListener('change', () => {
      saved = true
      const id = editInput.dataset['dueDateEditId']
      if (!id) return
      void updateDueDate(Number(id), editInput.value)
    })

    editInput.addEventListener('blur', () => {
      if (saved) return
      // changeが発火しなかった場合（値変更なしでblur）はspanに戻す
      const id = editInput.dataset['dueDateEditId']
      if (!id) return
      const span = document.querySelector<HTMLSpanElement>(`[data-due-date-display-id="${id}"]`)
      if (!span) return
      editInput.classList.add('hidden')
      span.classList.remove('hidden')
    })

    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        saved = true // changeを抑制
        const id = editInput.dataset['dueDateEditId']
        if (!id) return
        const span = document.querySelector<HTMLSpanElement>(`[data-due-date-display-id="${id}"]`)
        if (!span) return
        editInput.classList.add('hidden')
        span.classList.remove('hidden')
      }
    })
  })

  // 優先度インライン編集: バッジwrapクリックでselectに切り替え
  document.querySelectorAll<HTMLSpanElement>('[data-priority-display-id]').forEach((wrap) => {
    wrap.addEventListener('click', () => {
      const id = wrap.dataset['priorityDisplayId']
      if (!id) return
      const editSelect = document.querySelector<HTMLSelectElement>(
        `[data-priority-edit-id="${id}"]`,
      )
      if (!editSelect) return
      wrap.classList.add('hidden')
      editSelect.classList.remove('hidden')
      editSelect.focus()
    })
  })

  // 優先度インライン編集: change で保存
  document.querySelectorAll<HTMLSelectElement>('[data-priority-edit-id]').forEach((editSelect) => {
    let saved = false

    editSelect.addEventListener('change', () => {
      saved = true
      const id = editSelect.dataset['priorityEditId']
      if (!id) return
      void updatePriority(Number(id), editSelect.value)
    })

    editSelect.addEventListener('blur', () => {
      if (saved) return
      // changeが発火しなかった場合（値変更なしでblur）はバッジに戻す
      const id = editSelect.dataset['priorityEditId']
      if (!id) return
      const wrap = document.querySelector<HTMLSpanElement>(`[data-priority-display-id="${id}"]`)
      if (!wrap) return
      editSelect.classList.add('hidden')
      wrap.classList.remove('hidden')
    })
  })

  document
    .querySelector<HTMLButtonElement>(DOM_IDS.VIEW_TOGGLE_BTN)
    ?.addEventListener('click', () => {
      toggleViewType()
    })

  // data-id 属性を持つ <button>要素をすべて取得する。CSS セレクター（HTML 要素を条件で絞り込む記法）
  document.querySelectorAll<HTMLButtonElement>('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      // 末尾の「!」- non-null アサーション（値が必ず存在すると断言する記述）
      void toggleTodo(Number(btn.dataset['id']!))
    })
  })
}

const setupMasterPriorityEventListeners = (): void => {
  // 期限日インライン編集: change で保存
  document.querySelectorAll<HTMLInputElement>('[data-due-date-edit-id]').forEach((editInput) => {
    let saved = false

    editInput.addEventListener('change', () => {
      saved = true
      const id = editInput.dataset['dueDateEditId']
      if (!id) return
      void updateDueDate(Number(id), editInput.value)
    })

    editInput.addEventListener('blur', () => {
      if (saved) return
      // changeが発火しなかった場合（値変更なしでblur）はspanに戻す
      const id = editInput.dataset['dueDateEditId']
      if (!id) return
      const span = document.querySelector<HTMLSpanElement>(`[data-due-date-display-id="${id}"]`)
      if (!span) return
      editInput.classList.add('hidden')
      span.classList.remove('hidden')
    })

    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        saved = true // changeを抑制
        const id = editInput.dataset['dueDateEditId']
        if (!id) return
        const span = document.querySelector<HTMLSpanElement>(`[data-due-date-display-id="${id}"]`)
        if (!span) return
        editInput.classList.add('hidden')
        span.classList.remove('hidden')
      }
    })
  })
}

/**
 * アプリを初期化する
 *
 * APIからTodo一覧・優先度一覧を並列取得し、初回描画を行う。
 * DOMContentLoaded イベントで呼び出される。
 */
const initApp = async (): Promise<void> => {
  isLoading = true
  window.addEventListener('hashchange', () => {
    render()
  })
  render()
  try {
    const [fetchedTodos, fetchedPriorities] = await Promise.all([
      fetchTodos(),
      fetchAllPriorities(),
    ])
    todos = fetchedTodos
    priorities = fetchedPriorities
  } catch (err) {
    console.error('initApp error:', err)
  } finally {
    isLoading = false
    render()
  }
}

// 優先度マスタのEvent
export const updatePriorityName = async (id: string, newName: string): Promise<void> => {
  isLoading = true
  render()
  try {
    const updated = await updatePriorityMaster(id, { name: newName })
    priorities = priorities.map((p) => (p.id === id ? updated : p))
  } catch (err) {
    console.error(`${updatePriorityName} error:`, err)
  } finally {
    isLoading = false
    render()
  }
}

// 優先度マスタのEvent
export const updatePriorityForeground = async (
  id: string,
  newForeground: string,
): Promise<void> => {
  isLoading = true
  render()
  try {
    const updated = await updatePriorityMaster(id, { foregroundColor: newForeground })
    priorities = priorities.map((p) => (p.id === id ? updated : p))
  } catch (err) {
    console.error(`${updatePriorityForeground} error:`, err)
  } finally {
    isLoading = false
    render()
  }
}

// 優先度マスタのEvent
export const updatePriorityBackground = async (
  id: string,
  newBackground: string,
): Promise<void> => {
  isLoading = true
  render()
  try {
    const updated = await updatePriorityMaster(id, { backgroundColor: newBackground })
    priorities = priorities.map((p) => (p.id === id ? updated : p))
  } catch (err) {
    console.error(`${updatePriorityForeground} error:`, err)
  } finally {
    isLoading = false
    render()
  }
}

// 優先度マスタのEvent
export const togglePriorityStatus = async (id: string): Promise<void> => {
  const target = priorities.find((p) => p.id === id)
  if (!target) return

  isLoading = true
  render()
  try {
    const updated = await updatePriorityMaster(id, { isDeleted: !target.isDeleted })
    priorities = priorities.map((p) => (p.id === id ? updated : p))
  } catch (err) {
    console.error(`${togglePriorityStatus} error:`, err)
  } finally {
    isLoading = false
    render()
  }
}

export { initApp }
