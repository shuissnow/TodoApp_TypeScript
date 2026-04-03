import type { FilterType, Todo } from './types/todo'
import { fetchTodos, createTodo, updateTodo, deleteTodoById, deleteCompleted } from './services/api'
import { createTodoInput } from './components/TodoInput'
import { createFilterBar } from './components/FilterBar'
import { createTodoList } from './components/TodoList'
import { createFooter } from './components/Footer'

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
 * @param f - 設定するフィルター種別
 */
export const setFilter = (f: FilterType): void => {
  filter = f
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

  const filtered = getFilteredTodos()

  app.replaceChildren()

  const wrapper = document.createElement('div')
  wrapper.className = 'min-h-screen bg-gray-50 flex items-start justify-center pt-16 px-4'

  const card = document.createElement('div')
  card.className = 'w-full max-w-md bg-white rounded-2xl shadow-sm overflow-hidden'

  const header = document.createElement('header')
  header.className = 'px-4 py-5 border-b border-gray-100'
  const title = document.createElement('h1')
  title.className = 'text-2xl font-bold text-gray-800 text-center'
  title.textContent = 'Todo'
  header.appendChild(title)

  const inputEl = createTodoInput(isLoading)
  const filterEl = createFilterBar(filter)
  const listEl = createTodoList(filtered, isLoading)
  const footerEl = createFooter(todos, isLoading)

  card.appendChild(header)
  card.appendChild(inputEl)
  card.appendChild(filterEl)
  card.appendChild(listEl)
  if (todos.length > 0) card.appendChild(footerEl)

  wrapper.appendChild(card)
  app.appendChild(wrapper)

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
