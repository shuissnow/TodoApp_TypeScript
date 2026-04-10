import { describe, it, expect } from 'vitest'
import { createPrioritySelect } from '../../../components/atoms/PrioritySelect'
import type { Priority } from '../../../types/todo'

const PRIORITIES: Priority[] = [
  { id: '001', name: '高', foregroundColor: '#EF4444', backgroundColor: '#FEE2E2' },
  { id: '002', name: '中', foregroundColor: '#F97316', backgroundColor: '#FFEDD5' },
  { id: '003', name: '低', foregroundColor: '#3B82F6', backgroundColor: '#DBEAFE' },
]

describe('createPrioritySelect', () => {
  describe('レンダリング', () => {
    it('select 要素を返す', () => {
      const select = createPrioritySelect({ id: 'test-select', priorities: PRIORITIES })
      expect(select.tagName).toBe('SELECT')
    })

    it('指定した id が設定される', () => {
      const select = createPrioritySelect({ id: 'priority-select', priorities: PRIORITIES })
      expect(select.id).toBe('priority-select')
    })

    it('先頭に「なし」オプション（value=""）が含まれる', () => {
      const select = createPrioritySelect({ id: 'test', priorities: PRIORITIES })
      const firstOption = select.options[0]!
      expect(firstOption.value).toBe('')
      expect(firstOption.textContent).toBe('なし')
    })

    it('優先度の数だけオプションが追加される（なし + 3件）', () => {
      const select = createPrioritySelect({ id: 'test', priorities: PRIORITIES })
      expect(select.options.length).toBe(4)
    })

    it('各優先度オプションの value と label が正しい', () => {
      const select = createPrioritySelect({ id: 'test', priorities: PRIORITIES })
      expect(select.options[1]!.value).toBe('001')
      expect(select.options[1]!.textContent).toBe('高')
      expect(select.options[2]!.value).toBe('002')
      expect(select.options[2]!.textContent).toBe('中')
      expect(select.options[3]!.value).toBe('003')
      expect(select.options[3]!.textContent).toBe('低')
    })

    it('priorities が空のとき「なし」のみ表示される', () => {
      const select = createPrioritySelect({ id: 'test', priorities: [] })
      expect(select.options.length).toBe(1)
      expect(select.options[0]!.value).toBe('')
    })
  })

  describe('初期値', () => {
    it('value を指定しない場合、「なし」が選択される', () => {
      const select = createPrioritySelect({ id: 'test', priorities: PRIORITIES })
      expect(select.value).toBe('')
    })

    it('value に priorityId を指定した場合、その優先度が選択される', () => {
      const select = createPrioritySelect({ id: 'test', priorities: PRIORITIES, value: '002' })
      expect(select.value).toBe('002')
    })
  })

  describe('色の適用', () => {
    it('優先度を選択したとき inline style が設定される', () => {
      const select = createPrioritySelect({ id: 'test', priorities: PRIORITIES, value: '001' })
      expect(select.style.color).toBeTruthy()
      expect(select.style.backgroundColor).toBeTruthy()
    })

    it('「なし」を選択したとき inline style がリセットされる', () => {
      const select = createPrioritySelect({ id: 'test', priorities: PRIORITIES, value: '' })
      expect(select.style.color).toBe('')
      expect(select.style.backgroundColor).toBe('')
    })
  })

  describe('disabled', () => {
    it('disabled=true のとき disabled 属性が設定される', () => {
      const select = createPrioritySelect({ id: 'test', priorities: PRIORITIES, disabled: true })
      expect(select.disabled).toBe(true)
    })

    it('disabled を省略したとき disabled 属性が false になる', () => {
      const select = createPrioritySelect({ id: 'test', priorities: PRIORITIES })
      expect(select.disabled).toBe(false)
    })
  })
})
