import type { FilterType, Todo, ViewType } from './types/todo'
import { fetchTodos, createTodo, updateTodo, deleteTodoById, deleteCompleted } from './services/api'
import { createTodoInput } from './components/TodoInput'
import { createViewToggle } from './components/ViewToggle'
import { createTaskListView } from './components/TaskListView'
import { createTaskBoardView } from './components/TaskBoardView'
import { createFooter } from './components/Footer'

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
 * ヘッダーのDOM要素を生成する
 *
 * 左：ロゴ＋アプリ名、右：ナビリンク＋アバター
 *
 * @returns `<header>` 要素
 */
const createHeader = (): HTMLElement => {
  // ヘッダーの作成
  const header = document.createElement('header')
  header.className = 'h-[52px] bg-green-800 px-5 flex items-center justify-between'

  // 左側: ロゴ + アプリ名
  const left = document.createElement('div')
  left.className = 'flex items-center gap-2'

  // ロゴを作成する。
  const logoSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  logoSvg.setAttribute('width', '22')
  logoSvg.setAttribute('height', '22')
  logoSvg.setAttribute('viewBox', '0 0 22 22')
  logoSvg.setAttribute('fill', 'none')

  // ロゴの四角形を作成する。
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('x', '1')
  rect.setAttribute('y', '1')
  rect.setAttribute('width', '20')
  rect.setAttribute('height', '20')
  rect.setAttribute('rx', '5')
  rect.setAttribute('fill', '#16a34a')

  // ロゴのチェックマークを作成する。
  const check = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  check.setAttribute('d', 'M6 11l4 4 6-6')
  check.setAttribute('stroke', 'white')
  check.setAttribute('stroke-width', '2')
  check.setAttribute('stroke-linecap', 'round')
  check.setAttribute('stroke-linejoin', 'round')

  logoSvg.appendChild(rect)
  logoSvg.appendChild(check)

  // タイトル名を作成する。
  const appName = document.createElement('span')
  appName.textContent = 'TodoApp'
  appName.className = 'text-base font-medium text-green-50'

  left.appendChild(logoSvg)
  left.appendChild(appName)

  // 右側: ナビリンク + アバター
  const right = document.createElement('div')
  right.className = 'flex items-center gap-4'

  // TODO:未実装
  const navLinks = ['ダッシュボード', 'レポート']
  navLinks.forEach((label) => {
    const a = document.createElement('a')
    a.href = '#'
    a.textContent = label
    a.className = 'text-sm text-green-200 hover:text-green-50 transition-colors'
    right.appendChild(a)
  })

  // アバター
  const avatar = document.createElement('div')
  avatar.className =
    'w-7 h-7 rounded-full bg-green-600 border border-green-400 flex items-center justify-center'
  const initials = document.createElement('span')
  initials.textContent = 'U'
  initials.className = 'text-xs text-green-50 font-medium'
  avatar.appendChild(initials)
  right.appendChild(avatar)

  header.appendChild(left)
  header.appendChild(right)

  return header
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

  // ルート
  const root = document.createElement('div')
  root.className = 'min-h-screen flex flex-col'

  // Header
  root.appendChild(createHeader())

  // Main
  const main = document.createElement('main')
  main.className = 'flex-1 bg-gray-50'

  const content = document.createElement('div')
  content.className = 'p-5 max-w-3xl mx-auto'

  // セクション見出し
  const sectionTitle = document.createElement('h2')
  sectionTitle.textContent = 'タスク一覧'
  sectionTitle.className = 'text-lg font-medium text-green-800 mb-5'
  content.appendChild(sectionTitle)

  // タスク入力
  content.appendChild(createTodoInput(isLoading))

  // 区切り線
  const divider = document.createElement('hr')
  divider.className = 'border-green-200 mb-2.5'
  content.appendChild(divider)

  // ビュー切り替えボタン
  content.appendChild(createViewToggle(viewType))

  // タスクビュー
  if (viewType === 'list') {
    content.appendChild(createTaskListView(filtered, isLoading))
  } else {
    content.appendChild(createTaskBoardView(filtered))
  }

  main.appendChild(content)
  root.appendChild(main)

  // Footer
  root.appendChild(createFooter())

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
