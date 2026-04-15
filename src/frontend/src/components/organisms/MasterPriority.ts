import type { Priority } from '../../types/priority'
import { createPriorityBadge } from '../../utils/uiHelpers'
import { createPriority } from '../../services/priorityApi'

/**
 * 優先度マスタ管理画面を生成する。
 *
 * @param priorities
 * @param onToggleStatus
 * @param onUpdateName
 * @param onUpdateForegroundColor
 * @param onUpdateBackgroundColor
 * @returns
 */
export const createMasterPriority = (
  priorities: Priority[],
  onToggleStatus: (id: string) => void,
  onUpdateName: (id: string, newText: string) => void,
  onUpdateForegroundColor: (id: string, newColor: string) => void,
  onUpdateBackgroundColor: (id: string, newColor: string) => void,
): HTMLElement => {
  // 汎用セクションを生成する。
  const section: HTMLElement = document.createElement('section')

  // パンくずリストを生成する。
  section.appendChild(createBreadcrumb())

  // タイトルを生成する。
  section.appendChild(createTitle())

  // コンテンツを生成する。
  const body = createContent(
    priorities,
    onToggleStatus,
    onUpdateName,
    onUpdateForegroundColor,
    onUpdateBackgroundColor,
  )
  section.appendChild(body)

  return section
}

/**
 * パンくずリストを生成する。
 *
 * @returns HTMLElement
 */
const createBreadcrumb = (): HTMLElement => {
  // ナビゲーションリストを生成する。
  const nav: HTMLElement = document.createElement('nav')
  nav.className = 'mb-4'

  // 順序付きリストを生成する。
  const ol: HTMLOListElement = document.createElement('ol')
  ol.className = 'flex items-center gap-1.5 text-sm text-green-700'

  // リストアイテム要素を生成する。
  const homeItem: HTMLElement = document.createElement('li')
  const homeLink: HTMLAnchorElement = document.createElement('a')
  homeLink.href = '#/'
  homeLink.textContent = 'ホーム'
  homeLink.className = 'hover:text-green-900 hover:underline transition-colors'
  homeItem.appendChild(homeLink)
  ol.appendChild(homeItem)

  // リストアイテム要素を生成する。
  const sepItem1 = document.createElement('li')
  sepItem1.className = 'text-green-400'
  sepItem1.textContent = '›'
  ol.appendChild(sepItem1)

  // リストアイテム要素を生成する。
  const beforeItem1 = document.createElement('li')
  const beforeLink1: HTMLAnchorElement = document.createElement('a')
  beforeLink1.href = '#/master'
  beforeLink1.textContent = 'マスタ管理'
  beforeLink1.className = 'hover:text-green-900 hover:underline transition-colors'
  beforeItem1.appendChild(beforeLink1)
  ol.appendChild(beforeItem1)

  // リストアイテム要素を生成する。
  const sepItem2 = document.createElement('li')
  sepItem2.className = 'text-green-400'
  sepItem2.textContent = '›'
  ol.appendChild(sepItem2)

  // リストアイテム要素を生成する。
  const currentItem = document.createElement('li')
  currentItem.className = 'text-green-900 font-medium'
  currentItem.textContent = '優先度マスタ'
  ol.appendChild(currentItem)

  nav.appendChild(ol)

  return nav
}

/**
 * タイトルを生成する。
 *
 * @returns HTMLElement
 */
const createTitle = (): HTMLElement => {
  // コンテンツ区分要素を生成する。
  const titleWrapper: HTMLDivElement = document.createElement('div')
  titleWrapper.className = 'flex items-center gap-3 mb-6 pb-3 border-b border-green-200'

  // 見出し要素を生成する。
  const title: HTMLHeadElement = document.createElement('h2')
  title.className = 'text-xl font-semibold text-green-800'
  title.textContent = '優先度マスタ'
  titleWrapper.appendChild(title)

  return titleWrapper
}

/**
 * コンテンツを生成する。
 *
 * @returns HTMLElement
 */
