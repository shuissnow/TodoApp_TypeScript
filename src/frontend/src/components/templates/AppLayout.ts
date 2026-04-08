/**
 * アプリのページレイアウト骨格を生成する
 *
 * ヘッダー・メインコンテンツエリア・フッターを縦に並べる全画面レイアウト。
 * コンテンツは持たず、渡された要素を所定の位置に配置する。
 *
 * @param slots.header - ヘッダー要素
 * @param slots.contentChildren - メインコンテンツエリアに配置する子要素の配列
 * @param slots.footer - フッター要素
 * @returns レイアウト全体の `<div>` 要素
 */
export const createAppLayout = (slots: {
  header: HTMLElement
  contentChildren: HTMLElement[]
  footer: HTMLElement
}): HTMLElement => {
  const root = document.createElement('div')
  root.className = 'min-h-screen flex flex-col'

  root.appendChild(slots.header)

  const main = document.createElement('main')
  main.className = 'flex-1 bg-gray-50'

  const content = document.createElement('div')
  content.className = 'p-5 max-w-3xl mx-auto'

  slots.contentChildren.forEach((child) => content.appendChild(child))

  main.appendChild(content)
  root.appendChild(main)
  root.appendChild(slots.footer)

  return root
}
