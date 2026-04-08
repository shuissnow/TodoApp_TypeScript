/**
 * ヘッダーのDOM要素を生成する
 *
 * 左：ロゴ＋アプリ名、右：ナビリンク＋アバター
 *
 * @returns `<header>` 要素
 */
export const createHeader = (): HTMLElement => {
  const header = document.createElement('header')
  header.className = 'h-[52px] bg-green-800 px-5 flex items-center justify-between'

  // 左側: ロゴ + アプリ名
  const left = document.createElement('div')
  left.className = 'flex items-center gap-2'

  const logoSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  logoSvg.setAttribute('width', '22')
  logoSvg.setAttribute('height', '22')
  logoSvg.setAttribute('viewBox', '0 0 22 22')
  logoSvg.setAttribute('fill', 'none')

  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('x', '1')
  rect.setAttribute('y', '1')
  rect.setAttribute('width', '20')
  rect.setAttribute('height', '20')
  rect.setAttribute('rx', '5')
  rect.setAttribute('fill', '#16a34a')

  const check = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  check.setAttribute('d', 'M6 11l4 4 6-6')
  check.setAttribute('stroke', 'white')
  check.setAttribute('stroke-width', '2')
  check.setAttribute('stroke-linecap', 'round')
  check.setAttribute('stroke-linejoin', 'round')

  logoSvg.appendChild(rect)
  logoSvg.appendChild(check)

  const appName = document.createElement('span')
  appName.textContent = 'TodoApp'
  appName.className = 'text-base font-medium text-green-50'

  left.appendChild(logoSvg)
  left.appendChild(appName)

  // 右側: ナビリンク + アバター
  const right = document.createElement('div')
  right.className = 'flex items-center gap-4'

  // TODO:未実装
  const navLinks: string[] = ['ダッシュボード', 'レポート']
  navLinks.forEach((label) => {
    const a = document.createElement('a')
    a.href = '#'
    a.textContent = label
    a.className = 'text-sm text-green-200 hover:text-green-50 transition-colors'
    right.appendChild(a)
  })

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
