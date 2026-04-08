import { describe, it, expect } from 'vitest'
import { createHeader } from '../../../components/organisms/Header'

describe('createHeader', () => {
  it('header要素を返す', () => {
    const header = createHeader()
    expect(header.tagName).toBe('HEADER')
  })

  it('アプリ名「TodoApp」が表示される', () => {
    const header = createHeader()
    expect(header.textContent).toContain('TodoApp')
  })

  it('ナビゲーションリンク「ダッシュボード」が存在する', () => {
    const header = createHeader()
    const links = Array.from(header.querySelectorAll('a')).map((a) => a.textContent)
    expect(links).toContain('ダッシュボード')
  })

  it('ナビゲーションリンク「レポート」が存在する', () => {
    const header = createHeader()
    const links = Array.from(header.querySelectorAll('a')).map((a) => a.textContent)
    expect(links).toContain('レポート')
  })

  it('アバターに「U」が表示される', () => {
    const header = createHeader()
    expect(header.textContent).toContain('U')
  })
})
