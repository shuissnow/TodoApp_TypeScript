import { describe, it, expect } from 'vitest'
import { createAppLayout } from '../../../components/templates/AppLayout'

const makeEl = (tag: string, text: string): HTMLElement => {
  const el = document.createElement(tag)
  el.textContent = text
  return el
}

describe('createAppLayout', () => {
  it('header要素が配置される', () => {
    const header = makeEl('header', 'ヘッダー')
    const layout = createAppLayout({
      header,
      contentChildren: [],
      footer: makeEl('footer', 'フッター'),
    })
    expect(layout.querySelector('header')?.textContent).toBe('ヘッダー')
  })

  it('footer要素が配置される', () => {
    const footer = makeEl('footer', 'フッター')
    const layout = createAppLayout({
      header: makeEl('header', 'ヘッダー'),
      contentChildren: [],
      footer,
    })
    expect(layout.querySelector('footer')?.textContent).toBe('フッター')
  })

  it('contentChildrenが配置される', () => {
    const child = makeEl('p', 'コンテンツ')
    const layout = createAppLayout({
      header: makeEl('header', 'ヘッダー'),
      contentChildren: [child],
      footer: makeEl('footer', 'フッター'),
    })
    expect(layout.textContent).toContain('コンテンツ')
  })

  it('複数のcontentChildrenがすべて配置される', () => {
    const children = [makeEl('p', 'A'), makeEl('p', 'B'), makeEl('p', 'C')]
    const layout = createAppLayout({
      header: makeEl('header', 'ヘッダー'),
      contentChildren: children,
      footer: makeEl('footer', 'フッター'),
    })
    expect(layout.textContent).toContain('A')
    expect(layout.textContent).toContain('B')
    expect(layout.textContent).toContain('C')
  })

  it('contentChildren=[]のとき、main要素は空になる', () => {
    const layout = createAppLayout({
      header: makeEl('header', 'ヘッダー'),
      contentChildren: [],
      footer: makeEl('footer', 'フッター'),
    })
    const content = layout.querySelector('main div')
    expect(content?.children.length).toBe(0)
  })
})
