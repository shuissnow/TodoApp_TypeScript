/**
 * フッターのDOM要素を生成する
 *
 * 左側にコピーライト、右側にリンク群を表示する。
 *
 * @returns フッターの `<footer>` 要素
 */
export const createFooter = (): HTMLElement => {
  const footer = document.createElement('footer')
  footer.className = 'h-9 bg-green-900 px-5 flex items-center justify-between'

  const copyright = document.createElement('span')
  copyright.textContent = '© 2025 TodoApp'
  copyright.className = 'text-xs text-green-400'

  const links = document.createElement('div')
  links.className = 'flex gap-3.5'

  const linkDefs = [
    { label: 'プライバシー', href: '#' },
    { label: '利用規約', href: '#' },
    { label: 'お問い合わせ', href: '#' },
  ]
  linkDefs.forEach(({ label, href }) => {
    const a = document.createElement('a')
    a.href = href
    a.textContent = label
    a.className = 'text-xs text-green-600 hover:text-green-400 transition-colors'
    links.appendChild(a)
  })

  footer.appendChild(copyright)
  footer.appendChild(links)

  return footer
}
