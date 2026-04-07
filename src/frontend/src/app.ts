import type { FilterType, Todo } from './types/todo'
import { fetchTodos, createTodo, updateTodo, deleteTodoById, deleteCompleted } from './services/api'
import { createTodoInput } from './components/TodoInput'
import { createFilterBar } from './components/FilterBar'
import { createTodoList } from './components/TodoList'

/** 全Todoの状態 */
let todos: Todo[] = []

/** 現在選択中のフィルター */
let filter: FilterType = 'all'

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
  // HTMLのid=appの要素を取得する
  const app = document.querySelector<HTMLDivElement>('#app')
  //
  if (!app) return

  // filterTypeに応じてTodoリストを取得する。初期値はすべてのTodoリストを取得する。
  const filtered = getFilteredTodos()

  // appのノードを空にする。
  app.replaceChildren()

  // ページ全体: 縦方向に Header / Body / Footer を並べる
  const root = document.createElement('div')
  root.className = 'min-h-screen flex flex-col'

  // Header
  const header = document.createElement('header')
  header.className = 'bg-green-100 px-6 py-4 shadow-md'
  const title = document.createElement('h1')
  title.className = 'text-2xl font-bold text-black text-left tracking-wide'
  title.textContent = 'Todo'
  header.appendChild(title)

  // Body(Todoの入力)
  const body = document.createElement('background')
  body.className = 'flex-1 bg-gray-100 px-4 py-8'

  // Body(Todoの入力)
  const card = document.createElement('div')
  card.className = 'w-full max-w-md mx-auto bg-white rounded-2xl shadow-sm overflow-hidden'
  const inputEl = createTodoInput(isLoading)
  const filterEl = createFilterBar(filter)
  const listEl = createTodoList(filtered, isLoading)
  card.appendChild(inputEl)
  card.appendChild(filterEl)
  card.appendChild(listEl)
  body.appendChild(card)

  // Body(Todoの表示欄)
  const displayTodo = document.createElement('div');

  // === Footer ===
  const footer = document.createElement('footer')
  footer.className = 'bg-green-500 px-6 py-3'
  const footerContent = document.createElement('div')
  footerContent.className = 'max-w-md mx-auto flex items-center justify-between text-sm text-slate-300'

  const activeCount = todos.filter((t) => !t.completed).length
  const completedCount = todos.filter((t) => t.completed).length

  const countSpan = document.createElement('span')
  countSpan.textContent = `${activeCount}件残っています`
  footerContent.appendChild(countSpan)

  if (completedCount > 0) {
    const clearBtn = document.createElement('button')
    clearBtn.type = 'button'
    clearBtn.id = 'clear-completed-button'
    clearBtn.textContent = '完了済みを削除'
    clearBtn.disabled = isLoading
    clearBtn.className = 'text-slate-400 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
    footerContent.appendChild(clearBtn)
  }

  footer.appendChild(footerContent)

  root.appendChild(header)
  root.appendChild(body)
  root.appendChild(footer)
  app.appendChild(root)

  setupEventListeners()
}

/**
 * DOM要素にイベントリスナーを登録する
 *
 * `render()` の後に毎回呼ばれる。DOMを再構築するたびに
 * イベントリスナーも再登録が必要なため、セットで呼び出す設計になっている。
 *
 * 登録するイベント:
 * - テキスト入力のEnterキー → {@link addTodo}
 * - 「追加」ボタンのクリック → {@link addTodo}
 * - フィルターボタンのクリック → {@link setFilter}
 * - チェックボックスの変更 → {@link toggleTodo}
 * - 「削除」ボタンのクリック → {@link deleteTodo}
 * - 「完了済みを削除」ボタンのクリック → {@link clearCompleted}
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

  document.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const f = btn.dataset['filter'] as FilterType
      setFilter(f)
    })
  })

  document.querySelectorAll<HTMLInputElement>('input[data-id]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      void toggleTodo(checkbox.dataset['id']!)
    })
  })

  document.querySelectorAll<HTMLButtonElement>('[data-delete-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      void deleteTodo(btn.dataset['deleteId']!)
    })
  })

  document
    .querySelector<HTMLButtonElement>('#clear-completed-button')
    ?.addEventListener('click', () => {
      void clearCompleted()
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