const createContent = (
  priorities: Priority[],
  onToggleStatus: (id: string) => void,
  onUpdateName: (id: string, newText: string) => void,
  onUpdateForegroundColor: (id: string, newColor: string) => void,
  onUpdateBackgroundColor: (id: string, newColor: string) => void,
): HTMLElement => {
  // Body部
  const body = document.createElement('div')
  body.className = 'iflex flex-col tems-center justify-between mb-6'

  // ボタン行
  const buttonRow: HTMLDivElement = document.createElement('div')
  buttonRow.className = 'flex justify-end gap-2 mb-3'

  // 新規追加ボタン
  const addButton = document.createElement('button')
  addButton.className = 'px-4 py-2 rounded-lg bg-green-700 text-white text-sm hover:bg-green-600'
  addButton.textContent = '＋ 新規追加'
  buttonRow.appendChild(addButton)

  body.appendChild(buttonRow)

  // テーブル
  const table = createTable(
    priorities,
    onToggleStatus,
    onUpdateName,
    onUpdateForegroundColor,
    onUpdateBackgroundColor,
  )
  const tbody: HTMLTableSectionElement | null = table.querySelector('tbody')
  body.appendChild(table)

  // Event追加
  addButton.addEventListener('click', () => {
    if (tbody == null) return
    const displayOrder = tbody.rows.length + 1
    const newRow = createNewRow(displayOrder)
    tbody.appendChild(newRow)
  })

  return body
}

const createTable = (
  priorities: Priority[],
  onToggleStatus: (id: string) => void,
  onUpdateName: (id: string, newText: string) => void,
  onUpdateForegroundColor: (id: string, newColor: string) => void,
  onUpdateBackgroundColor: (id: string, newColor: string) => void,
): HTMLElement => {
  const table = document.createElement('table')
  table.className = 'w-full text-sm border-green-200'

  // thead（列ヘッダー）
  const thead = document.createElement('thead')
  thead.className = 'border-b border-green-200'
  const headerRow = document.createElement('tr')
  const columns = ['#', '並替', '表示名 ✎', '文字色 ✎', '背景色 ✎', '優先度バッチ', '操作']
  columns.forEach((col) => {
    const th = document.createElement('th')
    th.textContent = col
    th.className = 'text-center py-2 px-3'
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)

  // tbody（データ行）
  const tbody = document.createElement('tbody')
  priorities.forEach((priority, i) => {
    tbody.appendChild(
      createRow(
        priority,
        i === 0,
        i === priorities.length - 1,
        onToggleStatus,
        onUpdateName,
        onUpdateForegroundColor,
        onUpdateBackgroundColor,
      ),
    )
  })

  table.appendChild(thead)
  table.appendChild(tbody)

  return table
}

const createRow = (
  priority: Priority,
  isFirst: boolean,
  isLast: boolean,
  onToggleStatus: (id: string) => void,
  onUpdateName: (id: string, newText: string) => void,
  onUpdateForegroundColor: (id: string, newColor: string) => void,
  onUpdateBackgroundColor: (id: string, newColor: string) => void,
): HTMLTableRowElement => {
  const tr: HTMLTableRowElement = document.createElement('tr')
  tr.className = 'border-b border-gray-100 last:border-0'

  // #
  tr.appendChild(createOrderNumCell(priority))

  // 並替
  tr.appendChild(createOrderCell(isFirst, isLast))

  // 表示名
  tr.appendChild(createNameCell(priority, onUpdateName))

  // 文字色
  tr.appendChild(createForegroundCell(priority, onUpdateForegroundColor))

  // 背景色
  tr.appendChild(createBackgroundCell(priority, onUpdateBackgroundColor))

  // 表示ラベル（バッジ）
  tr.appendChild(createLabelCell(priority))

  // 操作
  tr.appendChild(createActionCell(priority, onToggleStatus))

  return tr
}

const createOrderNumCell = (priority: Priority): HTMLTableCellElement => {
  const cell: HTMLTableCellElement = document.createElement('td')
  cell.className = 'py-2 px-3 text-center'
  cell.textContent = String(priority.displayOrder)

  return cell
}

const createOrderCell = (isFirst: boolean, isLast: boolean): HTMLTableCellElement => {
  const btnClass =
    'rounded-full w-6 h-6 text-xs font-bold transition active:scale-95 bg-green-700 text-white hover:bg-green-600 cursor-pointer disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed' // 順序（↑↓ボタン＋番号）

  const cell: HTMLTableCellElement = document.createElement('td')
  cell.className = 'py-2 px-3 text-center'

  // 並替（↑）
  const upBtn: HTMLButtonElement = document.createElement('button')
  upBtn.className = btnClass
  upBtn.textContent = '↑'
  upBtn.disabled = isFirst
  cell.appendChild(upBtn)

  // 並替（↓）
  const downBtn: HTMLButtonElement = document.createElement('button')
  downBtn.className = btnClass
  downBtn.textContent = '↓'
  downBtn.disabled = isLast
  cell.appendChild(downBtn)

  return cell
}

const createNameCell = (
  priority: Priority,
  onUpdateName: (id: string, newText: string) => void,
): HTMLTableCellElement => {
  const cell: HTMLTableCellElement = document.createElement('td')
  cell.className = 'py-2 px-3 text-center'

  const nameSpan: HTMLSpanElement = document.createElement('span')
  nameSpan.textContent = priority.name
  nameSpan.className = 'cursor-pointer hover:text-green-600 hover:underline'
  nameSpan.dataset['priorityNameDisplayId'] = String(priority.id)
  cell.appendChild(nameSpan)

  const nameInput: HTMLInputElement = document.createElement('input')
  nameInput.type = 'text'
  nameInput.value = priority.name
  nameInput.className =
    'hidden text-sm border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 w-full'
  nameInput.dataset['priorityNameEditId'] = String(priority.id)
  cell.appendChild(nameInput)

  // eventを追加する
  let cancelled = false

  nameSpan.addEventListener('click', () => {
    nameSpan.classList.add('hidden')
    nameInput.classList.remove('hidden')
    nameInput.focus()
  })

  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      // blur を発火させて保存処理に任せる
      nameInput.blur()
    }
    if (e.key === 'Escape') {
      cancelled = true
      // 入力値を元に戻す
      nameInput.value = priority.name
      nameInput.blur()
    }
  })

  nameInput.addEventListener('blur', () => {
    if (!cancelled && nameInput.value !== priority.name) {
      // 変更があれば通知
      onUpdateName(priority.id, nameInput.value)
      // span の表示も更新
      nameSpan.textContent = nameInput.value
    }
    cancelled = false // フラグをリセット
    nameInput.classList.add('hidden')
    nameSpan.classList.remove('hidden')
  })

  return cell
}

