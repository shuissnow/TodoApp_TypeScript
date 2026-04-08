import { describe, it, expect } from 'vitest'
import { createFooter } from '../../components/Footer'

describe('createFooter', () => {
  it('footer要素を返す', () => {
    const footer = createFooter()
    expect(footer.tagName.toLowerCase()).toBe('footer')
  })

  it('コピーライトテキストが表示される', () => {
    const footer = createFooter()
    expect(footer.textContent).toContain('© 2025 TodoApp')
  })

  it('ナビゲーションリンクが3件表示される', () => {
    const footer = createFooter()
    const links = footer.querySelectorAll('a')
    expect(links.length).toBe(3)
  })

  it('「プライバシー」リンクが含まれる', () => {
    const footer = createFooter()
    const texts = Array.from(footer.querySelectorAll('a')).map((a) => a.textContent)
    expect(texts).toContain('プライバシー')
  })

  it('「利用規約」リンクが含まれる', () => {
    const footer = createFooter()
    const texts = Array.from(footer.querySelectorAll('a')).map((a) => a.textContent)
    expect(texts).toContain('利用規約')
  })

  it('「お問い合わせ」リンクが含まれる', () => {
    const footer = createFooter()
    const texts = Array.from(footer.querySelectorAll('a')).map((a) => a.textContent)
    expect(texts).toContain('お問い合わせ')
  })
})
