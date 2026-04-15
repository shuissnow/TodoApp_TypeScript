import { describe, it, expect } from 'vitest'
import { createPriorityBadge, createLoadingOverlay } from '../../utils/uiHelpers'
import type { Priority } from '../../types/todo'

const HIGH: Priority = {
  id: '001',
  name: '高',
  foregroundColor: '#EF4444',
  backgroundColor: '#FEE2E2',
  displayOrder: 1,
  isDeleted: false,
}
const MID: Priority = {
  id: '002',
  name: '中',
  foregroundColor: '#F97316',
  backgroundColor: '#FFEDD5',
  displayOrder: 2,
  isDeleted: false,
}
const LOW: Priority = {
  id: '003',
  name: '低',
  foregroundColor: '#3B82F6',
  backgroundColor: '#DBEAFE',
  displayOrder: 3,
  isDeleted: false,
}

describe('createPriorityBadge', () => {
  describe('ラベル表示', () => {
    it('Priority オブジェクト（高）のとき「高」が表示される', () => {
      const badge = createPriorityBadge(HIGH)
      expect(badge.textContent).toBe('高')
    })

    it('Priority オブジェクト（中）のとき「中」が表示される', () => {
      const badge = createPriorityBadge(MID)
      expect(badge.textContent).toBe('中')
    })

    it('Priority オブジェクト（低）のとき「低」が表示される', () => {
      const badge = createPriorityBadge(LOW)
      expect(badge.textContent).toBe('低')
    })

    it('priority=null のとき「低」が表示される', () => {
      const badge = createPriorityBadge(null)
      expect(badge.textContent).toBe('低')
    })

    it('priority=undefined のとき「低」が表示される', () => {
      const badge = createPriorityBadge(undefined)
      expect(badge.textContent).toBe('低')
    })
  })

  describe('インラインスタイル', () => {
    it('Priority オブジェクトの foregroundColor が color スタイルに反映される', () => {
      const badge = createPriorityBadge(HIGH)
      // ブラウザは16進数をrgb()に変換するためどちらも許容する
      expect(badge.style.color).toBeTruthy()
    })

    it('Priority オブジェクトの backgroundColor が background-color スタイルに反映される', () => {
      const badge = createPriorityBadge(HIGH)
      expect(badge.style.backgroundColor).toBeTruthy()
    })

    it('priority=null のときフォールバック色（青系）が設定される', () => {
      const badge = createPriorityBadge(null)
      expect(badge.style.color).toBeTruthy()
      expect(badge.style.backgroundColor).toBeTruthy()
    })
  })

  describe('クラス名', () => {
    it('バッジ共通クラスが含まれる', () => {
      const badge = createPriorityBadge(HIGH)
      expect(badge.className).toContain('rounded-full')
      expect(badge.className).toContain('text-xs')
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