const createForegroundCell = (
  priority: Priority,
  onUpdateForegroundColor: (id: string, newColor: string) => void,
): HTMLTableCellElement => {
  const cell: HTMLTableCellElement = document.createElement('td')
  cell.className = 'py-2 px-3 text-center'

  const foregroundDiv: HTMLDivElement = document.createElement('div')
  foregroundDiv.className = 'flex justify-center gap-2'

  const foregroundCircle: HTMLSpanElement = document.createElement('span')
  foregroundCircle.className = 'w-4 h-4 rounded-full inline-block'
  foregroundCircle.style.backgroundColor = priority.foregroundColor
  foregroundDiv.appendChild(foregroundCircle)

  const foregroundColorCode: HTMLSpanElement = document.createElement('span')
  foregroundColorCode.textContent = priority.foregroundColor
  foregroundDiv.appendChild(foregroundColorCode)

  const colorInput: HTMLInputElement = document.createElement('input')
  colorInput.type = 'color'
  colorInput.value = priority.foregroundColor
  colorInput.className = 'hidden w-8 h-8 cursor-pointer'
  cell.appendChild(colorInput)

  cell.appendChild(foregroundDiv)

  // event追加
  let changed = false
  foregroundDiv.addEventListener('click', () => {
    colorInput.click()
  })

  colorInput.addEventListener('change', () => {
    changed = true
    // 円とカラーコードの表示を即時更新
    foregroundCircle.style.backgroundColor = colorInput.value
    foregroundColorCode.textContent = colorInput.value
  })

  colorInput.addEventListener('blur', () => {
    if (changed) {
      onUpdateForegroundColor(priority.id, colorInput.value)
    }
    changed = false // フラグをリセット
  })

  return cell
}

