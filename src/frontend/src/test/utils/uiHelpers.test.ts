import { describe, it, expect } from 'vitest'
import { createPriorityBadge, createLoadingOverlay } from '../../utils/uiHelpers'

describe('createPriorityBadge', () => {
  describe('ラベル表示', () => {
    it("priority='high'のとき「高」が表示される", () => {
      const badge = createPriorityBadge('high')
      expect(badge.textContent).toBe('高')
    })

    it("priority='mid'のとき「中」が表示される", () => {
      const badge = createPriorityBadge('mid')
      expect(badge.textContent).toBe('中')
    })

    it("priority='low'のとき「低」が表示される", () => {
      const badge = createPriorityBadge('low')
      expect(badge.textContent).toBe('低')
    })

    it('priority=undefinedのとき「低」が表示される', () => {
      const badge = createPriorityBadge(undefined)
      expect(badge.textContent).toBe('低')
    })
  })

  describe('色クラス', () => {
    it("priority='high'のとき赤系クラスが付く", () => {
      const badge = createPriorityBadge('high')
      expect(badge.className).toContain('text-red-700')
    })

    it("priority='mid'のとき黄系クラスが付く", () => {
      const badge = createPriorityBadge('mid')
      expect(badge.className).toContain('text-amber-700')
    })

    it("priority='low'のとき緑系クラスが付く", () => {
      const badge = createPriorityBadge('low')
      expect(badge.className).toContain('text-green-700')
    })

    it('priority=undefinedのとき緑系クラスが付く', () => {
      const badge = createPriorityBadge(undefined)
      expect(badge.className).toContain('text-green-700')
    })
  })
})

describe('createLoadingOverlay', () => {
  it('オーバーレイdiv要素を返す', () => {
    const overlay = createLoadingOverlay()
    expect(overlay.tagName).toBe('DIV')
    expect(overlay.className).toContain('bg-white/70')
  })

  it('SVGスピナーが含まれる', () => {
    const overlay = createLoadingOverlay()
    const svg = overlay.querySelector('svg')
    expect(svg).not.toBeNull()
  })

  it('デフォルトのスピナーカラーがtext-green-600になる', () => {
    const overlay = createLoadingOverlay()
    const svg = overlay.querySelector('svg')
    expect(svg?.getAttribute('class')).toContain('text-green-600')
  })

  it('spinnerColorClassを指定するとそのクラスが付く', () => {
    const overlay = createLoadingOverlay('text-blue-500')
    const svg = overlay.querySelector('svg')
    expect(svg?.getAttribute('class')).toContain('text-blue-500')
  })

  it('aria-labelが「読み込み中」である', () => {
    const overlay = createLoadingOverlay()
    const svg = overlay.querySelector('svg')
    expect(svg?.getAttribute('aria-label')).toBe('読み込み中')
  })
})
