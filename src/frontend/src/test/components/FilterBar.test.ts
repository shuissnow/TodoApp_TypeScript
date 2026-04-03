import { describe, it, expect } from 'vitest'
import { createFilterBar } from '../../components/FilterBar'
import type { FilterType } from '../../types/todo'

describe('createFilterBar', () => {
  describe('ボタンの生成', () => {
    it('3つのボタンが生成される', () => {
      const container = createFilterBar('all')
      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBe(3)
    })

    it('各ボタンにdata-filter属性が設定される', () => {
      const container = createFilterBar('all')
      const filters = Array.from(container.querySelectorAll<HTMLButtonElement>('[data-filter]')).map(
        (btn) => btn.dataset['filter'],
      )
      expect(filters).toEqual(['all', 'active', 'completed'])
    })
  })

  describe('アクティブスタイル', () => {
    const cases: FilterType[] = ['all', 'active', 'completed']

    cases.forEach((active) => {
      it(`current="${active}" のとき該当ボタンにアクティブスタイルが付く`, () => {
        const container = createFilterBar(active)
        const activeButton = container.querySelector<HTMLButtonElement>(`[data-filter="${active}"]`)
        expect(activeButton?.className).toContain('bg-blue-500')
      })

      it(`current="${active}" のとき他のボタンにアクティブスタイルが付かない`, () => {
        const container = createFilterBar(active)
        const others = Array.from(
          container.querySelectorAll<HTMLButtonElement>('[data-filter]'),
        ).filter((btn) => btn.dataset['filter'] !== active)
        others.forEach((btn) => {
          expect(btn.className).not.toContain('bg-blue-500')
        })
      })
    })
  })
})
