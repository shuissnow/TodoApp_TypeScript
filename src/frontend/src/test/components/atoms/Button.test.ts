import { describe, it, expect } from 'vitest'
import { createButton } from '../../../components/atoms/Button'

describe('createButton', () => {
  describe('基本属性', () => {
    it('id属性が設定される', () => {
      const btn = createButton({ id: 'my-btn', text: '追加' })
      expect(btn.id).toBe('my-btn')
    })

    it('typeがbuttonである', () => {
      const btn = createButton({ id: 'my-btn', text: '追加' })
      expect(btn.type).toBe('button')
    })

    it('テキストが設定される', () => {
      const btn = createButton({ id: 'my-btn', text: '送信' })
      expect(btn.textContent).toBe('送信')
    })
  })

  describe('disabled', () => {
    it('disabled省略時はfalseになる', () => {
      const btn = createButton({ id: 'my-btn', text: '追加' })
      expect(btn.disabled).toBe(false)
    })

    it('disabled=falseのとき、ボタンがdisabledでない', () => {
      const btn = createButton({ id: 'my-btn', text: '追加', disabled: false })
      expect(btn.disabled).toBe(false)
    })

    it('disabled=trueのとき、ボタンがdisabledになる', () => {
      const btn = createButton({ id: 'my-btn', text: '追加', disabled: true })
      expect(btn.disabled).toBe(true)
    })
  })
})
