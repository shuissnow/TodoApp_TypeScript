import type { FilterType } from './types/filtertype'

import { fetchTodos } from './services/todoApi'
import { fetchAllPriorities } from './services/priorityApi'
import { createFooter } from './components/organisms/Footer'
import { createTodoTop } from './components/organisms/TodoTop'
import { createHeader } from './components/organisms/Header'
import { createAppLayout } from './components/templates/AppLayout'
import { createMasterTop } from './components/organisms/MasterTop'
import { createMasterPriority } from './components/organisms/MasterPriority'
import { DOM_IDS } from './utils/domIds'
import { store } from './stores/store'
import { addTodo, toggleTodo, updateDueDate, updatePriority } from './actions/todoActions'
import {
  updatePriorityName,
  updatePriorityForeground,
  updatePriorityBackground,
  togglePriorityStatus,
} from './actions/priorityActions'

/**
 * フィルターを変更して画面を再描画する
 *
 * @param filterType - 設定するフィルター種別
 */
export const setFilter = (filterType: FilterType): void => {
  store.filter = filterType
  render()
}

/**
 * ビュー種別をトグルして画面を再描画する
 */
export const toggleViewType = (): void => {
  store.viewType = store.viewType === 'list' ? 'board' : 'list'
  render()
}

/**
 * アプリを初期化する
 *
 * APIからTodo一覧・優先度一覧を並列取得し、初回描画を行う。
 * DOMContentLoaded イベントで呼び出される。
 */
const initApp = async (): Promise<void> => {
  store.isLoading = true
  window.addEventListener('hashchange', () => {
    render()
  })
  render()
  try {
    const [fetchedTodos, fetchedPriorities] = await Promise.all([
      fetchTodos(),
      fetchAllPriorities(),
    ])
    store.todos = fetchedTodos
    store.priorities = fetchedPriorities
  } catch (err) {
    console.error('initApp error:', err)
  } finally {
    store.isLoading = false
    render()
  }
}

/**
 * アプリ全体を再描画する
 *
 * ハッシュに応じてコンテンツを切り替え、`#app` 要素を組み立て直す。
 */
export const render = (): void => {
  const app = document.querySelector<HTMLDivElement>(DOM_IDS.APP)
  if (!app) return

  const hash = window.location.hash
  if (hash === '#/master') {
    const root = createAppLayout({
      header: createHeader(),
      contentChildren: [createMasterTop()],
      footer: createFooter(),
    })
    app.replaceChildren()
    app.appendChild(root)
    return
  } else if (hash === '#/master/priority') {
    const root = createAppLayout({
      header: createHeader(),
      contentChildren: [
        createMasterPriority(
          store.priorities,
          (id) => { void togglePriorityStatus(id, render) },
          (id, newName) => { void updatePriorityName(id, newName, render) },
          (id, newFg) => { void updatePriorityForeground(id, newFg, render) },
          (id, newBg) => { void updatePriorityBackground(id, newBg, render) },
        ),
      ],
      footer: createFooter(),
    })
    app.replaceChildren()
    app.appendChild(root)
    return
  }

  app.replaceChildren()

  const root = createAppLayout({
    header: createHeader(),
    contentChildren: [
      createTodoTop(
        store,
        (text, dueDate, priorityId) => { void addTodo(text, dueDate, priorityId, render) },
        (id) => { void toggleTodo(id, render) },
        (id, value) => { void updateDueDate(id, value, render) },
        (id, priorityId) => { void updatePriority(id, priorityId, render) },
        toggleViewType,
      ),
    ],
    footer: createFooter(),
  })

  app.appendChild(root)
}

export { initApp }
