import { describe, it, expect } from 'vitest'
import { createCheckbox } from '../../../components/atoms/Checkbox'

describe('createCheckbox', () => {
  describe('基本属性', () => {
    it('typeがcheckboxである', () => {
      const cb = createCheckbox({ dataId: 'id-1', checked: false })
      expect(cb.type).toBe('checkbox')
    })

    it('data-id属性が設定される', () => {
      const cb = createCheckbox({ dataId: 'id-1', checked: false })
      expect(cb.dataset['id']).toBe('id-1')
    })
  })

  describe('checked状態', () => {
    it('checked=trueのとき、checkedになる', () => {
      const cb = createCheckbox({ dataId: 'id-1', checked: true })
      expect(cb.checked).toBe(true)
    })

    it('checked=falseのとき、uncheckedになる', () => {
      const cb = createCheckbox({ dataId: 'id-1', checked: false })
      expect(cb.checked).toBe(false)
    })
  })

  describe('disabled', () => {
    it('disabled省略時はfalseになる', () => {
      const cb = createCheckbox({ dataId: 'id-1', checked: false })
      expect(cb.disabled).toBe(false)
    })

    it('disabled=falseのとき、disabledでない', () => {
      const cb = createCheckbox({ dataId: 'id-1', checked: false, disabled: false })
      expect(cb.disabled).toBe(false)
    })

    it('disabled=trueのとき、disabledになる', () => {
      const cb = createCheckbox({ dataId: 'id-1', checked: false, disabled: true })
      expect(cb.disabled).toBe(true)
    })
  })

  describe('ariaLabel', () => {
    it('ariaLabelを指定するとaria-label属性が付与される', () => {
      const cb = createCheckbox({ dataId: 'id-1', checked: false, ariaLabel: '完了にする' })
      expect(cb.getAttribute('aria-label')).toBe('完了にする')
    })

    it('ariaLabelを省略するとaria-label属性が付与されない', () => {
      const cb = createCheckbox({ dataId: 'id-1', checked: false })
      expect(cb.getAttribute('aria-label')).toBeNull()
    })
  })
})
