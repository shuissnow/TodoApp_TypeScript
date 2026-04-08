import { describe, it, expect } from 'vitest'
import { createTextInput } from '../../../components/atoms/TextInput'

describe('createTextInput', () => {
  describe('基本属性', () => {
    it('typeがtextである', () => {
      const input = createTextInput({ id: 'my-input' })
      expect(input.type).toBe('text')
    })

    it('id属性が設定される', () => {
      const input = createTextInput({ id: 'my-input' })
      expect(input.id).toBe('my-input')
    })
  })

  describe('placeholder', () => {
    it('placeholderを指定すると設定される', () => {
      const input = createTextInput({ id: 'my-input', placeholder: 'タスクを入力' })
      expect(input.placeholder).toBe('タスクを入力')
    })

    it('placeholder省略時は空文字になる', () => {
      const input = createTextInput({ id: 'my-input' })
      expect(input.placeholder).toBe('')
    })
  })

  describe('maxLength', () => {
    it('maxLengthを指定すると設定される', () => {
      const input = createTextInput({ id: 'my-input', maxLength: 200 })
      expect(input.maxLength).toBe(200)
    })

    it('maxLength省略時はデフォルト値(-1)になる', () => {
      const input = createTextInput({ id: 'my-input' })
      expect(input.maxLength).toBe(-1)
    })
  })

  describe('disabled', () => {
    it('disabled省略時はfalseになる', () => {
      const input = createTextInput({ id: 'my-input' })
      expect(input.disabled).toBe(false)
    })

    it('disabled=falseのとき、disabledでない', () => {
      const input = createTextInput({ id: 'my-input', disabled: false })
      expect(input.disabled).toBe(false)
    })

    it('disabled=trueのとき、disabledになる', () => {
      const input = createTextInput({ id: 'my-input', disabled: true })
      expect(input.disabled).toBe(true)
    })
  })
})
