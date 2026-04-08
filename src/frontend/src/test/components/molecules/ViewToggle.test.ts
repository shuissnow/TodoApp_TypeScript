import { describe, it, expect } from 'vitest'
import { createViewToggle } from '../../../components/molecules/ViewToggle'

describe('createViewToggle', () => {
  describe('ボタン要素', () => {
    it('id="view-toggle-button"のbutton要素が存在する', () => {
      const container = createViewToggle('list')
      const button = container.querySelector<HTMLButtonElement>('#view-toggle-button')
      expect(button).not.toBeNull()
    })

    it('typeがbuttonである', () => {
      const container = createViewToggle('list')
      const button = container.querySelector<HTMLButtonElement>('#view-toggle-button')
      expect(button?.type).toBe('button')
    })
  })

  describe("viewType='list'のとき", () => {
    it('titleが「ボード表示に切り替え」になる', () => {
      const container = createViewToggle('list')
      const button = container.querySelector<HTMLButtonElement>('#view-toggle-button')
      expect(button?.title).toBe('ボード表示に切り替え')
    })

    it('SVGにrect要素（ボードアイコン）が含まれる', () => {
      const container = createViewToggle('list')
      const rects = container.querySelectorAll('rect')
      expect(rects.length).toBeGreaterThan(0)
    })

    it('SVGにline要素（リストアイコン）が含まれない', () => {
      const container = createViewToggle('list')
      const lines = container.querySelectorAll('line')
      expect(lines.length).toBe(0)
    })
  })

  describe("viewType='board'のとき", () => {
    it('titleが「リスト表示に切り替え」になる', () => {
      const container = createViewToggle('board')
      const button = container.querySelector<HTMLButtonElement>('#view-toggle-button')
      expect(button?.title).toBe('リスト表示に切り替え')
    })

    it('SVGにline要素（リストアイコン）が含まれる', () => {
      const container = createViewToggle('board')
      const lines = container.querySelectorAll('line')
      expect(lines.length).toBeGreaterThan(0)
    })

    it('SVGにrect要素（ボードアイコン）が含まれない', () => {
      const container = createViewToggle('board')
      const rects = container.querySelectorAll('rect')
      expect(rects.length).toBe(0)
    })
  })
})
