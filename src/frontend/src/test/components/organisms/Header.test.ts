import { describe, it, expect, vi } from 'vitest'
import { createHeader } from '../../../components/organisms/Header'
import type { User } from '../../../types/auth'

const mockUser: User = { id: 1, username: 'Alice' }
const mockLogout = vi.fn()

describe('createHeader', () => {
  it('header要素を返す', () => {
    const header = createHeader(mockUser, mockLogout)
    expect(header.tagName).toBe('HEADER')
  })

  it('アプリ名「TodoApp」が表示される', () => {
    const header = createHeader(mockUser, mockLogout)
    expect(header.textContent).toContain('TodoApp')
  })

  it('ナビゲーションリンク「ダッシュボード」が存在する', () => {
    const header = createHeader(mockUser, mockLogout)
    const links = Array.from(header.querySelectorAll('a')).map((a) => a.textContent)
    expect(links).toContain('ダッシュボード')
  })

  it('ナビゲーションリンク「レポート」が存在する', () => {
    const header = createHeader(mockUser, mockLogout)
    const links = Array.from(header.querySelectorAll('a')).map((a) => a.textContent)
    expect(links).toContain('レポート')
  })

  it('アバターにユーザー名の頭文字が表示される', () => {
    const header = createHeader(mockUser, mockLogout)
    expect(header.textContent).toContain('A')
  })

  it('ログアウトボタンが存在する', () => {
    const header = createHeader(mockUser, mockLogout)
    const buttons = Array.from(header.querySelectorAll('button')).map((b) => b.textContent)
    expect(buttons).toContain('ログアウト')
  })

  it('ログアウトボタンを押すと onLogout が呼ばれる', () => {
    const header = createHeader(mockUser, mockLogout)
    const logoutBtn = header.querySelector<HTMLButtonElement>('button[aria-label="ログアウト"]')
    logoutBtn?.click()
    expect(mockLogout).toHaveBeenCalledOnce()
  })
})