const createBackgroundCell = (
  priority: Priority,
  onUpdateBackgroundColor: (id: string, newColor: string) => void,
): HTMLTableCellElement => {
  const cell: HTMLTableCellElement = document.createElement('td')
  cell.className = 'py-2 px-3 text-center'

  const backgroudDiv: HTMLDivElement = document.createElement('div')
  backgroudDiv.className = 'flex justify-center gap-2'

  const backgroundCircle: HTMLSpanElement = document.createElement('span')
  backgroundCircle.className = 'w-4 h-4 rounded-full inline-block'
  backgroundCircle.style.backgroundColor = priority.backgroundColor
  backgroudDiv.appendChild(backgroundCircle)

  const backgroundColorCode: HTMLSpanElement = document.createElement('span')
  backgroundColorCode.textContent = priority.backgroundColor
  backgroudDiv.appendChild(backgroundColorCode)

  const colorInput: HTMLInputElement = document.createElement('input')
  colorInput.type = 'color'
  colorInput.value = priority.backgroundColor
  colorInput.className = 'hidden w-8 h-8 cursor-pointer'
  cell.appendChild(colorInput)

  cell.appendChild(backgroudDiv)

  // event追加
  let changed = false
  backgroudDiv.addEventListener('click', () => {
    colorInput.click()
  })

  colorInput.addEventListener('change', () => {
    changed = true
    // 円とカラーコードの表示を即時更新
    backgroundCircle.style.backgroundColor = colorInput.value
    backgroundColorCode.textContent = colorInput.value
  })

  colorInput.addEventListener('blur', () => {
    if (changed) {
      onUpdateBackgroundColor(priority.id, colorInput.value)
    }
    changed = false // フラグをリセット
  })

  return cell
}

const createLabelCell = (priority: Priority): HTMLTableCellElement => {
  const cell = document.createElement('td')
  cell.className = 'py-2 px-3 text-center'

  const badge = document.createElement('span')
  badge.textContent = priority.name
  badge.className = 'px-2 py-0.5 rounded-full border text-xs'
  badge.style.color = priority.foregroundColor
  badge.style.borderColor = priority.backgroundColor

  cell.appendChild(badge)

  return cell
}

const createActionCell = (
  priority: Priority,
  onToggleStatus: (id: string) => void,
): HTMLTableCellElement => {
  const cell = document.createElement('td')
  cell.className = 'py-2 px-3 flex justify-center'

  const deleteBtn = document.createElement('button')
  if (priority.isDeleted) {
    deleteBtn.textContent = '有効'
    deleteBtn.className = 'px-3 py-1 rounded text-xs bg-green-700 text-white hover:bg-green-600'
  } else {
    deleteBtn.textContent = '無効'
    deleteBtn.className = 'px-3 py-1 rounded text-xs bg-red-700 text-white hover:bg-red-600'
  }
  deleteBtn.addEventListener('click', () => onToggleStatus(priority.id))
  cell.appendChild(deleteBtn)

  return cell
}

