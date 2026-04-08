import type { FilterType, Todo, ViewType } from './types/todo'
import { fetchTodos, createTodo, updateTodo, deleteTodoById, deleteCompleted } from './services/api'
import { createTodoInput } from './components/molecules/TodoInput'
import { createViewToggle } from './components/molecules/ViewToggle'
import { createTaskListView } from './components/organisms/TaskListView'
import { createTaskBoardView } from './components/organisms/TaskBoardView'
import { createFooter } from './components/organisms/Footer'
import { createHeader } from './components/organisms/Header'
import { createAppLayout } from './components/templates/AppLayout'

/** 全Todoの状態 */
let todos: Todo[] = []

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
 */
export const addTodo = async (text: string): Promise<void> => {
  const trimmed = text.trim()
  if (!trimmed || trimmed.length > MAX_TEXT_LENGTH) return

  isLoading = true
  render()
  try {
    const created = await createTodo(trimmed)
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
export const toggleTodo = async (id: string): Promise<void> => {
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
export const deleteTodo = async (id: string): Promise<void> => {
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
  const app = document.querySelector<HTMLDivElement>('#app')
  if (!app) return

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
    viewType === 'list' ? createTaskListView(filtered, isLoading) : createTaskBoardView(filtered)

  const root = createAppLayout({
    header: createHeader(),
    contentChildren: [
      sectionTitle,
      createTodoInput(isLoading),
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
 */
const setupEventListeners = (): void => {
  const input = document.querySelector<HTMLInputElement>('#todo-text-input')
  const addButton = document.querySelector<HTMLButtonElement>('#todo-add-button')

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      void addTodo(input.value)
      input.value = ''
    }
  })

  addButton?.addEventListener('click', () => {
    if (input) {
      void addTodo(input.value)
      input.value = ''
    }
  })

  document
    .querySelector<HTMLButtonElement>('#view-toggle-button')
    ?.addEventListener('click', () => {
      toggleViewType()
    })

  // data-id 属性を持つ <button>要素をすべて取得する。CSS セレクター（HTML 要素を条件で絞り込む記法）
  document.querySelectorAll<HTMLButtonElement>('button[data-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      // 末尾の「!」- non-null アサーション（値が必ず存在すると断言する記述）
      void toggleTodo(btn.dataset['id']!)
    })
  })
}

/**
 * アプリを初期化する
 *
 * APIからTodo一覧を取得し、初回描画を行う。
 * DOMContentLoaded イベントで呼び出される。
 */
const initApp = async (): Promise<void> => {
  isLoading = true
  render()
  try {
    todos = await fetchTodos()
  } catch (err) {
    console.error('initApp error:', err)
  } finally {
    isLoading = false
    render()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  void initApp()
})
