/**
 * マスタ管理画面を生成する。
 *
 * @returns
 */
export const createMasterTop = (): HTMLElement => {
  // 汎用セクションを生成する。
  const section: HTMLElement = document.createElement('section')

  // パンくずリストを生成する。
  section.appendChild(createBreadcrumb())

  // タイトルを生成する。
  section.appendChild(createTitle())

  // コンテンツを生成する。
  section.appendChild(createContent())

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
  const sepItem = document.createElement('li')
  sepItem.className = 'text-green-400'
  sepItem.textContent = '›'
  ol.appendChild(sepItem)

  // リストアイテム要素を生成する。
  const currentItem = document.createElement('li')
  currentItem.className = 'text-green-900 font-medium'
  currentItem.textContent = 'マスタ管理'
  ol.appendChild(currentItem)

  nav.appendChild(ol)

  return nav
}

/**
 * タイトルを生成する。
 */
const createTitle = (): HTMLElement => {
  // コンテンツ区分要素を生成する。
  const titleWrapper: HTMLDivElement = document.createElement('div')
  titleWrapper.className = 'flex items-center gap-3 mb-6 pb-3 border-b border-green-200'

  // 見出し要素を生成する。
  const title: HTMLHeadElement = document.createElement('h2')
  title.className = 'text-xl font-semibold text-green-800'
  title.textContent = 'マスタ管理'
  titleWrapper.appendChild(title)

  return titleWrapper
}

/**
 * コンテンツを生成する。
 */
const createContent = (): HTMLElement => {
  const list: HTMLUListElement = document.createElement('ul')
  list.className = 'flex flex-col gap-3'
  list.appendChild(createMasterCard('#/master/priority', '優先度マスタ管理'))

  return list
}

/**
 * マスタ管理画面のリンクを作成する
 *
 * @param href a要素
 * @param label 表示名
 * @returns HTMLElement
 */
const createMasterCard = (href: string, label: string): HTMLElement => {
  const li: HTMLLIElement = document.createElement('li')

  const card: HTMLAnchorElement = document.createElement('a')
  card.className =
    'flex items-center justify-between px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-800 font-medium hover:bg-green-100 hover:border-green-400 transition-colors'
  card.href = href

  const text: HTMLSpanElement = document.createElement('span')
  text.textContent = label
  card.appendChild(text)

  const arrow: HTMLSpanElement = document.createElement('span')
  arrow.className = 'text-green-400 text-lg'
  arrow.textContent = '›'
  card.appendChild(arrow)

  li.appendChild(card)

  return li
}