const createNewRow = (displayOrder: number): HTMLTableRowElement => {
  const tr = document.createElement('tr')
  tr.className = 'border-b border-gray-100 last:border-0'

  // # 列
  const orderNumCell = document.createElement('td')
  orderNumCell.className = 'py-2 px-3 text-center'
  orderNumCell.textContent = String(displayOrder)
  tr.appendChild(orderNumCell)

  // 並替列（新規行は末尾固定なので ↓ は disabled）
  tr.appendChild(createOrderCell(true, true))

  // 表示名
  const nameCell = document.createElement('td')
  nameCell.className = 'px-2 px-3 text-center'
  const nameInput = document.createElement('input')
  nameInput.type = 'text'
  nameInput.placeholder = '表示名'
  nameInput.className =
    'text-sm border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-green-400 w-full'
  nameCell.appendChild(nameInput)
  tr.appendChild(nameCell)

  // 文字色
  let foregroundColorSelected = false
  const foregroundCell = document.createElement('td')
  foregroundCell.className = 'py-2 px-3 text-center'
  const foregroundInput = document.createElement('input')
  foregroundInput.type = 'color'
  foregroundInput.className = 'hidden w-8 h-8 cursor-pointer'
  foregroundCell.appendChild(foregroundInput)
  const foregroundDiv = document.createElement('div')
  foregroundDiv.className = 'flex justify-center gap-2 cursor-pointer'
  const foregroundCircle = document.createElement('span')
  foregroundCircle.className = 'w-4 h-4 rounded-full inline-block'
  foregroundCircle.style.backgroundColor = foregroundInput.value
  foregroundDiv.appendChild(foregroundCircle)
  const foregroundColorCode = document.createElement('span')
  foregroundColorCode.textContent = foregroundInput.value
  foregroundDiv.appendChild(foregroundColorCode)
  foregroundCell.appendChild(foregroundDiv)
  foregroundDiv.addEventListener('click', () => foregroundInput.click())
  foregroundInput.addEventListener('change', () => {
    foregroundColorSelected = true
    foregroundCircle.style.backgroundColor = foregroundInput.value
    foregroundColorCode.textContent = foregroundInput.value
  })
  tr.appendChild(foregroundCell)

  // 背景色
  let backgroundColorSelected = false
  const backgroundCell = document.createElement('td')
  backgroundCell.className = 'py-2 px-3 text-center'
  const backgroundInput = document.createElement('input')
  backgroundInput.type = 'color'
  backgroundInput.className = 'hidden w-8 h-8 cursor-pointer'
  backgroundCell.appendChild(backgroundInput)
  const backgroundDiv = document.createElement('div')
  backgroundDiv.className = 'flex justify-center gap-2 cursor-pointer'
  const backgroundCircle = document.createElement('span')
  backgroundCircle.className = 'w-4 h-4 rounded-full inline-block'
  backgroundCircle.style.backgroundColor = backgroundInput.value
  backgroundDiv.appendChild(backgroundCircle)
  const backgroundColorCode = document.createElement('span')
  backgroundColorCode.textContent = backgroundInput.value
  backgroundDiv.appendChild(backgroundColorCode)
  backgroundCell.appendChild(backgroundDiv)
  backgroundDiv.addEventListener('click', () => backgroundInput.click())
  backgroundInput.addEventListener('change', () => {
    backgroundColorSelected = true
    backgroundCircle.style.backgroundColor = backgroundInput.value
    backgroundColorCode.textContent = backgroundInput.value
  })
  tr.appendChild(backgroundCell)

  // 優先度バッジ
  const badgeCell = document.createElement('td')
  badgeCell.className = 'py-2 px-3 text-center'
  const badge = createPriorityBadge(null)
  badgeCell.appendChild(badge)
  tr.appendChild(badgeCell)

  // 文字色・背景色の change イベントでバッジを更新
  const updateBadge = () => {
    badge.textContent = nameInput.value
    badge.style.color = foregroundInput.value
    badge.style.backgroundColor = backgroundInput.value
  }
  nameInput.addEventListener('input', updateBadge)
  foregroundInput.addEventListener('change', updateBadge)
  backgroundInput.addEventListener('change', updateBadge)

  // 操作
  const actionCell = document.createElement('td')
  actionCell.className = 'py-2 px-3 flex justify-center'
  const saveBtn = document.createElement('button')
  saveBtn.textContent = '保存'
  saveBtn.className = 'px-3 py-1 rounded text-xs bg-blue-700 text-white hover:bg-blue-600'

  saveBtn.addEventListener('click', () => {
    const errors: string[] = []
    if (!nameInput.value || nameInput.value.length > 3) {
      errors.push('表示名は1〜3文字で入力してください')
    }
    if (!foregroundColorSelected) {
      errors.push('文字色を選択してください')
    }
    if (!backgroundColorSelected) {
      errors.push('背景色を選択してください')
    }
    if (errors.length > 0) {
      window.alert(errors.join('\n'))
      return
    }

    // id生成
    void (async () => {
      try {
        const created = await createPriority(
          String(displayOrder).padStart(3, '0'),
          nameInput.value,
          foregroundInput.value,
          backgroundInput.value,
          displayOrder,
        )
        orderNumCell.textContent = String(created.displayOrder)
        saveBtn.disabled = true
        saveBtn.className = 'px-3 py-1 rounded text-xs bg-gray-400 text-white cursor-not-allowed'
      } catch (err) {
        console.error('addPriority error:', err)
      }
    })()
  })

  actionCell.appendChild(saveBtn)
  tr.appendChild(actionCell)
  return tr
}
